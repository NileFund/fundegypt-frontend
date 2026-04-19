import { useState, useEffect } from "react";
import { PlusCircle, Star, Image as ImageIcon } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { getMyProjects } from "../../../services/projectService";
import { type Project } from "../../../types";
import { ROUTES } from "../../../utils/constants";
import { getImageUrl } from "../../../utils/helpers";

export default function MyProjectsTab() {
  const [projects, setProjects] = useState<Project[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchMyProjects = async () => {
      try {
        setIsLoading(true);
        const data = await getMyProjects();
        // Handle both paginated response and direct array
        const projectList = Array.isArray(data) ? data : (data.results || []);
        setProjects(projectList);
      } catch (err) {
        console.error("Failed to load campaigns:", err);
        setError("Failed to load your campaigns. Please try again later.");
      } finally {
        setIsLoading(false);
      }
    };

    fetchMyProjects();
  }, []);

  const getProgressColor = (percent: number) => {
    if (percent < 25) return "#E53E3E";
    if (percent <= 75) return "#F57F17";
    return "#6FCF97";
  };

  const calculateDaysLeft = (endTime: string) => {
    if (!endTime) return 0;
    const end = new Date(endTime).getTime();
    const now = new Date().getTime();
    const diff = end - now;
    const days = Math.ceil(diff / (1000 * 60 * 60 * 24));
    return days > 0 ? days : 0;
  };

  if (isLoading) {
    return (
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 animate-in fade-in duration-300">
        {[1, 2, 3].map((n) => (
          <div key={n} className="bg-white rounded-xl overflow-hidden border border-brand-mint animate-pulse">
            <div className="bg-surface-page h-48 w-full" />
            <div className="p-4 space-y-3">
              <div className="bg-surface-page h-4 rounded w-1/4" />
              <div className="bg-surface-page h-5 rounded w-3/4" />
              <div className="bg-surface-page h-3 rounded w-full" />
              <div className="bg-brand-mint h-2 rounded-full w-full mt-4" />
            </div>
          </div>
        ))}
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-surface-error border-l-4 border-danger p-4 rounded-md">
        <p className="text-danger">{error}</p>
      </div>
    );
  }

  if (projects.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-16 bg-white border border-brand-mint rounded-xl animate-in fade-in">
        <div className="w-16 h-16 bg-brand-mint rounded-full flex items-center justify-center mb-4">
          <PlusCircle size={32} className="text-brand-primary" />
        </div>
        <h3 className="text-xl font-semibold text-[#1F6F5F] mb-2">No Projects Yet</h3>
        <p className="text-text-body mb-6">You haven't created any projects yet. Start your first campaign!</p>
        <button
          onClick={() => navigate(ROUTES.CREATE_PROJECT)}
          className="bg-brand-primary hover:bg-[#1F6F5F] text-white font-medium text-sm px-6 py-2.5 rounded-lg transition-colors duration-200">
          Create Project
        </button>
      </div>
    );
  }

  return (
    <div className="animate-in fade-in duration-300">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-semibold text-on-surface">My Campaigns</h2>
        <button
          onClick={() => navigate(ROUTES.CREATE_PROJECT)}
          className="bg-brand-primary hover:bg-[#1F6F5F] text-white font-medium text-sm px-6 py-2.5 rounded-lg transition-colors duration-200 flex items-center">
          <PlusCircle size={16} className="mr-2" />
          New Campaign
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {Array.isArray(projects) &&
          projects.map((project) => {
            const percent =
              project.totalTarget > 0
                ? Math.min(Math.round((project.totalDonated / project.totalTarget) * 100), 100)
                : 0;
            const barColor = getProgressColor(percent);
            const daysLeft = calculateDaysLeft(project.endTime);
            const displayImage = project.pictures?.length > 0 ? project.pictures[0].image : null;

            return (
              <div
                key={project.id}
                className="bg-white rounded-xl border border-brand-mint shadow-sm hover:shadow-[0_4px_12px_rgba(0,0,0,0.12)] transition-all duration-200 overflow-hidden flex flex-col group cursor-pointer"
                onClick={() => navigate(`${ROUTES.PROJECT_DETAIL.replace(":id", project.id.toString())}`)}>
                {/* 1. Image Section (Compact & Rounded) */}
                <div className="p-3">
                  <div className="relative h-48 w-full bg-slate-100 rounded-2xl overflow-hidden flex items-center justify-center">
                    {displayImage ? (
                      <img
                        src={getImageUrl(displayImage)}
                        alt={project.title}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                      />
                    ) : (
                      <ImageIcon size={48} className="text-[#CBD5E0]" />
                    )}
                  </div>
                </div>

                {/* 2. Content Section (Now outside the image!) */}
                <div className="p-5 flex flex-col grow">
                  <h3 className="text-lg font-semibold text-[#1F6F5F] line-clamp-2 leading-tight mb-2">
                    {project.title}
                  </h3>
                  <p className="text-sm text-text-body line-clamp-2 mb-4 grow">{project.details}</p>

                  <div className="mt-auto">
                    <div className="bg-brand-mint rounded-full h-2 overflow-hidden mb-2">
                      <div
                        className="h-full rounded-full transition-all duration-1000 ease-out"
                        style={{ width: `${percent}%`, backgroundColor: barColor }}
                      />
                    </div>

                    <div className="flex justify-between items-end mb-4">
                      <div>
                        <span className="text-sm font-bold text-[#1F6F5F]">
                          {Number(project.totalDonated).toLocaleString("en-US")} EGP
                        </span>
                        <span className="text-xs text-text-body block mt-0.5">
                          raised of {Number(project.totalTarget).toLocaleString("en-US")}
                        </span>
                      </div>
                      <span className="text-sm font-bold" style={{ color: barColor }}>
                        {percent}%
                      </span>
                    </div>

                    <div className="flex justify-between items-center pt-4 border-t border-gray-100">
                      <div className="flex items-center text-sm text-text-body">
                        <Star
                          size={16}
                          className={
                            project.averageRating > 0 ? "text-[#F6AD55] mr-1 fill-[#F6AD55]" : "text-brand-mint mr-1"
                          }
                        />
                        <span className="font-medium mt-0.5">
                          {project.averageRating > 0 ? project.averageRating.toFixed(1) : "New"}
                        </span>
                      </div>
                      <span className="bg-[#FFF8E1] text-warning text-xs font-semibold px-2.5 py-1 rounded-full">
                        {daysLeft} days left
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
