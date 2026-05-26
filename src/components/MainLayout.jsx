import React from 'react';
import Header from './Header';
import Footer from './Footer';

const MainLayout = ({ children }) => {
  return (
    <div className="min-h-screen flex flex-col bg-gray-50">
      {/* Global Header */}
      <Header />
      
      {/* Dynamic Content Area */}
      <main className="flex-grow">
        {children}
      </main>

      {/* Global Footer */}
      <Footer />
    </div>
  );
};

export default MainLayout;
