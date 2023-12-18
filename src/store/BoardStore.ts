import { getTodosGroupedByColumn, dbUpdateTodos } from "@/lib/todo-service";
import { Board, Column, Todo, TypedColumn } from "@/typings";
import { create } from "zustand";

interface BoardState {
  board: Board;
  getBoard: () => void;
  setBoardState: (board: Board) => void;
  updateTodoInDB: (todo: Todo, columnId: TypedColumn) => void;
  searchString: string;
  setSearchString: (searchString: string) => void;
}

export const useBoardStore = create<BoardState>((set) => ({
  board: {
    columns: new Map<TypedColumn, Column>(),
  },
  getBoard: async () => {
    const board = await getTodosGroupedByColumn();
    set({ board });
  },
  setBoardState: (board) => {
    set({ board });
  },
  updateTodoInDB: async (todo, columnId) => {
    await dbUpdateTodos(todo, columnId);
  },
  searchString: "",
  setSearchString: (searchString) => {
    set({ searchString });
  },
}));
