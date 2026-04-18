import React, { useState } from "react";
import { Link, Outlet, useLocation } from "react-router-dom";
import { User as UserIcon, Calendar, Share2 } from "lucide-react"; // Replaced Material Icons with Lucide
import { ROUTES } from "../../utils/constants";
import EditProfileModal from "./components/EditProfileModal";
import { useAuth } from "../../context/useAuth";

export default function ProfilePage() {
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const location = useLocation();
  const { user, isLoading } = useAuth();

  // --- STATE 1: LOADING (Light Theme) ---
  if (isLoading) {
    return (
      <div className="min-h-screen bg-[#f9f9ff] flex items-center justify-center">
        <div className="animate-pulse flex flex-col items-center">
          <div className="h-12 w-12 border-4 border-[#1F6F5F] border-t-transparent rounded-full animate-spin mb-4" />
          <p className="text-[#1F6F5F]/80 font-medium tracking-widest uppercase text-sm">Loading Profile...</p>
        </div>
      </div>
    );
  }

  // --- STATE 2: NO USER FALLBACK (Light Theme) ---
  if (!user) {
    return (
      <div className="min-h-screen bg-[#f9f9ff] flex items-center justify-center">
        <p className="text-error bg-error-container px-6 py-3 rounded-lg border border-error/20">
          Authentication error. Please log in.
        </p>
      </div>
    );
  }

  // Safe Date Formatting: Fallback to "Recently Joined" if backend doesn't send the date
  const memberSince = user.createdAt
    ? new Date(user.createdAt).toLocaleDateString("en-US", { month: "long", year: "numeric" })
    : "Recently Joined";

  return (
    <div className="text-on-surface bg-[#f9f9ff] font-['Inter'] min-h-screen flex flex-col">
      {/* --- MAIN CONTENT --- */}
      {/* Notice: The <nav> block has been completely deleted so it matches the Home Page! */}
      <main className="flex-grow">
        {/* Hero Banner Section */}
        <div className="relative h-64 md:h-80 w-full overflow-hidden bg-[#D1F2EB]">
          <div className="absolute inset-0 opacity-40 mix-blend-overlay">
            <img
              className="w-full h-full object-cover"
              src="https://lh3.googleusercontent.com/aida-public/AB6AXuBdojdw927_3ArMYgx5612cv0S-5MEDdN8sTGt3c7vXK9Fe43HGL3f1Vlkq-U9woUSxno0r27BOrYCHKBXB5O_wDm5aKDktcexRoT-fcVEDqIoC1Bi_rvF1LJemXnSCzui3m5RchOnIM3N7hh41zvh3rPXWnltbop-zWig1_dhV2WrVo_zDZkXvVCAnbZ-HBqD0KOkOH3atNWRzCouyL-w_hOmywJkxlLoUSdyffPFENVew0hI4so-ufa85xRbqNXz9cTljMotCXbA"
              alt="Background pattern"
            />
          </div>
        </div>

        {/* Profile Header Section */}
        <div className="max-w-6xl mx-auto px-6 -mt-24 relative z-10">
          <div className="flex flex-col md:flex-row md:items-end md:justify-between space-y-6 md:space-y-0">
            <div className="flex flex-col md:flex-row items-start md:items-end space-y-4 md:space-y-0 md:space-x-8">
              {/* Profile Picture */}
              <div className="p-2 bg-white rounded-full shadow-sm">
                {user.profilePic ? (
                  <img
                    className="w-32 h-32 md:w-40 md:h-40 rounded-full object-cover border-4 border-white"
                    src={user.profilePic}
                    alt={`${user.firstName} ${user.lastName}`}
                  />
                ) : (
                  <div className="w-32 h-32 md:w-40 md:h-40 rounded-full border-4 border-white bg-surface-container-low flex items-center justify-center">
                    {/* Fixed the "person" text bug by using Lucide Icon */}
                    <UserIcon size={64} className="text-outline-variant" />
                  </div>
                )}
              </div>

              {/* Identity Text */}
              <div className="pb-4">
                <h1 className="text-4xl md:text-5xl font-bold tracking-tight text-on-surface">
                  {user.firstName} {user.lastName}
                </h1>
                <p className="text-on-surface-variant font-medium mt-1 flex items-center">
                  {/* Fixed the "calendar_today" text bug */}
                  <Calendar size={16} className="mr-2" />
                  Member since {memberSince}
                </p>
              </div>
            </div>

            {/* Action Row */}
            <div className="pb-4 flex space-x-3">
              <button
                onClick={() => setIsEditModalOpen(true)}
                className="px-6 py-2.5 rounded-lg bg-primary text-on-primary font-semibold hover:bg-secondary transition-all duration-200">
                Edit Profile
              </button>
              <button className="p-2.5 rounded-lg border border-outline-variant/30 text-on-surface-variant hover:bg-surface-container-low transition-colors">
                {/* Fixed the "share" text bug */}
                <Share2 size={20} />
              </button>
            </div>
          </div>

          {/* Tab Navigation */}
          <div className="mt-12 flex space-x-12 border-b border-outline-variant/15">
            <Link
              to={`${ROUTES.PROFILE}/projects`}
              className={`pb-4 text-sm font-semibold tracking-wide transition-all border-b-2 ${
                location.pathname.includes("projects")
                  ? "text-primary border-primary"
                  : "text-on-surface-variant border-transparent hover:text-primary"
              }`}>
              My Projects
            </Link>

            <Link
              to={ROUTES.MY_DONATIONS}
              className={`pb-4 text-sm font-semibold tracking-wide transition-all border-b-2 ${
                location.pathname === ROUTES.MY_DONATIONS
                  ? "text-primary border-primary"
                  : "text-on-surface-variant border-transparent hover:text-primary"
              }`}>
              My Donations
            </Link>

            <Link
              to={ROUTES.PROFILE}
              className={`pb-4 text-sm font-semibold tracking-wide transition-all border-b-2 ${
                location.pathname === ROUTES.PROFILE || location.pathname === `${ROUTES.PROFILE}/`
                  ? "text-primary border-primary"
                  : "text-on-surface-variant border-transparent hover:text-primary"
              }`}>
              About
            </Link>
          </div>

          {/* Dynamic Content Area (The Outlet window rendering About, Projects, etc.) */}
          <div className="py-12">
            <Outlet />
          </div>
        </div>
      </main>

      {/* --- FOOTER --- */}
      {/* If your Home page also has a global footer, you can delete this <footer/> block too! */}
      <footer className="bg-slate-50 border-t border-slate-200 mt-auto">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 px-12 py-16 max-w-7xl mx-auto">
          <div className="space-y-4">
            <div className="text-lg font-bold text-emerald-800">FundEgypt</div>
            <p className="text-sm text-on-surface-variant leading-relaxed">
              Institutional Stability. Modern Efficiency. Empowering Egyptian communities through strategic crowdfunding
              and transparent support.
            </p>
          </div>
          <div className="grid grid-cols-2 gap-4">
            <a className="text-slate-500 hover:text-emerald-600 text-sm transition-opacity" href="#">
              About Us
            </a>
            <a className="text-slate-500 hover:text-emerald-600 text-sm transition-opacity" href="#">
              Terms of Service
            </a>
            <a className="text-slate-500 hover:text-emerald-600 text-sm transition-opacity" href="#">
              Privacy Policy
            </a>
            <a className="text-slate-500 hover:text-emerald-600 text-sm transition-opacity" href="#">
              Contact Support
            </a>
          </div>
          <div className="md:text-right flex flex-col justify-between">
            <div className="flex md:justify-end space-x-6 text-slate-400">
              <span className="cursor-pointer hover:text-primary transition-colors font-bold">ENG</span>
            </div>
            <div className="text-sm text-on-surface-variant mt-8 md:mt-0">
              © 2026 FundEgypt. Institutional Stability. Modern Efficiency.
            </div>
          </div>
        </div>
      </footer>

      {isEditModalOpen && <EditProfileModal onClose={() => setIsEditModalOpen(false)} />}
    </div>
  );
}
