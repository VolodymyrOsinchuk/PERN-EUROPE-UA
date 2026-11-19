// frontend/src/hooks/usePublicationCategories.js
import { useEffect, useState } from "react";
import customFetch from "../utils/customFetch";

// Кеш на рівні модуля: список завантажується один раз за сесію сторінки
let cache = null;
let inflight = null;

const fetchNames = () => {
  if (cache) return Promise.resolve(cache);
  if (!inflight) {
    inflight = customFetch
      .get("/publications/categories")
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

// Викликати після будь-якої зміни категорій в адмінці
export const invalidatePublicationCategories = () => {
  cache = null;
  inflight = null;
};

export default function usePublicationCategories() {
  const [names, setNames] = useState(cache || []);
  const [loading, setLoading] = useState(!cache);

  useEffect(() => {
    let alive = true;
    fetchNames().then((list) => {
      if (!alive) return;
      setNames(list);
      setLoading(false);
    });
    return () => {
      alive = false;
    };
  }, []);

  return { names, loading };
}
