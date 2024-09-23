import { useDroppable } from "@dnd-kit/core";
import React from "react";

type DroppableCellProps = {
  x: number;
  y: number;
  cell: number;
};

function areEqual(
  prevProps: DroppableCellProps,
  nextProps: DroppableCellProps,
) {
  // Re-render only if isSelected or shape properties change
  return (
    prevProps.x === nextProps.x &&
    prevProps.y === nextProps.y &&
    prevProps.cell === nextProps.cell
  );
}

const DroppableCell = React.memo(function DroppableCell({
  x,
  y,
  cell,
}: {
  x: number;
  y: number;
  cell: number;
}) {
  const { isOver, setNodeRef } = useDroppable({
    id: `${x}-${y}`,
  });

  return (
    <div
      ref={setNodeRef}
      className={`h-8 w-8 border ${
        cell ? "bg-blue-500" : isOver ? "bg-green-200" : "bg-white"
      }`}
      role="button"
      tabIndex={0}
      aria-label={`Grid cell at row ${y + 1}, column ${x + 1}`}
    />
  );
}, areEqual);

export default DroppableCell;
