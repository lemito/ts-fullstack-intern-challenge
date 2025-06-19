interface Cat {
  id: string;
  url: string;
}

interface CatCardProps {
  cat: Cat;
  isLiked: boolean;
  onLikeToggle: (catId: string) => void;
}

// interface Like {
//   cat_id: string;
//   created_at?: string;
// }

interface CatCardGridProps {
  userId: string | null;
}

interface Like {
  id: string;
  cat_id: string;
  user_id: string;
  created_at: string;
  url: string;
}
