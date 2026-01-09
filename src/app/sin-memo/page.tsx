"use client";

import { useState } from "react";

// Componente SIN useMemo - cálculo costoso se ejecuta en cada render
function ExpensiveCalculation({ count }: { count: number }) {
  // Simulamos un cálculo muy costoso
  const expensiveResult = (() => {
    console.log(" [SIN MEMO] Calculando resultado costoso...");
    let result = 0;
    for (let i = 0; i < 1000000000; i++) {
      result += Math.sqrt(i);
    }
    console.log("SIN MEMO Cálculo completado:", result.toFixed(0));
    return result;
  })();

  return (
    <div className="p-4 bg-red-100 border-2 border-red-500 rounded-lg">
      <h3 className="text-lg font-bold text-red-700 mb-2">SIN useMemo</h3>
      <p className="text-sm text-gray-700 mb-2">
        El cálculo se ejecuta CADA VEZ que el componente se renderiza
      </p>
      <p className="text-sm font-mono text-gray-600">
        Count: {count} | Resultado: {expensiveResult.toFixed(0)}
      </p>
    </div>
  );
}



export default function SinMemoPage() {
  const [count, setCount] = useState(0);

  return (
    <div className="min-h-screen bg-linear-to-br from-gray-50 to-gray-100 p-8">
      <div className="max-w-2xl mx-auto">
        <h1 className="text-4xl font-bold mb-8 text-gray-800">
          Demostración: SIN useMemo
        </h1>

        <div className="space-y-6">
          <div className="bg-white p-6 rounded-lg shadow-lg">
            <h2 className="text-2xl font-semibold mb-4 text-gray-700">
              Contador: {count}
            </h2>
            <button
              onClick={() => setCount(count + 1)}
              className="px-6 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600 transition-colors font-semibold"
            >
              Incrementar (+1)
            </button>
            <p className="text-sm text-gray-500 mt-4">
              Abre la consola para ver cómo el cálculo se ejecuta cada vez que
              haces clic
            </p>
          </div>

          <ExpensiveCalculation count={count} />

          <div className="bg-yellow-50 border-l-4 border-yellow-400 p-4 rounded">
            <p className="text-sm text-yellow-800">
              <strong> Observa la consola:</strong> Cada vez que incrementas el
              contador, verás el mensaje
              <code className="bg-yellow-100 px-2 py-1 rounded ml-1">
                [SIN MEMO] Calculando resultado costoso...
              </code>
              , incluso aunque el resultado sea el mismo.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
