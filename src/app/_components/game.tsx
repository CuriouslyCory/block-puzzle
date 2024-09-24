"use client";

import React, { useState } from "react";
import {
  DndContext,
  DragOverlay,
  type DragEndEvent,
  type DragStartEvent,
} from "@dnd-kit/core";
import { EMPTY_GRID, type GameShape, type Grid } from "~/types/game";
import { api } from "~/trpc/react";
import DraggableShape from "./draggable-shape";
import DroppableCell from "./droppable-cell";
import { snapToTop } from "../utils/snapModifier";

export function Game() {
  const [grid, setGrid] = useState<Grid>(structuredClone(EMPTY_GRID));
  const [shapes, setShapes] = useState<GameShape[]>([]);
  const [score, setScore] = useState(0);
  const [selectedShape, setSelectedShape] = useState<GameShape | null>(null);
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

  function handleDragStart(event: DragStartEvent) {
    if (event.active.data.current?.shape) {
      setSelectedShape(event.active.data.current.shape as GameShape);
    }
  }

  const handleDragEnd = (event: DragEndEvent) => {
    const { over, active } = event;
    if (over && active) {
      const [x, y] = over.id.toString().split("-").map(Number);
      if (typeof x === "undefined" || typeof y === "undefined") {
        console.warn("Invalid x or y", x, y);
        return;
      }
      const shapeId = active.id.toString();
      placeShape.mutate({
        shapeId,
        position: { x, y },
        grid,
        remainingShapes: shapes,
      });
    }
  };

  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-gray-100">
      <h1 className="mb-4 text-4xl font-bold">Shape Fitting Game</h1>
      <div className="mb-4">Score: {score}</div>
      <DndContext
        onDragStart={handleDragStart}
        onDragEnd={handleDragEnd}
        modifiers={[snapToTop]}
      >
        <div className="mb-4 grid grid-cols-8 gap-1" id="main-game-grid">
          {grid.map((row, y) =>
            row.map((cell, x) => (
              <DroppableCell key={`cell-${x}-${y}`} x={x} y={y} cell={cell} />
            )),
          )}
        </div>
        <div
          className="mb-4 flex justify-center gap-x-4 border-2 p-6"
          id="shape-inventory"
        >
          {shapes.map((shape) => (
            <div key={`${shape.uniqueId}`}>
              <DraggableShape
                shape={shape}
                isSelected={selectedShape === shape}
                onClick={() => setSelectedShape(shape)}
              />
            </div>
          ))}
        </div>
        <DragOverlay dropAnimation={null}>
          {selectedShape && (
            <DraggableShape
              shape={selectedShape}
              isSelected={true}
              onClick={() => {
                /* do nothing */
              }}
            />
          )}
        </DragOverlay>
      </DndContext>
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
  );
}
