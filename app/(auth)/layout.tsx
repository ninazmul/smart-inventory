"use client";

import React from "react";
import Image from "next/image";

const Layout = ({ children }: { children: React.ReactNode }) => {
  return (
    <div className="min-h-screen w-full flex flex-col md:flex-row items-center justify-center bg-gradient-to-br from-blue-50 to-white relative overflow-hidden">
      {/* Background Dotted Pattern or Illustration */}
      <div className="absolute inset-0">
        <div className="w-full h-full bg-dotted-pattern opacity-10 pointer-events-none" />
      </div>

      {/* Left Hero / Illustration */}
      <div className="hidden md:flex md:w-1/2 h-full items-center justify-center px-8">
        <div className="text-center md:text-left">
          <h1 className="text-4xl md:text-5xl font-bold text-gray-800 mb-4">
            Welcome to Smart Inventory
          </h1>
          <p className="text-gray-600 text-lg md:text-xl mb-6">
            Track your stock, manage orders, and gain real-time insights — all
            in one intelligent dashboard.
          </p>
          <Image
            src="/assets/images/placeholder.png"
            alt="Inventory Dashboard Illustration"
            width={500}
            height={400}
            className="mx-auto md:mx-0"
          />
        </div>
      </div>

      {/* Right Clerk Auth Form */}
      <div className="w-full md:w-1/2 flex flex-col items-center justify-center p-6 md:p-12 z-10">
        <div className="w-full max-w-md bg-white shadow-lg rounded-xl p-8">
          <h2 className="text-2xl font-semibold text-center text-gray-800 mb-6">
            Sign in to Smart Inventory
          </h2>

          {/* Clerk Sign In / Sign Up */}
          {children}

          <p className="text-center text-gray-500 text-sm mt-6">
            © {new Date().getFullYear()} Smart Inventory. All rights reserved.
          </p>
        </div>
      </div>

      {/* Mobile Illustration at bottom */}
      <div className="md:hidden absolute bottom-0 w-full flex justify-center mb-8">
        <Image
          src="/assets/images/placeholder.png"
          alt="Inventory Dashboard Illustration"
          width={300}
          height={200}
        />
      </div>
    </div>
  );
};

export default Layout;
