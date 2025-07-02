"use client";
import { useEffect, useState } from "react";
import { auth, db } from "../../lib/firebase";
import { useAuthState } from "react-firebase-hooks/auth";
import { collection, query, where, getDocs, Timestamp } from "firebase/firestore";

interface Order {
  id: string;
  productId: string;
  createdAt: Timestamp;
  status: string;
}

export default function OrdersPage() {
  const [user] = useAuthState(auth);
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchOrders = async () => {
      if (!user) return;
      const q = query(
        collection(db, "orders"),
        where("userId", "==", user.uid)
      );
      const querySnapshot = await getDocs(q);
      const fetchedOrders: Order[] = [];
      querySnapshot.forEach((doc) => {
        fetchedOrders.push({
          id: doc.id,
          productId: doc.data().productId,
          createdAt: doc.data().createdAt,
          status: doc.data().status,
        });
      });
      setOrders(fetchedOrders);
      setLoading(false);
    };
    fetchOrders();
  }, [user]);

  if (!user) {
    return (
      <main className="p-8 max-w-md mx-auto">
        <h1 className="text-xl font-bold mb-4">Your Orders</h1>
        <p className="text-red-500">Please log in to see your orders.</p>
      </main>
    );
  }

  return (
    <main className="p-8 max-w-md mx-auto">
      <h1 className="text-xl font-bold mb-4">Your Orders</h1>
      {loading ? (
        <p>Loading...</p>
      ) : orders.length === 0 ? (
        <p>You have no orders yet.</p>
      ) : (
        <ul className="space-y-4">
          {orders.map((order) => (
            <li
              key={order.id}
              className="border p-4 rounded shadow"
            >
              <p>
                <strong>Product ID:</strong> {order.productId}
              </p>
              <p>
                <strong>Status:</strong>{" "}
                <span className="text-green-500">{order.status}</span>
              </p>
              <p>
                <strong>Ordered On:</strong>{" "}
                {order.createdAt?.toDate().toLocaleDateString()}
              </p>
            </li>
          ))}
        </ul>
      )}
    </main>
  );
}
