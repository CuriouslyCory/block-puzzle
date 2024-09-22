"use client";

import { useState } from "react";
import {
  DndContext,
  useDraggable,
  useDroppable,
  DragOverlay,
  type DragEndEvent,
} from "@dnd-kit/core";
import { CSS } from "@dnd-kit/utilities";
import { type Grid, type Shape } from "~/types/game";
import { api } from "~/trpc/react";

function DraggableShape({
  shape,
  isSelected,
  onClick,
}: {
  shape: Shape;
  isSelected: boolean;
  onClick: () => void;
}) {
  const { attributes, listeners, setNodeRef, transform } = useDraggable({
    id: shape.id,
  });

  const style = transform
    ? {
        transform: CSS.Translate.toString(transform),
      }
    : undefined;
  // console.log("shape", shape);

  return (
    <div
      ref={setNodeRef}
      style={style}
      {...listeners}
      {...attributes}
      className={`flex cursor-move touch-none flex-col gap-1 border ${
        isSelected ? "border-2 border-red-500" : ""
      }`}
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
              className={`flex h-6 w-6 gap-1 ${cell ? "bg-blue-500" : "bg-white"}`}
            />
          ))}
        </div>
      ))}
    </div>
  );
}

function DroppableCell({ x, y, cell }: { x: number; y: number; cell: number }) {
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
}

export function Game() {
  const [grid, setGrid] = useState<Grid>([]);
  const [shapes, setShapes] = useState<Shape[]>([]);
  const [score, setScore] = useState(0);
  const [selectedShape, setSelectedShape] = useState<Shape | null>(null);
  const [isGameOver, setIsGameOver] = useState(false);

  const newGame = api.game.newGame.useMutation({
    onSuccess: (data) => {
      setGrid(data.grid);
      setShapes(data.shapes);
      setScore(data.score);
      setIsGameOver(false);
    },
  });

  const placeShape = api.game.placeShape.useMutation({
    onSuccess: (data) => {
      setGrid(data.grid);
      setShapes(data.shapes);
      setScore((prevScore) => prevScore + data.score);
      setSelectedShape(null);
      setIsGameOver(data.isGameOver);
    },
  });

  const handleDragEnd = (event: DragEndEvent) => {
    const { over, active } = event;
    if (over && active) {
      const [x, y] = over.id.toString().split("-").map(Number);
      if (typeof x === "undefined" || typeof y === "undefined") {
        console.warn("Invalid x or y", x, y);
        return;
      }
      const shapeId = active.id.toString();
      placeShape.mutate({ shapeId, position: { x, y }, grid });
    }
  };

  return (
    <DndContext onDragEnd={handleDragEnd}>
      <div className="flex min-h-screen flex-col items-center justify-center bg-gray-100">
        <h1 className="mb-4 text-4xl font-bold">Shape Fitting Game</h1>
        <div className="mb-4">Score: {score}</div>
        <div className="mb-4 grid grid-cols-8 gap-1">
          {grid.map((row, y) =>
            row.map((cell, x) => (
              <DroppableCell key={`${x}-${y}`} x={x} y={y} cell={cell} />
            )),
          )}
        </div>
        <div className="mb-4 flex justify-center gap-x-4">
          {shapes.map((shape, shapeIndex) => (
            <DraggableShape
              key={`${shape.id}-${shapeIndex}`}
              shape={shape}
              isSelected={selectedShape === shape}
              onClick={() => setSelectedShape(shape)}
            />
          ))}
        </div>
        <button
          className="rounded bg-green-500 px-4 py-2 text-white"
          onClick={() => newGame.mutate()}
        >
          New Game
        </button>
        {isGameOver && (
          <div className="mt-4 text-2xl font-bold text-red-500">Game Over!</div>
        )}
      </div>
      <DragOverlay>
        {selectedShape && (
          <div className="grid grid-cols-4 grid-rows-4 gap-1 opacity-50">
            {selectedShape.grid.map((row, rowIndex) =>
              row.map((cell, cellIndex) => (
                <div
                  key={`${rowIndex}-${cellIndex}`}
                  className={`h-6 w-6 ${cell ? "bg-blue-500" : "bg-transparent"}`}
                />
              )),
            )}
          </div>
        )}
      </DragOverlay>
    </DndContext>
  );
}
