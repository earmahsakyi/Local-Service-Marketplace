import React from "react";
import { motion } from "framer-motion";

const topServices = [
  {
    title: "Electrician",
    description: "Need wiring, lights, or fans fixed? Find expert electricians near you.",
    icon: "bolt",
  },
  {
    title: "Plumber",
    description: "Fix leaks, install sinks, and maintain your plumbing system.",
    icon: "plumbing",
  },
  {
    title: "Cleaner",
    description: "Reliable home and office cleaners you can count on.",
    icon: "cleaning_services",
  },
  {
    title: "Mechanic",
    description: "Professional vehicle repair and maintenance services.",
    icon: "build",
  },
];

const TopServices = () => (
  <section className="py-12">
    <h3 className="text-2xl md:text-3xl font-semibold text-center mb-10 font-heading text-gray-900">Top Services</h3>
    <div className="flex flex-col md:flex-row justify-center items-stretch gap-8">
      {topServices.map((service, idx) => (
        <motion.div
          key={idx}
          className="flex-1 bg-white shadow-lg rounded-xl p-6 flex flex-col items-center text-center transition-colors"
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: false }}
          transition={{ duration: 0.5, delay: idx * 0.2 }}
        >
          <span className="material-icons text-4xl mb-3 text-primary">{service.icon}</span>
          <h5 className="text-xl font-semibold mb-2">{service.title}</h5>
          <p className="text-gray-600">{service.description}</p>
        </motion.div>
      ))}
    </div>
  </section>
);

export default TopServices;