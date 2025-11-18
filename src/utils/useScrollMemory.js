import { useEffect, useRef } from "react";

export default function useScrollMemory(dependency) {
  const scrollYRef = useRef(0);

  // Save scroll
  useEffect(() => {
    const handleBefore = () => {
      scrollYRef.current = window.scrollY;
    };
    window.addEventListener("beforeunload", handleBefore);
    return () => window.removeEventListener("beforeunload", handleBefore);
  }, []);

  // Restore scroll after render
  useEffect(() => {
    window.scrollTo({ top: scrollYRef.current, behavior: "instant" });
  }, [dependency]);
}
