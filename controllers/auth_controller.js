const Joi = require("joi");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const db = require("../DB/db");
const { use } = require("../routes/routes");

// ### ADMIN LOGIN API ####
const admin_login = (req, res) => {
  try {
    // Input validation using Joi
    const schema = Joi.object({
      user_name: Joi.string().email().required(),
      password: Joi.string().required(),
    });

    const { error } = schema.validate(req.body);

    if (error) {
      return res.status(400).json({ error: error.details[0].message });
    }

    const { user_name, password } = req.body;
    // console.log(user_name);
    // console.log(password);
    // Check if user exists and is either superadmin or agent
    db.query(
      "SELECT * FROM users WHERE email = ?",
      [user_name],
      (err, results) => {
        if (err) {
          console.error("Error executing query:", err);
          return res.status(500).json({ error: "Internal Server Error" });
        }
        // console.log(results[0].password);
        const user = results[0];

        if (!user) {
          return res.status(401).json({ error: "Invalid credentials" });
        }

        // Compare passwords (not recommended for production)
        // console.log(user.pass);
        if (user.pass !== password) {
          return res.status(401).json({ error: "Invalid credentials" });
        }

        // if (user.role !== 'superadmin' && user.role !== 'agent') {
        //     return res.status(403).json({ error: 'Access forbidden' });
        // }

        // Generate JWT token
        const token = jwt.sign(
          { user_id: user.user_id, user_name: user.user_name, role: user.role },
          process.env.JWT_SECRET_ADMIN
        );

        // Set the JWT token as a cookie
        res.cookie("admin_access_token", token, {
          maxAge: 2 * 24 * 60 * 60 * 1000,
          secure: true,
          httpOnly: true,
        }); // 2 days in milliseconds

        // Remove password from the response
        delete user.pass;

        res.json({
          message: "Login successful",
          user,
          token,
        });
      }
    );
  } catch (error) {
    console.error("Error in admin_login:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
};

module.exports = {
  admin_login,
};
