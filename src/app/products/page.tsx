"use client";
import Link from "next/link";
import { useCartStore } from "../../lib/cart-store";

const products = [
  {
    id: 1,
    name: "Lab-Grown Diamond Ring",
    price: "$499",
    image: "/images/diamondring.png",
  },
  {
    id: 2,
    name: "Artificial Necklace Set",
    price: "$89",
    image: "/images/necklace.png",
  },
  {
    id: 3,
    name: "Gold-Plated Bracelet",
    price: "$129",
    image: "/images/bracelet.png",
  },
  {
    id: 4,
    name: "Diamond Earrings",
    price: "$299",
    image: "/images/earrings.png",
  },
];

export default function Products() {
  const addToCart = useCartStore((state) => state.addToCart);

  return (
    <main className="p-8">
      <h1 className="text-2xl font-bold mb-4">Our Collections</h1>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {products.map((product) => (
          <div
            key={product.id}
            className="border rounded p-4 shadow hover:shadow-lg flex flex-col items-center"
          >
            <img
              src={product.image}
              alt={product.name}
              className="w-full h-48 object-cover mb-2 rounded"
            />
            <h2 className="text-lg font-semibold">{product.name}</h2>
            <p className="mb-2">{product.price}</p>
            <div className="flex gap-2 mt-2">
              <Link
                href={`/order/${product.id}`}
                className="inline-block bg-indigo-500 text-white px-4 py-2 rounded text-center"
              >
                Buy Now
              </Link>
              <button
                onClick={() => {
                  console.log("Add to cart clicked!", product);
                  addToCart(product);
                }}
                className="bg-yellow-500 text-black px-4 py-2 rounded"
              >
                Add to Cart
              </button>
            </div>
          </div>
        ))}
      </div>
    </main>
  );
}
