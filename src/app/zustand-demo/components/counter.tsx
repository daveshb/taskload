"use client";

import { useCounterStore } from "@/stores/counter-store";

export function Counter() {
  const { count, increment, decrement, reset } = useCounterStore();

  return (
    <div className="flex flex-col items-center gap-4 p-6 bg-blue-50 rounded-lg border border-blue-200">
      <p className="text-2xl font-bold text-blue-900">Contador: {count}</p>
      <div className="flex gap-2">
        <button
          onClick={decrement}
          className="px-4 py-2 bg-red-500 text-white rounded-lg font-semibold hover:bg-red-600 transition-colors"
        >
          -1
        </button>
        <button
          onClick={increment}
          className="px-4 py-2 bg-green-500 text-white rounded-lg font-semibold hover:bg-green-600 transition-colors"
        >
          +1
        </button>
        <button
          onClick={reset}
          className="px-4 py-2 bg-yellow-500 text-white rounded-lg font-semibold hover:bg-yellow-600 transition-colors"
        >
          Reset
        </button>
      </div>
    </div>
  );
}
