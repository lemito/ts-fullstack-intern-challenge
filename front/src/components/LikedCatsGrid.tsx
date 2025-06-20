import { useEffect, useState } from "react";
import CatCard from "./CatCard";
import styles from "./CatCardGrid.module.css";

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:3000';

interface Like {
  id: string;
  cat_id: string;
  user_id: string;
  created_at: string;
}

interface Cat {
  id: string;
  url: string;
}

interface CatCardGridProps {
  userId: string | null;
}

export default function LikedCatsGrid({ userId }: CatCardGridProps) {
  const [likedCats, setLikedCats] = useState<Like[]>([]);
  const [catsDetails, setCatsDetails] = useState<Cat[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const extractCatId = (url: string): string => {
    const match = url.match(/\/([^\/?]+)(\?|$)/);
    return match ? match[1] : Math.random().toString(36).substring(2, 11);
  };

  useEffect(() => {
    const fetchLikedCats = async () => {
      try {
        setLoading(true);
        setError(null);

        if (!userId) {
          throw new Error("Пользователь не авторизован");
        }

        const token = localStorage.getItem("token");
        if (!token) {
          throw new Error("Токен авторизации не найден");
        }

        const response = await fetch(`${API_URL}/likes`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        if (!response.ok) {
          throw new Error("Ошибка загрузки понравившихся котиков");
        }

        const data = await response.json();

        const transformedLikes = data.data.map((item: any) => ({
          id: item.id,
          cat_id: item.catId,
          user_id: item.userId,
          created_at: item.createdAt,
        }));

        setLikedCats(transformedLikes);

        const details = transformedLikes.map((like: Like) => ({
          id: like.cat_id,
          url: `https://cataas.com/cat/${like.cat_id}`,
        }));

        setCatsDetails(details);
      } catch (err) {
        console.error("Error fetching liked cats:", err);
        setError(err instanceof Error ? err.message : "Неизвестная ошибка");
      } finally {
        setLoading(false);
      }
    };

    fetchLikedCats();
  }, [userId]);

  async function handleUnlike(catId: string) {
    try {
      console.log("Removing like for cat ID:", catId);
      const token = localStorage.getItem("token");
      if (!token) return;

      await fetch(`${API_URL}/likes/${catId}`, {
        method: "DELETE",
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      setLikedCats((prev) => prev.filter((like) => like.cat_id !== catId));
      setCatsDetails((prev) => prev.filter((cat) => cat.id !== catId));
    } catch (err) {
      console.error("Error unliking cat:", err);
    }
  }

  if (loading) {
    return (
      <div className={styles.loading_container}>
        <div className={styles.loader}></div>
        <p>Загружаем ваших любимых котиков...</p>
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

  if (catsDetails.length === 0) {
    return (
      <div className={styles.empty_container}>
        <p>У вас пока нет любимых котиков</p>
      </div>
    );
  }

  return (
    <div className={styles.all_cats_container}>
      {catsDetails.map((cat) => (
        <CatCard
          key={`liked-${cat.id}`}
          cat={cat}
          isLiked={true}
          onLikeToggle={() => handleUnlike(cat.id)}
        />
      ))}
    </div>
  );
}
