import React from 'react';
import { Outlet } from 'react-router-dom';
import { Header } from './Header';

export function Layout() {
  return (
    <div className="min-h-screen bg-gray-950">
      <Header />
      <main>
        <Outlet />
      </main>
    </div>
  );
}