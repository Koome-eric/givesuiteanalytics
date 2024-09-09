"use server";

import { connectToDB } from "../mongoose";
import Donor from "../models/donor.model";
import Donation from "../models/donation.model";
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

/// Fetch donors for a specific user with optional search query
export async function fetchDonors({
  userId,
  searchString = "",
  pageNumber = 1,
  limit = 5,
}: {
  userId: string; // Specify the type for userId
  searchString?: string;
  pageNumber?: number;
  limit?: number;
}) {
  try {
    connectToDB();

    // Find the user document to get the ObjectId
    const user = await User.findOne({ id: userId });
    if (!user) {
      throw new Error('User not found');
    }

    // Create a regex for case-insensitive search
    const searchRegex = new RegExp(searchString, 'i');

    // Calculate the number of donors to skip based on the page number and limit
    const skip = (pageNumber - 1) * limit;

    // Find donors where the author matches the user's ObjectId and the name matches the search query, and paginate the results
    const donors = await Donor.find({ 
      author: user._id,
      name: { $regex: searchRegex }
    })
      .skip(skip)
      .limit(limit);

    // Count the total number of donors for the user that match the search query
    const totalDonors = await Donor.countDocuments({ 
      author: user._id,
      name: { $regex: searchRegex }
    });

    // Check if there is a next page
    const isNext = totalDonors > skip + donors.length;

    return { donors, isNext, pageNumber: pageNumber };
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

export const deleteDonor = async (formData: FormData) => {
  const { id } = Object.fromEntries(formData);

  try {
    connectToDB();
    await Donor.findByIdAndDelete(id);
  } catch (err) {
    console.log(err);
    throw new Error("Failed to delete donor!");
  }

  revalidatePath("/donor");
};

// Update a donor by ID
export async function updateDonor(donorId: string, updateData: Partial<Params>) {
  try {
    connectToDB();

    // Update the donor
    const updatedDonor = await Donor.findByIdAndUpdate(donorId, updateData, { new: true });

    // Optionally revalidate the path if using ISR
    revalidatePath(`/donor`);

    return updatedDonor; // Return the updated donor
  } catch (error: any) {
    throw new Error(`Failed to update donor: ${error.message}`);
  }
}

export const fetchDonor = async (donorId: string) => {
  try {
    await connectToDB();
    const donor = await Donor.findById(donorId);

    if (!donor) {
      throw new Error('Donor not found');
    }

    return donor;
  } catch (error: any) {
    throw new Error(`Failed to fetch donor: ${error.message}`);
  }
};

// Fetch all donations made by a specific donor based on the name
export const fetchDonationsByDonorName = async (donorName: string) => {
  try {
    connectToDB();
    const donations = await Donation.find({ Name: donorName }).sort({ Date: -1 });
    return donations;
  } catch (err) {
    console.log(err);
    throw new Error("Failed to fetch donations by donor name!");
  }
};

// Get the total donation amount made by a specific donor based on the name
export const getTotalDonationsAmountByDonorName = async (donorName: string) => {
  try {
    const donations = await fetchDonationsByDonorName(donorName);
    const totalAmount = donations.reduce((total, donation) => {
      const amount = parseFloat(donation.Amount.replace(/[^0-9.-]+/g, ""));
      return total + amount;
    }, 0);
    return totalAmount;
  } catch (err) {
    console.log(err);
    throw new Error("Failed to calculate total donations amount by donor name!");
  }
};
