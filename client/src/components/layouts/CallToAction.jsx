import React from "react";
import { motion } from "framer-motion";
import { Link } from "react-router-dom";

const CallToAction = () => (
  <motion.section
    className="py-10 mt-10 bg-primary/10 rounded-xl shadow-inner flex flex-col items-center transition-colors"
    initial={{ opacity: 0, y: 50 }}
    whileInView={{ opacity: 1, y: 0 }}
    transition={{ duration: 0.8 }}
    viewport={{ once: false }}
  >
    <h4 className="text-2xl md:text-3xl font-semibold text-center mb-4 font-heading text-gray-900">
      Get Started - Find Trusted Local Experts
    </h4>
    <p className="text-lg text-center mb-6 text-gray-700">
      Create your free account and connect with reliable professionals in your area.
    </p>
    <motion.div
      className="flex flex-col md:flex-row gap-4"
      initial={{ opacity: 0, y: 50 }}
      whileInView={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.8 }}
      viewport={{ once: false }}
    >
      <Link to="/register" className="btn bg-primary text-white px-6  rounded-xl font-semibold shadow hover:bg-accent transition">
        Get Started
      </Link>
      <Link to="/register" className="btn-flat text-primary py-2 rounded-xl font-semibold hover:underline">
        Are you a service provider? Join here
      </Link>
    </motion.div>
  </motion.section>
);

export default CallToAction;