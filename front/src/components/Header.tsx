import { NavLink, Outlet } from "react-router-dom";
import styles from "./Header.module.css";

const ProfileIco = () => (
  <svg
    width="24"
    height="24"
    viewBox="0 0 24 24"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
  >
    <circle cx="12" cy="6" r="4" stroke="currentColor" stroke-width="2" />
    <line
      x1="4"
      y1="18"
      x2="20"
      y2="18"
      stroke="currentColor"
      stroke-width="2"
    />
    <line
      x1="8"
      y1="14"
      x2="16"
      y2="14"
      stroke="currentColor"
      stroke-width="2"
    />
  </svg>
);

export default function Header() {
  return (
    <>
      <div className={styles.header}>
        <div className={styles.links}>
          <NavLink
            to="/"
            className={({ isActive, isPending }) =>
              `${styles.link} ${styles.links} ${
                isPending ? styles.pending : isActive ? styles.active : ""
              }`
            }
          >
            Все котики
          </NavLink>
          <NavLink
            to="/likes"
            className={({ isActive, isPending }) =>
              `${styles.link} ${styles.links} ${
                isPending ? styles.pending : isActive ? styles.active : ""
              }`
            }
          >
            Любимые котики
          </NavLink>
        </div>
        <div className={styles.profile}>
          <NavLink
            to="/auth"
            className={({ isActive, isPending }) =>
              `${styles.link} ${styles.links} ${
                isPending ? styles.pending : isActive ? styles.active : ""
              }`
            }
          >
            <ProfileIco />
          </NavLink>
        </div>
      </div>
      <Outlet />
    </>
  );
}
