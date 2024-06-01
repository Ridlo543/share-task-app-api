"use client"
import { useState } from "react";
import { useRouter } from "next/navigation";

export default function OpenClassPage() {
  const [name, setName] = useState("");
  const [code, setCode] = useState("");
  const [error, setError] = useState("");
  const router = useRouter();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    // Validasi input
    if (!name.trim() || !code.trim()) {
      setError("Nama dan kode kelas harus diisi");
      return;
    }

    // Redirect ke halaman kelas dengan kode yang dimasukkan
    router.push(`/classes/${encodeURIComponent(code)}`);
  };

  return (
    <div>
      <h1>Open Class</h1>
      {error && <p style={{ color: "red" }}>{error}</p>}
      <form onSubmit={handleSubmit}>
        <div>
          <label>
            Nama Kelas:
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
            />
          </label>
        </div>
        <div>
          <label>
            Kode Kelas:
            <input
              type="text"
              value={code}
              onChange={(e) => setCode(e.target.value)}
            />
          </label>
        </div>
        <button type="submit">Buka Kelas</button>
      </form>
    </div>
  );
}
