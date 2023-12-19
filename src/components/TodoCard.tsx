"use client";

import Image from "next/image";
import { getImageURL } from "@/lib/todo-service";
import { useBoardStore } from "@/store/BoardStore";
import { XCircleIcon } from "@heroicons/react/24/solid";
import { useEffect, useState } from "react";
import {
  DraggableProvidedDragHandleProps,
  DraggableProvidedDraggableProps,
} from "react-beautiful-dnd";

interface TodoCardProps {
  id: TypedColumn;
  todo: Todo;
  index: number;
  innerRef: (element: HTMLElement | null) => void;
  draggableProps: DraggableProvidedDraggableProps;
  dragHandleProps: DraggableProvidedDragHandleProps | null | undefined;
}

export default function TodoCard({
  id,
  todo,
  index,
  innerRef,
  draggableProps,
  dragHandleProps,
}: TodoCardProps) {
  const deleteTodo = useBoardStore((state) => state.deleteTodo);
  const handleDelete = () => {
    deleteTodo(index, todo, id);
  };

  const [imageUrl, setImageUrl] = useState<string | null>(null);

  useEffect(() => {
    if (todo.image) {
      const fetchImage = async () => {
        const url = await getImageURL(todo.image!);
        if (url) {
          setImageUrl(url.toString());
        }
      };
      fetchImage();
    }
  }, [todo]);

  return (
    <div
      {...draggableProps}
      {...dragHandleProps}
      id={id}
      ref={innerRef}
      className="bg-white rounded-md space-y-2 drop-shadow-md"
    >
      <div className="flex items-center justify-between p-5">
        <p>{todo.title}</p>
        <button
          onClick={handleDelete}
          className="text-red-500 hover:text-red-700"
        >
          <XCircleIcon className="ml-5 h-8 w-8" />
        </button>
      </div>

      {/* Add image here */}
      {imageUrl && (
        <div className="h-full w-full rounded-b-md">
          <Image
            src={imageUrl}
            alt="Task Image"
            width={400}
            height={200}
            className="w-full object-contain rounded-b-md"
          />
        </div>
      )}
    </div>
  );
}
