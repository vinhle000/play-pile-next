const mongoose = require("mongoose");

const User = mongoose.model(
  "User",
  new mongoose.Schema(
    {
      username: {
        type: String,
        required: [true, "Please add a name"],
      },
      email: {
        type: String,
        required: [true, "Please add an email"],
        unique: true,
        // match: [
        //   /^([\w-\.]+@([\w-]+\.)+[\w-]{2,4})?$/,
        //   "Please add a valid email",
        // ],
      },
      // The select: false option just means that Mongoose will
      // not include this field by default when you fetch documents.
      password: {
        type: String,
        required: [true, "Please add a password"],
        select: false, // Explicitly include the password field
      },
        },
        {
      timestamps: true,
        },
      ),
    );

module.exports = User;
