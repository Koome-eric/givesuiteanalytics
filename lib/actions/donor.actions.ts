"use server";

import { connectToDB } from "../mongoose";
import Donor from "../models/donor.model";
import User from "../models/user.model";
import { revalidatePath } from "next/cache";

 
interface Params {
  name: string,
  primaryemailaddress: string,
  primarystreet?: string,
  primarycity?: string,
  primarystate?: string,
  accountnumber?: string,
  donationnumber?: number,
  donationamount?: string,
  lastdate?: string,
  img?: string,
  primaryzipcode?: number,
  firstdonationdate?: string,
  largestdonationdate?: string,
  firstdonation?: string,
  largestdonation?: string,
  latestdonation?: string,
  author: string,
}

export async function addDonor({ name, primaryemailaddress, primarystreet, primarycity, primarystate, accountnumber, author }: Params) {
  try {
    connectToDB();

    // Create the new donor
    const newDonor = await Donor.create({
      name,
      primaryemailaddress,
      primarystreet,
      primarycity,
      primarystate,
      accountnumber,
      author,
      
    });

    // Update User model to add the new member to the user's members array
    await User.findByIdAndUpdate(author, {
      $push: { donors: newDonor._id },
    });

    // Optionally revalidate the path if using ISR
    revalidatePath(`/donor`);


    return newDonor; // Return the newly created member
  } catch (error: any) {
    throw new Error(`Failed to create donor: ${error.message}`);
  }
}

// Fetch members for a specific user
export async function fetchDonors(userId: string, page: number = 1, limit: number = 10) {
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
    const donors = await Donor.find({ author: user._id })
      .skip(skip)
      .limit(limit);

    // Count the total number of members for the user
    const totalDonors = await Donor.countDocuments({ author: user._id });

    // Check if there is a next page
    const isNext = totalDonors > skip + donors.length;

    return { donors, isNext };
  } catch (error: any) {
    throw new Error(`Failed to fetch donors: ${error.message}`);
  }
}

// Fetch total donors for a specific user
export async function fetchTotalDonors(userId: string): Promise<number> {
  try {
    connectToDB();

    // Find the user document to get the ObjectId
    const user = await User.findOne({ id: userId });
    if (!user) {
      throw new Error('User not found');
    }

    // Count the total number of donors for the user
    const totalDonors = await Donor.countDocuments({ author: user._id });

    return totalDonors;
  } catch (error: any) {
    throw new Error(`Failed to fetch total donors: ${error.message}`);
  }
}