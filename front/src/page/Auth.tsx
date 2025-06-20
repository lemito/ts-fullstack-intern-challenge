import { useState } from "react";
import useAuth from "../hooks/useAuth";
import styles from "./AuthPage.module.css";

function AuthPage() {
  const { registerUser, loginUser, isAuthenticated, logout, token, userId } =
    useAuth();
  const [login, setLogin] = useState("");
  const [password, setPassword] = useState("");
  const [isRegisterForm, setIsRegisterForm] = useState(true);
  const [error, setError] = useState("");

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();
    setError("");

    const authAction = isRegisterForm ? registerUser : loginUser;
    const result = await authAction(login, password);

    if (result.success) {
      alert(
        isRegisterForm ? "User registered successfully!" : "Login successful!"
      );
    } else {
      setError(result.error || "An unknown error occurred");
    }
  };

  return (
    <div className={styles.container}>
      {isAuthenticated ? (
        <div className={styles.authInfo}>
          <h2 className={styles.title}>Authentication Info</h2>
          <p>You are authenticated with token: {token}</p>
          <p>Your user ID is: {userId}</p>
          <button onClick={logout} className={styles.button}>
            Logout
          </button>
        </div>
      ) : (
        <div>
          <h2 className={styles.title}>
            {isRegisterForm ? "Create Account" : "Login to Account"}
          </h2>

          {error && <div className={styles.error}>{error}</div>}

          <form onSubmit={handleSubmit} className={styles.form}>
            <div className={styles.formGroup}>
              <label className={styles.label}>Username:</label>
              <input
                type="text"
                value={login}
                onChange={(e) => setLogin(e.target.value)}
                required
                className={styles.input}
                placeholder="Enter your username"
              />
            </div>

            <div className={styles.formGroup}>
              <label className={styles.label}>Password:</label>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                className={styles.input}
                placeholder="Enter your password"
              />
            </div>

            <button type="submit" className={styles.button}>
              {isRegisterForm ? "Register" : "Login"}
            </button>
          </form>

          <p className={styles.switchText}>
            {isRegisterForm
              ? "Already have an account?"
              : "Don't have an account?"}

            <button
              onClick={() => {
                setIsRegisterForm(!isRegisterForm);
                setError("");
              }}
              className={styles.switchButton}
            >
              {isRegisterForm ? "Login here" : "Register here"}
            </button>
          </p>
        </div>
      )}
    </div>
  );
}

export default AuthPage;
