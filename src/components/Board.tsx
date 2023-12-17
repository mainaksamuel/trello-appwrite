"use client";

import { useEffect } from "react";
import { DragDropContext, Droppable } from "react-beautiful-dnd";

export default function Board() {
  useEffect(() => {}, []);

  return (
    <DragDropContext>
      <Droppable droppableId="board" direction="horizontal" type="column">
        {(provided) => <div>{/* render all the columns */}</div>}
      </Droppable>
    </DragDropContext>
  );
}
