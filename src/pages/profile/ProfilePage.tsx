import React, { useState } from "react";
import { Link, Outlet, useLocation } from "react-router-dom";
import { ROUTES } from "../../utils/constants";
import EditProfileModal from "./components/EditProfileModal";

export default function ProfilePage() {
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const location = useLocation();

  // Placeholder data - replace with your actual Auth Context / Redux state
  const user = {
    name: "Ahmed El-Sayed",
    memberSince: "January 2024",
    profilePic:
      "https://lh3.googleusercontent.com/aida-public/AB6AXuBA7_6kTTOrHlAbZPTauDJTj3s4t-ovcaWwPf4dJBM2ji2dwNsDsHvID8vWVVCg7NB0oN3mH9TwQPXw3MMI5iz7fpDRugMRR8cfATJ_bnyllXjJ9tIBC8hwwdgY6Q6yxeEW10F5kcegRtT-1npYdzaw87X7bkNMJXrwMuaLvsjPx-CtIx2PMzj0dqSqgsMvBlhYfAMkevowgaLzN8RAnaLlZ2YMp5UrdeZRqi7b4fgZsLglCkSQhA44gBZYnL4jjen3tLbhkL-C5ak",
  };

  return (
    <div className="text-on-surface bg-[#f9f9ff] font-['Inter'] min-h-screen flex flex-col">
      {/* --- TOP NAVBAR --- */}
      <nav className="bg-[#1F6F5F] dark:bg-emerald-950/80 font-inter tracking-tight top-0 sticky backdrop-blur-xl z-50">
        <div className="flex justify-between items-center w-full px-8 h-20 max-w-full">
          <div className="text-2xl font-bold text-white">FundEgypt</div>
          <div className="hidden md:flex items-center space-x-8">
            <a className="text-emerald-100/80 hover:text-white transition-colors" href="#">
              Explore
            </a>
            <a className="text-emerald-100/80 hover:text-white transition-colors" href="#">
              Categories
            </a>
            <a className="text-emerald-100/80 hover:text-white transition-colors" href="#">
              Start Campaign
            </a>
          </div>
          <div className="flex items-center space-x-4">
            <button className="px-6 py-2 rounded-lg text-emerald-50 hover:bg-emerald-700/50 transition-all duration-200">
              Login
            </button>
            <button className="px-6 py-2 rounded-lg bg-white text-primary font-semibold transition-transform scale-95 active:opacity-80">
              Register
            </button>
          </div>
        </div>
      </nav>

      {/* --- MAIN CONTENT --- */}
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
                <img
                  className="w-32 h-32 md:w-40 md:h-40 rounded-full object-cover border-4 border-white"
                  src={user.profilePic}
                  alt={user.name}
                />
              </div>

              {/* Identity Text */}
              <div className="pb-4">
                <h1 className="text-4xl md:text-5xl font-bold tracking-tight text-on-surface">{user.name}</h1>
                <p className="text-on-surface-variant font-medium mt-1 flex items-center">
                  <span className="material-symbols-outlined text-sm mr-1">calendar_today</span>
                  Member since {user.memberSince}
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
                <span className="material-symbols-outlined">share</span>
              </button>
            </div>
          </div>

          {/* Tab Navigation (Using React Router Links) */}
          <div className="mt-12 flex space-x-12 border-b border-outline-variant/15">
            <Link
              to={`${ROUTES.PROFILE}/projects`} // Assumes a projects route exists, or adjust as needed
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
                location.pathname === ROUTES.PROFILE
                  ? "text-primary border-primary"
                  : "text-on-surface-variant border-transparent hover:text-primary"
              }`}>
              About
            </Link>
          </div>

          {/* Dynamic Content Area (The Outlet window) */}
          <div className="py-12">
            <Outlet />
          </div>
        </div>
      </main>

      {/* --- FOOTER --- */}
      <footer className="bg-slate-50 dark:bg-slate-900 w-full border-t border-slate-200 dark:border-slate-800 mt-auto">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 px-12 py-16 max-w-7xl mx-auto">
          <div className="space-y-4">
            <div className="text-lg font-bold text-emerald-800 dark:text-emerald-200">FundEgypt</div>
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
              <span className="material-symbols-outlined cursor-pointer hover:text-primary transition-colors">
                public
              </span>
              <span className="material-symbols-outlined cursor-pointer hover:text-primary transition-colors">
                language
              </span>
              <span className="material-symbols-outlined cursor-pointer hover:text-primary transition-colors">hub</span>
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
