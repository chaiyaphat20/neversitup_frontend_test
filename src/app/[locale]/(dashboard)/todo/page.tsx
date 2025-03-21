import { Metadata } from "next";
import TodoScreen from "./components/TodoScreen";


export const metadata: Metadata = {
  title: 'My Todo App - Organize Your Tasks',
  description: 'จัดการ task ของคุณแบบง่ายๆ',
};

export default async function Home() {
  return (
    <div className="w-full">
      <div className="w-full mx-auto max-w-[1000px] px-4">
        <TodoScreen />
      </div>
    </div>
  );
}
