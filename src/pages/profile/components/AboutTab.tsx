/* eslint-disable @typescript-eslint/no-explicit-any */
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Trash2, HeartHandshake } from "lucide-react";
import DeleteAccountModal from "./DeleteAccountModal";
import { useAuth } from "../../../context/useAuth";
import { ROUTES } from "../../../utils/constants";
import { getMyDonations } from "../../../services/donationService"; // <-- Imported donation service

export default function AboutTab() {
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const navigate = useNavigate();
  // Renamed the auth loading state to avoid confusion
  const { user, isLoading: isAuthLoading } = useAuth();

  // --- NEW: State to hold our calculated frontend statistics ---
  const [stats, setStats] = useState({
    projectsSupported: 0,
    totalContribution: 0,
    impactLevel: "Newcomer",
  });

  // --- NEW: Fetch donations and calculate math on the frontend ---
  useEffect(() => {
    const fetchAndCalculateStats = async () => {
      try {
        const data = await getMyDonations();
        // Handle both paginated (.results) and unpaginated array responses safely
        const donations = data.results || data || [];

        // 1. Calculate Total Contribution (Sum of all donation amounts)
        const total = donations.reduce((sum: number, donation: any) => sum + Number(donation.amount), 0);

        // 2. Calculate Unique Projects Supported (Using a Set to remove duplicates)
        const uniqueProjects = new Set(donations.map((donation: any) => donation.project)).size;

        // 3. Calculate Impact Level dynamically based on the total
        let level = "Newcomer";
        if (total >= 50000) level = "Visionary";
        else if (total >= 10000) level = "Champion";
        else if (total > 0) level = "Supporter";

        // Save the math to our state!
        setStats({
          projectsSupported: uniqueProjects,
          totalContribution: total,
          impactLevel: level,
        });
      } catch (err) {
        console.error("Failed to load donations for stats:", err);
      }
    };

    fetchAndCalculateStats();
  }, []);

  if (isAuthLoading) {
    return <div className="animate-pulse p-8 flex justify-center text-gray-500">Loading profile information...</div>;
  }

  if (!user) {
    return <div className="p-8 flex justify-center text-red-500">Error loading profile data.</div>;
  }

  return (
    <div className="animate-in fade-in duration-300">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-8 items-start">
        {/* Left Side: Personal Info & Bio */}
        <div className="md:col-span-2 space-y-8">
          {/* Personal Information Card */}
          <div className="bg-white p-8 rounded-xl shadow-sm border border-gray-100">
            <h2 className="text-2xl font-semibold mb-8 text-gray-800">Personal Information</h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-y-10 gap-x-12">
              <div>
                <p className="text-xs font-bold text-gray-400 uppercase tracking-widest mb-2">Phone Number</p>
                <p className="text-lg font-medium text-gray-700">{user.phone || "Not provided"}</p>
              </div>
              <div>
                <p className="text-xs font-bold text-gray-400 uppercase tracking-widest mb-2">Birthdate</p>
                <p className="text-lg font-medium text-gray-700">{user.birthdate || "Not provided"}</p>
              </div>
              <div>
                <p className="text-xs font-bold text-gray-400 uppercase tracking-widest mb-2">Country</p>
                <p className="text-lg font-medium text-gray-700">{user.country || "Not provided"}</p>
              </div>
              <div>
                <p className="text-xs font-bold text-gray-400 uppercase tracking-widest mb-2">Social Profile</p>
                {user.facebookProfile ? (
                  <a
                    className="text-lg font-medium text-brand-primary hover:text-[#1F6F5F] hover:underline flex items-center transition-colors"
                    href={user.facebookProfile}
                    target="_blank"
                    rel="noopener noreferrer">
                    View Profile
                    <span className="material-symbols-outlined text-sm ml-1">open_in_new</span>
                  </a>
                ) : (
                  <p className="text-lg font-medium text-gray-400">Not connected</p>
                )}
              </div>
            </div>
          </div>

          {/* Bio Card */}
          <div className="bg-gray-50 p-8 rounded-xl border border-gray-100">
            <h3 className="text-lg font-semibold mb-4 text-gray-800">Biography</h3>
            <p className="text-gray-600 leading-relaxed">{user.bio || "This user hasn't written a biography yet."}</p>
          </div>
        </div>

        {/* Right Side: Sidebar Statistics & Action */}
        <div className="space-y-6">
          {/* Impact Statistics Card */}
          <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
            <h3 className="text-xs font-bold text-gray-400 uppercase tracking-widest mb-4">Impact Statistics</h3>
            <div className="space-y-6">
              <div className="flex justify-between items-center">
                <span className="text-gray-600 font-medium">Projects Supported</span>
                {/* Now using frontend stats! */}
                <span className="text-2xl font-bold text-[#1F6F5F]">{stats.projectsSupported}</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-gray-600 font-medium">Total Contribution</span>
                {/* Now using frontend stats! */}
                <span className="text-2xl font-bold text-[#1F6F5F]">
                  EGP {stats.totalContribution.toLocaleString()}
                </span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-gray-600 font-medium">Impact Level</span>
                {/* Now using frontend stats! */}
                <span className="px-3 py-1 rounded-full bg-[#E6F4F1] text-[#1F6F5F] text-xs font-bold uppercase tracking-tight">
                  {stats.impactLevel}
                </span>
              </div>
            </div>
          </div>

          {/* Call to Action Card */}
          <div className="bg-[#1F6F5F] p-6 rounded-xl text-white shadow-md">
            <HeartHandshake size={48} className="mb-4 text-[#A7F3D0]" />
            <h4 className="text-xl font-bold mb-2">Ready to start?</h4>
            <p className="text-emerald-50 text-sm mb-6 leading-snug opacity-90">
              Launch your own campaign today and make a real difference in Egypt.
            </p>
            {user && <button
              onClick={() => navigate(ROUTES.CREATE_PROJECT)}
              className="w-full py-3 bg-white text-[#1F6F5F] font-bold rounded-lg shadow-sm hover:bg-gray-50 hover:shadow transition-all active:scale-95">
              Start Campaign
            </button>}
          </div>
        </div>
      </div>

      {/* Upgraded Danger Zone */}
      <div className="mt-16 pt-10 border-t border-gray-200 flex justify-center">
        <button
          onClick={() => setIsDeleteModalOpen(true)}
          className="group flex items-center px-6 py-2.5 rounded-lg border border-red-200 bg-red-50 text-red-600 font-semibold text-sm hover:bg-red-600 hover:text-white hover:border-red-600 transition-all duration-200 shadow-sm hover:shadow-md active:scale-95">
          <Trash2 size={18} className="mr-2 text-red-500 group-hover:text-white transition-colors" />
          Delete Account
        </button>
      </div>

      {isDeleteModalOpen && <DeleteAccountModal onClose={() => setIsDeleteModalOpen(false)} />}
    </div>
  );
}
