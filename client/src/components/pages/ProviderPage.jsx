import React from 'react';
import Navbar from '../provider/Navbar';
import WelcomeMessage from '../provider/WelcomeMessage';
import ProviderProfileCard from '../provider/ProviderProfileCard';
import ServiceManager from '../provider/ServiceManager';
import QuickStats from '../provider/QuickStats';
import RecentActivity from '../provider/RecentActivity';

class ErrorBoundary extends React.Component {
  state = { hasError: false };
  static getDerivedStateFromError() {
    return { hasError: true };
  }
  render() {
    if (this.state.hasError) {
      return <div className="text-red-500 text-center p-6">Something went wrong.</div>;
    }
    return this.props.children;
  }
}

const ProviderPage = () => {
  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      {/* Top Navbar */}
      <Navbar />

      {/* Main Content */}
      <main className="flex-1 max-w-6xl mx-auto py-10 px-4 w-full">
        {/* Welcome & Quick Stats */}
        <div className="grid md:grid-cols-3 gap-8 mb-10">
          <div className="md:col-span-2 flex flex-col gap-6">
            <WelcomeMessage />
            <QuickStats />
          </div>
          <ProviderProfileCard />
        </div>
        {/* Services & Recent Activity */}
        <div className="grid md:grid-cols-3 gap-8">
          <div className="md:col-span-2">
            <ErrorBoundary>
              <ServiceManager />
            </ErrorBoundary>
          </div>
          <RecentActivity />
        </div>
      </main>
    </div>
  );
};

export default ProviderPage;