import React, { useState } from "react";
import { X, AlertTriangle } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../../../context/useAuth";
import { deleteAccount } from "../../../services/authService";

interface DeleteAccountModalProps {
  onClose: () => void;
}

export default function DeleteAccountModal({ onClose }: DeleteAccountModalProps) {
  const [password, setPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const { logout } = useAuth();
  const navigate = useNavigate();

  const handleDelete = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    if (!password) {
      setError("Please enter your password to confirm.");
      return;
    }

    setIsLoading(true);

    try {
      await deleteAccount(password);
      await logout();
      navigate("/");
      onClose();
    } catch (err: any) {
      // --- THE BULLETPROOF ERROR CATCHER ---

      // 1. Log the exact error to your browser console (F12 -> Console)
      // so you can see exactly what Django sent!
      console.error("Django Error Payload:", err.response?.data);

      const data = err.response?.data;

      // 2. Set a strong default message so it never fails silently
      let errorMessage = "Incorrect password. Account deletion failed.";

      // 3. Try to extract the specific text Django sent
      if (data) {
        if (Array.isArray(data.password)) {
          errorMessage = data.password[0]; // Catches {"password": ["Incorrect..."]}
        } else if (typeof data.password === "string") {
          errorMessage = data.password;
        } else if (data.detail) {
          errorMessage = data.detail;
        } else if (data.non_field_errors) {
          errorMessage = data.non_field_errors[0];
        }
      }

      // 4. Trigger the red UI text
      setError(errorMessage);
    } finally {
      setIsLoading(false);
    }
  };
  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/50 p-4 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="bg-white rounded-[16px] w-full max-w-[480px] shadow-[0_8px_24px_rgba(0,0,0,0.15)] overflow-hidden animate-in zoom-in-95 duration-200">
        <div className="flex justify-between items-center p-6 border-b border-gray-100">
          <h3 className="text-lg font-semibold text-red-600 flex items-center">
            <AlertTriangle size={20} className="text-red-500 mr-2" />
            Delete Account
          </h3>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600 transition-colors p-1 rounded-md hover:bg-gray-100"
            aria-label="Close dialog"
            disabled={isLoading}>
            <X size={20} />
          </button>
        </div>

        <form onSubmit={handleDelete}>
          <div className="p-6 space-y-4">
            <p className="text-gray-600 text-sm leading-relaxed">
              Are you sure you want to delete your account? This action will hide your profile and cancel any active
              campaigns. For financial security, your past donation records will be anonymized after 30 days.
            </p>
            <p className="text-gray-600 text-sm font-medium">
              This action <span className="text-red-600 font-bold">cannot</span> be undone.
            </p>

            <div className="pt-2">
              <label htmlFor="password" className="block text-sm font-medium text-gray-600 mb-1.5">
                Confirm your password
              </label>
              <input
                id="password"
                type="password"
                value={password}
                onChange={(e) => {
                  setPassword(e.target.value);
                  if (error) setError(null); // Clear the error when they start typing again
                }}
                placeholder="Enter your password"
                disabled={isLoading}
                className={`w-full bg-white border rounded-lg px-4 py-2.5 text-sm text-gray-800 placeholder:text-gray-400 focus:outline-none focus:ring-2 transition-all duration-200 ${
                  error
                    ? "border-red-500 focus:border-red-600 focus:ring-red-500/20"
                    : "border-gray-300 focus:border-[#2FA084] focus:ring-[#2FA084]/20"
                }`}
              />
              {/* This is where the error message renders */}
              {error && (
                <p className="mt-1.5 text-xs text-red-600 font-medium animate-in slide-in-from-top-1">{error}</p>
              )}
            </div>
          </div>

          <div className="flex justify-end gap-3 px-6 py-4 bg-gray-50 border-t border-gray-100">
            <button
              type="button"
              onClick={onClose}
              disabled={isLoading}
              className="px-4 py-2 rounded-lg text-sm font-medium text-gray-600 hover:bg-gray-200 transition-colors disabled:opacity-50">
              Cancel
            </button>
            <button
              type="submit"
              disabled={isLoading}
              className="bg-red-600 hover:bg-red-700 text-white font-medium text-sm px-6 py-2 rounded-lg transition-colors duration-200 flex items-center justify-center min-w-[140px] disabled:opacity-70 disabled:cursor-not-allowed">
              {isLoading ? "Deleting..." : "Delete Account"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
