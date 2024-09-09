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

// Fetch donations for a specific user with optional search query
export async function fetchDonations({
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

    // Calculate the number of donations to skip based on the page number and limit
    const skip = (pageNumber - 1) * limit;

    // Find donations where the author matches the user's ObjectId and the name matches the search query, and paginate the results
    const donations = await Donation.aggregate([
      { $match: { author: user._id, Name: { $regex: searchRegex } } },
      { $addFields: { sortableDate: { $dateFromString: { dateString: '$Date', format: '%m/%d/%Y' } } } },
      { $sort: { sortableDate: -1 } },
      { $skip: skip },
      { $limit: limit },
      { $project: { sortableDate: 0 } } // Remove the sortableDate field from the final output
    ]);

    // Count the total number of donations for the user that match the search query
    const totalDonations = await Donation.countDocuments({ 
      author: user._id,
      Name: { $regex: searchRegex }
    });

    // Check if there is a next page
    const isNext = totalDonations > skip + donations.length;

    return { donations, isNext, pageNumber: pageNumber };
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
export async function fetchLatestDonations(userId: string, limit: number = 6) {
  try {
    connectToDB();

    // Find the user document to get the ObjectId
    const user = await User.findOne({ id: userId });
    if (!user) {
      throw new Error('User not found');
    }

    // Find donations where the author matches the user's ObjectId, and limit the results
    const donations = await Donation.aggregate([
      { $match: { author: user._id } },
      { $addFields: { sortableDate: { $dateFromString: { dateString: '$Date', format: '%m/%d/%Y' } } } },
      { $sort: { sortableDate: -1 } }, // Sort by sortableDate in descending order
      { $limit: limit },
      { $project: { Name: 1, Date: 1, Amount: 1, _id: 1 } } // Select only the necessary fields
    ]);

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

  revalidatePath("/");
};

// Update a donation by ID
export async function updateDonation(donationId: string, updateData: Partial<Params>) {
  try {
    connectToDB();

    // Update the donation
    const updatedDonation = await Donation.findByIdAndUpdate(donationId, updateData, { new: true });

    // Optionally revalidate the path if using ISR
    revalidatePath(`/donation`);

    return updatedDonation; // Return the updated donation
  } catch (error: any) {
    throw new Error(`Failed to update donation: ${error.message}`);
  }
}

export const fetchDonation = async (donationId: string) => {
  try {
    await connectToDB();
    const donation = await Donation.findById(donationId);

    if (!donation) {
      throw new Error('Donation not found');
    }

    return donation;
  } catch (error: any) {
    throw new Error(`Failed to fetch donation: ${error.message}`);
  }
};


// Fetch yearly donations for a specific user
export async function fetchYearlyDonations(userId: string) {
  try {
    await connectToDB();

    // Find the user document to get the ObjectId
    const user = await User.findOne({ id: userId });
    if (!user) {
      throw new Error('User not found');
    }

    const currentYear = '2024'; // Set the current year as a string

    // Find donations where the author matches the user's ObjectId and the year matches the current year
    const donations = await Donation.find({
      author: user._id,
      Date: { $regex: `^\\d{2}/\\d{2}/${currentYear}` } // Match dates in the format mm/dd/2024
    });

    // Group donations by month
    const monthlyDonations: Record<string, any[]> = {};

    donations.forEach(donation => {
      const month = donation.Date.substring(0, 2); // Extract the month (e.g., '01' for January)
      
      if (!monthlyDonations[month]) {
        monthlyDonations[month] = [];
      }
      
      monthlyDonations[month].push(donation.toObject());
    });

    // Convert monthlyDonations to a plain object format
    const plainMonthlyDonations = Object.fromEntries(
      Object.entries(monthlyDonations).map(([month, donations]) => [
        month,
        donations.map(donation => ({
          ...donation,
          _id: donation._id.toString(),
          author: donation.author.toString(),
        })),
      ])
    );

    return plainMonthlyDonations;
  } catch (error) {
    const message = (error instanceof Error) ? error.message : 'An unknown error occurred';
    console.error('Error fetching yearly donations:', message);
    throw new Error(`Failed to fetch yearly donations: ${message}`);
  }
}






