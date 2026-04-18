import React, { useState } from "react";
import { Link, Outlet, useLocation } from "react-router-dom";
import { User as UserIcon, Calendar } from "lucide-react";
import { ROUTES } from "../../utils/constants";
import EditProfileModal from "./components/EditProfileModal"; 
import { useAuth } from "../../context/useAuth"; 

export default function ProfilePage() {
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const location = useLocation();
  const { user, isLoading } = useAuth();

  // --- STATE 1: LOADING ---
  if (isLoading) {
    return (
      <div className="min-h-screen bg-[#0B1120] flex items-center justify-center">
        <div className="animate-pulse flex flex-col items-center">
          <div className="h-12 w-12 border-4 border-orange-500 border-t-transparent rounded-full animate-spin mb-4" />
          <p className="text-orange-500/80 font-medium tracking-widest uppercase text-sm">Initializing Profile...</p>
        </div>
      </div>
    );
  }

  // --- STATE 2: NO USER FALLBACK ---
  if (!user) {
    return (
      <div className="min-h-screen bg-[#0B1120] flex items-center justify-center">
        <p className="text-red-500 bg-red-500/10 px-6 py-3 rounded-lg border border-red-500/20">
          Authentication error. Please log in.
        </p>
      </div>
    );
  }

  // Format the Django createdAt timestamp (e.g., "May 2026")
  const memberSince = new Date(user.createdAt).toLocaleDateString("en-US", {
    month: "long",
    year: "numeric",
  });

  return (
    <div className="text-slate-200 bg-[#0B1120] font-['Inter'] min-h-screen flex flex-col selection:bg-orange-500/30">
      {/* --- TOP NAVBAR --- */}
      <nav className="bg-[#0f172a]/90 border-b border-orange-500/20 font-inter tracking-tight top-0 sticky backdrop-blur-xl z-50">
        <div className="flex justify-between items-center w-full px-8 h-20 max-w-full">
          <div className="text-2xl font-bold text-orange-500 drop-shadow-[0_0_10px_rgba(249,115,22,0.4)]">
            FundEgypt
          </div>
          <div className="hidden md:flex items-center space-x-8">
            <Link to={ROUTES.HOME} className="text-slate-400 hover:text-orange-400 transition-colors font-medium">
              Explore
            </Link>
            <Link to="/categories" className="text-slate-400 hover:text-orange-400 transition-colors font-medium">
              Categories
            </Link>
            <Link
              to={ROUTES.CREATE_PROJECT}
              className="text-slate-400 hover:text-orange-400 transition-colors font-medium">
              Start Campaign
            </Link>
          </div>
          <div className="flex items-center space-x-4">
            <button className="px-6 py-2 rounded-lg bg-orange-600 hover:bg-orange-500 shadow-[0_0_15px_rgba(249,115,22,0.3)] text-white font-semibold transition-all duration-200 active:scale-95">
              My Profile
            </button>
          </div>
        </div>
      </nav>

      {/* --- MAIN CONTENT --- */}
      <main className="flex-grow">
        {/* Hero Banner Section */}
        <div className="relative h-64 md:h-80 w-full overflow-hidden bg-[#1e293b] border-b border-slate-800">
          <div className="absolute inset-0 bg-gradient-to-r from-orange-900/20 to-slate-900/80 mix-blend-overlay z-10" />
          {/* Optional: Add a cyberpunk grid pattern or texture here later */}
        </div>

        {/* Profile Header Section */}
        <div className="max-w-6xl mx-auto px-6 -mt-24 relative z-20">
          <div className="flex flex-col md:flex-row md:items-end md:justify-between space-y-6 md:space-y-0">
            <div className="flex flex-col md:flex-row items-start md:items-end space-y-4 md:space-y-0 md:space-x-8">
              {/* Profile Picture */}
              <div className="p-2 bg-[#0f172a] rounded-full shadow-[0_0_30px_rgba(0,0,0,0.5)] border border-slate-800 relative group">
                <div className="w-32 h-32 md:w-40 md:h-40 rounded-full overflow-hidden border-4 border-[#1e293b] bg-[#1e293b] flex items-center justify-center group-hover:border-orange-500/50 transition-colors duration-300">
                  {user.profilePic ? (
                    <img
                      className="w-full h-full object-cover"
                      src={user.profilePic}
                      alt={`${user.firstName} ${user.lastName}`}
                    />
                  ) : (
                    <UserIcon size={64} className="text-slate-500" />
                  )}
                </div>
              </div>

              {/* Identity Text */}
              <div className="pb-4">
                <h1 className="text-4xl md:text-5xl font-bold tracking-tight text-slate-100 drop-shadow-md">
                  {user.firstName} {user.lastName}
                </h1>
                <p className="text-orange-400/80 font-medium mt-2 flex items-center text-sm uppercase tracking-widest">
                  <Calendar size={14} className="mr-2" />
                  Member since {memberSince}
                </p>
              </div>
            </div>

            {/* Action Row */}
            <div className="pb-4 flex space-x-3">
              <button
                onClick={() => setIsEditModalOpen(true)}
                className="px-6 py-2.5 rounded-lg bg-[#1e293b] border border-slate-700 text-slate-200 font-semibold hover:border-orange-500 hover:text-orange-400 transition-all duration-200">
                Edit Profile
              </button>
            </div>
          </div>

          {/* Tab Navigation (Using React Router Links) */}
          <div className="mt-12 flex space-x-12 border-b border-slate-800">
            <Link
              to={`${ROUTES.PROFILE}/projects`}
              className={`pb-4 text-sm font-semibold tracking-wide transition-all border-b-2 ${
                location.pathname.includes("projects")
                  ? "text-orange-500 border-orange-500 drop-shadow-[0_0_8px_rgba(249,115,22,0.5)]"
                  : "text-slate-500 border-transparent hover:text-orange-400"
              }`}>
              My Campaigns
            </Link>

            <Link
              to={ROUTES.MY_DONATIONS}
              className={`pb-4 text-sm font-semibold tracking-wide transition-all border-b-2 ${
                location.pathname === ROUTES.MY_DONATIONS
                  ? "text-orange-500 border-orange-500 drop-shadow-[0_0_8px_rgba(249,115,22,0.5)]"
                  : "text-slate-500 border-transparent hover:text-orange-400"
              }`}>
              My Donations
            </Link>

            <Link
              to={ROUTES.PROFILE}
              className={`pb-4 text-sm font-semibold tracking-wide transition-all border-b-2 ${
                location.pathname === ROUTES.PROFILE || location.pathname === `${ROUTES.PROFILE}/`
                  ? "text-orange-500 border-orange-500 drop-shadow-[0_0_8px_rgba(249,115,22,0.5)]"
                  : "text-slate-500 border-transparent hover:text-orange-400"
              }`}>
              System Intel
            </Link>
          </div>

          {/* Dynamic Content Area (The Outlet window) */}
          <div className="py-12">
            <Outlet />
          </div>
        </div>
      </main>

      {/* --- FOOTER --- */}
      <footer className="bg-[#0f172a] w-full border-t border-slate-800 mt-auto">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 px-12 py-16 max-w-7xl mx-auto">
          <div className="space-y-4">
            <div className="text-lg font-bold text-slate-300 tracking-wide">
              FundEgypt <span className="text-orange-500">_Sys</span>
            </div>
            <p className="text-sm text-slate-500 leading-relaxed">
              Institutional Stability. Modern Efficiency. Empowering communities through strategic crowdfunding and
              transparent support networks.
            </p>
          </div>
          <div className="grid grid-cols-2 gap-4">
            <a className="text-slate-500 hover:text-orange-400 text-sm transition-colors" href="#">
              About Node
            </a>
            <a className="text-slate-500 hover:text-orange-400 text-sm transition-colors" href="#">
              Terms of Service
            </a>
            <a className="text-slate-500 hover:text-orange-400 text-sm transition-colors" href="#">
              Privacy Protocols
            </a>
            <a className="text-slate-500 hover:text-orange-400 text-sm transition-colors" href="#">
              Contact Uplink
            </a>
          </div>
          <div className="md:text-right flex flex-col justify-between">
            <div className="flex md:justify-end space-x-6 text-slate-600">
              <span className="material-symbols-outlined cursor-pointer hover:text-orange-500 transition-colors">
                public
              </span>
              <span className="material-symbols-outlined cursor-pointer hover:text-orange-500 transition-colors">
                language
              </span>
              <span className="material-symbols-outlined cursor-pointer hover:text-orange-500 transition-colors">
                hub
              </span>
            </div>
            <div className="text-sm text-slate-600 mt-8 md:mt-0 font-mono text-xs">
              © 2026 FundEgypt. System Nominal.
            </div>
          </div>
        </div>
      </footer>

      {isEditModalOpen && <EditProfileModal onClose={() => setIsEditModalOpen(false)} />}
    </div>
  );
}
