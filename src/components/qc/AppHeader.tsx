type AppHeaderProps = {
  title: string;
  userId: string;
  userName: string;
};

export default function AppHeader({ title, userId, userName }: AppHeaderProps) {
  return (
    <div className="hdr">
      <div className="hdr-sep">
        <div className="hdr-ham">
          <span />
          <span />
          <span />
        </div>
        <div className="hdr-ml">menu</div>
      </div>
      <div className="hdr-title">{title}</div>
      <div className="hdr-user">
        <div>ID　：{userId}</div>
        <div>名前：{userName}</div>
      </div>
    </div>
  );
}
