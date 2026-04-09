export const formatDateTime = (date: string) => {
  return new Date(date).toLocaleString("en-BD", {
    timeZone: "Asia/Dhaka", // ✅ Bangladesh time
    year: "numeric",
    month: "short",
    day: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });
};
