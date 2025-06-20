import LikedCatsGrid from "../components/LikedCatsGrid";

export default function FavoritesPage() {
  const userid = localStorage.getItem("userId");

  return (
    <>
      <LikedCatsGrid userId={userid} />
    </>
  );
}
