import mongoose from "mongoose";

const donorSchema = new mongoose.Schema(
    {
        name: {
            type: String,
            required: true,
            unique: true,
          },
          primaryemailaddress: {
            type: String, 
            unique: true,
          },
          primarystreet: {
            type: String,
          },
          primarycity: {
            type: String,
          },
          primarystate: {
            type: String,
          },
          phonenumber: {
            type: String,
          },
          donationnumber: {
            type: Number,
            min: 0,
          },
          donationamount: {
            type: String,
          },
          lastdate: {
            type: String,
          },
          img: {
            type: String,
          },
          accountnumber: {
            type: String,
            unique: true,
            min: 0, 
          },
          author: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "User",
            required: true,
          },
          primaryzipcode	: {
            type: Number,
            min: 0, 
          },
          firstdonationdate: {
            type: String,
          },
          largestdonationdate: {
            type: String,
          },
          firstdonation: {
            type: String,
          },
          largestdonation: {
            type: String,
          },
          latestdonation: {
            type: String,
          },
        },
      { timestamps: true }
    );

const Donor = mongoose.models.Donor || mongoose.model("Donor", donorSchema);

export default Donor;