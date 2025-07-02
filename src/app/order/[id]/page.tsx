"use client";
import { useEffect } from "react";
import { useParams } from "next/navigation";
import { auth, db } from "../../../lib/firebase";
import { doc, setDoc, serverTimestamp } from "firebase/firestore";
import { useAuthState } from "react-firebase-hooks/auth";

export default function Order() {
  const { id } = useParams();
  const [user] = useAuthState(auth);

  useEffect(() => {
    const saveOrder = async () => {
      if (!user) return;
      const orderRef = doc(db, "orders", `${user.uid}_${id}_${Date.now()}`);
      await setDoc(orderRef, {
        userId: user.uid,
        productId: id,
        createdAt: serverTimestamp(),
        status: "Processing",
      });
    };
    saveOrder();
  }, [user, id]);

  const deliveryDate = new Date(Date.now() + 7 * 86400000).toLocaleDateString();

  return (
    <main className="p-8 max-w-md mx-auto">
      <h1 className="text-xl font-bold mb-4">Order Confirmation</h1>
      {user ? (
        <>
          <p className="mb-2">Thank you for your purchase, {user.email}!</p>
          <p>Product ID: <strong>{id}</strong></p>
          <p>Status: <span className="text-green-600 font-semibold">Processing</span></p>
          <p>Estimated Delivery: <strong>{deliveryDate}</strong></p>
        </>
      ) : (
        <p className="text-red-500">Please log in to track your order.</p>
      )}
      <a
        href="/products"
        className="inline-block mt-4 bg-indigo-500 text-white px-4 py-2 rounded"
      >
        Back to Products
      </a>
    </main>
  );
}
// This code handles the order confirmation page, saving the order details to Firestore
// and displaying the order status and estimated delivery date to the user.
// - Checks if a user is logged in.
// - Saves the order to Firestore.
// - Displays order info.