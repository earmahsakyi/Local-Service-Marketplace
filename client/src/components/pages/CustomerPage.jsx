import React, { useState } from 'react'
import Navbar from '../customer/Navbar'
import WelcomeContent from '../customer/WelcomeContent'
import MapComponent from '../customer/MapComponent'
import SearchComponent from '../customer/SearchComponent'
import RequestsComponent from '../customer/RequestsComponent'
import { MdSearch, MdMap, MdAssignment } from "react-icons/md"
import { motion, AnimatePresence } from "framer-motion"

const TABS = [
  { name: "Search", key: "search", icon: <MdSearch size={22} /> },
  { name: "Map", key: "map", icon: <MdMap size={22} /> },
  { name: "My Requests", key: "requests", icon: <MdAssignment size={22} /> },
]

const tabVariants = {
  initial: { opacity: 0, x: 30 },
  animate: { opacity: 1, x: 0 },
  exit: { opacity: 0, x: -30 },
}

const CustomerPage = () => {
  const [activeTab, setActiveTab] = useState("search")
  return (
    <div className="bg-gray-100 min-h-screen">
      <Navbar />
      <div className="px-0 py-10">
        {/* Full-width welcome container */}
        <div className="w-full bg-white/70 backdrop-blur-lg rounded-xl shadow-2xl px-6 py-8 flex flex-col md:flex-row items-center md:items-start gap-6">
          <div className="flex-1 w-full text-left">
            <WelcomeContent />
          </div>
        </div>

        {/* Tab Bar */}
        <div className="flex space-x-2 md:space-x-4 mt-8 mb-6 bg-white/80 backdrop-blur rounded-xl shadow px-2 py-2 w-full">
          {TABS.map(tab => (
            <motion.button
              key={tab.key}
              whileTap={{ scale: 0.92 }}
              whileHover={{ scale: 1.06 }}
              className={`flex items-center gap-2 px-4 py-2 rounded-lg font-semibold transition outline-none
                ${activeTab === tab.key
                  ? "bg-blue-600 text-white shadow"
                  : "text-blue-700 hover:bg-blue-100"}`}
              onClick={() => setActiveTab(tab.key)}
            >
              {tab.icon} <span>{tab.name}</span>
            </motion.button>
          ))}
        </div>

        {/* Animated Tab Content */}
        <div className="relative min-h-[300px] px-4">
          <AnimatePresence mode="wait">
            {activeTab === "search" && (
              <motion.div
                key="search"
                variants={tabVariants}
                initial="initial"
                animate="animate"
                exit="exit"
                transition={{ duration: 0.4 }}
                className="absolute w-full"
              >
                <SearchComponent />
              </motion.div>
            )}
            {activeTab === "map" && (
              <motion.div
                key="map"
                variants={tabVariants}
                initial="initial"
                animate="animate"
                exit="exit"
                transition={{ duration: 0.4 }}
                className="absolute w-full"
              >
                <MapComponent />
              </motion.div>
            )}
            {activeTab === "requests" && (
              <motion.div
                key="requests"
                variants={tabVariants}
                initial="initial"
                animate="animate"
                exit="exit"
                transition={{ duration: 0.4 }}
                className="absolute w-full"
              >
                <RequestsComponent />
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>
    </div>
  )
}

export default CustomerPage