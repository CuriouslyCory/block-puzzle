import { useDraggable } from "@dnd-kit/core";
import { CSS, Transform } from "@dnd-kit/utilities";
import React from "react";
import { type GameShape } from "~/types/game";

type DraggableShapeProps = {
  shape: GameShape;
  isSelected: boolean;
  onClick: () => void;
};

function areEqual(
  prevProps: DraggableShapeProps,
  nextProps: DraggableShapeProps,
) {
  // Re-render only if isSelected or shape properties change
  return (
    prevProps.isSelected === nextProps.isSelected &&
    prevProps.shape.uniqueId === nextProps.shape.uniqueId &&
    prevProps.shape.grid === nextProps.shape.grid
  );
}

const DraggableShape = React.memo(function DraggableShape({
  shape,
  isSelected,
  onClick,
}: DraggableShapeProps) {
  const { attributes, listeners, setNodeRef, transform, isDragging } =
    useDraggable({
      id: shape.uniqueId,
    });

  const style: React.CSSProperties = {
    transform: CSS.Translate.toString(transform),
    position: "relative",
    cursor: "move",
    touchAction: "none",
  };

  return (
    <div
      ref={setNodeRef}
      style={style}
      {...listeners}
      {...attributes}
      className={`flex flex-col gap-1 ${
        isSelected ? "border-2 border-red-500" : ""
      } ${isDragging ? "" : ""}`}
      onClick={onClick}
      role="button"
      tabIndex={0}
      aria-label={`Select shape ${shape.id}`}
      onKeyDown={(e) => {
        if (e.key === "Enter" || e.key === " ") {
          onClick();
        }
      }}
    >
      {shape.grid.map((row, rowIndex) => (
        <div key={`row-${rowIndex}`} className="flex gap-1">
          {row.map((cell, cellIndex) => (
            <div
              key={`${rowIndex}-${cellIndex}`}
              className={`flex h-8 w-8 gap-1 ${cell ? "bg-blue-500" : "bg-transparent"}`}
            />
          ))}
        </div>
      ))}
    </div>
  );
}, areEqual);

export default DraggableShape;
