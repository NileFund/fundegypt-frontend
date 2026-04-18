import React, { useState, useEffect } from "react";
import { Heart, Image as ImageIcon } from "lucide-react";
import { getMyDonations } from "../../../services/donationService";
import { type Donation } from "../../../types";

export default function MyDonationsTab() {
  const [donations, setDonations] = useState<Donation[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchDonations = async () => {
      try {
        setIsLoading(true);
        const data = await getMyDonations();
        setDonations(data.results);
      } catch (err) {
        console.error("Failed to load donations from backend:", err);
        setError("Failed to load donation history. Please try again later.");
      } finally {
        setIsLoading(false);
      }
    };

    fetchDonations();
  }, []);

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

  if (error) {
    return (
      <div className="bg-[#FFF5F5] border-l-4 border-[#E53E3E] p-4 rounded-md">
        <p className="text-[#E53E3E]">{error}</p>
      </div>
    );
  }

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

  return (
    <div className="animate-in fade-in duration-300 space-y-6">
      <h2 className="text-2xl font-semibold text-on-surface mb-6">Donation History</h2>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {donations.map((donation) => (
          <div
            key={donation.id}
            className="bg-white rounded-xl border border-[#D1F2EB] shadow-sm hover:shadow-[0_4px_12px_rgba(0,0,0,0.12)] transition-all duration-200 flex overflow-hidden h-auto sm:h-32">
            {/* Project Image Fallback (Since backend doesn't send the image URL) */}
            <div className="w-1/3 sm:w-32 shrink-0 bg-[#F7FAFC] flex items-center justify-center border-r border-[#D1F2EB]">
              <ImageIcon size={32} className="text-[#CBD5E0]" />
            </div>

            {/* Donation Details */}
            <div className="p-4 flex flex-col justify-between w-full">
              <div>
                <div className="flex justify-between items-start mb-1">
                  <span className="bg-[#D1F2EB] text-[#1F6F5F] text-[10px] font-bold px-2 py-0.5 rounded-full uppercase tracking-wider">
                    Campaign Support
                  </span>
                  <span className="text-xs text-[#A0AEC0]">
                    {/* Updated from donation.date to donation.createdAt */}
                    {new Date(donation.created_at).toLocaleDateString("en-US", {
                      month: "short",
                      day: "numeric",
                      year: "numeric",
                    })}
                  </span>
                </div>
                <h3 className="text-sm font-semibold text-[#1F6F5F] line-clamp-1 mt-1">{donation.project_title ?? `Project #${donation.project}`}</h3>
              </div>

              <div className="mt-3 flex items-center justify-between border-t border-gray-100 pt-2">
                <span className="text-xs text-[#4A5568] flex items-center">
                  <Heart size={14} className="text-[#2FA084] mr-1" />
                  Amount Donated
                </span>
                <span className="text-base font-bold text-[#2FA084]">
                  {/* Since amount is a number in your interface, we can format it directly */}
                  {donation.amount.toLocaleString("ar-EG")} EGP
                </span>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
