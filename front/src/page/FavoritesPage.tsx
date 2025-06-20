import LikedCatsGrid from "../components/LikedCatsGrid";

export default function FavoritesPage() {
  const userid = localStorage.getItem("userId");
//   const { userId } = useAuth();
  return (
    <>
      <LikedCatsGrid userId={userid} />
    </>
  );
}
