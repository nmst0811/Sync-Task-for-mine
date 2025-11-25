import { useState, useEffect } from "react";
import type { Todo, Tag } from "./types";
import { initTodos } from "./initTodos";
import TodoList from "./TodoList";
import TaskCreator from "./TaskCreator"; // 作ったコンポーネントをインポート
import TaskEditor from "./TaskEditor";
import TagManager from "./TagManager"; // ◀◀ 追加
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faTag } from "@fortawesome/free-solid-svg-icons"; // アイコン追加
import { CATEGORIES } from "./constants";

const App = () => {
  const [todos, setTodos] = useState<Todo[]>([]);
  const [initialized, setInitialized] = useState(false);
  const [editingTodo, setEditingTodo] = useState<Todo | null>(null);
  const [tags, setTags] = useState<Tag[]>([]); // ◀◀ 追加: タグのState
  const [isTagManagerOpen, setIsTagManagerOpen] = useState(false); // ◀◀ 追加: タグ管理画面の開閉
  const localStorageKey = "TodoApp";
  const tagStorageKey = "TodoApp_Tags";

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
    // ▼▼ タグの読み込み ▼▼
    const tagJsonStr = localStorage.getItem(tagStorageKey);
    if (tagJsonStr) {
      setTags(JSON.parse(tagJsonStr));
    }
    setInitialized(true);
  }, []);

  // セーブ
  useEffect(() => {
    if (initialized) {
      localStorage.setItem(localStorageKey, JSON.stringify(todos));
      localStorage.setItem(tagStorageKey, JSON.stringify(tags));
    }
  }, [todos, tags, initialized]);

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

  const handleAddTag = (newTag: Tag) => setTags([...tags, newTag]);

  const handleDeleteTag = (id: string) => {
    setTags(tags.filter((t) => t.id !== id));
    // タスクからも削除されたタグIDを消すのが親切だが、今回は表示時に無視されるのでそのままでOK
  };

  const handleUpdateTodo = (updatedTodo: Todo) => {
    const newTodos = todos.map((t) => (t.id === updatedTodo.id ? updatedTodo : t));
    setTodos(newTodos);
    setEditingTodo(null); // モーダルを閉じる
  };

  const handleDeleteFromEditor = (id: string) => {
    remove(id);
    setEditingTodo(null);
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
        <div className="flex items-center justify-between mb-4">
          <h1 className="mb-4 text-2xl font-bold text-gray-800">
            <span className="text-teal-500">Sync-Task</span> for mine
          </h1>
          <button 
                onClick={() => setIsTagManagerOpen(true)}
                className="text-teal-500 bg-teal-50 p-2 rounded-full hover:bg-teal-100"
            >
                <FontAwesomeIcon icon={faTag} />
            </button>
        </div>

        {/* ▼▼ 編集: onEditプロップを追加 ▼▼ */}
        <TodoList 
          todos={todos} 
          tags={tags}
          updateIsDone={updateIsDone} 
          remove={remove} 
          onEdit={setEditingTodo} 
        />

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
        tags={tags}
      />

      {editingTodo && (
        <TaskEditor
          todo={editingTodo}
          tags={tags}
          onSave={handleUpdateTodo}
          onCancel={() => setEditingTodo(null)}
          onDelete={handleDeleteFromEditor}
        />
      )}

      {isTagManagerOpen && (
        <TagManager
            tags={tags}
            onAddTag={handleAddTag}
            onDeleteTag={handleDeleteTag}
            onClose={() => setIsTagManagerOpen(false)}
        />
      )}
    </div>
  );
};

export default App;