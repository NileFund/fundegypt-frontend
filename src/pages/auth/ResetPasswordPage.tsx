import { useState } from 'react';
import { Link, useParams, useNavigate, useSearchParams } from 'react-router-dom';
import { Lock, ArrowRight, Loader2, AlertCircle, CheckCircle2, ShieldCheck } from 'lucide-react';
import api from '../../services/api';
import { ROUTES, APP_NAME } from '../../utils/constants';
import { validatePassword } from '../../utils/validators';

const ResetPasswordPage = () => {
  const { token: pathToken } = useParams<{ token: string }>();
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();

  const token = pathToken || searchParams.get('token');

  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [status, setStatus] = useState<'idle' | 'success' | 'error'>('idle');
  const [message, setMessage] = useState('');
  const [fieldErrors, setFieldErrors] = useState<Record<string, string>>({});

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    const errors: Record<string, string> = {};
    const pwdCheck = validatePassword(password);
    if (!pwdCheck.isValid) {
      errors.password = pwdCheck.message || "Invalid password.";
    }
    if (password !== confirmPassword) {
      errors.confirmPassword = "Passwords do not match.";
    }

    if (Object.keys(errors).length > 0) {
      setFieldErrors(errors);
      return;
    }

    setIsLoading(true);
    setStatus('idle');
    setMessage('');
    setFieldErrors({});

    try {
      const payload = {
        token,
        password: password,
      };

      await api.post('/password_reset/confirm/', payload);

      setStatus('success');
      setTimeout(() => navigate(ROUTES.LOGIN, { state: { message: "Password reset successful! Please log in." } }), 3000);
    } catch (error) {
      console.error("Reset Password Error:", error);
      setStatus('error');
      const errorData = error.response?.data;
      setMessage(
        errorData?.detail ||
        errorData?.error ||
        "The reset link is invalid or has expired."
      );
      if (errorData && typeof errorData === 'object' && !errorData.detail) {
        setFieldErrors(errorData);
      }
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-surface-page relative overflow-hidden flex flex-col">
      <div className="absolute top-[-10%] right-[-10%] w-[500px] h-[500px] bg-brand-primary/5 rounded-full blur-[120px] pointer-events-none"></div>

      <header className="w-full px-4 md:px-8 py-4 flex justify-between items-center z-10 border-b border-black/5 bg-white/50 backdrop-blur-md">
        <Link
          to={ROUTES.HOME}
          className="text-2xl font-black tracking-tighter text-brand-secondary hover:scale-105 transition-transform duration-300"
        >
          {APP_NAME}
        </Link>
      </header>

      <div className="flex-grow flex items-center justify-center p-4">
        <div className="w-full max-w-md glass-shine rounded-[2.5rem] p-8 md:p-10 shadow-2xl relative z-10 transition-all duration-500">
          <div className="text-center mb-8">
            <div className="w-16 h-16 bg-brand-primary/10 rounded-2xl flex items-center justify-center mx-auto mb-4">
              <ShieldCheck className="text-brand-primary" size={32} />
            </div>
            <h1 className="text-3xl font-bold text-white mb-2 tracking-tight">New Password</h1>
            <p className="text-brand-mint/60 text-sm">Secure your account with a new strong password.</p>
          </div>

          {status === 'success' ? (
            <div className="text-center space-y-6">
              <div className="p-6 bg-brand-success/10 border border-brand-success/20 rounded-2xl flex flex-col items-center gap-3 text-brand-success text-center animate-in zoom-in-95 duration-500">
                <CheckCircle2 size={48} />
                <div>
                  <p className="font-bold text-lg">Password Updated!</p>
                  <p className="text-sm opacity-80">Redirecting to login...</p>
                </div>
              </div>
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
                <label className="text-sm font-semibold text-brand-mint/80 ml-1">New Password</label>
                <div className="relative">
                  <Lock className="absolute left-4 top-1/2 -translate-y-1/2 text-brand-mint/40" size={18} />
                  <input
                    type="password"
                    className={`w-full bg-white/5 border ${fieldErrors.new_password || fieldErrors.password ? 'border-red-500' : 'border-white/10'} rounded-2xl py-3 pl-12 pr-4 text-white focus:outline-none transition-all input-3d`}
                    placeholder="••••••••"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    disabled={isLoading}
                  />
                </div>
                {(fieldErrors.new_password || fieldErrors.password) && (
                  <p className="text-red-500 text-[10px] font-black uppercase tracking-wider ml-1 mt-1">
                    {fieldErrors.new_password || fieldErrors.password}
                  </p>
                )}
              </div>

              <div className="space-y-1">
                <label className="text-sm font-semibold text-brand-mint/80 ml-1">Confirm New Password</label>
                <div className="relative">
                  <Lock className="absolute left-4 top-1/2 -translate-y-1/2 text-brand-mint/40" size={18} />
                  <input
                    type="password"
                    className={`w-full bg-white/5 border ${fieldErrors.confirmPassword ? 'border-red-500' : 'border-white/10'} rounded-2xl py-3 pl-12 pr-4 text-white focus:outline-none transition-all input-3d`}
                    placeholder="••••••••"
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    disabled={isLoading}
                  />
                </div>
                {fieldErrors.confirmPassword && (
                  <p className="text-red-500 text-[10px] font-black uppercase tracking-wider ml-1 mt-1">
                    {fieldErrors.confirmPassword}
                  </p>
                )}
              </div>

              <button
                type="submit"
                disabled={isLoading}
                className="w-full bg-brand-primary hover:bg-brand-success disabled:bg-brand-primary/50 text-white py-4 rounded-2xl font-bold text-lg shadow-lg transition-all active:scale-[0.98] mt-6 flex items-center justify-center gap-2 group btn-3d"
              >
                {isLoading ? (
                  <>
                    <Loader2 className="animate-spin" size={20} />
                    Updating...
                  </>
                ) : (
                  <>
                    Set New Password
                    <ArrowRight className="group-hover:translate-x-1 transition-transform" size={20} />
                  </>
                )}
              </button>
            </form>
          )}
        </div>
      </div>
    </div>
  );
};

export default ResetPasswordPage;