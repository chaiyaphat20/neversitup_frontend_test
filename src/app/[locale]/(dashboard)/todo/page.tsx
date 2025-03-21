import TodoScreen from "./components/TodoScreen";

export default async function Home() {
  return (
    <div className="w-full">
      <div className="w-full mx-auto max-w-[1000px] px-4">
        <TodoScreen />
      </div>
    </div>
  );
}
