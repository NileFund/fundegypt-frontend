import React, { useState } from "react";
import { X, Lock } from "lucide-react";
import { EGYPTIAN_PHONE_REGEX } from "../../../utils/constants";

interface EditProfileModalProps {
  onClose: () => void;
}

export default function EditProfileModal({ onClose }: EditProfileModalProps) {
  // Initializing state with the dummy data from the UI mockup
  const [formData, setFormData] = useState({
    firstName: "Ahmed",
    lastName: "El-Sayed",
    email: "ahmed.elsayed@example.eg", // This will be locked
    phone: "01012345678", // Formatted to match your team's Regex
    birthdate: "1992-05-14",
    country: "Egypt",
    facebook: "facebook.com/ahmed.elsayed",
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
    if (!EGYPTIAN_PHONE_REGEX.test(formData.phone.replace(/[-\s]/g, ""))) {
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
      // TODO: Replace with Axios call -> axios.put('/api/accounts/me/update/', formData)
      await new Promise((resolve) => setTimeout(resolve, 1500)); // Simulate API delay

      // Show success toast here if you have a toast library!
      onClose();
    } catch (error) {
      setErrors({ submit: "Failed to update profile. Please try again." });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    // Overlay
    <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/50 p-4 backdrop-blur-sm animate-in fade-in duration-200">
      {/* Modal Container */}
      <div className="bg-white rounded-[16px] w-full max-w-[600px] shadow-[0_8px_24px_rgba(0,0,0,0.15)] overflow-hidden animate-in zoom-in-95 duration-200 flex flex-col max-h-[90vh]">
        {/* Header */}
        <div className="flex justify-between items-center p-6 border-b border-gray-100 shrink-0">
          <div>
            <h3 className="text-xl font-semibold text-[#1F6F5F]">Profile Information</h3>
            <p className="text-sm text-[#4A5568] mt-1">
              Update your personal details and how you appear to the community.
            </p>
          </div>
          <button
            onClick={onClose}
            className="text-[#A0AEC0] hover:text-[#4A5568] transition-colors p-1 rounded-md hover:bg-gray-100 self-start"
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
                <label className="block text-xs font-bold text-[#4A5568]/70 uppercase tracking-widest mb-2">
                  First Name
                </label>
                <input
                  name="firstName"
                  value={formData.firstName}
                  onChange={handleChange}
                  disabled={isLoading}
                  className={`w-full bg-white border rounded-lg px-4 py-2.5 text-sm text-[#4A5568] focus:outline-none focus:ring-2 transition-colors ${
                    errors.firstName
                      ? "border-[#E53E3E] focus:ring-[#E53E3E]/20"
                      : "border-gray-200 focus:border-[#2FA084] focus:ring-[#2FA084]/20"
                  }`}
                />
                {errors.firstName && <p className="mt-1 text-xs text-[#E53E3E]">{errors.firstName}</p>}
              </div>
              <div>
                <label className="block text-xs font-bold text-[#4A5568]/70 uppercase tracking-widest mb-2">
                  Last Name
                </label>
                <input
                  name="lastName"
                  value={formData.lastName}
                  onChange={handleChange}
                  disabled={isLoading}
                  className={`w-full bg-white border rounded-lg px-4 py-2.5 text-sm text-[#4A5568] focus:outline-none focus:ring-2 transition-colors ${
                    errors.lastName
                      ? "border-[#E53E3E] focus:ring-[#E53E3E]/20"
                      : "border-gray-200 focus:border-[#2FA084] focus:ring-[#2FA084]/20"
                  }`}
                />
                {errors.lastName && <p className="mt-1 text-xs text-[#E53E3E]">{errors.lastName}</p>}
              </div>
            </div>

            {/* Email (Locked) */}
            <div>
              <label className="block text-xs font-bold text-[#4A5568]/70 uppercase tracking-widest mb-2">
                Email Address
              </label>
              <div className="relative">
                <input
                  value={formData.email}
                  disabled
                  className="w-full bg-indigo-50/50 border border-gray-200 rounded-lg px-4 py-2.5 text-sm text-[#A0AEC0] cursor-not-allowed"
                />
                <Lock size={16} className="absolute right-4 top-3 text-[#A0AEC0]" />
              </div>
              <p className="mt-1.5 text-[11px] text-[#A0AEC0]">Email cannot be changed for security reasons.</p>
            </div>

            {/* Phone & Birthdate Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
              <div>
                <label className="block text-xs font-bold text-[#4A5568]/70 uppercase tracking-widest mb-2">
                  Phone
                </label>
                <input
                  name="phone"
                  value={formData.phone}
                  onChange={handleChange}
                  disabled={isLoading}
                  className={`w-full bg-white border rounded-lg px-4 py-2.5 text-sm text-[#4A5568] focus:outline-none focus:ring-2 transition-colors ${
                    errors.phone
                      ? "border-[#E53E3E] focus:ring-[#E53E3E]/20"
                      : "border-gray-200 focus:border-[#2FA084] focus:ring-[#2FA084]/20"
                  }`}
                />
                {errors.phone && <p className="mt-1 text-xs text-[#E53E3E]">{errors.phone}</p>}
              </div>
              <div>
                <label className="block text-xs font-bold text-[#4A5568]/70 uppercase tracking-widest mb-2">
                  Birthdate
                </label>
                <input
                  type="date"
                  name="birthdate"
                  value={formData.birthdate}
                  onChange={handleChange}
                  disabled={isLoading}
                  className="w-full bg-white border border-gray-200 rounded-lg px-4 py-2.5 text-sm text-[#4A5568] focus:outline-none focus:border-[#2FA084] focus:ring-2 focus:ring-[#2FA084]/20 transition-colors"
                />
              </div>
            </div>

            {/* Country & Facebook Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
              <div>
                <label className="block text-xs font-bold text-[#4A5568]/70 uppercase tracking-widest mb-2">
                  Country
                </label>
                <select
                  name="country"
                  value={formData.country}
                  onChange={handleChange}
                  disabled={isLoading}
                  className="w-full bg-white border border-gray-200 rounded-lg px-4 py-2.5 text-sm text-[#4A5568] focus:outline-none focus:border-[#2FA084] focus:ring-2 focus:ring-[#2FA084]/20 transition-colors">
                  <option value="Egypt">Egypt</option>
                  <option value="Saudi Arabia">Saudi Arabia</option>
                  <option value="UAE">UAE</option>
                  <option value="Other">Other</option>
                </select>
              </div>
              <div>
                <label className="block text-xs font-bold text-[#4A5568]/70 uppercase tracking-widest mb-2">
                  Facebook Link
                </label>
                <input
                  name="facebook"
                  value={formData.facebook}
                  onChange={handleChange}
                  disabled={isLoading}
                  className="w-full bg-white border border-gray-200 rounded-lg px-4 py-2.5 text-sm text-[#4A5568] focus:outline-none focus:border-[#2FA084] focus:ring-2 focus:ring-[#2FA084]/20 transition-colors"
                />
              </div>
            </div>

            {errors.submit && (
              <div className="p-3 bg-[#FFF5F5] border border-[#E53E3E]/20 rounded-lg">
                <p className="text-sm text-[#E53E3E] text-center">{errors.submit}</p>
              </div>
            )}
          </form>
        </div>

        {/* Footer (Fixed at bottom) */}
        <div className="flex justify-end gap-3 px-6 py-4 bg-gray-50 border-t border-gray-100 shrink-0">
          <button
            type="button"
            onClick={onClose}
            disabled={isLoading}
            className="px-4 py-2 rounded-lg text-sm font-medium text-[#4A5568] hover:bg-gray-200 transition-colors disabled:opacity-50">
            Cancel
          </button>
          <button
            type="submit"
            form="edit-profile-form"
            disabled={isLoading}
            className="bg-[#2FA084] hover:bg-[#1F6F5F] text-white font-medium text-sm px-6 py-2 rounded-lg transition-colors duration-200 flex items-center justify-center min-w-[140px] disabled:opacity-70 disabled:cursor-not-allowed">
            {isLoading ? "Saving..." : "Save Changes"}
          </button>
        </div>
      </div>
    </div>
  );
}
