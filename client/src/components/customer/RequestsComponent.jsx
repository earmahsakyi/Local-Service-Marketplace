import React from "react"
import { motion } from "framer-motion"
import { FaCheckCircle, FaTimesCircle, FaClock } from "react-icons/fa"

// Demo data — replace with your API/Redux data!
const requests = [
  {
    id: 1,
    provider: "Kwame Plumber Ltd",
    service: "Plumbing",
    date: "2025-06-12",
    status: "Completed",
  },
  {
    id: 2,
    provider: "Akua Shine Cleaners",
    service: "Cleaning",
    date: "2025-06-20",
    status: "Pending",
  },
  {
    id: 3,
    provider: "Kofi Electric",
    service: "Electrical",
    date: "2025-05-28",
    status: "Cancelled",
  },
]

const statusIcon = (status) => {
  if (status === "Completed")
    return <FaCheckCircle className="text-green-500" />
  if (status === "Cancelled")
    return <FaTimesCircle className="text-red-500" />
  return <FaClock className="text-yellow-500" />
}

const RequestsComponent = () => (
  <motion.div
    initial={{ opacity: 0, y: 20 }}
    animate={{ opacity: 1, y: 0 }}
    transition={{ duration: 0.5 }}
  >
    <h2 className="text-xl font-semibold mb-4 text-gray-900">My Requests</h2>
    {requests.length === 0 ? (
      <div className="text-gray-500">No requests yet.</div>
    ) : (
      <div className="divide-y divide-gray-200">
        {requests.map((req) => (
          <motion.div
            key={req.id}
            className="flex items-center justify-between py-3"
            initial={{ opacity: 0, x: -30 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.3, delay: req.id * 0.1 }}
          >
            <div>
              <div className="font-medium text-gray-800">{req.service}</div>
              <div className="text-gray-500 text-sm">
                {req.provider} &mdash; {new Date(req.date).toLocaleDateString()}
              </div>
            </div>
            <div className="flex items-center gap-2">
              {statusIcon(req.status)}
              <span className="text-sm font-medium">{req.status}</span>
            </div>
          </motion.div>
        ))}
      </div>
    )}
  </motion.div>
)

export default RequestsComponent