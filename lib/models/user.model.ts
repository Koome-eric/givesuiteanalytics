import mongoose from "mongoose";

const userSchema = new mongoose.Schema({
  id: {
    type: String,
    required: true,
  },
  username: {
    type: String,
    unique: true,
    required: true,
  },
  name: {
    type: String,
    required: true,
  },
  image: String,
  bio: String,
  members: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Member",
    },
  ],
  onboarded: {
    type: Boolean,
    default: false,
  },
  donors: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Donor",
    },
  ],
  donations: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Donation",
    },
  ],
});

const User = mongoose.models.User || mongoose.model("User", userSchema);

export default User;
