export default function Home() {
  return (
    <main className="flex min-h-screen flex-col items-center justify-center p-8">
      <h1 className="text-3xl font-bold mb-4">The Diamante Collections</h1>
      <p className="text-center max-w-lg">
        Welcome to your future e-commerce site for Artificial Jewellery and Lab-Grown Diamonds.
      </p>
      <div className="mt-8 flex gap-4">
        <a
          href="/products"
          className="bg-indigo-500 text-white px-4 py-2 rounded"
        >
          View Products
        </a>
        <a
          href="/auth"
          className="bg-green-500 text-white px-4 py-2 rounded"
        >
          Sign Up / Login
        </a>
      </div>
    </main>
  );
}