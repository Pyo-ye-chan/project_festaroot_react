import React from 'react';
import { Outlet } from 'react-router-dom';

const MainAdminLayout = () => {
  return (
    <div className="admin-layout flex">
      <aside className="w-64 bg-deep-festival-purple text-warm-white p-4">
        {/* Admin Sidebar content goes here */}
        <h2 className="text-xl font-bold mb-4">Admin Navigation</h2>
        <nav>
          <ul>
            <li className="mb-2"><a href="/admin/dashboard" className="block p-2 rounded hover:bg-festival-yellow hover:text-deep-festival-purple">Dashboard</a></li>
            <li className="mb-2"><a href="/admin/members" className="block p-2 rounded hover:bg-festival-yellow hover:text-deep-festival-purple">Members</a></li>
            <li className="mb-2"><a href="/admin/festivals" className="block p-2 rounded hover:bg-festival-yellow hover:text-deep-festival-purple">Festivals</a></li>
            <li className="mb-2"><a href="/admin/posts" className="block p-2 rounded hover:bg-festival-yellow hover:text-deep-festival-purple">Posts</a></li>
            <li className="mb-2"><a href="/admin/comments" className="block p-2 rounded hover:bg-festival-yellow hover:text-deep-festival-purple">Comments</a></li>
            <li className="mb-2"><a href="/admin/chats" className="block p-2 rounded hover:bg-festival-yellow hover:text-deep-festival-purple">Chats</a></li>
            <li className="mb-2"><a href="/admin/gatherings" className="block p-2 rounded hover:bg-festival-yellow hover:text-deep-festival-purple">Gatherings</a></li>
            <li className="mb-2"><a href="/admin/notices" className="block p-2 rounded hover:bg-festival-yellow hover:text-deep-festival-purple">Notices</a></li>
            <li className="mb-2"><a href="/admin/inquiries" className="block p-2 rounded hover:bg-festival-yellow hover:text-deep-festival-purple">Inquiries</a></li>
          </ul>
        </nav>
      </aside>
      <main className="flex-1 p-4">
        <Outlet /> {/* This is where nested routes will render */}
      </main>
    </div>
  );
};

export default MainAdminLayout;
