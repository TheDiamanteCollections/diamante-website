"use client";
import { useCartStore } from "../../lib/cart-store";
import { auth, db } from "../../lib/firebase";
import { useAuthState } from "react-firebase-hooks/auth";
import { collection, doc, setDoc, serverTimestamp } from "firebase/firestore";
import { useRouter } from "next/navigation";

export default function CartPage() {
  const cart = useCartStore((state) => state.cart);
  const clearCart = useCartStore((state) => state.clearCart);
  const [user] = useAuthState(auth);
  const router = useRouter();

  console.log("Cart contents on /cart:", cart);

  const placeOrder = async () => {
    if (!user) {
      alert("Please log in to place an order.");
      return;
    }

    const batch = cart.map((item) =>
      setDoc(
        doc(collection(db, "orders")),
        {
          userId: user.uid,
          productId: item.id,
          productName: item.name,
          price: item.price,
          createdAt: serverTimestamp(),
          status: "Processing",
        }
      )
    );

    await Promise.all(batch);
    clearCart();
    alert("Order placed!");
    router.push("/orders");
  };

  return (
    <main className="p-8 max-w-md mx-auto">
      <h1 className="text-xl font-bold mb-4">Your Cart</h1>
      {cart.length === 0 ? (
        <p>Your cart is empty.</p>
      ) : (
        <>
          <ul className="space-y-4">
            {cart.map((item, idx) => (
              <li key={idx} className="border p-4 rounded">
                <p><strong>{item.name}</strong></p>
                <p>{item.price}</p>
              </li>
            ))}
          </ul>
          <button
            onClick={placeOrder}
            className="bg-green-500 text-white px-4 py-2 rounded mt-4 w-full"
          >
            Place Order
          </button>
        </>
      )}
    </main>
  );
}
