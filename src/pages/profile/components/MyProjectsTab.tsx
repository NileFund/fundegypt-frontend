import React, { useState, useEffect } from "react";
import { PlusCircle, Star } from "lucide-react";

// TypeScript interface for a Created Project
interface MyProject {
  id: number;
  title: string;
  description: string;
  image: string;
  category: string;
  raised: number;
  target: number;
  rating: number;
  daysLeft: number;
  status: "Active" | "Completed" | "Cancelled";
}

export default function MyProjectsTab() {
  const [projects, setProjects] = useState<MyProject[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // TODO: Replace with actual Axios call (e.g., GET /api/projects/me/)
    const fetchMyProjects = async () => {
      setTimeout(() => {
        setProjects([
          {
            id: 1,
            title: "Clean Water Initiative for Fayoum",
            description:
              "Installing modern water filtration systems in rural Fayoum villages to provide safe drinking water for over 500 families.",
            image:
              "https://lh3.googleusercontent.com/aida-public/AB6AXuBdojdw927_3ArMYgx5612cv0S-5MEDdN8sTGt3c7vXK9Fe43HGL3f1Vlkq-U9woUSxno0r27BOrYCHKBXB5O_wDm5aKDktcexRoT-fcVEDqIoC1Bi_rvF1LJemXnSCzui3m5RchOnIM3N7hh41zvh3rPXWnltbop-zWig1_dhV2WrVo_zDZkXvVCAnbZ-HBqD0KOkOH3atNWRzCouyL-w_hOmywJkxlLoUSdyffPFENVew0hI4so-ufa85xRbqNXz9cTljMotCXbA", // Placeholder
            category: "Environment",
            raised: 45000,
            target: 62500,
            rating: 4.8,
            daysLeft: 12,
            status: "Active",
          },
          {
            id: 2,
            title: "Tech Bootcamp for Cairo Orphans",
            description:
              "Providing laptops and a 6-month coding bootcamp to 20 orphaned teenagers to help them transition into software development careers.",
            image:
              "https://lh3.googleusercontent.com/aida-public/AB6AXuBdojdw927_3ArMYgx5612cv0S-5MEDdN8sTGt3c7vXK9Fe43HGL3f1Vlkq-U9woUSxno0r27BOrYCHKBXB5O_wDm5aKDktcexRoT-fcVEDqIoC1Bi_rvF1LJemXnSCzui3m5RchOnIM3N7hh41zvh3rPXWnltbop-zWig1_dhV2WrVo_zDZkXvVCAnbZ-HBqD0KOkOH3atNWRzCouyL-w_hOmywJkxlLoUSdyffPFENVew0hI4so-ufa85xRbqNXz9cTljMotCXbA", // Placeholder
            category: "Education",
            raised: 5000,
            target: 50000,
            rating: 0,
            daysLeft: 45,
            status: "Active",
          },
        ]);
        setIsLoading(false);
      }, 1000);
    };

    fetchMyProjects();
  }, []);

  // --- Helper to calculate progress bar color based on Design Docs ---
  const getProgressColor = (percent: number) => {
    if (percent < 25) return "#E53E3E"; // Red
    if (percent <= 75) return "#F57F17"; // Amber
    return "#6FCF97"; // Green
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

  // --- STATE 2: EMPTY STATE (Exactly matching Docs Section 9.2) ---
  if (projects.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-16 bg-white border border-[#D1F2EB] rounded-xl animate-in fade-in">
        <div className="w-16 h-16 bg-[#D1F2EB] rounded-full flex items-center justify-center mb-4">
          <PlusCircle size={32} className="text-[#2FA084]" />
        </div>
        <h3 className="text-xl font-semibold text-[#1F6F5F] mb-2">No Projects Yet</h3>
        <p className="text-[#4A5568] mb-6">You haven't created any projects yet. Start your first campaign!</p>
        <button className="bg-[#2FA084] hover:bg-[#1F6F5F] text-white font-medium text-sm px-6 py-2.5 rounded-lg transition-colors duration-200">
          Create Project
        </button>
      </div>
    );
  }

  // --- STATE 3: DATA LOADED (Project Cards) ---
  return (
    <div className="animate-in fade-in duration-300">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-semibold text-on-surface">My Campaigns</h2>
        <button className="bg-[#2FA084] hover:bg-[#1F6F5F] text-white font-medium text-sm px-6 py-2.5 rounded-lg transition-colors duration-200 flex items-center">
          <PlusCircle size={16} className="mr-2" />
          New Campaign
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {projects.map((project) => {
          const percent = Math.min(Math.round((project.raised / project.target) * 100), 100);
          const barColor = getProgressColor(percent);

          return (
            <div
              key={project.id}
              className="bg-white rounded-xl border border-[#D1F2EB] shadow-sm hover:shadow-[0_4px_12px_rgba(0,0,0,0.12)] transition-all duration-200 overflow-hidden flex flex-col group cursor-pointer">
              {/* Image & Badge */}
              <div className="relative h-48 w-full bg-[#EEEEEE] overflow-hidden">
                <img
                  src={project.image}
                  alt={project.title}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                />
                <span className="absolute top-3 left-3 bg-[#D1F2EB] text-[#1F6F5F] text-xs font-bold px-2.5 py-1 rounded-full uppercase tracking-wider shadow-sm">
                  {project.category}
                </span>
                <span className="absolute top-3 right-3 bg-white/90 backdrop-blur-sm text-[#1F6F5F] text-xs font-semibold px-2.5 py-1 rounded-full shadow-sm">
                  {project.status}
                </span>
              </div>

              {/* Content */}
              <div className="p-5 flex flex-col flex-grow">
                <h3 className="text-lg font-semibold text-[#1F6F5F] line-clamp-2 leading-tight mb-2">
                  {project.title}
                </h3>
                <p className="text-sm text-[#4A5568] line-clamp-2 mb-4 flex-grow">{project.description}</p>

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
                        {project.raised.toLocaleString("ar-EG")} EGP
                      </span>
                      <span className="text-xs text-[#4A5568] block mt-0.5">
                        raised of {project.target.toLocaleString("ar-EG")}
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
                        className={project.rating > 0 ? "text-[#F6AD55] mr-1 fill-[#F6AD55]" : "text-[#D1F2EB] mr-1"}
                      />
                      <span className="font-medium mt-0.5">{project.rating > 0 ? project.rating : "New"}</span>
                    </div>
                    <span className="bg-[#FFF8E1] text-[#F57F17] text-xs font-semibold px-2.5 py-1 rounded-full">
                      {project.daysLeft} days left
                    </span>
                  </div>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
