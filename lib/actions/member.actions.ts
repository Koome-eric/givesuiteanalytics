"use server";

import { connectToDB } from "../mongoose";
import Member from "../models/member.model";
import User from "../models/user.model";
import { revalidatePath } from "next/cache";

// Add a new member
interface Params {
  username: string,
  email: string,
  password: string,
  author: string,
  phone?: string,
  address?: string,
  role?: string,
}

export async function addMember({ username, email, password, author, phone, address, role }: Params) {
  try {
    connectToDB();

    // Create the new member
    const newMember = await Member.create({
      username,
      email,
      password,
      author,
      phone,
      address,
      role,
      
    });

    // Update User model to add the new member to the user's members array
    await User.findByIdAndUpdate(author, {
      $push: { members: newMember._id },
    });

    // Optionally revalidate the path if using ISR
    revalidatePath(`/member`);


    return newMember; // Return the newly created member
  } catch (error: any) {
    throw new Error(`Failed to create member: ${error.message}`);
  }
}

/// Fetch members for a specific user with optional search query
export async function fetchMembers({
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

    // Calculate the number of members to skip based on the page number and limit
    const skip = (pageNumber - 1) * limit;

    // Find members where the author matches the user's ObjectId and the name matches the search query, and paginate the results
    const members = await Member.find({ 
      author: user._id,
      username: { $regex: searchRegex }
    })
      .skip(skip)
      .limit(limit);

    // Count the total number of members for the user that match the search query
    const totalMembers = await Member.countDocuments({ 
      author: user._id,
      username: { $regex: searchRegex }
    });

    // Check if there is a next page
    const isNext = totalMembers > skip + members.length;

    return { members, isNext, pageNumber: pageNumber };
  } catch (error: any) {
    throw new Error(`Failed to fetch members: ${error.message}`);
  }
}

// Fetch total members for a specific user
export async function fetchTotalMembers(userId: string): Promise<number> {
  try {
    connectToDB();

    // Find the user document to get the ObjectId
    const user = await User.findOne({ id: userId });
    if (!user) {
      throw new Error('User not found');
    }

    // Count the total number of members for the user
    const totalMembers = await Member.countDocuments({ author: user._id });

    return totalMembers;
  } catch (error: any) {
    throw new Error(`Failed to fetch total members: ${error.message}`);
  }
}

export const deleteMember = async (formData: FormData) => {
  const { id } = Object.fromEntries(formData);

  try {
    connectToDB();
    await Member.findByIdAndDelete(id);
  } catch (err) {
    console.log(err);
    throw new Error("Failed to delete member!");
  }

  revalidatePath("/member");
};

// Update a member by ID
export async function updateMember(memberId: string, updateData: Partial<Params>) {
  try {
    connectToDB();

    // Update the member
    const updatedMember = await Member.findByIdAndUpdate(memberId, updateData, { new: true });

    // Optionally revalidate the path if using ISR
    revalidatePath(`/member`);

    return updatedMember; // Return the updated member
  } catch (error: any) {
    throw new Error(`Failed to update member: ${error.message}`);
  }
}

export const fetchMember = async (memberId: string) => {
  try {
    await connectToDB();
    const member = await Member.findById(memberId);

    if (!member) {
      throw new Error('Member not found');
    }

    return member;
  } catch (error: any) {
    throw new Error(`Failed to fetch member: ${error.message}`);
  }
};