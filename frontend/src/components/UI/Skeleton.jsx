const Skeleton = ({ className = '', height, width, circle }) => {
  return (
    <div
      className={`animate-pulse rounded-xl ${className}`}
      style={{
        height: height || '1rem',
        width: width || '100%',
        borderRadius: circle ? '9999px' : '0.75rem',
        background: 'linear-gradient(90deg, rgba(255,255,255,0.03) 0%, rgba(255,255,255,0.06) 50%, rgba(255,255,255,0.03) 100%)',
        backgroundSize: '200% 100%',
        animation: 'pulse 2s cubic-bezier(0.4, 0, 0.6, 1) infinite, shimmer 2s linear infinite'
      }}
    />
  );
};

export const CardSkeleton = () => (
  <div className="glass-card-static p-6 space-y-4">
    <div className="flex justify-between">
      <Skeleton width="40px" height="40px" circle />
      <Skeleton width="60px" height="24px" />
    </div>
    <Skeleton width="80%" height="24px" />
    <Skeleton width="100%" height="48px" />
    <div className="pt-4 border-t border-white/5 flex justify-between">
      <Skeleton width="100px" height="16px" />
      <Skeleton width="16px" height="16px" circle />
    </div>
  </div>
);

export default Skeleton;
