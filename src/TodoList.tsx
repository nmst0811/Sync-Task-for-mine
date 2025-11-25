import type { Todo, Tag } from "./types";
import TodoItem from "./TodoItem";

type Props = {
  todos: Todo[];
  tags: Tag[];
  updateIsDone: (id: string, value: boolean) => void;
  remove: (id: string) => void;
  onEdit: (todo: Todo) => void; // ◀◀ 追加: 編集ボタンを押したときの関数
};

const TodoList = ({ todos, tags, updateIsDone, remove, onEdit }: Props) => {
  // 表示順のソート
  // 1. 未完了のタスクを上に
  // 2. 優先度が高い（数字が小さい）順に
  const sortedTodos = [...todos].sort((a, b) => {
    if (a.isDone !== b.isDone) {
      return a.isDone ? 1 : -1; // 未完了(-1)を先に
    }
    if (a.priority !== b.priority) {
      return a.priority - b.priority; // 1(高) -> 2 -> 3(低) の順
    }
    // (オプション) もし優先度も同じなら期限が近い順にするならここに追加
    if (a.deadline && b.deadline) {
      return new Date(a.deadline).getTime() - new Date(b.deadline).getTime();
    }
    return 0;
  });

  return (
    <div className="space-y-2 pb-24">
      {sortedTodos.map((todo) => (
        <TodoItem
          key={todo.id}
          todo={todo}
          allTags={tags}
          updateIsDone={updateIsDone}
          remove={remove}
          onEdit={onEdit} // ◀◀ TodoItemへ渡す
        />
      ))}
      
      {todos.length === 0 && (
        <div className="text-center text-gray-400 mt-10 text-sm font-bold">
          <p>タスクがありません</p>
          <p>下のアイコンをタップして追加してください</p>
        </div>
      )}
    </div>
  );
};

export default TodoList;