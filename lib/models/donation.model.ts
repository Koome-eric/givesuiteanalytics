import mongoose from "mongoose";

const donationSchema = new mongoose.Schema(
    {
      Name: {
          type: String,
          required: true,
          unique: true,
        },
        author: {
          type: mongoose.Schema.Types.ObjectId,
          ref: "User",
          required: true,
        },
        Date: {
          type: String, 
          
        },
        Amount: {
          type: String,
        },
        Type: {
          type: String,
        },
        Fund: {
          type: String,
        },
        img: {
          type: String,
        },
        account: {
          type: String,
          min: 0, 
        },
        Campaign: {
          type: String,
        
        },
      },
    { timestamps: true }
  );
const Donation = mongoose.models.Donation || mongoose.model("Donation", donationSchema);

export default Donation;