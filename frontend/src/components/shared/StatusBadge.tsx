type StatusBadgeProps = {
  status: 'PENDING' | 'COMPLETED' | 'FAILED'
}

const classes = {
  PENDING: 'border-amber-200 bg-amber-50 text-amber-700',
  COMPLETED: 'border-emerald-200 bg-emerald-50 text-emerald-700',
  FAILED: 'border-rose-200 bg-rose-50 text-rose-700',
}

export function StatusBadge({ status }: StatusBadgeProps) {
  return (
    <span
      className={`inline-flex rounded-full border px-2.5 py-1 text-xs font-semibold ${classes[status]}`}
    >
      {status[0] + status.slice(1).toLowerCase()}
    </span>
  )
}
