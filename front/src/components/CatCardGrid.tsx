import { useEffect, useState } from "react";
import CatCard from "./CatCard";
import styles from "./CatCardGrid.module.css";



export default function CatCardGrid({ userId }: CatCardGridProps) {
  const [cats, setCats] = useState<Cat[]>([]);
  const [likes, setLikes] = useState<Like[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchCats = async () => {
      try {
        setLoading(true);
        setError(null);

        const batchSize = 5;
        const totalCats = 20;
        let loadedCats: Cat[] = [];

        for (let i = 0; i < totalCats / batchSize; i++) {
          try {
            const batchPromises = Array(batchSize)
              .fill(0)
              .map(async () => {
                const response = await fetch(
                  "https://cataas.com/cat?json=true"
                );
                if (!response.ok) throw new Error("Ошибка загрузки котика");
                return response.json();
              });

            const batchResults = await Promise.all(batchPromises);
            const formattedBatch = batchResults.map((cat) => ({
              id: cat._id,
              url: cat.url.startsWith("http")
                ? cat.url
                : `https://cataas.com${cat.url}`,
            }));

            loadedCats = [...loadedCats, ...formattedBatch];
            setCats(loadedCats);
          } catch (batchError) {
            console.error("Ошибка в пакете:", batchError);
          }

          await new Promise((resolve) => setTimeout(resolve, 500));
        }

        if (loadedCats.length === 0) {
          throw new Error("Не удалось загрузить ни одного котика");
        }
      } catch (err) {
        console.error("Error fetching cats:", err);
        setError(err instanceof Error ? err.message : "Неизвестная ошибка");
      } finally {
        setLoading(false);
      }
    };

    const fetchLikes = async () => {
      if (!userId) return;

      try {
        const token = localStorage.getItem("token");
        if (!token) return;

        const response = await fetch("http://localhost:3000/likes", {
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
    };

    fetchCats();
    fetchLikes();
  }, [userId]);

  async function handleLikeToggle(catId: string) {
    try {
      const token = localStorage.getItem("token");
      if (!token) return;

      const existingLike = likes.find((like) => like.cat_id === catId);

      if (existingLike) {
        // Удаляем лайк
        await fetch(`http://localhost:3000/likes/${existingLike.id}`, {
          method: "DELETE",
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        setLikes(likes.filter((like) => like.id !== existingLike.id));
      } else {
        // Добавляем лайк
        const response = await fetch("http://localhost:3000/likes", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({ cat_id: catId }),
        });

        if (!response.ok) throw new Error("Ошибка добавления лайка");
        const newLike: Like = await response.json();
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
          key={`${cat.id}-${cat.url}`}
          cat={cat}
          isLiked={likes.some((like) => like.cat_id === cat.id)}
          onLikeToggle={handleLikeToggle}
        />
      ))}
    </div>
  );
}
