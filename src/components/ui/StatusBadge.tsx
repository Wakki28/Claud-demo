// ステータスバッジコンポーネント
type BadgeVariant = 'success' | 'warning' | 'danger' | 'info' | 'default';

type StatusBadgeProps = {
  label: string;
  variant: BadgeVariant;
};

const variantStyles: Record<BadgeVariant, string> = {
  success: 'bg-green-100 text-green-800 border border-green-200',
  warning: 'bg-yellow-100 text-yellow-800 border border-yellow-200',
  danger:  'bg-red-100 text-red-800 border border-red-200',
  info:    'bg-blue-100 text-blue-800 border border-blue-200',
  default: 'bg-gray-100 text-gray-700 border border-gray-200',
};

export default function StatusBadge({ label, variant }: StatusBadgeProps) {
  return (
    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${variantStyles[variant]}`}>
      {label}
    </span>
  );
}
