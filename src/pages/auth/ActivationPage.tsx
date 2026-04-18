import { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import {
  ShieldCheck,
  AlertCircle,
  Loader2,
  CheckCircle2,
  ArrowRight
} from 'lucide-react';
import axios from 'axios';
import api from '../../services/api';
import { ROUTES, APP_NAME } from '../../utils/constants';
import Logo from '../../assets/favicon.png';

const ActivationPage = () => {
  const { uid, token } = useParams<{ uid: string; token: string }>();
  const [status, setStatus] = useState<'loading' | 'success' | 'error'>('loading');
  const [message, setMessage] = useState<string>('Verifying your account details...');

  useEffect(() => {
    const activateAccount = async () => {
      if (!uid || !token) {
        setStatus('error');
        setMessage('Invalid activation link. Please check your email and try again.');
        return;
      }

      try {
        const response = await api.get(`/accounts/activate/${uid}/${token}/`);
        setStatus('success');
        setMessage(response.data.message || 'Your account has been successfully activated.');
      } catch (error) {
        console.error("Activation Error:", error);
        setStatus('error');

        let errorMsg = 'The activation link is invalid or has expired. Please try registering again.';
        if (axios.isAxiosError(error)) {
          const errorData = error.response?.data;
          errorMsg = errorData?.error || errorData?.detail || errorMsg;
        }

        setMessage(errorMsg);
      }
    };

    activateAccount();
  }, [uid, token]);

  return (
    <div className="min-h-screen bg-surface-page relative overflow-hidden flex flex-col">
      <div className="absolute top-[-10%] right-[-10%] w-125 h-125 bg-brand-primary/5 rounded-full blur-[120px] pointer-events-none"></div>
      <div className="absolute bottom-[-10%] left-[-10%] w-125 h-125 bg-brand-secondary/5 rounded-full blur-[120px] pointer-events-none"></div>

      <header className="w-full px-8 py-6 flex justify-center items-center z-10">
        <Link
          to={ROUTES.HOME}
          className="text-2xl font-black tracking-tighter text-brand-secondary hover:scale-105 transition-transform duration-300"
        >
          <img src={Logo} alt={APP_NAME} className="w-8 h-8 inline-block mr-2 -mt-1" />
          {APP_NAME}
        </Link>
      </header>

      <div className="grow flex items-center justify-center p-4">
        <div className="w-full max-w-md glass-shine rounded-[2.5rem] p-8 md:p-12 shadow-2xl relative z-10 text-center transition-all duration-500">

          <div className="flex justify-center mb-8">
            <div className={`w-24 h-24 rounded-3xl flex items-center justify-center transition-all duration-700 ${status === 'loading' ? 'bg-white/5 animate-pulse' :
              status === 'success' ? 'bg-brand-success/20 border border-brand-success/30 rotate-360' :
                'bg-danger/20 border border-danger/30'
              }`}>
              {status === 'loading' && <Loader2 className="text-brand-primary animate-spin" size={48} />}
              {status === 'success' && <CheckCircle2 className="text-brand-success" size={48} />}
              {status === 'error' && <AlertCircle className="text-danger" size={48} />}
            </div>
          </div>

          {/* Status Text */}
          <div className="space-y-4 mb-10">
            <h1 className="text-3xl font-bold text-white tracking-tight">
              {status === 'loading' && 'Account Activation'}
              {status === 'success' && 'Welcome Aboard!'}
              {status === 'error' && 'Activation Failed'}
            </h1>
            <p className={`text-sm font-medium leading-relaxed px-2 ${status === 'error' ? 'text-danger/80' : 'text-brand-mint/60'
              }`}>
              {message}
            </p>
          </div>

          <div className="space-y-3">
            {status === 'success' ? (
              <Link
                to={ROUTES.LOGIN}
                className="w-full bg-brand-primary hover:bg-brand-success text-white py-4 rounded-2xl font-bold text-lg shadow-lg transition-all active:scale-[0.98] flex items-center justify-center gap-2 group btn-3d"
              >
                Continue to Login
                <ArrowRight className="group-hover:translate-x-1 transition-transform" size={20} />
              </Link>
            ) : status === 'error' ? (
              <>
                <Link
                  to={ROUTES.REGISTER}
                  className="w-full bg-brand-primary hover:bg-brand-success text-white py-4 rounded-2xl font-bold text-lg shadow-lg transition-all active:scale-[0.98] flex items-center justify-center gap-2 btn-3d"
                >
                  Try Registering Again
                </Link>
                <Link
                  to={ROUTES.HOME}
                  className="block text-brand-mint/40 hover:text-white transition-colors text-sm font-bold pt-2"
                >
                  Back to Home
                </Link>
              </>
            ) : (
              <div className="flex items-center justify-center gap-3 text-brand-primary/40 font-bold uppercase tracking-widest text-xs">
                <span className="w-2 h-2 rounded-full bg-brand-primary animate-ping"></span>
                Institutional Verification in Progress
              </div>
            )}
          </div>

          <div className="mt-12 pt-8 border-t border-white/5 opacity-30">
            <div className="flex items-center justify-center gap-2 mb-2 text-white">
              <ShieldCheck size={14} />
              <span className="text-[10px] font-black uppercase tracking-widest">Secure Verification</span>
            </div>
            <p className="text-[9px] text-brand-mint font-medium uppercase tracking-[0.2em]">
              © 2026 FUNDEGYPT. TRUST. STABILITY. GROWTH.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ActivationPage;