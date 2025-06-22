import React, { useState, useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { motion } from 'framer-motion';
import { Bell, CalendarCheck, Handshake, AlertCircle, PackageSearch, ArrowRight, X } from 'lucide-react';
import { getProviderActivity } from '../../actions/providerAction';
import axios from 'axios';

// Activity visuals mapping
const activityVisuals = {
  default: { Icon: Bell, color: 'bg-purple-100 text-purple-600' },
  SERVICE_CREATED: { Icon: Handshake, color: 'bg-green-100 text-green-600' },
  SERVICE_UPDATED: { Icon: Handshake, color: 'bg-blue-100 text-blue-600' },
  SERVICE_DELETED: { Icon: Handshake, color: 'bg-red-100 text-red-600' },
  PROFILE_UPDATED: { Icon: CalendarCheck, color: 'bg-yellow-100 text-yellow-600' },
  // Add more activity types as needed
};

const RecentActivity = () => {
  const dispatch = useDispatch();
  const { activities, activityLoading, error } = useSelector(state => state.provider);
  const [showAllActivities, setShowAllActivities] = useState(false);
  const [allActivities, setAllActivities] = useState([]);
  const [isLoadingAll, setIsLoadingAll] = useState(false);

  // Fetch initial activities
  useEffect(() => {
    dispatch(getProviderActivity());
  }, [dispatch]);

  // Fetch all activities for modal
  const loadAllActivities = async () => {
    setIsLoadingAll(true);
    try {
      const response = await axios.get('/api/provider/activity?limit=50', {
        headers: {
          'x-auth-token': localStorage.getItem('token')
        }
      });
      setAllActivities(response.data);
    } catch (err) {
      console.error('Error loading all activities:', err);
    } finally {
      setIsLoadingAll(false);
    }
  };

  const handleViewAllClick = () => {
    setShowAllActivities(true);
    loadAllActivities();
  };

  if (activityLoading) {
    return (
      <div className="text-center p-6">
        <p>Loading recent activity...</p>
      </div>
    );
  }

  if (error && !activityLoading && !activities.length) {
    return (
      <div className="text-center p-6 text-red-500">
        <AlertCircle className="mx-auto mb-2" size={32} />
        <p>Could not load recent activity: {typeof error === 'string' ? error : 'Unknown error'}</p>
      </div>
    );
  }

  return (
    <>
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4 }}
        className="bg-white rounded-xl shadow-lg p-3 sm:p-5 md:p-6 border border-gray-100 w-full max-w-2xl mx-auto"
      >
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between mb-6 gap-2">
          <h3 className="text-lg sm:text-xl font-bold text-gray-800">Recent Activity</h3>
        </div>

        {activities.length === 0 ? (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="text-center py-8"
          >
            <div className="text-gray-400 mb-4 flex justify-center">
              <PackageSearch size={48} />
            </div>
            <p className="text-gray-500 text-lg">No recent activity to display.</p>
          </motion.div>
        ) : (
          <ul className="space-y-3 sm:space-y-4">
            {activities.map((activity, index) => (
              <ActivityItem key={activity._id || index} activity={activity} visual={activityVisuals} />
            ))}
          </ul>
        )}

        {activities.length > 0 && (
          <motion.div
            whileHover={{ scale: 1.02 }}
            className="mt-6 text-center"
          >
            <button 
              onClick={handleViewAllClick}
              className="inline-flex items-center gap-2 px-4 py-2 rounded-md bg-indigo-600 text-white font-semibold hover:bg-indigo-700 transition text-sm sm:text-base"
            >
              View all activity
              <ArrowRight size={16} />
            </button>
          </motion.div>
        )}
      </motion.div>

      {/* All Activities Modal */}
      {showAllActivities && (
        <div className="fixed inset-0 z-50 overflow-y-auto">
          <div className="flex items-center justify-center min-h-screen pt-4 px-2 sm:px-4 pb-20 text-center sm:block sm:p-0">
            {/* Background overlay */}
            <div 
              className="fixed inset-0 transition-opacity" 
              aria-hidden="true"
              onClick={() => setShowAllActivities(false)}
            >
              <div className="absolute inset-0 bg-gray-500 opacity-75"></div>
            </div>

            {/* Modal container */}
            <div className="inline-block align-bottom bg-white rounded-lg text-left overflow-hidden shadow-xl transform transition-all w-full max-w-full sm:max-w-4xl mx-auto my-4 sm:my-8">
              <div className="bg-white px-2 py-4 sm:px-6 sm:py-6">
                <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-2">
                  <h3 className="text-xl sm:text-2xl font-bold text-gray-900">All Activities</h3>
                  <button
                    onClick={() => setShowAllActivities(false)}
                    className="text-gray-400 hover:text-gray-500 ml-auto"
                  >
                    <X size={24} />
                  </button>
                </div>

                {isLoadingAll ? (
                  <div className="text-center py-8">
                    <p>Loading all activities...</p>
                  </div>
                ) : (
                  <div className="mt-4 max-h-[70vh] overflow-y-auto">
                    <ul className="space-y-2 sm:space-y-3">
                      {allActivities.length > 0 ? (
                        allActivities.map((activity) => (
                          <ActivityItem 
                            key={activity._id} 
                            activity={activity} 
                            visual={activityVisuals} 
                            showFullDate
                          />
                        ))
                      ) : (
                        <div className="text-center py-8 text-gray-500">
                          No activities found
                        </div>
                      )}
                    </ul>
                  </div>
                )}
              </div>
              <div className="bg-gray-50 px-2 py-3 sm:px-6 sm:py-4 flex flex-col sm:flex-row-reverse gap-2">
                <button
                  type="button"
                  onClick={() => setShowAllActivities(false)}
                  className="w-full sm:w-auto inline-flex justify-center rounded-md border border-transparent shadow-sm px-4 py-2 bg-indigo-600 text-base font-medium text-white hover:bg-indigo-700 focus:outline-none text-sm sm:text-base"
                >
                  Close
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Responsive styles */}
      <style>{`
        @media (max-width: 640px) {
          .max-w-2xl { max-width: 100% !important; }
          .sm\\:p-5 { padding: 1rem !important; }
          .rounded-xl { border-radius: 1rem !important; }
        }
        @media (max-width: 480px) {
          .sm\\:max-w-4xl { max-width: 98vw !important; }
          .sm\\:p-6 { padding: 1rem !important; }
          .sm\\:py-6 { padding-top: 1rem !important; padding-bottom: 1rem !important; }
        }
      `}</style>
    </>
  );
};

// Reusable Activity Item Component
const ActivityItem = ({ activity, visual, showFullDate = false }) => {
  const visualConfig = activityVisuals[activity.type] || activityVisuals.default;
  
  return (
    <motion.li
      initial={{ opacity: 0, x: -20 }}
      animate={{ opacity: 1, x: 0 }}
      className="flex items-start gap-3 sm:gap-4 p-2 sm:p-3 hover:bg-gray-50 rounded-lg transition-colors"
    >
      <div className={`w-9 h-9 sm:w-10 sm:h-10 flex items-center justify-center rounded-lg ${visualConfig.color}`}>
        <visualConfig.Icon size={20} />
      </div>
      <div className="flex-1 min-w-0">
        <div className="flex flex-col sm:flex-row justify-between items-baseline gap-1 sm:gap-2">
          <h4 className="font-semibold text-gray-800 truncate flex-grow text-sm sm:text-base">
            {activity.message || 'No details'}
          </h4>
          <span className="text-xs text-gray-400 whitespace-nowrap flex-shrink-0">
            {showFullDate ? (
              new Date(activity.createdAt).toLocaleString('en-US', {
                year: 'numeric',
                month: 'short',
                day: 'numeric',
                hour: '2-digit',
                minute: '2-digit'
              })
            ) : (
              new Date(activity.createdAt).toLocaleTimeString('en-US', {
                hour: '2-digit',
                minute: '2-digit'
              })
            )}
          </span>
        </div>
        <p className="text-xs sm:text-sm text-gray-500 mt-1">
          <span className={`inline-block w-2 h-2 rounded-full mr-2 align-middle ${visualConfig.color.split(' ')[0]} opacity-80`}></span>
          {activity.type || 'General'}
        </p>
      </div>
    </motion.li>
  );
};

export default RecentActivity;