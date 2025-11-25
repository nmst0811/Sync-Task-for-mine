import { useState, useEffect } from "react";
import type { Todo } from "./types";
import { initTodos } from "./initTodos";
import TodoList from "./TodoList";
import TaskCreator from "./TaskCreator"; // 作ったコンポーネントをインポート
import { CATEGORIES } from "./constants";

const App = () => {
  const [todos, setTodos] = useState<Todo[]>([]);
  const [initialized, setInitialized] = useState(false);
  const localStorageKey = "TodoApp";

  // 通知許可
  useEffect(() => {
    if (Notification.permission === "default") {
      Notification.requestPermission();
    }
  }, []);

  // ロード
  useEffect(() => {
    const todoJsonStr = localStorage.getItem(localStorageKey);
    if (todoJsonStr && todoJsonStr !== "[]") {
      const storedTodos: Todo[] = JSON.parse(todoJsonStr);
      const convertedTodos = storedTodos.map((todo) => ({
        ...todo,
        deadline: todo.deadline ? new Date(todo.deadline) : null,
      }));
      setTodos(convertedTodos);
    } else {
      setTodos(initTodos);
    }
    setInitialized(true);
  }, []);

  // セーブ
  useEffect(() => {
    if (initialized) {
      localStorage.setItem(localStorageKey, JSON.stringify(todos));
    }
  }, [todos, initialized]);

  // 通知機能
  const sendNotification = (title: string) => {
    if (Notification.permission === "granted") {
      new Notification("課題追加！", { body: `${title} をリストに追加しました` });
    }
  };

  // Todo追加機能（TaskCreatorから呼び出される）
  const handleAddTodo = (newTodo: Todo) => {
    setTodos([...todos, newTodo]);
  };

  // Todo更新機能
  const updateIsDone = (id: string, value: boolean) => {
    const updatedTodos = todos.map((todo) =>
      todo.id === id ? { ...todo, isDone: value } : todo
    );
    setTodos(updatedTodos);
  };

  // Todo削除機能
  const remove = (id: string) =>
    setTodos(todos.filter((todo) => todo.id !== id));
  
  const removeCompletedTodos = () =>
    setTodos(todos.filter((todo) => !todo.isDone));

  return (
    <div className="relative min-h-screen bg-gray-100 pb-32">
      <div className="mx-4 max-w-2xl pt-10 md:mx-auto">
        <h1 className="mb-4 text-2xl font-bold text-gray-800">
          <span className="text-indigo-600">Sync-Task</span> for mine
        </h1>

        {/* リスト表示 */}
        <TodoList todos={todos} updateIsDone={updateIsDone} remove={remove} />

        {todos.some((t) => t.isDone) && (
          <button
            onClick={removeCompletedTodos}
            className="mt-5 w-full rounded-md bg-red-100 px-3 py-2 font-bold text-red-500 transition-colors hover:bg-red-200"
          >
            完了済みのタスクを一括削除
          </button>
        )}
      </div>

      {/* ▼▼ ここに新しいコンポーネントを置くだけ！ ▼▼ */}
      <TaskCreator 
        onAddTodo={handleAddTodo} 
        onSendNotification={sendNotification} 
      />
    </div>
  );
};

export default App;