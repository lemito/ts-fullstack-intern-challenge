import CatCardGrid from "../components/CatCardGrid";
import useAuth from "../hooks/useAuth";

export default function HomePage() {
  const { userId } = useAuth();
  console.log(userId);
  return (
    <>
      <CatCardGrid userId={userId} />
    </>
  );
}
