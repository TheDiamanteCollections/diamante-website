"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { auth } from "../../lib/firebase";
import {
  useCreateUserWithEmailAndPassword,
  useSignInWithEmailAndPassword,
  useSignOut,
  useAuthState,
} from "react-firebase-hooks/auth";

export default function AuthPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const router = useRouter();

  const [createUserWithEmailAndPassword] =
    useCreateUserWithEmailAndPassword(auth);
  const [signInWithEmailAndPassword] =
    useSignInWithEmailAndPassword(auth);
  const [signOut] = useSignOut(auth);
  const [currentUser, authLoading] = useAuthState(auth);

  return (
    <main className="p-8 max-w-sm mx-auto">
      <h1 className="text-2xl font-bold mb-4">Sign Up / Login</h1>
      {currentUser ? (
        <div className="text-center">
          <p className="mb-4">Welcome, {currentUser.email}</p>
          <button
            onClick={() => signOut()}
            className="bg-red-500 text-white px-4 py-2 rounded"
          >
            Logout
          </button>
        </div>
      ) : (
        <div className="space-y-4">
          <input
            type="email"
            placeholder="Email"
            className="border p-2 w-full text-white bg-black placeholder-gray-500"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
          <input
            type="password"
            placeholder="Password"
            className="border p-2 w-full text-white bg-black placeholder-gray-500"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />

          <div className="flex gap-2">
            <button
              onClick={async () => {
                const res = await createUserWithEmailAndPassword(email, password);
                if (res) {
                  router.push("/products");
                }
              }}
              className="bg-blue-500 text-white px-4 py-2 rounded w-1/2"
            >
              Sign Up
            </button>
            <button
              onClick={async () => {
                console.log("Login button clicked!");
                const res = await signInWithEmailAndPassword(email, password);
                if (res) {
                  router.push("/products");
                }
              }}
              className="bg-green-500 text-white px-4 py-2 rounded w-1/2"
            >
              Login
            </button>
          </div>
        </div>
      )}
    </main>
  );
}
