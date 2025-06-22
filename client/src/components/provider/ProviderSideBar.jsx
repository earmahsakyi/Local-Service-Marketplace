import React from "react";
import { Link, useNavigate } from "react-router-dom";

const ProviderSidebar = () => {
  const navigate = useNavigate();

  // Example logout handler
  const handleLogout = () => {
    // add your logout logic here
    navigate("/login");
  };

  return (
    <aside className="w-64 bg-white shadow-lg min-h-screen p-6 flex flex-col">
      <div className="mb-8">
        <span className="text-2xl font-bold text-blue-600">Dashboard</span>
      </div>
      <nav className="flex-1 space-y-2">
        <Link
          to="/provider-page"
          className="flex items-center px-4 py-2 text-gray-700 bg-blue-100 rounded font-semibold"
        >
          {/* Home Icon */}
          <svg className="w-5 h-5 mr-3 text-blue-600" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" d="M3 12l9-9 9 9v7a2 2 0 01-2 2H5a2 2 0 01-2-2z"></path>
          </svg>
          Home
        </Link>
        <Link
          to="/provider/users"
          className="flex items-center px-4 py-2 text-gray-600 hover:bg-blue-50 rounded"
        >
          {/* Users Icon */}
          <svg className="w-5 h-5 mr-3 text-gray-400" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" d="M17 20h5v-2a4 4 0 00-3-3.87M9 20h6M3 20h5v-2a4 4 0 013-3.87M16 7a4 4 0 10-8 0 4 4 0 008 0z"></path>
          </svg>
          Users
        </Link>
        <Link
          to="/provider/analytics"
          className="flex items-center px-4 py-2 text-gray-600 hover:bg-blue-50 rounded"
        >
          {/* Chart Icon */}
          <svg className="w-5 h-5 mr-3 text-gray-400" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" d="M11 17v-6m4 6v-3m-8 3v-9"></path>
          </svg>
          Analytics
        </Link>
        <Link
          to="/provider/settings"
          className="flex items-center px-4 py-2 text-gray-600 hover:bg-blue-50 rounded"
        >
          {/* Settings Icon */}
          <svg className="w-5 h-5 mr-3 text-gray-400" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" d="M12 8v4l3 3"></path>
            <circle cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="2" fill="none"/>
          </svg>
          Settings
        </Link>
      </nav>
      <div className="mt-auto pt-6 border-t">
        <button
          onClick={handleLogout}
          className="flex items-center text-red-500 hover:underline"
        >
          {/* Logout Icon */}
          <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" d="M17 16l4-4m0 0l-4-4m4 4H7"></path>
          </svg>
          Logout
        </button>
      </div>
    </aside>
  );
};

export default ProviderSidebar;