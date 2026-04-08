import { useAppSelector } from "@/hooks/reduxHook";

export const useRole = () => {
  const role = useAppSelector((state) => state.auth.user?.role);

  const isAdmin = role === "admin";
  const isUser = role === "user";

  return {
    role,
    isAdmin,
    isUser,
  };
};
