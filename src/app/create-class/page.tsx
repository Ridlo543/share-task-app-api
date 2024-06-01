'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';

export default function CreateClassPage() {
  const [name, setName] = useState('');
  const router = useRouter();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    const res = await fetch('/api/classes', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ name }),
    });

    if (res.ok) {
      const data = await res.json();
      router.push(`/classes/${data.code}`);
    } else {
      alert('Failed to create class');
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      <label>
        Class Name:
        <input value={name} onChange={(e) => setName(e.target.value)} />
      </label>
      <button type="submit">Create Class</button>
    </form>
  );
}
