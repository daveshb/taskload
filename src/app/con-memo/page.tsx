'use client';

import { useState, useMemo } from 'react';

// Componente CON useMemo - cálculo costoso se memoriza
function ExpensiveCalculationWithMemo({ count, dummy }: { count: number, dummy:number }) {
  // Usamos useMemo para memorizar el resultado
  const expensiveResult = useMemo(() => {
    console.log(' [CON MEMO] Calculando resultado costoso...');
    let result = 0;
    for (let i = 0; i < 1000000000; i++) {
      result += Math.sqrt(i);
    }
    console.log(' [CON MEMO] Cálculo completado:', result.toFixed(0));
    return result;
  }, [count,dummy]); // Dependencia: solo recalcula si count cambia

  return (
    <div className="p-4 bg-green-100 border-2 border-green-500 rounded-lg">
      <h3 className="text-lg font-bold text-green-700 mb-2"> CON useMemo</h3>
      <p className="text-sm text-gray-700 mb-2">
        El cálculo se memoriza y solo se ejecuta cuando count cambia
      </p>
      <p className="text-sm font-mono text-gray-600">
        Count: {count} | Resultado: {expensiveResult.toFixed(0)}
      </p>
    </div>
  );
}

export default function ConMemoPage() {
  const [count, setCount] = useState(0);
  const [dummy, setDummy] = useState(0);

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 p-8">
      <div className="max-w-2xl mx-auto">
        <h1 className="text-4xl font-bold mb-8 text-gray-800">
          Demostración: CON useMemo 
        </h1>

        <div className="space-y-6">
          <div className="bg-white p-6 rounded-lg shadow-lg">
            <h2 className="text-2xl font-semibold mb-4 text-gray-700">
              Contador Principal: {count}
            </h2>
            <button
              onClick={() => setCount(count + 1)}
              className="px-6 py-2 bg-green-500 text-white rounded-lg hover:bg-green-600 transition-colors font-semibold"
            >
              Incrementar Contador (+1)
            </button>
          </div>

          <ExpensiveCalculationWithMemo count={count} dummy={dummy} />

          <div className="bg-white p-6 rounded-lg shadow-lg">
            <h2 className="text-2xl font-semibold mb-4 text-gray-700">
              Contador Dummy (no afecta cálculo): {dummy}
            </h2>
            <button
              onClick={() => setDummy(dummy + 1)}
              className="px-6 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors font-semibold"
            >
              Incrementar Dummy (+1)
            </button>
          </div>

          <div className="bg-green-50 border-l-4 border-green-400 p-4 rounded">
            <p className="text-sm text-green-800">
              <strong> Observa la consola:</strong> 
              <ul className="mt-2 space-y-1">
                <li>• Al hacer clic en Incrementar Contador: verás el mensaje de cálculo</li>
                <li>• Al hacer clic en Incrementar Dummy: <strong>NO verás el mensaje</strong> (no recalcula)</li>
              </ul>
            </p>
          </div>

          <div className="bg-blue-50 border-l-4 border-blue-400 p-4 rounded">
            <p className="text-sm text-blue-800">
              <strong> ¿Por qué?</strong> El <code className="bg-blue-100 px-2 py-1 rounded">useMemo</code> solo recalcula 
              cuando sus dependencias cambian. Dummy no está en las dependencias, así que el cálculo anterior se reutiliza.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
