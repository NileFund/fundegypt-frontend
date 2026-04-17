import React, { useState } from "react";
import { X, AlertTriangle } from "lucide-react";

interface DeleteAccountModalProps {
  onClose: () => void;
}

export default function DeleteAccountModal({ onClose }: DeleteAccountModalProps) {
  const [password, setPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleDelete = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    if (!password) {
      setError("Please enter your password to confirm.");
      return;
    }

    setIsLoading(true);

    try {
      // TODO: Replace with your actual Axios call to your Django API
      // await axios.delete('/api/accounts/me/delete/', { data: { password } });

      // Simulating network request...
      await new Promise((resolve, reject) => {
        setTimeout(() => {
          if (password === "password123") {
            // Fake successful password
            resolve(true);
          } else {
            reject(new Error("Incorrect password."));
          }
        }, 1500);
      });

      // If successful, log the user out and redirect to home
      // authCtx.logout();
      // navigate('/');
      alert("Account successfully deleted. Redirecting to home...");
      onClose();
    } catch (err: any) {
      setError(err.message || "Something went wrong. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    // Overlay: rgba(0,0,0,0.5)
    <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/50 p-4 backdrop-blur-sm animate-in fade-in duration-200">
      {/* Modal Container: Max width 480px, bg white, 16px radius, shadow */}
      <div className="bg-white rounded-[16px] w-full max-w-[480px] shadow-[0_8px_24px_rgba(0,0,0,0.15)] overflow-hidden animate-in zoom-in-95 duration-200">
        {/* Header */}
        <div className="flex justify-between items-center p-6 border-b border-gray-100">
          <h3 className="text-lg font-semibold text-[#1F6F5F] flex items-center">
            <AlertTriangle size={20} className="text-[#E53E3E] mr-2" />
            Delete Account
          </h3>
          <button
            onClick={onClose}
            className="text-[#A0AEC0] hover:text-[#4A5568] transition-colors p-1 rounded-md hover:bg-gray-100"
            aria-label="Close dialog"
            disabled={isLoading}>
            <X size={20} />
          </button>
        </div>

        {/* Body */}
        <form onSubmit={handleDelete}>
          <div className="p-6 space-y-4">
            <p className="text-[#4A5568] text-sm leading-relaxed">
              Are you sure you want to delete your account? This action will hide your profile and cancel any active
              campaigns. For financial security, your past donation records will be anonymized after 30 days.
            </p>
            <p className="text-[#4A5568] text-sm font-medium">
              This action <span className="text-[#E53E3E] font-bold">cannot</span> be undone.
            </p>

            <div className="pt-2">
              <label htmlFor="password" className="block text-sm font-medium text-[#4A5568] mb-1.5">
                Confirm your password
              </label>
              <input
                id="password"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Enter your password"
                disabled={isLoading}
                className={`w-full bg-white border rounded-lg px-4 py-2.5 text-sm text-[#4A5568] placeholder:text-[#A0AEC0] focus:outline-none focus:ring-2 transition-colors duration-200 ${
                  error
                    ? "border-[#E53E3E] focus:border-[#E53E3E] focus:ring-[#E53E3E]/20"
                    : "border-gray-200 focus:border-[#2FA084] focus:ring-[#2FA084]/20"
                }`}
              />
              {error && (
                <p className="mt-1.5 text-xs text-[#E53E3E] font-medium animate-in slide-in-from-top-1">{error}</p>
              )}
            </div>
          </div>

          {/* Footer */}
          <div className="flex justify-end gap-3 px-6 py-4 bg-gray-50 border-t border-gray-100">
            <button
              type="button"
              onClick={onClose}
              disabled={isLoading}
              className="px-4 py-2 rounded-lg text-sm font-medium text-[#4A5568] hover:bg-gray-200 transition-colors disabled:opacity-50">
              Cancel
            </button>
            <button
              type="submit"
              disabled={isLoading}
              className="bg-[#E53E3E] hover:bg-[#C53030] text-white font-medium text-sm px-6 py-2 rounded-lg transition-colors duration-200 flex items-center justify-center min-w-[140px] disabled:opacity-70 disabled:cursor-not-allowed">
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
