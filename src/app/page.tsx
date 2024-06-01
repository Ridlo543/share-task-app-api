import Link from "next/link";

export default function Home() {
  return (
    <main className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-semibold mb-4">Welcome to Share-Task-App</h1>
      <div className="flex flex-col space-y-4">
        <Link
          href="/open-class"
          className="bg-blue-500 text-white px-4 py-2 rounded-md hover:bg-blue-600 transition duration-300 ease-in-out"
        >
          Open Class
        </Link>
        <Link
          href="/create-class"
          className="bg-green-500 text-white px-4 py-2 rounded-md hover:bg-green-600 transition duration-300 ease-in-out"
        >
          Create Class
        </Link>
      </div>
    </main>
  );
}
