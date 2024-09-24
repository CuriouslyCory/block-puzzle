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
import { snapToBottom } from "../utils/snapToBottomModifier";
import { topLeftCollisionDetection } from "../utils/topLeftCollisionDetection";
import { placeShapeOnGrid } from "../utils/game-helpers";

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
    onMutate: (data) => {
      try {
        const shape = data.remainingShapes.find(
          (shape) => shape.uniqueId === data.shapeId,
        );
        if (!shape) {
          throw new Error("Shape not found");
        }
        try {
          const newGrid = placeShapeOnGrid(data.grid, shape, data.position);
          setGrid(newGrid);
          setShapes((prevShapes) =>
            prevShapes.filter((shape) => shape.uniqueId !== data.shapeId),
          );
        } catch (error) {
          console.error(error);
        }
      } catch (error) {
        console.error(error);
      }
    },
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
    <div className="flex flex-col items-center justify-center">
      <h1 className="mb-4 text-4xl font-bold">Shape Fitting Game</h1>
      <div className="mb-4">Score: {score}</div>
      <DndContext
        onDragStart={handleDragStart}
        onDragEnd={handleDragEnd}
        modifiers={[snapToBottom]}
        collisionDetection={topLeftCollisionDetection}
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
