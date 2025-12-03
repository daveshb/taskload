"use client";

import { useState, FormEvent } from "react";
import { useUserStore } from "@/stores/user-store";

export function UserPanel() {
  const { user, isLoggedIn, login, logout, updateUser } = useUserStore();
  const [nameInput, setNameInput] = useState(user?.name ?? "");
  const [emailInput, setEmailInput] = useState(user?.email ?? "");

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();

    if (!isLoggedIn) login({ name: nameInput, email: emailInput });
    else updateUser({ name: nameInput, email: emailInput });
  };

  return (
    <div className="flex flex-col gap-4 p-6 bg-purple-50 rounded-lg border border-purple-200">
      <h3 className="text-xl font-bold text-purple-900">Panel de Usuario</h3>

      {isLoggedIn && user ? (
        <div className="bg-white p-4 rounded-lg border border-purple-300">
          <p className="text-lg font-semibold text-gray-800">
            Nombre: <span className="text-purple-600">{user.name}</span>
          </p>
          <p className="text-lg font-semibold text-gray-800">
            Email: <span className="text-purple-600">{user.email}</span>
          </p>
        </div>
      ) : (
        <p className="text-gray-600 font-semibold">No hay usuario logueado.</p>
      )}

      <form onSubmit={handleSubmit} className="flex flex-col gap-3">
        <input
          type="text"
          placeholder="Nombre"
          value={nameInput}
          onChange={(e) => setNameInput(e.target.value)}
          className="px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-purple-500"
        />
        <input
          type="email"
          placeholder="Email"
          value={emailInput}
          onChange={(e) => setEmailInput(e.target.value)}
          className="px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-purple-500"
        />
        <button
          type="submit"
          className="px-4 py-2 bg-purple-500 text-white rounded-lg font-semibold hover:bg-purple-600 transition-colors"
        >
          {isLoggedIn ? "Actualizar" : "Login"}
        </button>
      </form>

      {isLoggedIn && (
        <button
          onClick={logout}
          className="px-4 py-2 bg-red-500 text-white rounded-lg font-semibold hover:bg-red-600 transition-colors"
        >
          Logout
        </button>
      )}
    </div>
  );
}
