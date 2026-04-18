import { useState } from 'react';
import { Heart, X, AlertCircle, CheckCircle } from 'lucide-react';
import { createDonation } from '../../services/donationService';
import { LIMITS } from '../../utils/constants';

interface DonationModalProps {
  projectId: number;
  projectTitle: string;
  projectStatus: string; 
  onSuccess?: () => void;
}

type ModalState = 'idle' | 'loading' | 'success' | 'error';

const QUICK_AMOUNTS = [50, 100, 250, 500];

export default function DonationModal({
  projectId,
  projectTitle,
  projectStatus,
  onSuccess,
}: DonationModalProps) {
  console.log('projectStatus:', projectStatus); 
  const [isOpen, setIsOpen] = useState(false);
  const [amount, setAmount] = useState('');
  const [modalState, setModalState] = useState<ModalState>('idle');
  const [errorMsg, setErrorMsg] = useState('');

  const isDisabled = projectStatus !== 'running';

  const open = () => {
    if (isDisabled) return; 
    setIsOpen(true);
    setAmount('');
    setModalState('idle');
    setErrorMsg('');
  };

  const close = () => {
    if (modalState === 'loading') return;
    setIsOpen(false);
  };

  const handleQuickAmount = (val: number) => {
    setAmount(String(val));
    setErrorMsg('');
  };

  const handleAmountChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setAmount(e.target.value);
    setErrorMsg('');
  };

  const validate = (): string => {
    const num = parseFloat(amount);
    if (!amount || isNaN(num)) return 'Please enter a donation amount.';
    if (num < LIMITS.minDonation)
      return `Minimum donation is ${LIMITS.minDonation} EGP.`;
    return '';
  };

  const handleSubmit = async () => {
    if (isDisabled) {
      setErrorMsg('This project is not accepting donations.');
      return;
    }

    const err = validate();
    if (err) {
      setErrorMsg(err);
      return;
    }

    setModalState('loading');
    setErrorMsg('');

    try {
      await createDonation(projectId, parseFloat(amount));
      setModalState('success');
      onSuccess?.();
    } catch (e: any) {
      console.log('Donation error response:', e?.response?.data);
        const data = e?.response?.data;
        const msg =
        data?.detail ||
        data?.non_field_errors?.[0] ||
        (typeof data === 'string' ? data : null) ||
        'Donation failed. Please try again.';
      setErrorMsg(msg);
      setModalState('error');
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Escape') close();
  };

  return (
    <>
      {/* Donate Button */}
      <button
        onClick={open}
        disabled={isDisabled}
        className={`w-full flex items-center justify-center gap-2 font-semibold text-base px-8 py-3 rounded-lg transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-offset-2
          ${
            isDisabled
              ? 'bg-gray-300 text-gray-500 cursor-not-allowed'
              : 'bg-[#2FA084] hover:bg-[#1F6F5F] text-white focus:ring-[#2FA084]'
          }
        `}
      >
        <Heart size={18} />
        {isDisabled ? 'Campaign Completed' : 'Donate Now'}
      </button>

      {/* Backdrop */}
      {isOpen && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50"
          onClick={close}
          onKeyDown={handleKeyDown}
        >
          {/* Modal */}
          <div
            className="bg-white rounded-xl shadow-2xl w-full max-w-md p-6 relative"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Close */}
            <button
              onClick={close}
              aria-label="Close dialog"
              className="absolute top-4 right-4 text-gray-400 hover:text-gray-600 transition-colors"
              disabled={modalState === 'loading'}
            >
              <X size={20} />
            </button>

            {modalState === 'success' ? (
              /* Success State */
              <div className="text-center py-4">
                <div className="flex items-center justify-center w-16 h-16 bg-[#D1F2EB] rounded-full mx-auto mb-4">
                  <CheckCircle size={32} color="#2FA084" />
                </div>
                <h2 className="text-xl font-semibold text-[#1F6F5F] mb-2">
                  Thank You!
                </h2>
                <p className="text-[#4A5568] mb-6">
                  Your donation of{' '}
                  <span className="font-semibold text-[#2FA084]">
                    {parseFloat(amount).toLocaleString('ar-EG')} EGP
                  </span>{' '}
                  to <span className="font-medium">"{projectTitle}"</span> was successful.
                </p>
                <button
                  onClick={close}
                  className="bg-[#2FA084] hover:bg-[#1F6F5F] text-white font-medium px-8 py-2.5 rounded-lg"
                >
                  Close
                </button>
              </div>
            ) : (
              /* Donation Form */
              <>
                {/* Header */}
                <div className="mb-6">
                  <div className="flex items-center gap-2 mb-1">
                    <Heart size={20} color="#2FA084" />
                    <h2 className="text-xl font-semibold text-[#1F6F5F]">
                      Support this Campaign
                    </h2>
                  </div>
                  <p className="text-sm text-[#4A5568] pl-7">
                    You're donating to{' '}
                    <span className="font-medium text-[#1F6F5F]">
                      "{projectTitle}"
                    </span>
                  </p>
                </div>

                {/* Quick Amounts */}
                <div className="mb-4">
                  <div className="grid grid-cols-4 gap-2">
                    {QUICK_AMOUNTS.map((val) => (
                      <button
                        key={val}
                        onClick={() => handleQuickAmount(val)}
                        className="py-2 rounded-lg text-sm font-medium border border-[#D1F2EB] text-[#2FA084] hover:bg-[#D1F2EB]"
                      >
                        {val} EGP
                      </button>
                    ))}
                  </div>
                </div>

                {/* Input */}
                <input
                  type="number"
                  value={amount}
                  onChange={handleAmountChange}
                  className="w-full border rounded-lg px-4 py-3"
                  placeholder={`Min. ${LIMITS.minDonation} EGP`}
                />

                {errorMsg && (
                  <div className="flex items-center gap-1.5 mt-2 text-red-500 text-sm">
                    <AlertCircle size={14} />
                    <span>{errorMsg}</span>
                  </div>
                )}

                {/* Submit */}
                <button
                  onClick={handleSubmit}
                  disabled={modalState === 'loading' || isDisabled}
                  className="w-full bg-[#2FA084] hover:bg-[#1F6F5F] text-white font-semibold py-3 rounded-lg mt-5"
                >
                  {modalState === 'loading'
                    ? 'Processing...'
                    : 'Confirm Donation'}
                </button>
              </>
            )}
          </div>
        </div>
      )}
    </>
  );
}