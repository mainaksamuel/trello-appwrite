interface Board {
  columns: Map<TypedColumn, Column>;
}

type TypedColumn = "todo" | "inprogress" | "done";

interface Column {
  id: TypedColumn;
  todos: Todo[];
}

interface Todo {
  $id: string;
  $createdAt: string;
  title: string;
  status: TypedColumn;
  image?: Image;
}

interface InputTodo {
  title: string;
  status: TypedColumn;
  // json string of the image location on the appwrite bucket.
  // Obtained after first uploading the image then getting the params
  image?: string;
}

interface Image {
  bucketId: string;
  fileId: string;
}
