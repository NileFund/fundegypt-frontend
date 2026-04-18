/* eslint-disable @typescript-eslint/no-explicit-any */
import { useState, useEffect } from "react";
import { Heart } from "lucide-react";
import { getMyDonations } from "../../../services/donationService";
import { useNavigate } from "react-router-dom";
import { ROUTES } from "../../../utils/constants";
import type { Donation } from "../../../types";

export default function MyDonationsTab() {
  const [donations, setDonations] = useState<Donation[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const navigate = useNavigate();

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

  const formatDate = (iso: string) =>
    new Date(iso).toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
      year: "numeric",
    });

  const formatAmount = (amount: string | number) =>
    Number(amount).toLocaleString("en-US");

  // LOADING
  if (isLoading) {
    return (
      <div className="space-y-3">
        {[1, 2, 3, 4].map((n) => (
          <div
            key={n}
            className="bg-white rounded-xl border border-brand-mint animate-pulse p-5 flex items-center gap-4"
          >
            <div className="w-10 h-10 bg-surface-page rounded-full shrink-0" />
            <div className="flex-1 space-y-2">
              <div className="bg-surface-page h-4 rounded w-1/2" />
              <div className="bg-surface-page h-3 rounded w-1/4" />
            </div>
            <div className="bg-surface-page h-5 rounded w-20" />
          </div>
        ))}
      </div>
    );
  }

  // ERROR
  if (error) {
    return (
      <div className="bg-surface-error border-l-4 border-error p-4 rounded-md">
        <p className="text-error">{error}</p>
      </div>
    );
  }

  // EMPTY
  if (donations.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-16 bg-white border border-brand-mint rounded-xl">
        <Heart size={48} className="text-brand-mint mb-4" />
        <h3 className="text-xl font-semibold text-brand-mint mb-2">
          No Donations Yet
        </h3>
        <p className="text-text-muted mb-6">
          You haven't donated to any project yet.
        </p>
        <button className="border border-brand-mint text-brand-mint hover:bg-surface-page font-medium text-sm px-6 py-2.5 rounded-lg transition-colors duration-200">
          Explore Projects
        </button>
      </div>
    );
  }

  return (
    <div className="animate-in fade-in duration-300">
      {/* Header */}
      <div className="flex items-center justify-between mb-5">
        <h2 className="text-2xl font-semibold text-[#1F6F5F]">
          Donation History
        </h2>
        <span className="text-sm text-text-muted">
          {donations.length} donation
          {donations.length !== 1 ? "s" : ""}
        </span>
      </div>

      {/* List */}
      <div className="space-y-3">
        {Array.isArray(donations) && donations.map((donation) => (
          <div
            key={donation.id}
            onClick={() =>
              navigate(
                ROUTES.PROJECT_DETAIL.replace(
                  ":id",
                  String(donation.project)
                )
              )
            }
            className="bg-white rounded-xl border border-brand-mint p-4 flex items-center gap-4 cursor-pointer hover:border-brand-primarybg-brand-primary] hover:shadow-md transition-all duration-200 group"
          >
            {/* Icon */}
            <div className="w-11 h-11 bg-brand-mint rounded-full flex items-center justify-center shrink-0 group-hover:bg-brand-primary] transition-colors duration-200">
              <Heart
                size={18}
                className="text-brand-primary bg-brand-primary] group-hover:text-white transition-colors duration-200"
                fill="currentColor"
              />
            </div>

            {/* Info */}
            <div className="flex-1 min-w-0">
              <p className="text-sm font-semibold text-[#1F6F5F] truncate">
                {(donation as any).projectTitle}
              </p>
              <p className="text-xs text-text-muted mt-0.5">
                {formatDate((donation as any).createdAt)}
              </p>
            </div>

            {/* Amount */}
            <div className="text-right shrink-0">
              <p className="text-base font-bold text-brand-primarybg-brand-primary]">
                {formatAmount(donation.amount)} EGP
              </p>
              <span className="text-[10px] bg-brand-mint text-[#1F6F5F] px-2 py-0.5 rounded-full font-medium">
                Donated
              </span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}