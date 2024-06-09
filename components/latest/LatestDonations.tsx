// LatestDonations.tsx
"use client";

import React from 'react';

// Define an interface for a donation
interface Donation {
  Name: string;
  Amount: string;
  Date: string;
}

// Use the Donation interface to type the donations prop
const LatestDonations = ({ donations }: { donations: Donation[] }) => {
  return (
    <div className="latest-donations-container bg-white rounded-lg shadow-md p-4">
      <h3 className="text-lg font-semibold mb-4">Latest Donations</h3>
      <ul>
        {donations.map((donation, index) => (
          <li key={index} className="mb-3">
            <div className="flex justify-between">
              <span className="font-medium">{donation.Name}</span>
              <span className="text-sm text-gray-500">{`$${donation.Amount}`}</span>
            </div>
            <div className="text-sm1 text-gray-500">{donation.Date}</div>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default LatestDonations;
