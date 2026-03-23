type EmptyStateProps = {
  icon: string;
  title: string;
  description: string;
};

export default function EmptyState({ icon, title, description }: EmptyStateProps) {
  return (
    <div className="empty">
      <div className="empty-ico">{icon}</div>
      <div className="empty-ttl">{title}</div>
      <div className="empty-dsc">{description}</div>
    </div>
  );
}
