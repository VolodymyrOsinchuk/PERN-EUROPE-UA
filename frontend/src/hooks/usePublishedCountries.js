import { useEffect, useState } from "react";
import customFetch from "../utils/customFetch";

// Кеш на рівні модуля: список завантажується один раз за сесію сторінки
let cache = null;
let inflight = null;

const fetchCountries = () => {
  if (cache) return Promise.resolve(cache);
  if (!inflight) {
    inflight = customFetch
      .get("/countries")
      .then(({ data }) => {
        cache = Array.isArray(data) ? data : [];
        return cache;
      })
      .catch(() => [])
      .finally(() => {
        inflight = null;
      });
  }
  return inflight;
};

// Викликати після будь-якої зміни країн в адмінці
export const invalidatePublishedCountries = () => {
  cache = null;
  inflight = null;
};

export default function usePublishedCountries() {
  const [countries, setCountries] = useState(cache || []);
  const [loading, setLoading] = useState(!cache);

  useEffect(() => {
    let alive = true;
    fetchCountries().then((list) => {
      if (!alive) return;
      setCountries(list);
      setLoading(false);
    });
    return () => {
      alive = false;
    };
  }, []);

  return { countries, loading };
}
