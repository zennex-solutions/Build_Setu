export const formatMessageTime = (timestamp: number | string) => {
  if (!timestamp) return "";

  const date =
    typeof timestamp === "number"
      ? new Date(timestamp)
      : new Date(Date.parse(timestamp));

  if (isNaN(date.getTime())) return "";

  const now = new Date();
  const diff = Math.floor((now.getTime() - date.getTime()) / 1000);

  if (diff < 5) return "Just now";
  if (diff < 60) return `${diff} sec ago`;

  const minutes = Math.floor(diff / 60);
  if (minutes < 60) return `${minutes} min ago`;

  const hours = Math.floor(minutes / 60);
  if (hours < 24) return `${hours} hr ago`;

  const days = Math.floor(hours / 24);
  if (days === 1) return "Yesterday";
  if (days < 7) return `${days} days ago`;

  return (
    date.toLocaleDateString() +
    " " +
    date.toLocaleTimeString([], {
      hour: "2-digit",
      minute: "2-digit",
    })
  );
};
