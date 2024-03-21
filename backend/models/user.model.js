import mongoose from "mongoose";

const userSchema = new mongoose.Schema(
  {
    username: { type: String, required: true, unique: true },
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    profilePicture: {
      type: String,
      default:
        "https://openseauserdata.com/files/7f16cec1cc177a7e148067006e73c02a.png",
    },
    isAdmin: {
      type: Boolean,
      default: false,
    },
  },
  /* gives the time of creation and update */
  { timestamps: true }
);

const User = mongoose.model("User", userSchema);

export default User;
