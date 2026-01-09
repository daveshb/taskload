"use client";

import { useRouter } from "next/navigation";
import { ThemeToggle } from "./components/theme-toggle";
import { Counter } from "./components/counter";
import { UserPanel } from "./components/user-panel";

export default function ZustandDemoPage() {
  const router = useRouter();

  return (
    <main className="min-h-screen bg-gray-50 p-8">
      <div className="max-w-2xl mx-auto">
        <h1 className="text-5xl font-bold mb-2 text-gray-900">
          Zustand + Next.js App Router
        </h1>
        <p className="text-gray-600 mb-8">
          Demostración de estado global con tres stores: Tema, Contador y Usuario
        </p>

        <div className="space-y-6">
          {/* Theme Toggle */}
          <div>
            <h2 className="text-2xl font-semibold mb-3 text-gray-800">
              🎨 Store de Tema
            </h2>
            <ThemeToggle />
          </div>

          {/* Counter */}
          <div>
            <h2 className="text-2xl font-semibold mb-3 text-gray-800">
              🔢 Store de Contador
            </h2>
            <Counter />
          </div>

          {/* User Panel */}
          <div>
            <h2 className="text-2xl font-semibold mb-3 text-gray-800">
              👤 Store de Usuario
            </h2>
            <UserPanel />
          </div>

          {/* Info Box */}
          <div className="mt-8 p-6 bg-blue-50 border-l-4 border-blue-500 rounded-lg">
            <h3 className="text-lg font-bold text-blue-900 mb-2">
              💡 ¿Cómo funcionan estos stores?
            </h3>
            <ul className="text-sm text-blue-800 space-y-2">
              <li>
                <strong>useThemeStore:</strong> Gestiona el tema (claro/oscuro)
                globalmente
              </li>
              <li>
                <strong>useCounterStore:</strong> Mantiene un contador disponible
                en toda la app
              </li>
              <li>
                <strong>useUserStore:</strong> Controla la sesión y datos del
                usuario
              </li>
            </ul>
            <p className="text-sm text-blue-800 mt-4">
              Puedes usar estos stores en cualquier componente cliente sin necesidad
              de prop drilling. Los cambios en un store se reflejan automáticamente en
              todos los componentes que los usan.
            </p>
          </div>

          {/* Botón para ir a Demo 2 */}
          <div className="flex justify-center mt-8">
            <button
              onClick={() => router.push("/zustand-demo2")}
              className="px-8 py-3 bg-indigo-600 text-white rounded-lg font-semibold hover:bg-indigo-700 transition-colors text-lg"
            >
              Ir a Demo 2 →
            </button>
          </div>
        </div>
      </div>
    </main>
  );
}
