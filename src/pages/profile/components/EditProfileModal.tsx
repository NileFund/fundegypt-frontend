import React, { useState } from "react";
import { X, Lock } from "lucide-react";
import { EGYPTIAN_PHONE_REGEX } from "../../../utils/constants";
import { useAuth } from "../../../context/useAuth"; // Adjust path if needed
import { updateProfile } from "../../../services/authService"; // Adjust path if needed

interface EditProfileModalProps {
  onClose: () => void;
}

export default function EditProfileModal({ onClose }: EditProfileModalProps) {
  const { user } = useAuth();

  // Initialize state with the real user data from context
  const [formData, setFormData] = useState({
    firstName: user?.firstName || "",
    lastName: user?.lastName || "",
    email: user?.email || "",
    phone: user?.phone || "",
    birthdate: user?.birthdate || "",
    country: user?.country || "Egypt",
    facebookProfile: user?.facebookProfile || "",
  });

  const [isLoading, setIsLoading] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    // Clear error when user starts typing
    if (errors[name]) {
      setErrors((prev) => ({ ...prev, [name]: "" }));
    }
  };

  const validateForm = () => {
    const newErrors: Record<string, string> = {};

    if (formData.firstName.length < 2) newErrors.firstName = "First name must be at least 2 characters.";
    if (formData.lastName.length < 2) newErrors.lastName = "Last name must be at least 2 characters.";
    if (formData.phone && !EGYPTIAN_PHONE_REGEX.test(formData.phone.replace(/[-\s]/g, ""))) {
      newErrors.phone = "Must be a valid Egyptian number (e.g., 010xxxxxxxx).";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!validateForm()) return;

    setIsLoading(true);

    try {
      // Construct FormData for Django (converting camelCase to snake_case)
      const data = new FormData();
      data.append("first_name", formData.firstName);
      data.append("last_name", formData.lastName);
      if (formData.phone) data.append("phone", formData.phone);
      if (formData.birthdate) data.append("birthdate", formData.birthdate);
      if (formData.country) data.append("country", formData.country);
      if (formData.facebookProfile) data.append("facebook_profile", formData.facebookProfile);

      // Call the real API
      await updateProfile(data);

      // Reload the window to refresh the global AuthContext with the new data
      window.location.reload();
    } catch (error: any) {
      setErrors({ submit: error.response?.data?.detail || "Failed to update profile. Please try again." });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    // Overlay
    <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/80 p-4 backdrop-blur-md animate-in fade-in duration-200">
      {/* Modal Container */}
      <div className="bg-[#0f172a] border border-orange-500/20 rounded-[16px] w-full max-w-[600px] shadow-[0_0_30px_rgba(249,115,22,0.15)] overflow-hidden animate-in zoom-in-95 duration-200 flex flex-col max-h-[90vh]">
        {/* Header */}
        <div className="flex justify-between items-center p-6 border-b border-slate-800 shrink-0">
          <div>
            <h3 className="text-xl font-semibold text-orange-500">Profile Information</h3>
            <p className="text-sm text-slate-400 mt-1">
              Update your personal details and how you appear to the community.
            </p>
          </div>
          <button
            onClick={onClose}
            className="text-slate-500 hover:text-orange-400 transition-colors p-1 rounded-md hover:bg-slate-800 self-start"
            aria-label="Close dialog"
            disabled={isLoading}>
            <X size={20} />
          </button>
        </div>

        {/* Scrollable Body */}
        <div className="overflow-y-auto p-6 custom-scrollbar">
          <form id="edit-profile-form" onSubmit={handleSubmit} className="space-y-6">
            {/* Name Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
              <div>
                <label className="block text-xs font-bold text-orange-400/80 uppercase tracking-widest mb-2">
                  First Name
                </label>
                <input
                  name="firstName"
                  value={formData.firstName}
                  onChange={handleChange}
                  disabled={isLoading}
                  className={`w-full bg-[#1e293b] border rounded-lg px-4 py-2.5 text-sm text-slate-200 focus:outline-none focus:ring-2 transition-all duration-200 ${
                    errors.firstName
                      ? "border-red-500/50 focus:ring-red-500/20"
                      : "border-slate-700 focus:border-orange-500 focus:ring-orange-500/20"
                  }`}
                />
                {errors.firstName && <p className="mt-1 text-xs text-red-400">{errors.firstName}</p>}
              </div>
              <div>
                <label className="block text-xs font-bold text-orange-400/80 uppercase tracking-widest mb-2">
                  Last Name
                </label>
                <input
                  name="lastName"
                  value={formData.lastName}
                  onChange={handleChange}
                  disabled={isLoading}
                  className={`w-full bg-[#1e293b] border rounded-lg px-4 py-2.5 text-sm text-slate-200 focus:outline-none focus:ring-2 transition-all duration-200 ${
                    errors.lastName
                      ? "border-red-500/50 focus:ring-red-500/20"
                      : "border-slate-700 focus:border-orange-500 focus:ring-orange-500/20"
                  }`}
                />
                {errors.lastName && <p className="mt-1 text-xs text-red-400">{errors.lastName}</p>}
              </div>
            </div>

            {/* Email (Locked) */}
            <div>
              <label className="block text-xs font-bold text-slate-500 uppercase tracking-widest mb-2">
                Email Address
              </label>
              <div className="relative">
                <input
                  value={formData.email}
                  disabled
                  className="w-full bg-[#0f172a] border border-slate-800 rounded-lg px-4 py-2.5 text-sm text-slate-500 cursor-not-allowed"
                />
                <Lock size={16} className="absolute right-4 top-3 text-slate-600" />
              </div>
              <p className="mt-1.5 text-[11px] text-slate-500">Email cannot be changed for security reasons.</p>
            </div>

            {/* Phone & Birthdate Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
              <div>
                <label className="block text-xs font-bold text-orange-400/80 uppercase tracking-widest mb-2">
                  Phone
                </label>
                <input
                  name="phone"
                  value={formData.phone}
                  onChange={handleChange}
                  disabled={isLoading}
                  className={`w-full bg-[#1e293b] border rounded-lg px-4 py-2.5 text-sm text-slate-200 focus:outline-none focus:ring-2 transition-all duration-200 ${
                    errors.phone
                      ? "border-red-500/50 focus:ring-red-500/20"
                      : "border-slate-700 focus:border-orange-500 focus:ring-orange-500/20"
                  }`}
                />
                {errors.phone && <p className="mt-1 text-xs text-red-400">{errors.phone}</p>}
              </div>
              <div>
                <label className="block text-xs font-bold text-orange-400/80 uppercase tracking-widest mb-2">
                  Birthdate
                </label>
                <input
                  type="date"
                  name="birthdate"
                  value={formData.birthdate}
                  onChange={handleChange}
                  disabled={isLoading}
                  className="w-full bg-[#1e293b] border border-slate-700 rounded-lg px-4 py-2.5 text-sm text-slate-200 focus:outline-none focus:border-orange-500 focus:ring-2 focus:ring-orange-500/20 transition-all duration-200"
                />
              </div>
            </div>

            {/* Country & Facebook Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
              <div>
                <label className="block text-xs font-bold text-orange-400/80 uppercase tracking-widest mb-2">
                  Country
                </label>
                <select
                  name="country"
                  value={formData.country}
                  onChange={handleChange}
                  disabled={isLoading}
                  className="w-full bg-[#1e293b] border border-slate-700 rounded-lg px-4 py-2.5 text-sm text-slate-200 focus:outline-none focus:border-orange-500 focus:ring-2 focus:ring-orange-500/20 transition-all duration-200">
                  <option value="Egypt">Egypt</option>
                  <option value="Saudi Arabia">Saudi Arabia</option>
                  <option value="UAE">UAE</option>
                  <option value="Other">Other</option>
                </select>
              </div>
              <div>
                <label className="block text-xs font-bold text-orange-400/80 uppercase tracking-widest mb-2">
                  Facebook Link
                </label>
                <input
                  name="facebookProfile"
                  value={formData.facebookProfile}
                  onChange={handleChange}
                  disabled={isLoading}
                  className="w-full bg-[#1e293b] border border-slate-700 rounded-lg px-4 py-2.5 text-sm text-slate-200 focus:outline-none focus:border-orange-500 focus:ring-2 focus:ring-orange-500/20 transition-all duration-200"
                />
              </div>
            </div>

            {errors.submit && (
              <div className="p-3 bg-red-500/10 border border-red-500/20 rounded-lg">
                <p className="text-sm text-red-400 text-center">{errors.submit}</p>
              </div>
            )}
          </form>
        </div>

        {/* Footer */}
        <div className="flex justify-end gap-3 px-6 py-4 bg-[#0B1120] border-t border-slate-800 shrink-0">
          <button
            type="button"
            onClick={onClose}
            disabled={isLoading}
            className="px-4 py-2 rounded-lg text-sm font-medium text-slate-400 hover:bg-slate-800 hover:text-slate-200 transition-colors disabled:opacity-50">
            Cancel
          </button>
          <button
            type="submit"
            form="edit-profile-form"
            disabled={isLoading}
            className="bg-orange-600 hover:bg-orange-500 shadow-[0_0_15px_rgba(249,115,22,0.3)] text-white font-bold text-sm px-6 py-2 rounded-lg transition-all duration-200 flex items-center justify-center min-w-[140px] disabled:opacity-70 disabled:cursor-not-allowed">
            {isLoading ? "Saving..." : "Save Changes"}
          </button>
        </div>
      </div>
    </div>
  );
}
