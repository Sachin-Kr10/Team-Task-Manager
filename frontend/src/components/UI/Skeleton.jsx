const Skeleton = ({ className, height, width, circle }) => {
  return (
    <div
      className={`animate-pulse bg-white/5 rounded-lg ${className}`}
      style={{
        height: height || '1rem',
        width: width || '100%',
        borderRadius: circle ? '9999px' : '0.75rem'
      }}
    />
  );
};

export const CardSkeleton = () => (
  <div className="glass-card p-6 space-y-4">
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
