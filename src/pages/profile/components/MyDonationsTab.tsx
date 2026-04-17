import React, { useState, useEffect } from "react";
import { Heart } from "lucide-react";

// TypeScript interface matching your Django backend response
interface Donation {
  id: number;
  amount: string; // Django Decimal fields often serialize as strings
  date: string;
  project: {
    id: number;
    title: string;
    category: string;
    image: string;
  };
}

export default function MyDonationsTab() {
  const [donations, setDonations] = useState<Donation[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    // TODO: Replace with your actual Axios instance
    // axios.get('/api/donations/my/').then(...)

    const fetchDonations = async () => {
      try {
        // Simulating the network request to your Django API
        setTimeout(() => {
          setDonations([
            {
              id: 1,
              amount: "1500.00",
              date: "2026-03-15T10:30:00Z",
              project: {
                id: 101,
                title: "Build a School in Upper Egypt",
                category: "Education",
                image:
                  "https://lh3.googleusercontent.com/aida-public/AB6AXuBdojdw927_3ArMYgx5612cv0S-5MEDdN8sTGt3c7vXK9Fe43HGL3f1Vlkq-U9woUSxno0r27BOrYCHKBXB5O_wDm5aKDktcexRoT-fcVEDqIoC1Bi_rvF1LJemXnSCzui3m5RchOnIM3N7hh41zvh3rPXWnltbop-zWig1_dhV2WrVo_zDZkXvVCAnbZ-HBqD0KOkOH3atNWRzCouyL-w_hOmywJkxlLoUSdyffPFENVew0hI4so-ufa85xRbqNXz9cTljMotCXbA",
              },
            },
            {
              id: 2,
              amount: "500.00",
              date: "2026-04-02T14:15:00Z",
              project: {
                id: 102,
                title: "Emergency Medical Supplies for Cairo Clinic",
                category: "Medical",
                image:
                  "https://lh3.googleusercontent.com/aida-public/AB6AXuBdojdw927_3ArMYgx5612cv0S-5MEDdN8sTGt3c7vXK9Fe43HGL3f1Vlkq-U9woUSxno0r27BOrYCHKBXB5O_wDm5aKDktcexRoT-fcVEDqIoC1Bi_rvF1LJemXnSCzui3m5RchOnIM3N7hh41zvh3rPXWnltbop-zWig1_dhV2WrVo_zDZkXvVCAnbZ-HBqD0KOkOH3atNWRzCouyL-w_hOmywJkxlLoUSdyffPFENVew0hI4so-ufa85xRbqNXz9cTljMotCXbA",
              },
            },
          ]);
          setIsLoading(false);
        }, 1200); // 1.2s delay to show off the skeleton loader
      } catch (err) {
        setError("Failed to load donation history. Please try again later.");
        setIsLoading(false);
      }
    };

    fetchDonations();
  }, []);

  // --- STATE 1: LOADING SKELETON (Docs Section 9.1) ---
  if (isLoading) {
    return (
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 animate-in fade-in duration-300">
        {[1, 2, 3, 4].map((n) => (
          <div key={n} className="bg-white rounded-xl overflow-hidden border border-[#D1F2EB] animate-pulse flex h-32">
            <div className="bg-[#EEEEEE] w-32 h-full shrink-0" />
            <div className="p-4 space-y-3 w-full flex flex-col justify-center">
              <div className="bg-[#EEEEEE] h-4 rounded w-3/4" />
              <div className="bg-[#EEEEEE] h-3 rounded w-1/2" />
              <div className="bg-[#D1F2EB] h-2 rounded-full w-full mt-auto" />
            </div>
          </div>
        ))}
      </div>
    );
  }

  // --- STATE 2: ERROR ---
  if (error) {
    return (
      <div className="bg-[#FFF5F5] border-l-4 border-[#E53E3E] p-4 rounded-md">
        <p className="text-[#E53E3E]">{error}</p>
      </div>
    );
  }

  // --- STATE 3: EMPTY STATE (Docs Section 9.2) ---
  if (donations.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-16 bg-white border border-[#D1F2EB] rounded-xl animate-in fade-in">
        <Heart size={48} className="text-[#D1F2EB] mb-4" />
        <h3 className="text-xl font-semibold text-[#1F6F5F] mb-2">No Donations Yet</h3>
        <p className="text-[#4A5568] mb-6">You haven't donated to any project yet. Explore projects.</p>
        <button className="border border-[#2FA084] text-[#2FA084] hover:bg-[#D1F2EB] font-medium text-sm px-6 py-2.5 rounded-lg transition-colors duration-200">
          Explore Projects
        </button>
      </div>
    );
  }

  // --- STATE 4: DATA LOADED ---
  return (
    <div className="animate-in fade-in duration-300 space-y-6">
      <h2 className="text-2xl font-semibold text-on-surface mb-6">Donation History</h2>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {donations.map((donation) => (
          <div
            key={donation.id}
            className="bg-white rounded-xl border border-[#D1F2EB] shadow-sm hover:shadow-[0_4px_12px_rgba(0,0,0,0.12)] transition-all duration-200 flex overflow-hidden h-auto sm:h-32">
            {/* Project Image */}
            <div className="w-1/3 sm:w-32 shrink-0 bg-[#EEEEEE]">
              <img
                src={donation.project.image}
                alt={donation.project.title}
                className="w-full h-full object-cover"
                loading="lazy"
              />
            </div>

            {/* Donation Details */}
            <div className="p-4 flex flex-col justify-between w-full">
              <div>
                <div className="flex justify-between items-start mb-1">
                  <span className="bg-[#D1F2EB] text-[#1F6F5F] text-[10px] font-bold px-2 py-0.5 rounded-full uppercase tracking-wider">
                    {donation.project.category}
                  </span>
                  <span className="text-xs text-[#A0AEC0]">
                    {new Date(donation.date).toLocaleDateString("en-US", {
                      month: "short",
                      day: "numeric",
                      year: "numeric",
                    })}
                  </span>
                </div>
                <h3 className="text-sm font-semibold text-[#1F6F5F] line-clamp-1 mt-1">{donation.project.title}</h3>
              </div>

              <div className="mt-3 flex items-center justify-between border-t border-gray-100 pt-2">
                <span className="text-xs text-[#4A5568] flex items-center">
                  <Heart size={14} className="text-[#2FA084] mr-1" />
                  Amount Donated
                </span>
                <span className="text-base font-bold text-[#2FA084]">
                  {Number(donation.amount).toLocaleString("ar-EG")} EGP
                </span>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
