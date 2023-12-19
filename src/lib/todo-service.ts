import { ID, databases, storage } from "@/appwrite";

// Get Image url
export async function getImageURL(image: Image) {
  return storage.getFilePreview(image.bucketId, image.fileId);
}

// Add an image to the appwrite storage
export async function uploadImage(image: File | null) {
  if (!image) return;

  const fileUploaded = await storage.createFile(
    process.env.NEXT_PUBLIC_STORAGE_ID!,
    ID.unique(),
    image,
  );

  return fileUploaded;
}

// Add a `todo` to the appwrite db
export async function dbAddTodo(todo: InputTodo) {
  return await databases.createDocument(
    process.env.NEXT_PUBLIC_DATABASE_ID!,
    process.env.NEXT_PUBLIC_TODOS_COLLECTION_ID!,
    ID.unique(),
    todo,
  );
}

// Delete a `todo` from the appwrite db
export async function dbDeleteTodo(todo: Todo) {
  if (todo.image) {
    await storage.deleteFile(todo.image.bucketId, todo.image.fileId);
  }
  await databases.deleteDocument(
    process.env.NEXT_PUBLIC_DATABASE_ID!,
    process.env.NEXT_PUBLIC_TODOS_COLLECTION_ID!,
    todo.$id,
  );
}

// Update the `todo` collection in the appwrite db
export async function dbUpdateTodos(todo: Todo, columnId: TypedColumn) {
  await databases.updateDocument(
    process.env.NEXT_PUBLIC_DATABASE_ID!,
    process.env.NEXT_PUBLIC_TODOS_COLLECTION_ID!,
    todo.$id,
    {
      title: todo.title,
      status: columnId,
    },
  );
}

// Group `todos` by column for the `Board`
export async function getTodosGroupedByColumn() {
  const data = await databases.listDocuments(
    process.env.NEXT_PUBLIC_DATABASE_ID!,
    process.env.NEXT_PUBLIC_TODOS_COLLECTION_ID!,
  );

  const todos = data.documents;

  const columns = todos.reduce((acc, todo) => {
    if (!acc.get(todo.status)) {
      acc.set(todo.status, {
        id: todo.status,
        todos: [],
      });
    }

    acc.get(todo.status)!.todos.push({
      $id: todo.$id,
      $createdAt: todo.$createdAt,
      title: todo.title,
      status: todo.status,
      ...(todo.image && { image: JSON.parse(todo.image) }),
    });

    return acc;
  }, new Map<TypedColumn, Column>());

  // if the columns do not have `todo`, `inprogress` and `done`,
  // add them with empty `todos`
  const columnTypes: TypedColumn[] = ["todo", "inprogress", "done"];

  for (const columnType of columnTypes) {
    if (!columns.get(columnType)) {
      columns.set(columnType, {
        id: columnType,
        todos: [],
      });
    }
  }

  // sort the columns by columnTypes order
  const sortedColumns = new Map(
    Array.from(columns.entries()).sort(
      (a, b) => columnTypes.indexOf(a[0]) - columnTypes.indexOf(b[0]),
    ),
  );

  const board: Board = {
    columns: sortedColumns,
  };

  return board;
}
