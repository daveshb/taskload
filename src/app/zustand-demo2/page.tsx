"use client";

import { useRouter } from "next/navigation";
import { useThemeStore } from "@/stores/theme-store";
import { useCounterStore } from "@/stores/counter-store";
import { useUserStore } from "@/stores/user-store";

export default function ZustandDemo2Page() {
  const router = useRouter();
  const { theme } = useThemeStore();
  const { count, increment } = useCounterStore();
  const { user, isLoggedIn } = useUserStore();

  return (
    <main className="min-h-screen bg-gray-50 p-8">
      <div className="max-w-2xl mx-auto">
        <h1 className="text-5xl font-bold mb-2 text-gray-900">
          Zustand Demo 2 - Estado Persistente
        </h1>
        <p className="text-gray-600 mb-8">
          Esta página demuestra que el estado de Zustand se mantiene entre rutas
        </p>

        <div className="space-y-6">
          {/* Info de los stores */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {/* Tema */}
            <div className="p-6 bg-yellow-50 rounded-lg border border-yellow-200">
              <h3 className="text-lg font-bold text-yellow-900 mb-2">🎨 Tema</h3>
              <p className="text-sm text-yellow-800">
                Tema actual: <span className="font-bold text-yellow-600">{theme === "light" ? "🌞 Claro" : "🌙 Oscuro"}</span>
              </p>
              <p className="text-xs text-yellow-700 mt-2">
                Cambio el tema en demo1 y se mantiene aquí
              </p>
            </div>

            {/* Contador */}
            <div className="p-6 bg-blue-50 rounded-lg border border-blue-200">
              <h3 className="text-lg font-bold text-blue-900 mb-2">🔢 Contador</h3>
              <p className="text-3xl font-bold text-blue-600 mb-2">{count}</p>
                <button onClick={increment}
                    className="px-4 py-2 bg-green-500 text-white rounded-lg font-semibold hover:bg-green-600 transition-colors"
                >
                    +1
                </button>
              <p className="text-xs text-blue-700">
                Incrementa el contador en demo1 y verás el valor aquí
              </p>
            </div>

            {/* Usuario */}
            <div className="p-6 bg-purple-50 rounded-lg border border-purple-200">
              <h3 className="text-lg font-bold text-purple-900 mb-2">👤 Usuario</h3>
              <p className="text-sm text-purple-800">
                {isLoggedIn && user ? (
                  <>
                    <span className="font-bold">{user.name}</span>
                    <br />
                    <span className="text-xs">{user.email}</span>
                  </>
                ) : (
                  <span>No logueado</span>
                )}
              </p>
            </div>
          </div>

          {/* Info Box */}
          <div className="p-6 bg-green-50 border-l-4 border-green-500 rounded-lg">
            <h3 className="text-lg font-bold text-green-900 mb-2">
              ✅ ¿Qué demuestra esto?
            </h3>
            <ul className="text-sm text-green-800 space-y-2">
              <li>
                ✓ El estado persiste cuando navegas entre páginas
              </li>
              <li>
                ✓ Los cambios en un store son visibles en todas las rutas
              </li>
              <li>
                ✓ No hay necesidad de compartir props entre componentes
              </li>
              <li>
                ✓ Zustand mantiene el estado global de forma eficiente
              </li>
            </ul>
          </div>

          {/* Botones de navegación */}
          <div className="flex gap-4 justify-center mt-8">
            <button
              onClick={() => router.push("/zustand-demo")}
              className="px-6 py-3 bg-blue-500 text-white rounded-lg font-semibold hover:bg-blue-600 transition-colors"
            >
              ← Volver a Demo 1
            </button>
            <button
              onClick={() => router.back()}
              className="px-6 py-3 bg-gray-500 text-white rounded-lg font-semibold hover:bg-gray-600 transition-colors"
            >
              Atrás
            </button>
          </div>
        </div>
      </div>
    </main>
  );
}
