'use client'

import { useRouter } from "next/navigation";
import { useEffect } from "react";

export default function Home() {
  const router = useRouter();
  useEffect(()=>{
    router.push("/todo")
  },[])
  return (
    <div className="w-full ">
    </div>
  );
}
