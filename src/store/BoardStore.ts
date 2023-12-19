import {
  uploadImage,
  getTodosGroupedByColumn,
  dbUpdateTodos,
  dbDeleteTodo,
  dbAddTodo,
} from "@/lib/todo-service";
import { create } from "zustand";

interface BoardState {
  board: Board;
  getBoard: () => void;
  setBoardState: (board: Board) => void;
  updateTodoInDB: (todo: Todo, columnId: TypedColumn) => void;
  searchString: string;
  setSearchString: (searchString: string) => void;
  addTodoFn: (
    title: string,
    columnId: TypedColumn,
    image?: File | null,
  ) => void;
  deleteTodo: (todoIndex: number, todo: Todo, columnId: TypedColumn) => void;
  newTodoInput: string;
  setNewTodoInput: (input: string) => void;
  newTodoType: TypedColumn;
  setNewTodoType: (taskType: TypedColumn) => void;
  image: File | null;
  setImage: (image: File | null) => void;
}

export const useBoardStore = create<BoardState>()((set, get) => ({
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
  deleteTodo: async (todoIndex, todo, columnId) => {
    const currCols = new Map(get().board.columns);
    currCols.get(columnId)?.todos.splice(todoIndex, 1);
    set({ board: { columns: currCols } });

    await dbDeleteTodo(todo);
  },
  newTodoInput: "",
  setNewTodoInput: (newTaskInput) => {
    set({ newTodoInput: newTaskInput });
  },
  newTodoType: "todo",
  setNewTodoType: (newTaskType) => {
    set({ newTodoType: newTaskType });
  },
  image: null,
  setImage: (image) => {
    set({ image });
  },
  addTodoFn: async (title, columnId, image?: File | null) => {
    let file: Image | undefined;
    if (image) {
      const fileUploaded = await uploadImage(image);
      if (fileUploaded) {
        file = {
          bucketId: fileUploaded.bucketId,
          fileId: fileUploaded.$id,
        };
      }
    }

    const { $id, $createdAt } = await dbAddTodo({
      title: title,
      status: columnId,
      ...(file && { image: JSON.stringify(file) }),
    });

    set({ newTodoInput: "" });
    set((state) => {
      const currCols = new Map(state.board.columns);

      const addedTodo: Todo = {
        $id,
        $createdAt,
        title,
        status: columnId,
        ...(file && { image: file }),
      };
      const column = currCols.get(columnId);

      if (!column) {
        currCols.set(columnId, {
          id: columnId,
          todos: [addedTodo],
        });
      } else {
        currCols.get(columnId)?.todos.push(addedTodo);
      }

      return {
        board: {
          columns: currCols,
        },
      };
    });
  },
}));
