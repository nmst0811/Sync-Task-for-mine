import type { Todo } from "./types";
import { v4 as uuid } from "uuid";

export const initTodos: Todo[] = [
  {
    id: uuid(),
    name: "【MMD】会議",
    isDone: false,
    priority: 1,
    deadline: new Date(2025, 2, 9, 19, 0),
  },
];