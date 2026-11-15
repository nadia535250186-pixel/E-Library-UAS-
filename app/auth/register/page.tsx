
"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";

import styles from "./register.module.css";

export default function RegisterPage() {
  const router = useRouter();

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [error, setError] = useState("");

  const handleRegister = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setError("");

    if (password !== confirmPassword) {
      setError("Password dan konfirmasi password tidak sama!");
      return;
    }

    const savedUsers = localStorage.getItem("users");
    const users = savedUsers ? JSON.parse(savedUsers) : [];

    const emailExists = users.some(
      (user: { email: string }) => user.email === email
    );

    if (emailExists) {
      setError("Email sudah terdaftar!");
      return;
    }

    const nextNumber = Number(
      localStorage.getItem("nextMemberNumber") || "1"
    );

    const memberNumber = `LIB${String(nextNumber).padStart(4, "0")}`;

    const newUser = {
      name,
      email,
      password,
      memberNumber,
    };

    users.push(newUser);

    localStorage.setItem("users", JSON.stringify(users));
    localStorage.setItem("nextMemberNumber", String(nextNumber + 1));

    alert("Registrasi berhasil! Silakan login.");
    router.push("/auth/login");
  };

  return (
    <main className={styles.container}>
      <div className={styles.registerBox}>
        <h1 className={styles.title}>Create Account</h1>
        <p className={styles.subtitle}>
          Register to join our E-Library
        </p>

        <form className={styles.form} onSubmit={handleRegister}>
          <label className={styles.label}>Full Name</label>
          <input
            className={styles.input}
            type="text"
            placeholder="Enter your full name"
            value={name}
            onChange={(e) => setName(e.target.value)}
            required
          />

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
            placeholder="Create a password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />

          <label className={styles.label}>Confirm Password</label>
          <input
            className={styles.input}
            type="password"
            placeholder="Confirm your password"
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
            required
          />

          {error && <p style={{ color: "red" }}>{error}</p>}

          <button className={styles.button} type="submit">
            Register
          </button>
        </form>

        <p className={styles.footer}>
          Already have an account?{" "}
          <Link href="/auth/login" className={styles.link}>
            Login
          </Link>
        </p>
      </div>
    </main>
  );
}
