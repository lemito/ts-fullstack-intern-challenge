import { useState } from "react";
import styles from "./CatCard.module.css";

const HeartFilledIcon = () => (
  <svg
    width="40"
    height="37"
    viewBox="0 0 40 37"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
  >
    <path
      d="M20 36.7L17.1 34.06C6.8 24.72 0 18.56 0 11C0 4.84 4.84 0 11 0C14.48 0 17.82 1.62 20 4.18C22.18 1.62 25.52 0 29 0C35.16 0 40 4.84 40 11C40 18.56 33.2 24.72 22.9 34.08L20 36.7Z"
      fill="#F24E1E"
    />
  </svg>
);

const HeartWhiteIcon = () => (
  <svg
    width="48"
    height="48"
    viewBox="0 0 48 48"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
  >
    <g clipPath="url(#clip0_1_2165)">
      <path
        d="M33 6C29.52 6 26.18 7.62 24 10.18C21.82 7.62 18.48 6 15 6C8.84 6 4 10.84 4 17C4 24.56 10.8 30.72 21.1 40.08L24 42.7L26.9 40.06C37.2 30.72 44 24.56 44 17C44 10.84 39.16 6 33 6ZM24.2 37.1L24 37.3L23.8 37.1C14.28 28.48 8 22.78 8 17C8 13 11 10 15 10C18.08 10 21.08 11.98 22.14 14.72H25.88C26.92 11.98 29.92 10 33 10C37 10 40 13 40 17C40 22.78 33.72 28.48 24.2 37.1Z"
        fill="#F24E1E"
      />
    </g>
    <defs>
      <clipPath id="clip0_1_2165">
        <rect width="48" height="48" fill="white" />
      </clipPath>
    </defs>
  </svg>
);

export default function CatCard({ cat, isLiked, onLikeToggle }: CatCardProps) {
  const [imageError, setImageError] = useState(false);
  const [isHovered, setIsHovered] = useState(false);

  const handleImageError = () => {
    setImageError(true);
  };

  return (
    <div
      className={styles.card}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      data-value={`id=${cat.id};url=${cat.url}`}
    >
      <div className={styles.imageContainer}>
        {!imageError ? (
          <img
            src={cat.url}
            alt={`Cat ${cat.url}`}
            className={styles.image}
            onError={handleImageError}
            loading="lazy"
          />
        ) : (
          <div className={styles.imagePlaceholder}>
            <svg
              width="64"
              height="64"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="1"
            >
              <path d="M23 19a2 2 0 0 1-2 2H3a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h4l2-3h6l2 3h4a2 2 0 0 1 2 2z" />
              <circle cx="12" cy="13" r="4" />
            </svg>
          </div>
        )}
        <button
          onClick={() => onLikeToggle(cat.id)}
          className={`${styles.likeButton} ${isLiked ? styles.liked : ""} ${
            isHovered || isLiked ? styles.visible : ""
          }`}
          aria-label={
            isLiked ? "Удалить из понравившихся" : "Добавить в понравившиеся"
          }
        >
          {isLiked ? <HeartFilledIcon /> : <HeartWhiteIcon />}
        </button>
      </div>
    </div>
  );
}
