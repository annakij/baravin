import { useEffect, useRef } from "react";

export default function useScrollMemory(dependency) {
  const scrollYRef = useRef(0);

  // 🧭 Spara scroll innan dependency ändras
  useEffect(() => {
    const handleBefore = () => {
      scrollYRef.current = window.scrollY;
    };
    window.addEventListener("beforeunload", handleBefore);
    return () => window.removeEventListener("beforeunload", handleBefore);
  }, []);

  // 🔄 Återställ scroll efter ny render
  useEffect(() => {
    window.scrollTo({ top: scrollYRef.current, behavior: "instant" });
  }, [dependency]);
}
