import { useEffect, useState, useCallback, useRef } from "react";
import CatCard from "./CatCard";
import styles from "./CatCardGrid.module.css";

const API_URL = import.meta.env.VITE_API_URL || "http://localhost:8080/api";

export default function CatCardGrid({ userId }: CatCardGridProps) {
  const [cats, setCats] = useState<Cat[]>([]);
  const [likes, setLikes] = useState<Like[]>([]);
  const [loading, setLoading] = useState(true);
  const [loadingMore, setLoadingMore] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const observerRef = useRef<HTMLDivElement | null>(null);

  const extractCatId = (url: string): string => {
    const match = url.match(/\/([^\/?]+)(\?|$)/);
    return match ? match[1] : Math.random().toString(36).substring(2, 11);
  };

  const fetchCatsBatch = useCallback(async (batchSize: number) => {
    try {
      const batchPromises = Array(batchSize)
        .fill(0)
        .map(async () => {
          const response = await fetch("https://cataas.com/cat?json=true");
          if (!response.ok) throw new Error("Ошибка загрузки котика");
          return response.json();
        });

      const batchResults = await Promise.all(batchPromises);

      return batchResults.map((cat) => {
        const id = extractCatId(cat.url);
        return {
          id,
          url: cat.url.startsWith("http")
            ? cat.url
            : `https://cataas.com/${cat.url}`,
        };
      });
    } catch (err) {
      console.error("Ошибка загрузки котиков:", err);
      throw err;
    }
  }, []);

  const fetchInitialCats = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      const initialCats = await fetchCatsBatch(5);
      setCats(initialCats);
    } catch (err) {
      console.error("Error fetching initial cats:", err);
      setError(err instanceof Error ? err.message : "Неизвестная ошибка");
    } finally {
      setLoading(false);
    }
  }, [fetchCatsBatch]);

  const fetchMoreCats = useCallback(async () => {
    try {
      setLoadingMore(true);
      const newCats = await fetchCatsBatch(5);
      setCats((prev) => [...prev, ...newCats]);
    } catch (err) {
      console.error("Ошибка загрузки дополнительных котиков:", err);
    } finally {
      setLoadingMore(false);
    }
  }, [fetchCatsBatch]);

  const fetchLikes = useCallback(async () => {
    if (!userId) return;

    try {
      const token = localStorage.getItem("token");
      if (!token) return;

      const response = await fetch(`${API_URL}/likes`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (!response.ok) throw new Error("Ошибка загрузки лайков");
      const data = await response.json();
      setLikes(data.data as Like[]);
    } catch (err) {
      console.error("Error fetching likes:", err);
    }
  }, [userId]);

  useEffect(() => {
    fetchInitialCats();
    fetchLikes();
  }, [fetchInitialCats, fetchLikes]);

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting && !loading && !loadingMore) {
          fetchMoreCats();
        }
      },
      { threshold: 1.0 }
    );

    if (observerRef.current) {
      observer.observe(observerRef.current);
    }

    return () => {
      if (observerRef.current) {
        observer.unobserve(observerRef.current);
      }
    };
  }, [loading, loadingMore, fetchMoreCats]);

  async function handleLikeToggle(catId: string) {
    try {
      console.log("Toggling like for cat ID:", catId);
      const token = localStorage.getItem("token");

      if (!token || !userId) {
        console.error("No token or userId found");
        return;
      }

      const existingLike = likes.find((like) => like.cat_id === catId);

      if (existingLike) {
        console.log("Removing like for cat ID:", catId);
        await fetch(`${API_URL}/likes/${catId}`, {
          method: "DELETE",
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        setLikes(likes.filter((like) => like.cat_id !== catId));
      } else {
        console.log("Adding like for cat ID:", catId);
        const response = await fetch(`${API_URL}/likes`, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({
            cat_id: catId,
            user_id: userId,
            created_at: new Date().toISOString(),
          }),
        });

        if (!response.ok) {
          const errorData = await response.json();
          throw new Error(errorData.message || "Ошибка добавления лайка");
        }

        const newLike: Like = await response.json();
        console.log("Added new like:", newLike);
        setLikes([...likes, newLike]);
      }
    } catch (err) {
      console.error("Error toggling like:", err);
    }
  }

  if (loading) {
    return (
      <div className={styles.loading_container}>
        <div className={styles.loader}></div>
        <p>Загружаем милых котиков...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className={styles.error_container}>
        <p>{error}</p>
        <button
          className={styles.retry_button}
          onClick={() => window.location.reload()}
        >
          Попробовать снова
        </button>
      </div>
    );
  }

  return (
    <div className={styles.all_cats_container}>
      {cats.map((cat) => (
        <CatCard
          key={cat.id}
          cat={cat}
          isLiked={likes.some((like) => like.cat_id === cat.id)}
          onLikeToggle={() => handleLikeToggle(cat.id)}
        />
      ))}

      <div ref={observerRef} style={{ height: "20px" }} />

      {loadingMore && (
        <div className={styles.loading_more}>
          <div className={styles.small_loader}></div>
          <p>Загружаем еще котиков...</p>
        </div>
      )}
    </div>
  );
}
