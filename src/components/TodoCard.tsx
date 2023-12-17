"use client";

import { Todo, TypedColumn } from "@/typings";
import { XCircleIcon } from "@heroicons/react/24/solid";
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
        <button className="text-red-500 hover:text-red-700">
          <XCircleIcon className="ml-5 h-8 w-8" />
        </button>
      </div>

      {/* Add image here */}
    </div>
  );
}
