"use client";

import React from 'react';
import { Bar } from 'react-chartjs-2';
import { Chart as ChartJS, CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend } from 'chart.js';

interface Donation {
  Date: string;
  Amount: string;
}

interface DonationsChartProps {
  donationData: Donation[];
}

interface MonthlyDonations {
  [key: string]: number;
}

ChartJS.register(CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend);

const monthsOrder = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];

const monthMapping = {
  '01': 'Jan',
  '02': 'Feb',
  '03': 'Mar',
  '04': 'Apr',
  '05': 'May',
  '06': 'Jun',
  '07': 'Jul',
  '08': 'Aug',
  '09': 'Sep',
  '10': 'Oct',
  '11': 'Nov',
  '12': 'Dec',
};

const getMonthName = (dateString: string) => {
  const month = dateString.split('/')[0] as keyof typeof monthMapping;
  return monthMapping[month];
};

const DonationsChart: React.FC<DonationsChartProps> = ({ donationData }) => {
  const monthlyDonations: MonthlyDonations = {};
  donationData.forEach((donation) => {
    const monthName = getMonthName(donation.Date);
    if (!monthlyDonations[monthName]) {
      monthlyDonations[monthName] = 0;
    }
    monthlyDonations[monthName] += parseFloat(donation.Amount);
  });

  // Sort monthly donations
  const sortedMonthlyDonations: MonthlyDonations = {};
  monthsOrder.forEach((month) => {
    if (monthlyDonations[month]) {
      sortedMonthlyDonations[month] = monthlyDonations[month];
    }
  });

  const chartData = {
    labels: Object.keys(sortedMonthlyDonations),
    datasets: [
      {
        label: 'Total Donations',
        data: Object.values(sortedMonthlyDonations),
        backgroundColor: 'rgba(135, 126, 255, 0.5)',
        borderColor: 'rgba(135, 126, 255, 1)',
        borderWidth: 1,
      },
    ],
  };

  const options = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        display: false,
      }
    },
    scales: {
      x: {
        title: {
          display: true,
          text: 'Month',
        },
      },
      y: {
        title: {
          display: true,
          text: 'Amount ($)',
        },
        beginAtZero: true,
      },
    },
  };

  return (
    <div className="chart-container h-[400px]">
      <h2 className="text-center text-xl font-bold mb-4">Monthly Donations</h2>
      <Bar data={chartData} options={options} />
    </div>
  );
};

export default DonationsChart;
