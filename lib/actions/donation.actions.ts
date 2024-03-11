"use server";

import { connectToDB } from "../mongoose";
import Donation from "../models/donation.model";
import User from "../models/user.model";
import { revalidatePath } from "next/cache";

// Add a new donation
interface Params {
  Name: string,
  Date: string,
  Amount: string,
  Type?: string,
  Fund?: string,
  img?: string,
  account?: string,
  Campaign?: string,
  author: string,
}

export async function addDonation({ Name, Date, Amount, Type, Fund, account, Campaign, author }: Params) {
  try {
    connectToDB();

    // Create the new donation
    const newDonation = await Donation.create({
      Name,
      Date,
      Amount,
      Type,
      Fund,
      account,
      Campaign,
      author,
      
    });

    // Update User model to add the new member to the user's members array
    await User.findByIdAndUpdate(author, {
      $push: { donations: newDonation._id },
    });

    // Optionally revalidate the path if using ISR
    revalidatePath(`/donation`);


    return newDonation; // Return the newly created member
  } catch (error: any) {
    throw new Error(`Failed to create donation: ${error.message}`);
  }
}

// Fetch donations for a specific user
export async function fetchDonations(userId: string, page: number = 1, limit: number = 10) {
  try {
    connectToDB();

    // Find the user document to get the ObjectId
    const user = await User.findOne({ id: userId });
    if (!user) {
      throw new Error('User not found');
    }

    // Calculate the number of members to skip based on the page number and limit
    const skip = (page - 1) * limit;

    // Find members where the author matches the user's ObjectId, and paginate the results
    const donations = await Donation.find({ author: user._id })
      .skip(skip)
      .limit(limit);

    // Count the total number of members for the user
    const totalDonations = await Donation.countDocuments({ author: user._id });

    // Check if there is a next page
    const isNext = totalDonations > skip + donations.length;

    return { donations, isNext };
  } catch (error: any) {
    throw new Error(`Failed to fetch donations: ${error.message}`);
  }
}

// Fetch total donations amount for a specific user
export async function fetchTotalDonationsAmount(userId: string): Promise<number> {
  try {
    connectToDB();

    // Find the user document to get the ObjectId
    const user = await User.findOne({ id: userId });
    if (!user) {
      throw new Error('User not found');
    }

    // Aggregate the total donations amount for the user
    const result = await Donation.aggregate([
      { $match: { author: user._id } },
      { $project: { amountAsDouble: { $toDouble: "$Amount" } } }, // Convert Amount to double
      { $group: { _id: null, totalAmount: { $sum: "$amountAsDouble" } } } // Sum the converted amounts
    ]);

    return result.length > 0 ? result[0].totalAmount : 0;
  } catch (error: any) {
    throw new Error(`Failed to fetch total donations amount: ${error.message}`);
  }
}

// Fetch latest donations for a specific user
export async function fetchLatestDonations(userId: string, limit: number = 5) {
  try {
    connectToDB();

    // Find the user document to get the ObjectId
    const user = await User.findOne({ id: userId });
    if (!user) {
      throw new Error('User not found');
    }

    // Find donations where the author matches the user's ObjectId, and limit the results
    const donations = await Donation.find({ author: user._id })
      .select('Name Date Amount')
      .sort({ Date: -1 }) // Sort by date in descending order
      .limit(limit);

    return donations;
  } catch (error: any) {
    throw new Error(`Failed to fetch latest donations: ${error.message}`);
  }
}

export const deleteDonation = async (formData: FormData) => {
  const { id } = Object.fromEntries(formData);

  try {
    connectToDB();
    await Donation.findByIdAndDelete(id);
  } catch (err) {
    console.log(err);
    throw new Error("Failed to delete donation!");
  }

  revalidatePath("/donation");
};