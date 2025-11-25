import { useState } from "react";
import { v4 as uuid } from "uuid";
import dayjs from "dayjs";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faCalendarCheck, faXmark } from "@fortawesome/free-solid-svg-icons";
import { faGoogle, faMicrosoft } from "@fortawesome/free-brands-svg-icons";
import { CATEGORIES } from "./constants"; // 定数をインポート
import type { Todo } from "./types";

// 親（App.tsx）から受け取る関数の型定義
type Props = {
  onAddTodo: (todo: Todo) => void;
  onSendNotification: (title: string) => void;
};

const TaskCreator = ({ onAddTodo, onSendNotification }: Props) => {
  // ▼▼ Stateやロジックはここ（App.tsxから移動） ▼▼
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState("school");
  const [newTodoName, setNewTodoName] = useState("");
  const [newTodoPriority, setNewTodoPriority] = useState(3);
  const [newTodoDeadline, setNewTodoDeadline] = useState<Date | null>(null);
  const [newTodoNameError, setNewTodoNameError] = useState("");

  // バリデーション
  const isValidTodoName = (name: string): string => {
    if (name.length < 2 || name.length > 32)
      return "2文字以上、32文字以内で入力してください";
    return "";
  };

  // カレンダーURL生成
  const generateCalendarUrl = (type: "google" | "outlook", title: string, date: Date | null) => {
    if (!date) return "";
    const startDate = dayjs(date);
    const endDate = startDate.add(1, "hour");
    const formatG = (d: dayjs.Dayjs) => d.format("YYYYMMDDTHHmmss");

    if (type === "google") {
      return `https://www.google.com/calendar/render?action=TEMPLATE&text=${encodeURIComponent(title)}&dates=${formatG(startDate)}/${formatG(endDate)}`;
    } else {
      return `https://outlook.live.com/calendar/0/deeplink/compose?subject=${encodeURIComponent(title)}&startdt=${startDate.toISOString()}&enddt=${endDate.toISOString()}`;
    }
  };

  // モーダルを開く
  const openAddModal = (categoryId: string) => {
    setSelectedCategory(categoryId);
    setNewTodoName("");
    setNewTodoPriority(3);
    setNewTodoDeadline(dayjs().add(1, "day").hour(23).minute(59).toDate());
    setNewTodoNameError("");
    setIsModalOpen(true);
  };

  // タスク追加実行
  const handleAddNewTodo = (linkTo?: "google" | "outlook") => {
    const err = isValidTodoName(newTodoName);
    if (err !== "") {
      setNewTodoNameError(err);
      return;
    }

    const newTodo: Todo = {
      id: uuid(),
      name: newTodoName,
      isDone: false,
      priority: newTodoPriority,
      deadline: newTodoDeadline,
      category: selectedCategory,
    };

    // 親の関数を実行して保存
    onAddTodo(newTodo);
    onSendNotification(newTodoName);

    if (linkTo && newTodoDeadline) {
      const url = generateCalendarUrl(linkTo, newTodoName, newTodoDeadline);
      window.open(url, "_blank");
    }

    setIsModalOpen(false);
  };

  return (
    <>
      {/* ▼▼ 下部固定メニュー（レスポンシブ対応：max-w-2xlで中央寄せ） ▼▼ */}
      <div className="fixed bottom-0 left-0 right-0 z-10 flex justify-center p-2 pb-6">
        {/* この div が背景の白いバー。幅を制限して中央に配置 */}
        <div className="w-full max-w-2xl rounded-2xl border border-gray-200 bg-white/90 shadow-lg backdrop-blur-sm">
          <div className="flex justify-around p-2">
            {CATEGORIES.map((cat) => (
              <button
                key={cat.id}
                onClick={() => openAddModal(cat.id)}
                className="flex flex-col items-center gap-1 p-2 transition-transform active:scale-95"
              >
                <div
                  className={`${cat.color} flex h-10 w-10 items-center justify-center rounded-full text-lg text-white shadow-md sm:h-12 sm:w-12 sm:text-xl`}
                >
                  <FontAwesomeIcon icon={cat.icon} />
                </div>
                <span className="text-[10px] font-bold text-gray-600 sm:text-xs">
                  {cat.label}
                </span>
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* ▼▼ モーダル（ポップアップ） ▼▼ */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-end justify-center bg-black/50 p-4 transition-opacity sm:items-center">
          {/* モーダル本体も max-w-md で幅制限 */}
          <div className="w-full max-w-md animate-slide-up rounded-2xl bg-white p-5 shadow-2xl sm:animate-none">
            <div className="mb-4 flex items-center justify-between">
              <div className="flex items-center gap-2">
                <div
                  className={`h-8 w-3 rounded-full ${
                    CATEGORIES.find((c) => c.id === selectedCategory)?.color
                  }`}
                ></div>
                <h2 className="text-xl font-bold text-gray-800">
                  {CATEGORIES.find((c) => c.id === selectedCategory)?.label}
                </h2>
              </div>
              <button
                onClick={() => setIsModalOpen(false)}
                className="text-gray-400 hover:text-gray-600"
              >
                <FontAwesomeIcon icon={faXmark} size="xl" />
              </button>
            </div>

            <div className="space-y-4">
              <div>
                <label className="text-sm font-bold text-gray-500">
                  タスク名
                </label>
                <input
                  autoFocus
                  type="text"
                  value={newTodoName}
                  onChange={(e) => {
                    setNewTodoName(e.target.value);
                    setNewTodoNameError(isValidTodoName(e.target.value));
                  }}
                  className={`w-full border-b-2 bg-transparent p-2 text-lg font-bold focus:outline-none ${
                    newTodoNameError ? "border-red-500" : "border-indigo-500"
                  }`}
                  placeholder="タスクを入力..."
                />
                {newTodoNameError && (
                  <p className="mt-1 text-sm text-red-500">
                    {newTodoNameError}
                  </p>
                )}
              </div>

              <div>
                <label className="text-sm font-bold text-gray-500">重要度</label>
                <div className="mt-1 flex gap-2">
                  {[1, 2, 3].map((val) => (
                    <button
                      key={val}
                      onClick={() => setNewTodoPriority(val)}
                      className={`rounded-full border px-3 py-1 text-sm font-bold transition-colors ${
                        newTodoPriority === val
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
                  value={
                    newTodoDeadline
                      ? dayjs(newTodoDeadline).format("YYYY-MM-DDTHH:mm")
                      : ""
                  }
                  onChange={(e) =>
                    setNewTodoDeadline(
                      e.target.value ? new Date(e.target.value) : null
                    )
                  }
                  className="mt-1 w-full rounded border-none bg-gray-100 p-2 font-medium"
                />
              </div>

              <div className="flex flex-col gap-3 pt-4">
                <button
                  onClick={() => handleAddNewTodo()}
                  disabled={!!newTodoNameError || !newTodoName}
                  className="w-full rounded-xl bg-indigo-600 py-3 font-bold text-white shadow-md hover:bg-indigo-700 disabled:opacity-50"
                >
                  <FontAwesomeIcon icon={faCalendarCheck} className="mr-2" />
                  アプリに追加
                </button>

                <div className="grid grid-cols-2 gap-3">
                  <button
                    onClick={() => handleAddNewTodo("google")}
                    disabled={
                      !!newTodoNameError || !newTodoName || !newTodoDeadline
                    }
                    className="flex items-center justify-center gap-2 rounded-xl border border-gray-300 bg-white py-2 font-bold text-gray-700 hover:bg-gray-50 disabled:opacity-50"
                  >
                    <FontAwesomeIcon
                      icon={faGoogle}
                      className="text-blue-500"
                    />
                    + Google
                  </button>
                  <button
                    onClick={() => handleAddNewTodo("outlook")}
                    disabled={
                      !!newTodoNameError || !newTodoName || !newTodoDeadline
                    }
                    className="flex items-center justify-center gap-2 rounded-xl border border-gray-300 bg-white py-2 font-bold text-gray-700 hover:bg-gray-50 disabled:opacity-50"
                  >
                    <FontAwesomeIcon
                      icon={faMicrosoft}
                      className="text-blue-700"
                    />
                    + Outlook
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default TaskCreator;