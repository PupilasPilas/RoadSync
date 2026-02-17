export default function ProgressBar({ progress, color, height = 8, showLabel = false }) {
  const barColor = color || (progress >= 80 ? 'var(--status-ok)' : progress >= 50 ? 'var(--status-pending)' : 'var(--status-error)')

  return (
    <div style={{ display: 'flex', alignItems: 'center', gap: 10, width: '100%' }}>
      <div
        style={{
          flex: 1,
          height,
          borderRadius: height / 2,
          background: 'var(--border)',
          overflow: 'hidden',
        }}
      >
        <div
          style={{
            width: `${progress}%`,
            height: '100%',
            borderRadius: height / 2,
            background: barColor,
            transition: 'width 0.6s ease-out',
          }}
        />
      </div>
      {showLabel && (
        <span style={{ fontSize: 13, fontWeight: 600, color: barColor, minWidth: 40, textAlign: 'right' }}>
          {progress}%
        </span>
      )}
    </div>
  )
}
