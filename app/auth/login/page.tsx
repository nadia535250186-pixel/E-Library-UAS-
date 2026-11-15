
"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import styles from "./login.module.css";

export default function LoginPage() {
  const router = useRouter();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");

  const handleLogin = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setError("");

    const savedUsers = localStorage.getItem("users");
    const users = savedUsers ? JSON.parse(savedUsers) : [];

    const user = users.find(
      (item: { email: string; password: string }) =>
        item.email === email && item.password === password
    );

    if (!user) {
      setError("Email atau password salah!");
      return;
    }

    localStorage.setItem("currentUser", JSON.stringify(user));
    router.push("/profile");
  };

  return (
    <main className={styles.container}>
      <div className={styles.loginBox}>
        <h1 className={styles.title}>Welcome Back!</h1>
        <p className={styles.subtitle}>Login to your E-Library account</p>

        <form className={styles.form} onSubmit={handleLogin}>
          <label className={styles.label}>Email</label>
          <input
            className={styles.input}
            type="email"
            placeholder="Enter your email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />

          <label className={styles.label}>Password</label>
          <input
            className={styles.input}
            type="password"
            placeholder="Enter your password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />

          {error && <p style={{ color: "red" }}>{error}</p>}

          <button className={styles.button} type="submit">
            Login
          </button>
        </form>

        <p className={styles.footer}>
          Don't have an account?{" "}
          <Link href="/auth/register" className={styles.link}>
            Register
          </Link>
        </p>
      </div>
    </main>
  );
}
