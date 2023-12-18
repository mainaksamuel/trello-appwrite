import { Board, Todo, TypedColumn } from "@/typings";

export default function formatTodosForAI(board: Board) {
  const todos = Array.from(board.columns.entries());

  const flatArr = todos.reduce(
    (map, [key, value]) => {
      map[key] = value.todos;
      return map;
    },
    {} as { [key in TypedColumn]: Todo[] },
  );

  const flatArrCount = Object.entries(flatArr).reduce(
    (map, [key, value]) => {
      map[key as TypedColumn] = value.length;
      return map;
    },
    {} as { [key in TypedColumn]: number },
  );

  return flatArrCount;
}
