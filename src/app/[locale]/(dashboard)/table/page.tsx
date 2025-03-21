"use client";

import { transformTableDataToObjects } from "@/utils/helper";
import { useRouter } from "next/navigation";
import React from "react";

const data = {
  columns: [
    {
      key: "id",
      name: "",
    },
    {
      key: "no",
      name: "No.",
    },
    {
      key: "title",
      name: "Title",
    },
    {
      key: "desc",
      name: "Description",
    },
    {
      key: "date",
      name: "Created Date",
    },
  ],
  data: [
    [
      "f22ecad5-cbb6-402b-995f-6867792bc9c6",
      1,
      "Job 1",
      "This is job 1",
      "1 Oct 2023 12:03:48",
    ],
    [
      "6a412fa7-2c3b-4e38-8973-2b32479bffab",
      2,
      "Job 2",
      "This is job 2",
      "11 Oct 2023 10:03:48",
    ],
    [
      "2c302941-3ba7-413d-84a6-20503355b08a",
      3,
      "Job 3",
      "This is job 3",
      "14 Oct 2023 18:34:48",
    ],
    [
      "eff7e063-3e18-4790-95b4-abf62470e874",
      4,
      "Job 4",
      "This is job 4",
      "1 Oct 2023 09:26:48",
    ],
  ],
};

function Table() {
  const tableData = transformTableDataToObjects(data);
  const router = useRouter();
  const goBack = () => {
    router.back();
  };
  return (
    <div className="p-4">
      <div className="mx-auto max-w-[1000px]">
        <table className="min-w-full border border-gray-300 ">
          <thead>
            <tr className="bg-gray-100">
              {data.columns
                .filter((col) => col.name)
                .map((column) => (
                  <th key={column.key} className="px-4 py-2 text-left border-b">
                    {column.name}
                  </th>
                ))}
            </tr>
          </thead>
          <tbody>
            {tableData.map((row) => (
              <tr key={row.id} className="hover:bg-gray-50">
                <td className="px-4 py-2 border-b">{row.no}</td>
                <td className="px-4 py-2 border-b">{row.title}</td>
                <td className="px-4 py-2 border-b">{row.desc}</td>
                <td className="px-4 py-2 border-b">{row.date}</td>
              </tr>
            ))}
          </tbody>
        </table>
        <button
          onClick={goBack}
          className="bg-white px-4 py-2 rounded border text-red-500 mt-4"
        >
          Goto todo list
        </button>
      </div>
    </div>
  );
}

export default Table;
