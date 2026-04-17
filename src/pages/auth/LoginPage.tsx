import { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Mail, Lock, ArrowRight, Loader2, AlertCircle } from 'lucide-react';
import api from '../../services/api';
import { ROUTES, APP_NAME } from '../../utils/constants';
import { validateEmail } from '../../utils/validators';
import { storage } from '../../utils/helpers';

const LoginPage = () => {
    const location = useLocation();
    const [formData, setFormData] = useState({
        email: '',
        password: ''
    });
    const [isLoading, setIsLoading] = useState(false);
    const [fieldErrors, setFieldErrors] = useState<Record<string, string>>({});
    const [generalError, setGeneralError] = useState<string | null>(null);
    const [successMessage, setSuccessMessage] = useState<string | null>(null);

    useEffect(() => {
        if (location.state?.message) {
            setSuccessMessage(location.state.message);
        }
    }, [location]);

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
        if (fieldErrors[name]) {
            setFieldErrors(prev => {
                const newErrors = { ...prev };
                delete newErrors[name];
                return newErrors;
            });
        }
        if (generalError) setGeneralError(null);
    };

    const handleLogin = async (e: React.FormEvent) => {
        e.preventDefault();

        const errors: Record<string, string> = {};
        if (!validateEmail(formData.email)) {
            errors.email = "Please enter a valid email address.";
        }
        if (!formData.password) {
            errors.password = "Password is required.";
        }

        if (Object.keys(errors).length > 0) {
            setFieldErrors(errors);
            return;
        }

        setIsLoading(true);
        setGeneralError(null);
        setFieldErrors({});

        try {
            const { data } = await api.post('/accounts/login/', {
                email: formData.email,
                password: formData.password,
            });

            const token = data.access || data.token || data.key;
            const refresh = data.refresh;

            if (token) storage.set('access_token', token);
            if (refresh) storage.set('refresh_token', refresh);

            window.location.href = ROUTES.HOME;
        } catch (error: any) {
            console.error("Login Error:", error);
            const errorData = error.response?.data;

            if (error.response?.status === 401 || error.response?.status === 400) {
                if (typeof errorData === 'object' && !errorData.detail && !errorData.non_field_errors) {
                    setFieldErrors(errorData);
                } else {
                    setGeneralError(
                        errorData?.detail ||
                        errorData?.non_field_errors?.[0] ||
                        "Invalid email or password. Please try again."
                    );
                }
            } else {
                setGeneralError("An unexpected error occurred. Please try again later.");
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
                <Link
                    to={ROUTES.CREATE_PROJECT}
                    className="bg-brand-primary hover:bg-brand-success text-white px-5 py-2 rounded-full font-bold text-sm shadow-lg transition-all active:scale-95 btn-3d"
                >
                    Start a fundraiser
                </Link>
            </header>

            <div className="flex-grow flex items-center justify-center p-4">
                <div className="w-full max-w-md glass-shine rounded-[2.5rem] p-6 md:p-10 shadow-2xl relative z-10 transition-all duration-500">
                    <div className="text-center mb-6 md:mb-8">
                        <h1 className="text-3xl md:text-4xl font-bold text-white mb-1.5 tracking-tight">
                            Welcome Back
                        </h1>
                        <p className="text-brand-mint/60 text-sm">Enter your details to access your account</p>
                    </div>

                    {successMessage && !generalError && (
                        <div className="mb-6 p-4 bg-brand-success/10 border border-brand-success/20 rounded-2xl flex items-center gap-3 text-brand-success text-sm font-medium animate-in fade-in slide-in-from-top-2">
                            <div className="w-2 h-2 rounded-full bg-brand-success pulse-custom" />
                            {successMessage}
                        </div>
                    )}

                    {generalError && (
                        <div className="mb-6 p-4 bg-danger/10 border border-danger/20 rounded-2xl flex items-center gap-3 text-danger text-sm font-medium animate-in fade-in slide-in-from-top-2">
                            <AlertCircle size={18} />
                            {generalError}
                        </div>
                    )}

                    <form onSubmit={handleLogin} className="space-y-4">
                        <div className="space-y-1">
                            <label className="text-sm font-semibold text-brand-mint/80 ml-1">Email Address</label>
                            <div className="relative">
                                <Mail className="absolute left-4 top-1/2 -translate-y-1/2 text-brand-mint/40" size={18} />
                                <input
                                    name="email"
                                    type="email"
                                    className={`w-full bg-white/5 border ${fieldErrors.email ? 'border-red-500' : 'border-white/10'} rounded-2xl py-3 pl-12 pr-4 text-white focus:outline-none transition-all input-3d`}
                                    placeholder="name@example.com"
                                    value={formData.email}
                                    onChange={handleChange}
                                    disabled={isLoading}
                                />
                            </div>
                            {fieldErrors.email && <p className="text-red-500 text-[10px] font-black uppercase tracking-wider ml-1 mt-1">{fieldErrors.email}</p>}
                        </div>

                        <div className="space-y-1">
                            <div className="flex justify-between items-center ml-1">
                                <label className="text-sm font-semibold text-brand-mint/80">Password</label>
                                <Link to={ROUTES.FORGOT_PASSWORD} className="text-xs font-bold text-brand-primary hover:text-brand-mint transition-colors">
                                    Forgot?
                                </Link>
                            </div>
                            <div className="relative">
                                <Lock className="absolute left-4 top-1/2 -translate-y-1/2 text-brand-mint/40" size={18} />
                                <input
                                    name="password"
                                    type="password"
                                    className={`w-full bg-white/5 border ${fieldErrors.password ? 'border-red-500' : 'border-white/10'} rounded-2xl py-3 pl-12 pr-4 text-white focus:outline-none transition-all input-3d`}
                                    placeholder="••••••••"
                                    value={formData.password}
                                    onChange={handleChange}
                                    disabled={isLoading}
                                />
                            </div>
                            {fieldErrors.password && <p className="text-red-500 text-[10px] font-black uppercase tracking-wider ml-1 mt-1">{fieldErrors.password}</p>}
                        </div>

                        <button
                            type="submit"
                            disabled={isLoading}
                            className="w-full bg-brand-primary hover:bg-brand-success disabled:bg-brand-primary/50 text-white py-4 rounded-2xl font-bold text-lg shadow-lg transition-all active:scale-[0.98] mt-4 flex items-center justify-center gap-2 group btn-3d"
                        >
                            {isLoading ? (
                                <>
                                    <Loader2 className="animate-spin" size={20} />
                                    Verifying...
                                </>
                            ) : (
                                <>
                                    Sign In
                                    <ArrowRight className="group-hover:translate-x-1 transition-transform" size={20} />
                                </>
                            )}
                        </button>
                    </form>

                    <div className="mt-6">
                        <div className="relative flex items-center mb-4">
                            <div className="flex-grow border-t border-white/10"></div>
                            <span className="mx-4 text-xs font-bold text-brand-mint/30 uppercase tracking-widest">Or continue with</span>
                            <div className="flex-grow border-t border-white/10"></div>
                        </div>
                    </div>

                    <p className="text-center mt-6 text-brand-mint/60 text-sm">
                        Don't have an account?{' '}
                        <Link to={ROUTES.REGISTER} className="text-brand-primary font-bold hover:text-brand-mint transition-colors underline decoration-brand-primary/30 underline-offset-4">
                            Create account
                        </Link>
                    </p>

                    <div className="mt-8 pt-6 border-t border-white/5 flex flex-wrap justify-center gap-x-8 gap-y-2">
                        <Link to="#" className="text-[10px] font-bold text-brand-mint/30 hover:text-brand-primary transition-colors cursor-pointer">ABOUT US</Link>
                        <Link to="#" className="text-[10px] font-bold text-brand-mint/30 hover:text-brand-primary transition-colors cursor-pointer">TERMS</Link>
                        <Link to="#" className="text-[10px] font-bold text-brand-mint/30 hover:text-brand-primary transition-colors cursor-pointer">PRIVACY</Link>
                    </div>
                    <p className="text-center mt-3 text-[9px] text-white/15 font-medium uppercase tracking-[0.2em]">
                        © 2026 FUNDEGYPT. INSTITUTIONAL STABILITY. MODERN EFFICIENCY.
                    </p>
                </div>
            </div>
        </div>
    );
};

export default LoginPage;