
"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import styles from "./profile.module.css";

type User = {
  name: string;
  email: string;
  password: string;
  memberNumber: string;
};

export default function ProfilePage() {
  const router = useRouter();

  const [user, setUser] = useState<User | null>(null);
  const [isEditing, setIsEditing] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");

  useEffect(() => {
    try {
      const savedUser = localStorage.getItem("currentUser");

      if (!savedUser) {
        router.replace("/auth/login");
        return;
      }

      const parsedUser: User = JSON.parse(savedUser);

      setUser(parsedUser);
      setName(parsedUser.name);
      setEmail(parsedUser.email);
      setIsLoading(false);
    } catch (error) {
      console.error("Gagal membaca data profile:", error);
      localStorage.removeItem("currentUser");
      router.replace("/auth/login");
    }
  }, [router]);

  const handleUpdate = () => {
    if (!user) return;

    const savedUsers = localStorage.getItem("users");
    const users: User[] = savedUsers ? JSON.parse(savedUsers) : [];

    const emailExists = users.some(
      (item) => item.email === email && item.email !== user.email
    );

    if (emailExists) {
      alert("Email sudah digunakan oleh akun lain!");
      return;
    }

    const updatedUser = {
      ...user,
      name,
      email,
    };

    const updatedUsers = users.map((item) =>
      item.memberNumber === user.memberNumber ? updatedUser : item
    );

    localStorage.setItem("users", JSON.stringify(updatedUsers));
    localStorage.setItem("currentUser", JSON.stringify(updatedUser));

    setUser(updatedUser);
    setIsEditing(false);

    alert("Profile berhasil diperbarui!");
  };

  const handleLogout = () => {
    localStorage.removeItem("currentUser");
    router.replace("/auth/login");
  };

  if (isLoading) {
    return <p>Loading profile...</p>;
  }

  if (!user) {
    return null;
  }

  return (
    <main className={styles.container}>
      <div className={styles.profileBox}>
        <h1 className={styles.title}>My Profile</h1>
        <p className={styles.subtitle}>
          Your E-Library account information
        </p>

        <div className={styles.info}>
          <p className={styles.label}>Member Number</p>
          <p className={styles.value}>{user.memberNumber}</p>
        </div>

        <div className={styles.info}>
          <p className={styles.label}>Full Name</p>
          {isEditing ? (
            <input
              className={styles.input}
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
            />
          ) : (
            <p className={styles.value}>{user.name}</p>
          )}
        </div>

        <div className={styles.info}>
          <p className={styles.label}>Email</p>
          {isEditing ? (
            <input
              className={styles.input}
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
          ) : (
            <p className={styles.value}>{user.email}</p>
          )}
        </div>

        <div className={styles.buttonGroup}>
          {isEditing ? (
            <>
              <button className={styles.button} onClick={handleUpdate}>
                Save Changes
              </button>
              <button
                className={styles.button}
                onClick={() => {
                  setName(user.name);
                  setEmail(user.email);
                  setIsEditing(false);
                }}
              >
                Cancel
              </button>
            </>
          ) : (
            <button
              className={styles.button}
              onClick={() => setIsEditing(true)}
            >
              Edit Profile
            </button>
          )}

          <button
            className={`${styles.button} ${styles.logoutButton}`}
            onClick={handleLogout}
          >
            Logout
          </button>
        </div>
      </div>
    </main>
  );
}
