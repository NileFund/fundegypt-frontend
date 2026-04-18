import { useState, useEffect } from 'react';
import { Star } from 'lucide-react';
import {
  getRatingSummary,
  getProjectRatings,
  createRating,
  updateRating,
} from '../../services/ratingService';

interface RatingUser {
  email: string;
  fullName: string;
  profilePicture: string | null;
}

interface Rating {
  id: number;
  user: RatingUser;
  value: number;
  createdAt: string;
}

interface RatingSummary {
  projectId: number;
  averageRating: number;
  totalRatings: number;
  distribution: Record<string, number>;
}

interface Props {
  projectId: number;
  isOwner: boolean;
  isAuthenticated: boolean;
}

function StarRow({
  value,
  interactive = false,
  onChange,
  size = 20,
}: {
  value: number;
  interactive?: boolean;
  onChange?: (v: number) => void;
  size?: number;
}) {
  const [hovered, setHovered] = useState(0);

  return (
    <div className="flex gap-1">
      {[1, 2, 3, 4, 5].map((star) => (
        <button
          key={star}
          type="button"
          disabled={!interactive}
          onClick={() => onChange?.(star)}
          onMouseEnter={() => interactive && setHovered(star)}
          onMouseLeave={() => interactive && setHovered(0)}
          className={`transition-all duration-150 ${interactive ? 'cursor-pointer hover:scale-110' : 'cursor-default'}`}
          aria-label={interactive ? `Rate ${star} stars` : undefined}
        >
          <Star
            size={size}
            className="transition-colors duration-150"
            fill={(hovered || value) >= star ? '#F6AD55' : 'transparent'}
            color={(hovered || value) >= star ? '#F6AD55' : '#CBD5E0'}
          />
        </button>
      ))}
    </div>
  );
}

function DistributionBar({ label, count, total }: { label: string; count: number; total: number }) {
  const pct = total > 0 ? Math.round((count / total) * 100) : 0;
  return (
    <div className="flex items-center gap-3">
      <span className="text-xs text-[#4A5568] w-6 text-right font-medium">{label}</span>
      <Star size={12} fill="#F6AD55" color="#F6AD55" />
      <div className="flex-1 bg-[#EEEEEE] rounded-full h-2 overflow-hidden">
        <div
          className="h-full bg-[#F6AD55] rounded-full transition-all duration-700 ease-out"
          style={{ width: `${pct}%` }}
        />
      </div>
      <span className="text-xs text-[#A0AEC0] w-6">{count}</span>
    </div>
  );
}

function formatDate(iso: string): string {
  try {
    const d = new Date(iso);
    if (isNaN(d.getTime())) return '—';
    return d.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
  } catch {
    return '—';
  }
}

function getInitial(user: RatingUser): string {
  if (user?.fullName?.trim()) return user.fullName.trim().charAt(0).toUpperCase();
  if (user?.email) return user.email.charAt(0).toUpperCase();
  return '?';
}

function getDisplayName(user: RatingUser): string {
  if (user?.fullName?.trim()) return user.fullName.trim();
  if (user?.email) return user.email;
  return 'Anonymous';
}

export default function RatingSection({ projectId, isOwner, isAuthenticated }: Props) {
  const [summary, setSummary] = useState<RatingSummary | null>(null);
  const [ratings, setRatings] = useState<Rating[]>([]);
  const [loadState, setLoadState] = useState<'loading' | 'success' | 'error'>('loading');
  const [selectedStar, setSelectedStar] = useState(0);
  const [submitState, setSubmitState] = useState<'idle' | 'loading' | 'success'>('idle');
  const [submitError, setSubmitError] = useState('');
  const [hasRated, setHasRated] = useState(false);
  const [isUpdating, setIsUpdating] = useState(false);
  const [showAll, setShowAll] = useState(false);

  const fetchData = async (silent = false) => {
    try {
      if (!silent) setLoadState('loading');
      const [s, r] = await Promise.all([
        getRatingSummary(projectId),
        getProjectRatings(projectId),
      ]);
      setSummary(s as unknown as RatingSummary);
      setRatings(r.results as unknown as Rating[]);
      setLoadState('success');
    } catch {
      if (!silent) setLoadState('error');
    }
  };

  useEffect(() => {
    fetchData();
  }, [projectId]);

  const handleSubmit = async () => {
    if (!selectedStar) { setSubmitError('Please select a star rating.'); return; }
    setSubmitState('loading');
    setSubmitError('');
    try {
      if (hasRated) {
        await updateRating(projectId, selectedStar);
      } else {
        await createRating(projectId, selectedStar);
      }
      setHasRated(true);
      setIsUpdating(false);
      setSubmitState('success');
      setSelectedStar(0);
      await fetchData(true);
    } catch (e: any) {
      const data = e?.response?.data;
      const msg =
        data?.details?.non_field_errors?.[0] ||
        data?.message ||
        data?.detail ||
        'Failed to submit rating.';
      if (msg.toLowerCase().includes('already rated')) {
        setHasRated(true);
        setSubmitError('You already rated this. Click "Update My Rating" to change it.');
      } else {
        setSubmitError(msg);
      }
      setSubmitState('idle');
    }
  };

  const handleUpdateClick = () => {
    setIsUpdating(true);
    setSubmitState('idle');
    setSubmitError('');
    setSelectedStar(0);
  };

  if (loadState === 'loading') {
    return (
      <div className="bg-white rounded-xl border border-gray-100 shadow-sm p-8 animate-pulse">
        <div className="h-6 bg-[#EEEEEE] rounded w-1/3 mb-6" />
        <div className="flex gap-6">
          <div className="h-24 w-24 bg-[#EEEEEE] rounded-2xl" />
          <div className="flex-1 space-y-3 pt-2">
            {[5, 4, 3, 2, 1].map(n => <div key={n} className="h-2 bg-[#EEEEEE] rounded-full" />)}
          </div>
        </div>
      </div>
    );
  }

  if (loadState === 'error' || !summary) return null;

  const visibleRatings = showAll ? ratings : ratings.slice(0, 3);
  const showRateForm = !isOwner && isAuthenticated && (!hasRated || isUpdating);
  const showSuccess = submitState === 'success';
  const showUpdateBtn = !isOwner && isAuthenticated && hasRated && !isUpdating && !showSuccess;

  return (
    <div className="bg-white rounded-xl border border-gray-100 shadow-sm p-8 space-y-7">
      <h3 className="text-xl font-semibold text-[#1F6F5F]">Community Rating</h3>

      {/* Summary */}
      <div className="flex items-start gap-8">
        <div className="flex flex-col items-center justify-center bg-[#D1F2EB] rounded-2xl px-6 py-5 min-w-[110px] gap-2">
          <span className="text-5xl font-bold text-[#2FA084] leading-none">
            {(summary.averageRating ?? 0).toFixed(1)}
          </span>
          <StarRow value={Math.round(summary.averageRating ?? 0)} size={16} />
          <span className="text-xs text-[#4A5568]">
            {summary.totalRatings} rating{summary.totalRatings !== 1 ? 's' : ''}
          </span>
        </div>

        <div className="flex-1 space-y-2 pt-1">
          {[5, 4, 3, 2, 1].map((star) => (
            <DistributionBar
              key={star}
              label={String(star)}
              count={summary.distribution[String(star)] ?? 0}
              total={summary.totalRatings}
            />
          ))}
        </div>
      </div>

      {/* Not authenticated */}
      {!isAuthenticated && (
        <div className="border-t border-[#EEEEEE] pt-5">
          <p className="text-sm text-[#4A5568]">
            <a href="/login" className="text-[#2FA084] font-semibold hover:underline">Log in</a> to rate this project.
          </p>
        </div>
      )}

      {/* Owner */}
      {isOwner && (
        <div className="border-t border-[#EEEEEE] pt-5">
          <p className="text-sm text-[#A0AEC0]">You cannot rate your own project.</p>
        </div>
      )}

      {/* Success message */}
      {showSuccess && (
        <div className="border-t border-[#EEEEEE] pt-5 space-y-3">
          <div className="flex items-center gap-2 bg-[#D1F2EB] text-[#1F6F5F] px-4 py-3 rounded-lg text-sm font-medium">
            <Star size={16} fill="#2FA084" color="#2FA084" />
            {isUpdating ? 'Rating updated successfully!' : 'Thank you! Your rating has been submitted.'}
          </div>
          <button
            onClick={handleUpdateClick}
            className="text-sm text-[#2FA084] hover:text-[#1F6F5F] font-medium transition-colors underline underline-offset-2"
          >
            Change your rating
          </button>
        </div>
      )}

      {/* Update button */}
      {showUpdateBtn && (
        <div className="border-t border-[#EEEEEE] pt-5">
          <p className="text-sm text-[#4A5568] mb-3">You've already rated this project.</p>
          <button
            onClick={handleUpdateClick}
            className="px-5 py-2 border border-[#2FA084] text-[#2FA084] hover:bg-[#D1F2EB] text-sm font-semibold rounded-lg transition-colors duration-200"
          >
            Update My Rating
          </button>
        </div>
      )}

      {/* Rate / Update form */}
      {showRateForm && (
        <div className="border-t border-[#EEEEEE] pt-5">
          <p className="text-sm font-semibold text-[#1F6F5F] mb-3">
            {hasRated ? 'Update your rating' : 'Rate this project'}
          </p>
          <div className="flex items-center gap-4 flex-wrap">
            <StarRow value={selectedStar} interactive onChange={setSelectedStar} size={28} />
            <button
              onClick={handleSubmit}
              disabled={submitState === 'loading' || !selectedStar}
              className="px-5 py-2 bg-[#2FA084] hover:bg-[#1F6F5F] disabled:opacity-50 disabled:cursor-not-allowed text-white text-sm font-semibold rounded-lg transition-colors duration-200 flex items-center gap-2"
            >
              {submitState === 'loading' ? (
                <>
                  <span className="w-3 h-3 border-2 border-white border-t-transparent rounded-full animate-spin" />
                  Submitting…
                </>
              ) : (
                hasRated ? 'Update Rating' : 'Submit Rating'
              )}
            </button>
            {isUpdating && (
              <button
                onClick={() => { setIsUpdating(false); setSubmitError(''); }}
                className="text-sm text-[#A0AEC0] hover:text-[#4A5568] transition-colors"
              >
                Cancel
              </button>
            )}
          </div>
          {submitError && <p className="text-xs text-[#E53E3E] mt-2">{submitError}</p>}
        </div>
      )}

      {/* Recent ratings list */}
      {ratings.length > 0 && (
        <div className="border-t border-[#EEEEEE] pt-6 space-y-4">
          <p className="text-sm font-semibold text-[#1F6F5F]">Recent Ratings</p>
          {visibleRatings.map((r) => (
            <div key={r.id} className="flex items-center gap-3">
              <div className="w-9 h-9 rounded-full bg-[#D1F2EB] flex items-center justify-center shrink-0 overflow-hidden">
                {r.user?.profilePicture ? (
                  <img
                    src={r.user.profilePicture}
                    alt={getDisplayName(r.user)}
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <span className="text-sm font-bold text-[#2FA084]">{getInitial(r.user)}</span>
                )}
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-semibold text-[#1F6F5F] truncate">{getDisplayName(r.user)}</p>
                <p className="text-xs text-[#A0AEC0]">{formatDate(r.createdAt)}</p>
              </div>
              <StarRow value={r.value} size={16} />
            </div>
          ))}
          {ratings.length > 3 && (
            <button
              onClick={() => setShowAll(v => !v)}
              className="text-sm text-[#2FA084] hover:text-[#1F6F5F] font-medium transition-colors"
            >
              {showAll ? 'Show less' : `Show all ${ratings.length} ratings`}
            </button>
          )}
        </div>
      )}

      {ratings.length === 0 && (
        <div className="border-t border-[#EEEEEE] pt-5">
          <p className="text-sm text-[#A0AEC0] text-center py-4">No ratings yet. Be the first to rate!</p>
        </div>
      )}
    </div>
  );
}