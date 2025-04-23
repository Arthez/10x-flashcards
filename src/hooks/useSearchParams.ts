import { useEffect, useState } from "react";

export function useSearchParams() {
  const [searchParams, setSearchParams] = useState<URLSearchParams>(() => {
    if (typeof window !== "undefined") {
      return new URLSearchParams(window.location.search);
    }
    return new URLSearchParams();
  });

  useEffect(() => {
    // Update search params on mount to ensure we have the latest values
    setSearchParams(new URLSearchParams(window.location.search));

    function handlePopState() {
      setSearchParams(new URLSearchParams(window.location.search));
    }

    window.addEventListener("popstate", handlePopState);
    return () => window.removeEventListener("popstate", handlePopState);
  }, []);

  return searchParams;
}
