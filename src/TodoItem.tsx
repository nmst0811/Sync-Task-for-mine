import { faTriangleExclamation } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import type { Todo } from "./types";
import { CATEGORY_COLORS } from "./constants"; // ◀◀ ここを変更
import { twMerge } from "tailwind-merge";
import dayjs from "dayjs";

type Props = {
  todo: Todo;
  updateIsDone: (id: string, value: boolean) => void;
  remove: (id: string) => void;
};

const TodoItem = ({ todo, updateIsDone, remove }: Props) => {
  // 色の取得ロジック（なければグレー）
  const categoryColor = todo.category ? CATEGORY_COLORS[todo.category] : 'bg-gray-300';

  return (
    // ... (以下のreturnの中身は前回のままでOKです)
    <div
      className={twMerge(
        "mb-2 flex items-center justify-between rounded-md border bg-white p-3 shadow-sm transition-all hover:shadow-md pl-0 overflow-hidden",
        todo.isDone && "bg-gray-100 opacity-50"
      )}
    >
      <div className="flex items-center h-full">
        {/* 左端のカラーバー */}
        <div className={`w-2 self-stretch mr-3 ${categoryColor}`}></div>
        
        {/* 以下、前回と同じ... */}
        <label className="flex items-center space-x-2 cursor-pointer">
          <input
            type="checkbox"
            checked={todo.isDone}
            onChange={(e) => updateIsDone(todo.id, e.target.checked)}
            className="h-5 w-5 rounded border-gray-300 text-indigo-600 focus:ring-indigo-500"
          />
          <span
            className={twMerge(
              "text-lg font-bold text-gray-700 transition-all",
              todo.isDone && "line-through text-gray-400"
            )}
          >
            {todo.name}
          </span>
        </label>
      </div>

      <div className="flex items-center space-x-2">
        <div className="mr-2 font-bold text-yellow-500 text-sm tracking-widest">
          {{ 1: "★★★", 2: "★★", 3: "★" }[todo.priority] || "★"}
        </div>
        {todo.deadline && (
          <div className="mr-2 rounded-md border border-gray-300 px-2 py-1 text-xs text-gray-500">
            締切: {dayjs(todo.deadline).format("YYYY/MM/DD HH:mm")}
          </div>
        )}
        <button
          onClick={() => remove(todo.id)}
          className="rounded-md bg-slate-200 px-2 py-1 text-sm font-bold text-white hover:bg-red-500 transition-colors"
        >
          削除
        </button>
      </div>
    </div>
  );
};

export default TodoItem;