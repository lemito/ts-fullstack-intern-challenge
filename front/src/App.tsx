import { createBrowserRouter, RouterProvider } from "react-router-dom";
import "./App.css";
import Header from "./components/Header";
import AuthPage from "./page/Auth";
import FavoritesPage from "./page/FavoritesPage";
import HomePage from "./page/Home";
import Guard from "./components/guard";

function App() {
  const router = createBrowserRouter([
    {
      element: <Header />,
      children: [
        {
          path: "/",
          element: <HomePage />,
        },
        {
          path: "/auth",
          element: <AuthPage />,
        },
        {
          element: <Guard />,
          children: [
            {
              path: "/likes",
              element: <FavoritesPage />,
            },
          ],
        },
      ],
    },
  ]);
  return (
    <>
      <RouterProvider router={router} />
    </>
  );
}

export default App;
