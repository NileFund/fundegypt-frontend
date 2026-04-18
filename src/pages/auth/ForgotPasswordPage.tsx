import { useState } from 'react';
import { Link } from 'react-router-dom';
import { Mail, ArrowRight, Loader2, AlertCircle, CheckCircle2 } from 'lucide-react';
import axios from 'axios';
import api from '../../services/api';
import { ROUTES, APP_NAME } from '../../utils/constants';
import { validateEmail } from '../../utils/validators';

const ForgotPasswordPage = () => {
  const [email, setEmail] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [status, setStatus] = useState<'idle' | 'success' | 'error'>('idle');
  const [message, setMessage] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!validateEmail(email)) {
      setStatus('error');
      setMessage("Please enter a valid email address.");
      return;
    }

    setIsLoading(true);
    setStatus('idle');
    setMessage('');

    try {
      await api.post('/password_reset/', { email });
      setStatus('success');
      setMessage("We've sent a password reset link to your email. Please check your inbox and follow the instructions.");
    } catch (error) {
      console.error("Forgot Password Error:", error);
      setStatus('error');

      let errorMsg = "An error occurred. Please make sure the email is registered or try again later.";
      if (axios.isAxiosError(error)) {
        const errorData = error.response?.data;
        errorMsg = errorData?.detail || errorData?.error || errorMsg;
      }

      setMessage(errorMsg);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-surface-page relative overflow-hidden flex flex-col">
      <div className="absolute top-[-10%] right-[-10%] w-125 h-125 bg-brand-primary/5 rounded-full blur-[120px] pointer-events-none"></div>

      <header className="w-full px-4 md:px-8 py-4 flex justify-between items-center z-10 border-b border-black/5 bg-white/50 backdrop-blur-md">
        <Link
          to={ROUTES.HOME}
          className="text-2xl font-black tracking-tighter text-brand-secondary hover:scale-105 transition-transform duration-300"
        >
          {APP_NAME}
        </Link>
        <Link
          to={ROUTES.LOGIN}
          className="text-sm font-bold text-brand-secondary hover:text-brand-primary transition-colors"
        >
          Back to Login
        </Link>
      </header>

      <div className="grow flex items-center justify-center p-4">
        <div className="w-full max-w-md glass-shine rounded-[2.5rem] p-8 md:p-10 shadow-2xl relative z-10 transition-all duration-500">
          <div className="text-center mb-8">
            <div className="w-16 h-16 bg-brand-primary/10 rounded-2xl flex items-center justify-center mx-auto mb-4">
              <Mail className="text-brand-primary" size={32} />
            </div>
            <h1 className="text-3xl font-bold text-white mb-2 tracking-tight">Forgot Password?</h1>
            <p className="text-brand-mint/60 text-sm">No worries, we'll send you reset instructions.</p>
          </div>

          {status === 'success' ? (
            <div className="text-center space-y-6">
              <div className="p-4 bg-brand-success/10 border border-brand-success/20 rounded-2xl flex items-center gap-3 text-brand-success text-sm font-medium">
                <CheckCircle2 className="shrink-0" size={18} />
                {message}
              </div>
              <Link
                to={ROUTES.LOGIN}
                className="w-full bg-brand-primary hover:bg-brand-success text-white py-4 rounded-2xl font-bold text-lg shadow-lg block transition-all active:scale-[0.98] btn-3d"
              >
                Back to Login
              </Link>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-4">
              {status === 'error' && (
                <div className="p-4 bg-danger/10 border border-danger/20 rounded-2xl flex items-center gap-3 text-danger text-sm font-medium mb-4">
                  <AlertCircle className="shrink-0" size={18} />
                  {message}
                </div>
              )}

              <div className="space-y-1">
                <label className="text-sm font-semibold text-brand-mint/80 ml-1">Email Address</label>
                <div className="relative">
                  <Mail className="absolute left-4 top-1/2 -translate-y-1/2 text-brand-mint/40" size={18} />
                  <input
                    type="email"
                    className="w-full bg-white/5 border border-white/10 rounded-2xl py-3 pl-12 pr-4 text-white focus:outline-none transition-all input-3d"
                    placeholder="name@example.com"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    disabled={isLoading}
                  />
                </div>
              </div>

              <button
                type="submit"
                disabled={isLoading}
                className="w-full bg-brand-primary hover:bg-brand-success disabled:bg-brand-primary/50 text-white py-4 rounded-2xl font-bold text-lg shadow-lg transition-all active:scale-[0.98] mt-4 flex items-center justify-center gap-2 group btn-3d"
              >
                {isLoading ? (
                  <>
                    <Loader2 className="animate-spin" size={20} />
                    Sending...
                  </>
                ) : (
                  <>
                    Reset Password
                    <ArrowRight className="group-hover:translate-x-1 transition-transform" size={20} />
                  </>
                )}
              </button>
            </form>
          )}

          <div className="mt-8 pt-6 border-t border-white/5 text-center">
            <Link to={ROUTES.REGISTER} className="text-brand-mint/60 hover:text-white transition-colors text-sm font-medium">
              Don't have an account? <span className="text-brand-primary font-bold">Sign Up</span>
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ForgotPasswordPage;