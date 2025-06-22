// client/src/components/provider/QuickStats.jsx
import React, { useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { motion } from 'framer-motion';
import { Briefcase, CalendarClock, StarIcon as Star } from 'lucide-react'; // Using StarIcon as Star
import { getProviderStats } from '../../actions/providerAction'; // Adjust if path is different

const QuickStats = () => {
  const dispatch = useDispatch();
  // Assuming stats are stored in state.provider.stats and loading flag is state.provider.statsLoading
  const { stats: providerStats, statsLoading, error } = useSelector(state => state.provider);

  useEffect(() => {
    dispatch(getProviderStats());
  }, [dispatch]);

  if (statsLoading) {
    return (
      <div className="w-full max-w-4xl mx-auto text-center p-6">
        <p>Loading statistics...</p>
      </div>
    );
  }

  if (error && !statsLoading) { // Show error only if not loading and error is present for stats
    return (
      <div className="w-full max-w-4xl mx-auto text-center p-6 text-red-500">
        <p>Could not load statistics: {typeof error === 'string' ? error : 'Unknown error'}</p>
      </div>
    );
  }

  // Define the stats to display, mapping from providerStats object
  // The actual keys (servicesCount, bookingsCount, reviewsCount) depend on your API and Redux state structure
  const displayStatsConfig = [
    { Icon: Briefcase, label: 'Services', valueKey: 'servicesCount', color: 'bg-blue-100 text-blue-700' },
    { Icon: CalendarClock, label: 'Bookings', valueKey: 'bookingsCount', color: 'bg-green-100 text-green-700' },
    { Icon: Star, label: 'Reviews', valueKey: 'reviewsCount', color: 'bg-yellow-100 text-yellow-700' },
  ];

  const statsToRender = displayStatsConfig.map(stat => ({
    ...stat,
    value: (providerStats && typeof providerStats[stat.valueKey] !== 'undefined') ? providerStats[stat.valueKey] : 0,
  }));


  return (
    <motion.div
      initial={{ opacity: 0, y: 24 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6, delay: 0.1 }}
      className="w-full max-w-4xl mx-auto grid grid-cols-1 sm:grid-cols-3 gap-6 mt-6 px-4"
    >
      {statsToRender.map((s) => (
        <div
          key={s.label}
          className={`flex flex-col items-center justify-center gap-2 rounded-xl p-6 shadow-md ${s.color}`}
        >
          <s.Icon size={28} className="mb-1" /> {/* Lucide icons are components */}
          <div className="text-3xl font-bold">{s.value}</div>
          <div className="text-sm font-medium tracking-wide uppercase">{s.label}</div>
        </div>
      ))}
    </motion.div>
  );
};

export default QuickStats;
