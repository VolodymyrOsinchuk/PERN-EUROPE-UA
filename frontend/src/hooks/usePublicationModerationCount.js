// frontend/src/hooks/usePublicationModerationCount.js
import { useEffect, useState } from "react";
import customFetch from "../utils/customFetch";

export default function usePublicationModerationCount(enabled) {
  const [count, setCount] = useState(0);

  useEffect(() => {
    if (!enabled) return;
    let cancelled = false;

    const load = () =>
      customFetch
        .get("/publications/moderation/counts")
        .then(({ data }) => {
          if (!cancelled) setCount(data.pending || 0);
        })
        .catch(() => {});

    load();
    const timer = setInterval(load, 60_000);
    return () => {
      cancelled = true;
      clearInterval(timer);
    };
  }, [enabled]);

  return count;
}
