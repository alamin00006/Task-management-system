"use client";

import { usePathname, useRouter, useSearchParams, useParams } from "next/navigation";

/**
 * Next router helpers to replace common react-router-dom hooks.
 */
export function useNavigate() {
  const router = useRouter();
  return (to: string) => router.push(to);
}

export function useLocation() {
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const search = searchParams?.toString();
  return {
    pathname,
    search: search ? `?${search}` : "",
    hash: "",
    state: null,
  } as const;
}

export function useRRParams<T extends Record<string, string | string[]>>() {
  return useParams() as unknown as T;
}

export function useSearch() {
  const sp = useSearchParams();
  return sp;
}
