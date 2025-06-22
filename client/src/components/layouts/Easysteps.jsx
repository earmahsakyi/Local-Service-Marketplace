import React from "react";
import { motion } from "framer-motion";

const steps = [
  {
    icon: "person_add",
    title: "Create an Account",
    description: 'Click on "Sign Up" in the navigation bar to get started.',
  },
  {
    icon: "build",
    title: "Add Service",
    description: "Update your profile after creating your account to list your service.",
  },
  {
    icon: "search",
    title: "Search for a Service",
    description: "Use the filter option to find service providers near you.",
  },
  {
    icon: "event_available",
    title: "Book Now",
    description: "Get notified when the provider approves authentication required!",
  },
];

const Easysteps = () => (
  <section className="py-12">
    <motion.h3
      className="textext-2xl md:text-3xl font-semibold text-center mb-10 font-heading text-gray-900"
      initial={{ opacity: 0, y: -30 }}
      whileInView={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6 }}
    >
      Book or Add With 3 Easy Steps
    </motion.h3>
    <div className="flex flex-col md:flex-row justify-center items-stretch gap-8">
      {steps.map((step, idx) => (
        <motion.div
          key={idx}
          className="flex-1 bg-white shadow-lg rounded-xl p-6 flex flex-col items-center text-center transition-colors"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 1, delay: idx * 0.2 }}
          viewport={{ once: false }}
        >
          <span className="material-icons text-4xl mb-3 text-primary">{step.icon}</span>
          <h5 className="text-xl font-semibold mb-2">{step.title}</h5>
          <p className="text-gray-600">{step.description}</p>
        </motion.div>
      ))}
    </div>
  </section>
);

export default Easysteps;