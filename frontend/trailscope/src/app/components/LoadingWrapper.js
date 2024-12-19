"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/router";  // Correct import for route events
import Loading from "./Loading";

export default function LoadingWrapper({ children }) {
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  useEffect(() => {
    if (!router.events) return;

    const handleStart = () => setLoading(true);
    const handleComplete = () => setLoading(false);

    router.events.on("routeChangeStart", handleStart);
    router.events.on("routeChangeComplete", handleComplete);
    router.events.on("routeChangeError", handleComplete);

    return () => {
      router.events.off("routeChangeStart", handleStart);
      router.events.off("routeChangeComplete", handleComplete);
      router.events.off("routeChangeError", handleComplete);
    };
  }, [router]);

  return (
    <>
      {loading && <Loading />}
      {children}
    </>
  );
}
