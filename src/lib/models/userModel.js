import mongoose from 'mongoose';

const UserSchema = new mongoose.Schema(
  {
    username: {
      type: String,
      // 6.3.24 - Switching to Oauth methods
      // required: [true, 'Please add a name'],
    },
    email: {
      type: String,
      required: [true, 'Please add an email'],
      unique: true,
      // match: [
      //   /^([\w-\.]+@([\w-]+\.)+[\w-]{2,4})?$/,
      //   "Please add a valid email",
      // ],
    },
    // The select: false option just means that Mongoose will
    // not include this field by default when you fetch documents.

    // 6.3.24 - Switching to Oauth methods
    // password: {
    //   type: String,
    //   required: [true, 'Please add a password'],
    //   select: false, // Explicitly include the password field
    // },
  },
  {
    timestamps: true,
  },
);

// userSchema.index({ username: 1 });
UserSchema.index({ email: 1 });
const User = mongoose.models?.User || mongoose.model('User', UserSchema);
export default User;
