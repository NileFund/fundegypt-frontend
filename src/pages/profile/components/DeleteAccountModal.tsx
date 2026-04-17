import React, { useState } from "react";
import { X, AlertTriangle } from "lucide-react";
import { useNavigate } from "react-router-dom"; // Added for routing
import { useAuth } from "../../../context/useAuth"; // Adjust path to your auth context
import { deleteAccount } from "../../../services/authService"; // Adjust path to your API services

interface DeleteAccountModalProps {
  onClose: () => void;
}

export default function DeleteAccountModal({ onClose }: DeleteAccountModalProps) {
  const [password, setPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Bring in global logout and navigation
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
      // 1. Call the real Django endpoint to delete the user record
      await deleteAccount(password);

      // 2. Clear local storage tokens and reset the AuthContext state
      await logout();

      // 3. Redirect back to the landing page
      navigate("/");

      // Optional: Close modal (though the component will likely unmount on redirect)
      onClose();
    } catch (err: any) {
      // Safely extract Django's error message (e.g., "Incorrect password")
      const backendError = err.response?.data?.detail || err.response?.data?.error;
      setError(backendError || "Something went wrong. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    // Overlay: Deepened to a darker blur to fit the cyberpunk aesthetic
    <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/80 p-4 backdrop-blur-md animate-in fade-in duration-200">
      {/* Modal Container: Warm dark slate with subtle orange glow border */}
      <div className="bg-[#0f172a] border border-orange-500/20 rounded-[16px] w-full max-w-[480px] shadow-[0_0_30px_rgba(249,115,22,0.15)] overflow-hidden animate-in zoom-in-95 duration-200">
        {/* Header */}
        <div className="flex justify-between items-center p-6 border-b border-slate-800">
          <h3 className="text-lg font-semibold text-orange-500 flex items-center">
            <AlertTriangle size={20} className="text-red-500 mr-2 drop-shadow-[0_0_8px_rgba(239,68,68,0.5)]" />
            Delete Account
          </h3>
          <button
            onClick={onClose}
            className="text-slate-500 hover:text-orange-400 transition-colors p-1 rounded-md hover:bg-slate-800"
            aria-label="Close dialog"
            disabled={isLoading}>
            <X size={20} />
          </button>
        </div>

        {/* Body */}
        <form onSubmit={handleDelete}>
          <div className="p-6 space-y-4">
            <p className="text-slate-300 text-sm leading-relaxed">
              Are you sure you want to delete your account? This action will hide your profile and cancel any active
              campaigns. For financial security, your past donation records will be anonymized after 30 days.
            </p>
            <p className="text-slate-300 text-sm font-medium">
              This action <span className="text-red-500 font-bold">cannot</span> be undone.
            </p>

            <div className="pt-2">
              <label htmlFor="password" className="block text-sm font-medium text-orange-400/80 mb-1.5">
                Confirm your password
              </label>
              <input
                id="password"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Enter your password"
                disabled={isLoading}
                className={`w-full bg-[#1e293b] rounded-lg px-4 py-2.5 text-sm text-slate-200 placeholder:text-slate-500 focus:outline-none focus:ring-2 transition-all duration-200 ${
                  error
                    ? "border border-red-500/50 focus:border-red-500 focus:ring-red-500/20"
                    : "border border-slate-700 focus:border-orange-500 focus:ring-orange-500/20"
                }`}
              />
              {error && (
                <p className="mt-1.5 text-xs text-red-400 font-medium animate-in slide-in-from-top-1">{error}</p>
              )}
            </div>
          </div>

          {/* Footer */}
          <div className="flex justify-end gap-3 px-6 py-4 bg-[#0B1120] border-t border-slate-800">
            <button
              type="button"
              onClick={onClose}
              disabled={isLoading}
              className="px-4 py-2 rounded-lg text-sm font-medium text-slate-400 hover:bg-slate-800 hover:text-slate-200 transition-colors disabled:opacity-50">
              Cancel
            </button>
            <button
              type="submit"
              disabled={isLoading}
              className="bg-red-600/90 hover:bg-red-500 text-white shadow-[0_0_15px_rgba(220,38,38,0.4)] font-medium text-sm px-6 py-2 rounded-lg transition-all duration-200 flex items-center justify-center min-w-[140px] disabled:opacity-70 disabled:cursor-not-allowed">
              {isLoading ? (
                <span className="flex items-center">
                  <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" fill="none" viewBox="0 0 24 24">
                    <circle
                      className="opacity-25"
                      cx="12"
                      cy="12"
                      r="10"
                      stroke="currentColor"
                      strokeWidth="4"></circle>
                    <path
                      className="opacity-75"
                      fill="currentColor"
                      d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                  Deleting...
                </span>
              ) : (
                "Delete Account"
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
