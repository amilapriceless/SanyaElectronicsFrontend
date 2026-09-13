export function PostHeader({ avatar, username, date }) {
  return (
    <div className="post-header">
      <img src={avatar} alt={username} className="avatar" />
      <div className="user-info">
        <span className="username">{username}</span>
        <span className="date">{date}</span>
      </div>
    </div>
  );
}