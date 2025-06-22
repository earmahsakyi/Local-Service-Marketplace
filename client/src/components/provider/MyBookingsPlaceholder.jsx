import React from 'react';
import { motion } from 'framer-motion';
import { CalendarCheck } from 'lucide-react'; // Example icon

const MyBookingsPlaceholder = () => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="flex flex-col items-center justify-center h-full p-8 text-center bg-gray-50 rounded-lg shadow"
    >
      <CalendarCheck size={48} className="text-blue-500 mb-4" />
      <h2 className="text-2xl font-semibold text-gray-700 mb-2">My Bookings</h2>
      <p className="text-gray-500">
        This page will display your bookings soon. Backend functionality is pending.
      </p>
    </motion.div>
  );
};

export default MyBookingsPlaceholder;
