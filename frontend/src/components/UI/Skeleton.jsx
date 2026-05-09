const Skeleton = ({
  className = '',
  height,
  width,
  circle = false
}) => {
  return (
    <div
      className={`relative overflow-hidden bg-white/[0.04] ${className} ${
        circle ? 'rounded-full' : 'rounded-2xl'
      }`}
      style={{
        height: height || '1rem',
        width: width || '100%'
      }}
    >
      {/* Base Glow */}
      <div className="absolute inset-0 bg-gradient-to-r from-white/[0.02] via-white/[0.06] to-white/[0.02]" />

      {/* Shimmer */}
      <div className="absolute inset-0 -translate-x-full animate-[shimmer_2s_linear_infinite] bg-gradient-to-r from-transparent via-white/[0.08] to-transparent" />

      {/* Blue Accent Glow */}
      <div className="absolute left-0 top-0 h-full w-1/3 bg-blue-500/[0.03] blur-xl" />
    </div>
  )
}

export const CardSkeleton = () => (
  <div className="group relative overflow-hidden rounded-[28px] border border-white/10 bg-[rgba(15,23,42,0.68)] p-6 backdrop-blur-2xl shadow-[0_10px_40px_rgba(0,0,0,0.35)]">
    {/* Background Glow */}
    <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_top,rgba(59,130,246,0.10),transparent_35%),radial-gradient(circle_at_bottom_right,rgba(168,85,247,0.08),transparent_30%)]" />

    {/* Grid */}
    <div className="pointer-events-none absolute inset-0 opacity-[0.03] [background-image:linear-gradient(rgba(255,255,255,0.10)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.10)_1px,transparent_1px)] [background-size:50px_50px]" />

    <div className="relative space-y-5">
      {/* Top */}
      <div className="flex items-start justify-between">
        <div className="flex items-center gap-4">
          <Skeleton
            width="56px"
            height="56px"
            circle
          />

          <div className="space-y-2">
            <Skeleton
              width="140px"
              height="16px"
            />

            <Skeleton
              width="90px"
              height="12px"
            />
          </div>
        </div>

        <Skeleton
          width="70px"
          height="28px"
          className="rounded-full"
        />
      </div>

      {/* Title */}
      <div className="space-y-3">
        <Skeleton
          width="85%"
          height="24px"
        />

        <Skeleton
          width="65%"
          height="18px"
        />
      </div>

      {/* Content */}
      <div className="space-y-2">
        <Skeleton
          width="100%"
          height="14px"
        />

        <Skeleton
          width="92%"
          height="14px"
        />

        <Skeleton
          width="70%"
          height="14px"
        />
      </div>

      {/* Progress */}
      <div className="space-y-3 pt-2">
        <div className="flex items-center justify-between">
          <Skeleton
            width="100px"
            height="14px"
          />

          <Skeleton
            width="40px"
            height="14px"
          />
        </div>

        <Skeleton
          width="100%"
          height="10px"
          className="rounded-full"
        />
      </div>

      {/* Footer */}
      <div className="flex items-center justify-between border-t border-white/6 pt-5">
        <div className="flex items-center gap-3">
          <Skeleton
            width="36px"
            height="36px"
            circle
          />

          <div className="space-y-2">
            <Skeleton
              width="80px"
              height="12px"
            />

            <Skeleton
              width="60px"
              height="10px"
            />
          </div>
        </div>

        <Skeleton
          width="36px"
          height="36px"
          circle
        />
      </div>
    </div>
  </div>
)

export default Skeleton