import React, { useEffect, useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { getCurrentCustomerProfile } from '../../actions/customerAction';
import { motion } from 'framer-motion';
import Lottie from 'lottie-react';
import handymanAnim from './Animation - 1750949180058.json';
import { FaBroom, FaTools, FaPlug, FaHammer } from 'react-icons/fa';

const icons = [FaBroom, FaTools, FaPlug, FaHammer];

const WelcomeContent = () => {
  const [visible, setVisible] = useState(true);
  const dispatch = useDispatch();
  const { profile } = useSelector((state) => state.customer);

  useEffect(() => {
    dispatch(getCurrentCustomerProfile());
  }, [dispatch]);

  useEffect(() => {
    const interval = setInterval(() => {
      setVisible(v => !v);
    }, 8000); // 10 seconds
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="relative flex flex-col items-center justify-center min-h-[45vh]">
      <div className="absolute inset-0 -z-10 bg-gradient-to-br from-blue-50/70 to-white/90 rounded-xl" />
      <motion.div
        className="py-8 px-6 bg-white/70 backdrop-blur-lg rounded-xl shadow-2xl flex flex-col items-center"
        initial={{ opacity: 0, y: -50 }}
        animate={visible ? { opacity: 1, y: 0 } : { opacity: 0, y: 100 }}
        transition={{ duration: 1 }}
      >
        <Lottie animationData={handymanAnim} className="w-24 h-24 mb-2" loop />
        <motion.h1
          className="text-4xl md:text-5xl font-bold mb-4 text-gray-900"
          initial={{ scale: 0.8 }}
          animate={{ scale: 1 }}
          transition={{ duration: 1, delay: 0.3, type: "spring" }}
        >
          Welcome, <motion.span whileHover={{ color: "#2563eb" }} className="text-primary cursor-pointer">{profile?.fullName || "Customer"}</motion.span>
        </motion.h1>
        <motion.p
          className="text-lg md:text-xl text-gray-700 text-center"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.6, duration: 1 }}
        >
          Need a reliable electrician, plumber, cleaner, carpenter or mechanic? You’re in the right place!
        </motion.p>
        <div className="flex justify-center gap-6 mt-6">
          {icons.map((Icon, i) => (
            <motion.div
              key={i}
              whileHover={{ scale: 1.2, rotate: 8 }}
              className="text-3xl text-blue-600"
              tabIndex={0}
            >
              <Icon />
            </motion.div>
          ))}
        </div>
      </motion.div>
    </div>
  );
};

export default WelcomeContent;