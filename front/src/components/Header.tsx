import { NavLink, Outlet } from "react-router-dom";
import styles from "./Header.module.css";

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
      </div>
      <Outlet />
    </>
  );
}
