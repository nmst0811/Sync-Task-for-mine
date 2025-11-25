import { useState } from "react";
import dayjs from "dayjs";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faSave, faXmark, faTrashCan } from "@fortawesome/free-solid-svg-icons";
import { faGoogle, faMicrosoft } from "@fortawesome/free-brands-svg-icons";
import { CATEGORIES } from "./constants";
import type { Todo } from "./types";

type Props = {
  todo: Todo;
  onSave: (updatedTodo: Todo) => void;
  onCancel: () => void;
  onDelete: (id: string) => void;
};

const TaskEditor = ({ todo, onSave, onCancel, onDelete }: Props) => {
  const [name, setName] = useState(todo.name);
  const [priority, setPriority] = useState(todo.priority);
  const [deadline, setDeadline] = useState<Date | null>(todo.deadline);

  // カレンダーURL生成 (共通ロジック)
  const generateCalendarUrl = (type: "google" | "outlook") => {
    if (!deadline) return;
    const startDate = dayjs(deadline);
    const endDate = startDate.add(1, "hour");
    const formatG = (d: dayjs.Dayjs) => d.format("YYYYMMDDTHHmmss");

    if (type === "google") {
      const url = `https://www.google.com/calendar/render?action=TEMPLATE&text=${encodeURIComponent(name)}&dates=${formatG(startDate)}/${formatG(endDate)}`;
      window.open(url, "_blank");
    } else {
      const url = `https://outlook.live.com/calendar/0/deeplink/compose?subject=${encodeURIComponent(name)}&startdt=${startDate.toISOString()}&enddt=${endDate.toISOString()}`;
      window.open(url, "_blank");
    }
  };

  const handleSave = () => {
    onSave({ ...todo, name, priority, deadline });
  };

  const categoryConfig = CATEGORIES.find((c) => c.id === todo.category);

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4 transition-opacity">
      <div className="w-full max-w-md animate-slide-up rounded-2xl bg-white p-5 shadow-2xl sm:animate-none">
        {/* ヘッダー */}
        <div className="mb-4 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className={`h-8 w-3 rounded-full ${categoryConfig?.color || "bg-gray-400"}`}></div>
            <h2 className="text-xl font-bold text-gray-800">タスクの編集</h2>
          </div>
          <button onClick={onCancel} className="text-gray-400 hover:text-gray-600">
            <FontAwesomeIcon icon={faXmark} size="xl" />
          </button>
        </div>

        {/* 編集フォーム */}
        <div className="space-y-4">
          <div>
            <label className="text-sm font-bold text-gray-500">タスク名</label>
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="w-full border-b-2 border-indigo-500 bg-transparent p-2 text-lg font-bold focus:outline-none"
            />
          </div>

          <div>
            <label className="text-sm font-bold text-gray-500">重要度</label>
            <div className="mt-1 flex gap-2">
              {[1, 2, 3].map((val) => (
                <button
                  key={val}
                  onClick={() => setPriority(val)}
                  className={`rounded-full border px-3 py-1 text-sm font-bold transition-colors ${
                    priority === val
                      ? "border-yellow-400 bg-yellow-50 text-yellow-600"
                      : "border-gray-200 bg-white text-gray-400 hover:bg-gray-50"
                  }`}
                >
                  {{ 1: "★★★", 2: "★★", 3: "★" }[val]}
                </button>
              ))}
            </div>
          </div>

          <div>
            <label className="text-sm font-bold text-gray-500">期限</label>
            <input
              type="datetime-local"
              value={deadline ? dayjs(deadline).format("YYYY-MM-DDTHH:mm") : ""}
              onChange={(e) => setDeadline(e.target.value ? new Date(e.target.value) : null)}
              className="mt-1 w-full rounded border-none bg-gray-100 p-2 font-medium"
            />
          </div>

          {/* アクションボタン */}
          <div className="flex flex-col gap-3 pt-4">
            <div className="grid grid-cols-2 gap-3">
              <button
                onClick={() => generateCalendarUrl("google")}
                disabled={!deadline}
                className="flex items-center justify-center gap-2 rounded-xl border border-gray-300 bg-white py-2 font-bold text-gray-700 hover:bg-gray-50 disabled:opacity-50"
              >
                <FontAwesomeIcon icon={faGoogle} className="text-blue-500" />
                <span className="text-xs sm:text-sm">Google登録</span>
              </button>
              <button
                onClick={() => generateCalendarUrl("outlook")}
                disabled={!deadline}
                className="flex items-center justify-center gap-2 rounded-xl border border-gray-300 bg-white py-2 font-bold text-gray-700 hover:bg-gray-50 disabled:opacity-50"
              >
                <FontAwesomeIcon icon={faMicrosoft} className="text-blue-700" />
                <span className="text-xs sm:text-sm">Outlook登録</span>
              </button>
            </div>

            <div className="flex gap-3">
              <button
                onClick={() => onDelete(todo.id)}
                className="flex-1 rounded-xl bg-red-100 py-3 font-bold text-red-500 hover:bg-red-200"
              >
                <FontAwesomeIcon icon={faTrashCan} className="mr-2" />
                削除
              </button>
              <button
                onClick={handleSave}
                className="flex-2 rounded-xl bg-indigo-600 py-3 font-bold text-white shadow-md hover:bg-indigo-700"
              >
                <FontAwesomeIcon icon={faSave} className="mr-2" />
                保存して閉じる
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default TaskEditor;