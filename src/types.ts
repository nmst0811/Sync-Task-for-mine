export type Tag = {
  id: string;
  label: string;
  color: string; // Tailwindのクラス名 (例: "bg-red-200 text-red-700")
};

export type Todo = {
  id: string;
  name: string;
  isDone: boolean;
  priority: number;
  deadline: Date | null;
  category: string;
  tags?: string[];
};