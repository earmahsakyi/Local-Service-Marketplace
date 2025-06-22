import React from "react";
import { FaFacebookF, FaTwitter, FaInstagram, FaArrowUp } from "react-icons/fa";

const Footer = () => {
  const scrollToTop = () => window.scrollTo({ top: 0, behavior: "smooth" });

  return (
    <footer className="relative w-full bg-gray-950 text-gray-200 mt-12 border-t border-gray-800 px-4 py-10 transition-colors">
      <div className="max-w-6xl mx-auto flex flex-col md:flex-row items-center md:items-start justify-between gap-10">
        <div className="w-full md:w-1/2 mb-6 md:mb-0">
          <h5 className="text-xl font-bold mb-3 font-heading">Stay Updated</h5>
          <p className="text-gray-400 mb-4">Subscribe to our newsletter for the latest updates.</p>
          <form className="flex flex-col sm:flex-row gap-2">
            <input
              type="email"
              required
              placeholder="Enter your email"
              className="flex-1 px-4 py-2 rounded-md bg-gray-800 text-gray-100 focus:outline-none focus:ring-2 focus:ring-primary"
            />
            <button
              type="submit"
              className="px-5 py-2 rounded-md bg-primary text-white font-semibold hover:bg-accent transition"
            >
              Subscribe
            </button>
          </form>
        </div>
        <div className="flex flex-col items-center gap-6 md:gap-8">
          <div className="flex gap-4">
            <a href="#" className="p-2 rounded-full bg-gray-800 hover:bg-primary transition" aria-label="Facebook">
              <FaFacebookF className="text-lg" />
            </a>
            <a href="#" className="p-2 rounded-full bg-gray-800 hover:bg-accent transition" aria-label="Twitter">
              <FaTwitter className="text-lg" />
            </a>
            <a href="#" className="p-2 rounded-full bg-gray-800 hover:bg-pink-500 transition" aria-label="Instagram">
              <FaInstagram className="text-lg" />
            </a>
          </div>
          <div className="text-sm text-gray-500">
            &copy; {new Date().getFullYear()} InYourArea. All rights reserved.
          </div>
        </div>
      </div>
      <button
        className="absolute right-6 bottom-6 bg-primary hover:bg-accent text-white p-3 rounded-full shadow-lg transition"
        onClick={scrollToTop}
        aria-label="Back to top"
      >
        <FaArrowUp />
      </button>
    </footer>
  );
};

export default Footer;