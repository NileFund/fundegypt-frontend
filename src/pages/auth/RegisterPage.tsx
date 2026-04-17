import { useState, useRef } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import {
  Camera,
  ShieldCheck,
  Building2,
  Loader2,
  AlertCircle
} from 'lucide-react';
import { ROUTES, APP_NAME } from '../../utils/constants';
import api from '../../services/api';
import { validateEmail, validatePassword, validateEgyptPhone } from '../../utils/validators';

const RegisterPage = () => {
  const navigate = useNavigate();
  const fileInputRef = useRef<HTMLInputElement>(null);

  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    phone: '',
    password: '',
    confirmPassword: ''
  });

  const [image, setImage] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [fieldErrors, setFieldErrors] = useState<Record<string, string>>({});
  const [generalError, setGeneralError] = useState<string | null>(null);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });

    if (fieldErrors[name]) {
      setFieldErrors(prev => {
        const newErrors = { ...prev };
        delete newErrors[name];
        return newErrors;
      });
    }
  };

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setImage(file);
      const reader = new FileReader();
      reader.onloadend = () => {
        setImagePreview(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const triggerFileInput = () => {
    fileInputRef.current?.click();
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const errors: Record<string, string> = {};

    if (formData.password !== formData.confirmPassword) {
      errors.confirmPassword = "Passwords do not match.";
    }

    if (!validateEmail(formData.email)) {
      errors.email = "Please enter a valid email address.";
    }

    const pwdCheck = validatePassword(formData.password);
    if (!pwdCheck.isValid) {
      errors.password = pwdCheck.message || "Invalid password.";
    }

    if (!validateEgyptPhone(formData.phone)) {
      errors.phone = "Please enter a valid Egyptian phone number.";
    }

    if (!formData.firstName.trim()) errors.firstName = "First name is required.";
    if (!formData.lastName.trim()) errors.lastName = "Last name is required.";

    if (Object.keys(errors).length > 0) {
      setFieldErrors(errors);
      return;
    }

    setIsLoading(true);
    setGeneralError(null);
    setFieldErrors({});

    try {
      const data = new FormData();
      data.append('email', formData.email);
      data.append('first_name', formData.firstName);
      data.append('last_name', formData.lastName);
      data.append('phone', formData.phone);
      data.append('password', formData.password);
      data.append('confirm_password', formData.confirmPassword);

      if (image) {
        data.append('profile_picture', image);
      }

      await api.post('/accounts/register/', data, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });

      navigate(ROUTES.LOGIN, {
        state: { message: "Account created! Please check your email and click the activation link to complete your registration." }
      });
    } catch (error) {
      console.error("DEBUG: Registration failed:", error);
      const errorData = error.response?.data;

      if (errorData && typeof errorData === 'object') {
        const mappedErrors: Record<string, string> = {};
        Object.keys(errorData).forEach(key => {
          let fieldName = key;
          if (key === 'first_name') fieldName = 'firstName';
          else if (key === 'last_name') fieldName = 'lastName';
          else if (key === 'username') fieldName = 'email';

          mappedErrors[fieldName] = Array.isArray(errorData[key]) ? errorData[key][0] : errorData[key];
        });
        setFieldErrors(mappedErrors);
      } else {
        setGeneralError("Registration failed. Please try again.");
      }
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-surface-page flex flex-col relative overflow-hidden">
      <div className="absolute top-[-10%] right-[-10%] w-[500px] h-[500px] bg-brand-primary/5 rounded-full blur-[120px] pointer-events-none"></div>

      <header className="w-full px-6 md:px-12 py-6 flex justify-between items-center z-10">
        <Link
          to={ROUTES.HOME}
          className="text-2xl font-black tracking-tighter text-brand-secondary hover:scale-105 transition-transform duration-300"
        >
          {APP_NAME}
        </Link>
        <Link
          to={ROUTES.LOGIN}
          className="text-sm font-bold text-brand-secondary hover:text-brand-primary transition-colors flex items-center gap-2"
        >
          Already have an account? <span className="underline underline-offset-4">Log in</span>
        </Link>
      </header>

      <div className="flex-grow flex items-center justify-center p-4">
        <div className="w-full max-w-4xl glass-shine rounded-[2.5rem] shadow-2xl flex flex-col md:flex-row overflow-hidden relative z-10 transition-all duration-500">

          <div className="md:w-[40%] bg-[#0a2d26] p-8 md:p-10 flex flex-col justify-between relative overflow-hidden shrink-0">
            <div className="absolute top-[-10%] left-[-10%] w-64 h-64 bg-white/5 rounded-full blur-3xl"></div>
            <div className="absolute bottom-[-5%] right-[-5%] w-48 h-48 bg-brand-primary/20 rounded-full blur-2xl"></div>

            <div className="relative z-10">
              <h2 className="text-2xl font-black tracking-tighter text-white mb-6">{APP_NAME}</h2>
              <p className="text-white/80 text-sm font-medium leading-relaxed">
                Join the movement of institutional stability and modern efficiency. Support the future of Egypt today.
              </p>
            </div>

            <div className="relative z-10 mt-12 space-y-5">
              <div className="flex items-center gap-3 text-white/90">
                <div className="w-8 h-8 rounded-lg bg-white/10 flex items-center justify-center border border-white/10 shrink-0">
                  <ShieldCheck size={16} />
                </div>
                <span className="text-xs font-bold tracking-tight">Secure Transactions</span>
              </div>
              <div className="flex items-center gap-3 text-white/90">
                <div className="w-8 h-8 rounded-lg bg-white/10 flex items-center justify-center border border-white/10 shrink-0">
                  <Building2 size={16} />
                </div>
                <span className="text-xs font-bold tracking-tight">Institutional Trust</span>
              </div>
            </div>
          </div>

          {/* Form Section */}
          <div className="flex-grow p-6 md:p-8 bg-[#EEEEEE]">
            <div className="mb-4">
              <h1 className="text-xl md:text-2xl font-bold text-brand-secondary tracking-tight">Create Account</h1>
              <p className="text-text-body/80 text-[10px] font-bold mt-0.5 tracking-wide">Enter your details to register as a fundraiser.</p>
            </div>

            {generalError && (
              <div className="mb-4 bg-red-500/10 border border-red-500/20 text-red-600 px-4 py-2 rounded-xl flex items-center gap-3 animate-shake">
                <AlertCircle size={18} className="shrink-0" />
                <p className="text-[10px] font-bold">{generalError}</p>
              </div>
            )}

            <div className="flex flex-col items-center mb-6 group">
              <input
                type="file"
                ref={fileInputRef}
                onChange={handleImageChange}
                accept="image/*"
                className="hidden"
              />
              <div className="relative cursor-pointer" onClick={triggerFileInput}>
                <div className="w-20 h-20 rounded-full bg-white border-2 border-dashed border-text-muted/50 flex items-center justify-center group-hover:border-brand-primary transition-all shadow-sm overflow-hidden relative">
                  {imagePreview ? (
                    <img src={imagePreview} alt="Preview" className="w-full h-full object-cover" />
                  ) : (
                    <Camera className="text-text-muted group-hover:text-brand-primary transition-colors" size={28} />
                  )}
                </div>
                <div className="absolute bottom-0 right-1 w-6 h-6 rounded-full bg-brand-primary text-white flex items-center justify-center shadow-lg border-2 border-white ring-4 ring-[#EEEEEE]">
                  <span className="text-lg font-bold leading-none">+</span>
                </div>
              </div>
              <p className="text-[9px] font-black text-brand-secondary uppercase tracking-widest mt-2">Upload Profile Image</p>
            </div>

            <form onSubmit={handleSubmit} className="space-y-2.5">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                <div className="space-y-0.5">
                  <label className="text-[9px] font-black text-brand-secondary uppercase tracking-wide ml-1">First Name</label>
                  <input
                    name="firstName"
                    type="text"
                    placeholder="Alaa"
                    className={`w-full bg-white border ${fieldErrors.firstName ? 'border-red-500' : 'border-black/10'} rounded-xl py-2.5 px-4 text-text-body focus:outline-none focus:border-brand-primary/50 transition-all font-bold placeholder:text-text-body/30 text-sm`}
                    onChange={handleChange}
                    value={formData.firstName}
                  />
                  {fieldErrors.firstName && <p className="text-red-500 text-[8px] font-black uppercase tracking-wider ml-1 mt-0.5">{fieldErrors.firstName}</p>}
                </div>
                <div className="space-y-0.5">
                  <label className="text-[9px] font-black text-brand-secondary uppercase tracking-wide ml-1">Last Name</label>
                  <input
                    name="lastName"
                    type="text"
                    placeholder="Salem"
                    className={`w-full bg-white border ${fieldErrors.lastName ? 'border-red-500' : 'border-black/10'} rounded-xl py-2.5 px-4 text-text-body focus:outline-none focus:border-brand-primary/50 transition-all font-bold placeholder:text-text-body/30 text-sm`}
                    onChange={handleChange}
                    value={formData.lastName}
                  />
                  {fieldErrors.lastName && <p className="text-red-500 text-[8px] font-black uppercase tracking-wider ml-1 mt-0.5">{fieldErrors.lastName}</p>}
                </div>
              </div>

              <div className="space-y-0.5">
                <label className="text-[9px] font-black text-brand-secondary uppercase tracking-wide ml-1">Email Address</label>
                <input
                  name="email"
                  type="email"
                  placeholder="alaa.salem@example.com"
                  className={`w-full bg-white border ${fieldErrors.email ? 'border-red-500' : 'border-black/10'} rounded-xl py-2.5 px-4 text-text-body focus:outline-none focus:border-brand-primary/50 transition-all font-bold placeholder:text-text-body/30 text-sm`}
                  onChange={handleChange}
                  value={formData.email}
                />
                {fieldErrors.email && <p className="text-red-500 text-[8px] font-black uppercase tracking-wider ml-1 mt-0.5">{fieldErrors.email}</p>}
              </div>

              <div className="space-y-0.5">
                <label className="text-[9px] font-black text-brand-secondary uppercase tracking-wide ml-1">Mobile Phone</label>
                <div className="relative">
                  <span className="absolute left-4 top-1/2 -translate-y-1/2 text-brand-secondary font-black text-[9px] uppercase tracking-widest pointer-events-none">EGY</span>
                  <input
                    name="phone"
                    type="tel"
                    placeholder="01X-XXXX-XXXX"
                    className={`w-full bg-white border ${fieldErrors.phone ? 'border-red-500' : 'border-black/10'} rounded-xl py-2.5 pl-12 pr-4 text-text-body focus:outline-none focus:border-brand-primary/50 transition-all font-bold tracking-wider placeholder:text-text-body/30 text-sm`}
                    onChange={handleChange}
                    value={formData.phone}
                  />
                </div>
                {fieldErrors.phone && <p className="text-red-500 text-[8px] font-black uppercase tracking-wider ml-1 mt-0.5">{fieldErrors.phone}</p>}
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                <div className="space-y-0.5">
                  <label className="text-[9px] font-black text-brand-secondary uppercase tracking-wide ml-1">Password</label>
                  <input
                    name="password"
                    type="password"
                    placeholder="••••••••"
                    className={`w-full bg-white border ${fieldErrors.password ? 'border-red-500' : 'border-black/10'} rounded-xl py-2.5 px-4 text-text-body focus:outline-none focus:border-brand-primary/50 transition-all font-bold placeholder:text-text-body/30 text-sm`}
                    onChange={handleChange}
                    value={formData.password}
                  />
                  {fieldErrors.password && <p className="text-red-500 text-[8px] font-black uppercase tracking-wider ml-1 mt-0.5">{fieldErrors.password}</p>}
                </div>
                <div className="space-y-0.5">
                  <label className="text-[9px] font-black text-brand-secondary uppercase tracking-wide ml-1">Confirm Password</label>
                  <input
                    name="confirmPassword"
                    type="password"
                    placeholder="••••••••"
                    className={`w-full bg-white border ${fieldErrors.confirmPassword ? 'border-red-500' : 'border-black/10'} rounded-xl py-2.5 px-4 text-text-body focus:outline-none focus:border-brand-primary/50 transition-all font-bold placeholder:text-text-body/30 text-sm`}
                    onChange={handleChange}
                    value={formData.confirmPassword}
                  />
                  {fieldErrors.confirmPassword && <p className="text-red-500 text-[8px] font-black uppercase tracking-wider ml-1 mt-0.5">{fieldErrors.confirmPassword}</p>}
                </div>
              </div>

              <button
                type="submit"
                disabled={isLoading}
                className="w-full bg-brand-primary hover:bg-brand-success disabled:opacity-50 disabled:cursor-not-allowed text-white py-3.5 rounded-xl font-bold text-base shadow-lg transition-all active:scale-[0.98] mt-2.5 btn-3d flex items-center justify-center gap-2"
              >
                {isLoading ? (
                  <>
                    <Loader2 className="animate-spin" size={18} />
                    Creating...
                  </>
                ) : (
                  "Create Account"
                )}
              </button>
            </form>

            <p className="text-center mt-6 text-[10px] text-text-body/60 font-black uppercase tracking-[0.2em]">
              © 2026 FUNDEGYPT. INSTITUTIONAL STABILITY.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default RegisterPage;