import React from "react";
import { motion } from "framer-motion";

const WelcomeContent = () => (
  <motion.div
    className="py-8"
    initial={{ opacity: 0, y: -50 }}
    whileInView={{ opacity: 1, y: 0 }}
    transition={{ duration: 1 }}
    viewport={{ once: false, amount: 0.5 }}
  >
    <motion.h1
      className="text-4xl md:text-5xl font-bold mb-4 text-gray-900"
      initial={{ scale: 0.8 }}
      animate={{ scale: 1 }}
      transition={{ duration: 1, delay: 0.3, type: "spring" }}
    >
      Welcome to <span className="text-primary ">InYourArea</span>
    </motion.h1>
    <motion.p
      className="text-lg md:text-xl text-gray-700"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ delay: 0.6, duration: 1 }}
    >
      Need a reliable electrician, plumber, cleaner, carpenter or mechanic? You’re in the right place!
      We connect you with trusted local professionals who get the job done quickly, safely, and affordably.
    </motion.p>
  </motion.div>
);

export default WelcomeContent;