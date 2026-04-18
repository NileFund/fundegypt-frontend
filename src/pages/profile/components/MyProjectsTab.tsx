import React, { useState, useEffect } from "react";
import { PlusCircle, Star, Image as ImageIcon } from "lucide-react";
import { useNavigate } from "react-router-dom"; // Added for routing
import { getMyProjects } from "../../../services/projectService"; // Adjust path
import { type Project } from "../../../types";
import { ROUTES } from "../../../utils/constants"; // Adjust path

export default function MyProjectsTab() {
  const [projects, setProjects] = useState<Project[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchMyProjects = async () => {
      try {
        setIsLoading(true);
        // Calls the real Django endpoint
        const response = await getMyProjects();
        // Assuming your getMyProjects returns a paginated response based on projectService.ts
        setProjects(response.results || response);
      } catch (err) {
        console.error("Failed to load campaigns:", err);
        setError("Failed to load your campaigns. Please try again later.");
      } finally {
        setIsLoading(false);
      }
    };

    fetchMyProjects();
  }, []);

  // --- Helper to calculate progress bar color ---
  const getProgressColor = (percent: number) => {
    if (percent < 25) return "#E53E3E"; // Red
    if (percent <= 75) return "#F57F17"; // Amber
    return "#6FCF97"; // Green
  };

  // --- Helper to calculate Days Left from Django's endTime ---
  const calculateDaysLeft = (endTime: string) => {
    if (!endTime) return 0;
    const end = new Date(endTime).getTime();
    const now = new Date().getTime();
    const diff = end - now;
    const days = Math.ceil(diff / (1000 * 60 * 60 * 24));
    return days > 0 ? days : 0;
  };

  // --- STATE 1: LOADING SKELETON ---
  if (isLoading) {
    return (
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 animate-in fade-in duration-300">
        {[1, 2, 3].map((n) => (
          <div key={n} className="bg-white rounded-xl overflow-hidden border border-[#D1F2EB] animate-pulse">
            <div className="bg-[#EEEEEE] h-48 w-full" />
            <div className="p-4 space-y-3">
              <div className="bg-[#EEEEEE] h-4 rounded w-1/4" />
              <div className="bg-[#EEEEEE] h-5 rounded w-3/4" />
              <div className="bg-[#EEEEEE] h-3 rounded w-full" />
              <div className="bg-[#D1F2EB] h-2 rounded-full w-full mt-4" />
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

  // --- STATE 3: EMPTY STATE ---
  if (projects.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-16 bg-white border border-[#D1F2EB] rounded-xl animate-in fade-in">
        <div className="w-16 h-16 bg-[#D1F2EB] rounded-full flex items-center justify-center mb-4">
          <PlusCircle size={32} className="text-[#2FA084]" />
        </div>
        <h3 className="text-xl font-semibold text-[#1F6F5F] mb-2">No Projects Yet</h3>
        <p className="text-[#4A5568] mb-6">You haven't created any projects yet. Start your first campaign!</p>
        <button
          onClick={() => navigate(ROUTES.CREATE_PROJECT)}
          className="bg-[#2FA084] hover:bg-[#1F6F5F] text-white font-medium text-sm px-6 py-2.5 rounded-lg transition-colors duration-200">
          Create Project
        </button>
      </div>
    );
  }

  // --- STATE 4: DATA LOADED ---
  return (
    <div className="animate-in fade-in duration-300">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-semibold text-on-surface">My Campaigns</h2>
        <button
          onClick={() => navigate(ROUTES.CREATE_PROJECT)}
          className="bg-[#2FA084] hover:bg-[#1F6F5F] text-white font-medium text-sm px-6 py-2.5 rounded-lg transition-colors duration-200 flex items-center">
          <PlusCircle size={16} className="mr-2" />
          New Campaign
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">

        {
          Array.isArray(projects) && projects.map((project) => {
            // Guard against division by zero if target is 0
            const percent =
              project.totalTarget > 0 ? Math.min(Math.round((project.totalDonated / project.totalTarget) * 100), 100) : 0;
            const barColor = getProgressColor(percent);
            const daysLeft = calculateDaysLeft(project.endTime);

            // Grab the first image from the pictures array, or null if empty
            const displayImage = project.pictures?.length > 0 ? project.pictures[0].image : null;

            return (
              <div
                key={project.id}
                className="bg-white rounded-xl border border-[#D1F2EB] shadow-sm hover:shadow-[0_4px_12px_rgba(0,0,0,0.12)] transition-all duration-200 overflow-hidden flex flex-col group cursor-pointer"
                onClick={() => navigate(`${ROUTES.PROJECT_DETAIL.replace(":id", project.id.toString())}`)} // Assuming you want clicking to go to detail page
              >
                {/* Image & Badge */}
                <div className="relative h-48 w-full bg-[#EEEEEE] overflow-hidden flex items-center justify-center">
                  {displayImage ? (
                    <img
                      src={displayImage}
                      alt={project.title}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                    />
                  ) : (
                    <ImageIcon size={48} className="text-[#CBD5E0]" />
                  )}

                  <div className="flex justify-between items-end mb-4">
                    <div>
                      <span className="text-sm font-bold text-[#1F6F5F]">
                        {Number(project.totalDonated).toLocaleString("en-US")} EGP
                      </span>
                      <span className="text-xs text-[#4A5568] block mt-0.5">
                        raised of {Number(project.totalTarget).toLocaleString("en-US")} EGP
                      </span>
                    </div>
                    <span className="text-sm font-bold" style={{ color: barColor }}>
                      {percent}%
                    </span>
                  </div>

                  {/* Content */}
                  <div className="p-5 flex flex-col flex-grow">
                    <h3 className="text-lg font-semibold text-[#1F6F5F] line-clamp-2 leading-tight mb-2">
                      {project.title}
                    </h3>
                    {/* Mapped 'description' to 'details' per types.ts */}
                    <p className="text-sm text-[#4A5568] line-clamp-2 mb-4 flex-grow">{project.details}</p>

                    {/* Progress Bar */}
                    <div className="mt-auto">
                      <div className="bg-[#D1F2EB] rounded-full h-2 overflow-hidden mb-2">
                        <div
                          className="h-full rounded-full transition-all duration-1000 ease-out"
                          style={{ width: `${percent}%`, backgroundColor: barColor }}
                        />
                      </div>

                      <div className="flex justify-between items-end mb-4">
                        <div>
                          <span className="text-sm font-bold text-[#1F6F5F]">
                            {Number(project.totalDonated).toLocaleString("ar-EG")} EGP
                          </span>
                          <span className="text-xs text-[#4A5568] block mt-0.5">
                            raised of {Number(project.totalTarget).toLocaleString("ar-EG")}
                          </span>
                        </div>
                        <span className="text-sm font-bold" style={{ color: barColor }}>
                          {percent}%
                        </span>
                      </div>

                      {/* Footer Metrics */}
                      <div className="flex justify-between items-center pt-4 border-t border-gray-100">
                        <div className="flex items-center text-sm text-[#4A5568]">
                          <Star
                            size={16}
                            className={
                              project.averageRating > 0 ? "text-[#F6AD55] mr-1 fill-[#F6AD55]" : "text-[#D1F2EB] mr-1"
                            }
                          />
                          <span className="font-medium mt-0.5">
                            {project.averageRating > 0 ? project.averageRating.toFixed(1) : "New"}
                          </span>
                        </div>
                        <span className="bg-[#FFF8E1] text-[#F57F17] text-xs font-semibold px-2.5 py-1 rounded-full">
                          {daysLeft} days left
                        </span>
                      </div>
                    </div>
                  </div>
                </div >
              </div>
            );
          })
        }
      </div >
    </div >
  );
}
