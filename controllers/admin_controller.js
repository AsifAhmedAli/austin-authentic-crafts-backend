const Joi = require("joi");
const db = require("../DB/db.js");
const axios = require("axios");
const AWS = require("aws-sdk");
const fs = require("fs");
// const fs = require("fs");
const multer = require("multer");
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, "uploads/");
  },
  filename: function (req, file, cb) {
    cb(null, Date.now() + "-" + file.originalname);
  },
});
AWS.config.update({
  accessKeyId: process.env.accessKeyId,
  secretAccessKey: process.env.secretAccessKey,
  region: process.env.region,
});
const s3 = new AWS.S3();
const bucketName = process.env.bucketName;
const CLIENT_ID = process.env.CLIENT_ID;
const CLIENT_SECRET = process.env.CLIENT_SECRET;
// const key = 'uploads/your-file-name.jpg'; // Change the file name as needed

const upload = multer({ storage: storage });
// const upload = multer({ dest: "uploads/" }); // Initialize Multer middleware
// // ### ADD PHONE NUMBER ####

const new_request = (req, res) => {
  // try {
  // const { name, email, insta_url, songinput } = req.body;

  const from_number = process.env.from_number;
  const accountSid = process.env.TWILIO_ACCOUNT_SID;
  const authToken = process.env.TWILIO_AUTH_TOKEN;
  const client = require('twilio')(accountSid, authToken);
var msgid;

client.messages
  .create({
     body: 'This is the ship that made the Kessel Run in fourteen parsecs?',
     from: from_number,
     to: '+14086934608'
   })
  .then(message => {
    // message.sid
    return res.status(200).json({ msg: "sent", mid: message.sid})
  })
  .catch(error => {
    console.error("Failed to send message:", error);
      // console.error("Error in sending message:", error);
  res.status(500).json({ error: "Internal Server Error" });
 });
  // console.log(message)
    
  // } catch (error) {
  // console.error("Error in addPhoneNumber:", error);
  // res.status(500).json({ error: "Internal Server Error" });
  // }
};

// // ### GET ALL PHONE NUMBERS ####

const get_image_name = (req, res) => {
  try {
    // Retrieve all phone numbers from the database
    db.query("SELECT * FROM image", (err, image_name) => {
      if (err) {
        console.error("Error executing query:", err);
        return res.status(500).json({ error: "Internal Server Error" });
      }
      if (image_name.length !== 1) {
        return res.status(500).json({ error: "No Image in the database" });
      }
      // console.log(image_name);
      const params = {
        Bucket: process.env.bucketName,
        Key: image_name[0].iname,
      };
      s3.getObject(params, (err, data) => {
        if (err) {
          console.error("Error reading file from S3:", err);
        } else {
          // File content is available in data.Body
          // const fileContent = data.Body.toString('utf-8');
          const dataUrl =
            "data:image/jpeg;base64," + data.Body.toString("base64");
          // console.log("File content:", dataUrl);
          res.status(200).json({ dataUrl: dataUrl });
        }
      });
      // res.status(200).json(image_name);
    });
  } catch (error) {
    console.error("Error in getAllPhoneNumbers:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
};

const save_image = (req, res) => {
  upload.single("image")(req, res, (err) => {
    if (err) {
      console.error("Error uploading image:", err);
      return res.status(500).json({ error: "Image upload error" });
    }
    const uploadedFile = req.file;
    var filename = uploadedFile.filename;
    // console.log(filename);
    const characters =
      "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
    let result = "";

    for (let i = 0; i < 6; i++) {
      const randomIndex = Math.floor(Math.random() * characters.length);
      result += characters.charAt(randomIndex);
    }

    // return result;
    var filename1 = Date.now() + "-new-image-" + result;
    const fileStream = fs.createReadStream(uploadedFile.path);
    const params = {
      Bucket: bucketName,
      Key: `uploads/${filename1}`,
      Body: fileStream,
    };
    const newkey = `uploads/${filename1}`;
    s3.upload(params, (err, data) => {
      if (err) {
        console.error(err);
      } else {
        const deleteQuery = "delete from image";
        // Execute the query to insert image data
        db.query(deleteQuery, (dbError, dbResult) => {
          if (dbError) {
            console.error("Error inserting image data into database:", dbError);
            return res.status(500).json({ error: "Database error" });
          }
          // Insert the image data into your 'images' table
          const insertQuery = "INSERT INTO image (iname) VALUES (?)";
          const insertValues = [newkey];

          // Execute the query to insert image data
          db.query(insertQuery, insertValues, (dbError, dbResult) => {
            if (dbError) {
              console.error(
                "Error inserting image data into database:",
                dbError
              );
              return res.status(500).json({ error: "Database error" });
            }

            return res
              .status(201)
              .json({ message: "Image saved successfully" });
          });
        });
        // console.log(`File uploaded successfully. File URL: ${data.Location}`);
      }
    });
    // console.log('File uploaded successfully. Path:', uploadedFile.path);
  });
};

const change_text = (req, res) => {
  const { main_heading, area, status, paragraph } = req.body;
  // console.log(main_heading, area, status, paragraph);
  db.query(
    "update texts set main_heading = ?, area = ?, status = ?, paragraph = ?",
    [main_heading, area, status, paragraph],
    (error, result) => {
      if (error) {
        console.error("Error inserting image data into database:", error);
        return res.status(500).json({ error: "Database error" });
      }
      return res.status(201).json({ message: "Text Updated successfully" });
    }
  );
};

const get_texts = (req, res) => {
  try {
    // Retrieve all phone numbers from the database
    db.query("SELECT * FROM texts", (err, texts) => {
      if (err) {
        console.error("Error executing query:", err);
        return res.status(500).json({ error: "Internal Server Error" });
      }
      if (texts.length !== 1) {
        return res
          .status(500)
          .json({ error: "No Texts Saved in the database" });
      }
      res.status(200).json({ texts: texts });
    });
  } catch (error) {
    console.error("Error in getAllPhoneNumbers:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
};

const fetch_tracks = async (req, res) => {
  try {
    // Get the query parameter from the request
    const query = req.query.q;

    // Obtain the access token
    const {
      data: { access_token },
    } = await axios.post("https://accounts.spotify.com/api/token", null, {
      params: {
        grant_type: "client_credentials",
      },
      headers: {
        "Content-Type": "application/x-www-form-urlencoded",
        Authorization: `Basic ${Buffer.from(
          `${CLIENT_ID}:${CLIENT_SECRET}`
        ).toString("base64")}`,
      },
    });

    const {
      data: { tracks },
    } = await axios.get("https://api.spotify.com/v1/search", {
      params: {
        q: query,
        type: "track",
        limit: 5,
      },
      headers: {
        Authorization: `Bearer ${access_token}`,
      },
    });

    // Return the search results
    // console.log(tracks)
    // tracks.items.forEach(element => {
      
    // });
    res.json(tracks);
  } catch (error) {
    console.error("Error searching for track:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
};
module.exports = {
  new_request,
  get_image_name,
  fetch_tracks,
  save_image,
  change_text,
  get_texts,
  // get_all_phone_numbers,
  // get_single_phone_number,
  // delete_phone_number,
  // create_new_bot,
  // get_all_bots,
  // get_single_bot,
  // delete_bot,
  // create_deal,
};
