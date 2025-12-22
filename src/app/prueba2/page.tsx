"use client";

import { getTasks } from "@/services/task";

import { useEffect, useState } from "react";

const Prueba = () => {
  const [page, setPage] = useState<number>(0);
  const [loading, setLoding] = useState<boolean>(false);

  const [task, setTask] = useState<any[]>([]);

  useEffect(() => {
    const fecthTickets = async () => {
      try {
        setLoding(true);
        const response = await getTasks();
        setTask(response.data);
      } catch (err) {
        console.error("internal server error");
        console.error(err);
      } finally {
        setLoding(false);
      }
    };

    fecthTickets();

    console.log("se ejecuto el useEffect");
  }, [page]);

  console.log(task);

  return (
    <div>
      <div className="flex gap-4">
        <button
          className=" border-t-amber-500 bg-cyan-600 p-4"
          onClick={() => {
            setPage(page - 1);
          }}
        >
          prev page
        </button>
        <button
          className=" border-t-amber-500 bg-cyan-600 p-4"
          onClick={() => {
            setPage(page + 1);
          }}
        >
          next page
        </button>
      </div>

       <div>
        { loading ? <div>cargando...</div> : <div>Todo okk.....</div> }
       </div>

      {task.map((item) => (
        <div key={item._id}>
          <div>{item.title}</div>
          <div>{item.description}</div>
        </div>
      ))}

      <div className="text-9xl">{page}</div>
    </div>
  );
};

export default Prueba;
