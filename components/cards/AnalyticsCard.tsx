"use client";

import React from 'react';
import { ReactNode } from 'react';

interface AnalyticsCardProps {
  title: string;
  count: string | number;
  icon: ReactNode;
}

const AnalyticsCard: React.FC<AnalyticsCardProps> = ({ title, count, icon }) => {
  return (
    <div className="bg-white shadow-md rounded-lg p-4 flex items-center justify-between">
      <div>
        <h4 className="text-gray-500">{title}</h4>
        <h2 className="text-xl font-bold">{count}</h2>
      </div>
      <div className="text-blue-500">
        {icon}
      </div>
    </div>
  );
};

export default AnalyticsCard;

