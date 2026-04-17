import React, { useState } from "react";
import DeleteAccountModal from "./DeleteAccountModal";

export default function AboutTab() {
  // State to control the visibility of the Delete Account Modal
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);

  return (
    <div className="animate-in fade-in duration-300">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-8 items-start">
        {/* Asymmetric Content Grid (Left Side) */}
        <div className="md:col-span-2 space-y-8">
          {/* Personal Information Card */}
          <div className="bg-surface-container-lowest p-8 rounded-xl shadow-[0px_24px_48px_rgba(17,28,44,0.02)]">
            <h2 className="text-2xl font-semibold mb-8 text-on-surface">Personal Information</h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-y-10 gap-x-12">
              <div>
                <p className="text-xs font-bold text-on-surface-variant/60 uppercase tracking-widest mb-2">
                  Phone Number
                </p>
                <p className="text-lg font-medium text-on-surface">+20 123 456 7890</p>
              </div>
              <div>
                <p className="text-xs font-bold text-on-surface-variant/60 uppercase tracking-widest mb-2">Birthdate</p>
                <p className="text-lg font-medium text-on-surface">May 14, 1992</p>
              </div>
              <div>
                <p className="text-xs font-bold text-on-surface-variant/60 uppercase tracking-widest mb-2">Country</p>
                <p className="text-lg font-medium text-on-surface">Egypt</p>
              </div>
              <div>
                <p className="text-xs font-bold text-on-surface-variant/60 uppercase tracking-widest mb-2">
                  Social Profile
                </p>
                <a className="text-lg font-medium text-primary hover:underline flex items-center" href="#">
                  facebook.com/ahmed.elsayed
                  <span className="material-symbols-outlined text-sm ml-1">open_in_new</span>
                </a>
              </div>
            </div>
          </div>

          {/* Bio Card */}
          <div className="bg-surface-container-low p-8 rounded-xl">
            <h3 className="text-lg font-semibold mb-4 text-on-surface">Biography</h3>
            <p className="text-on-surface-variant leading-relaxed">
              Architecture enthusiast and community development advocate based in Cairo. Focused on sustainable urban
              planning and supporting local initiatives that preserve historical landmarks while modernizing
              infrastructure. Join me in building a better future for our communities.
            </p>
          </div>
        </div>

        {/* Sidebar: Statistics/Badges (Right Side) */}
        <div className="space-y-6">
          <div className="bg-surface-container-lowest p-6 rounded-xl shadow-[0px_24px_48px_rgba(17,28,44,0.02)]">
            <h3 className="text-xs font-bold text-on-surface-variant/60 uppercase tracking-widest mb-4">
              Impact Statistics
            </h3>
            <div className="space-y-6">
              <div className="flex justify-between items-center">
                <span className="text-on-surface-variant font-medium">Projects Supported</span>
                <span className="text-2xl font-bold text-primary">12</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-on-surface-variant font-medium">Total Contribution</span>
                <span className="text-2xl font-bold text-primary">EGP 45k</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-on-surface-variant font-medium">Impact Level</span>
                <span className="px-3 py-1 rounded-full bg-primary-fixed text-on-primary-fixed text-xs font-bold uppercase tracking-tight">
                  Visionary
                </span>
              </div>
            </div>
          </div>

          <div className="bg-primary p-6 rounded-xl text-on-primary">
            <span
              className="material-symbols-outlined text-4xl mb-4"
              style={{
                fontVariationSettings: "'FILL' 1",
              }}>
              volunteer_activism
            </span>
            <h4 className="text-xl font-bold mb-2">Ready to start?</h4>
            <p className="text-on-primary-container/80 text-sm mb-6 leading-snug">
              Launch your own campaign today and make a real difference in Egypt.
            </p>
            <button className="w-full py-3 bg-white text-primary font-bold rounded-lg hover:bg-secondary-container transition-colors">
              Start Campaign
            </button>
          </div>
        </div>
      </div>

      {/* Subtle Danger Zone - Wired up! */}
      <div className="mt-24 pt-12 border-t border-outline-variant/15 flex justify-center">
        <button
          className="text-error/60 text-sm font-medium hover:text-error transition-colors flex items-center"
          onClick={() => setIsDeleteModalOpen(true)}>
          <span className="material-symbols-outlined text-sm mr-2">delete_forever</span>
          Delete Account
        </button>
      </div>

      {/* Conditionally Render the Modal */}
      {isDeleteModalOpen && <DeleteAccountModal onClose={() => setIsDeleteModalOpen(false)} />}
    </div>
  );
}
