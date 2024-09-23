import { z } from "zod";

export type Cell = 0 | 1; // 0 for empty, 1 for filled

export type Grid = Cell[][];

export type Shape = {
  id: string;
  grid: Grid;
};

export type GameShape = Shape & {
  uniqueId: string;
};

export const GRID_SIZE = 8;

export const EMPTY_CELL: Cell = 0;
export const EMPTY_ROW: Cell[] = Array<Cell>(GRID_SIZE).fill(EMPTY_CELL);
export const EMPTY_GRID: Grid = Array<Cell[]>(GRID_SIZE).fill(EMPTY_ROW);
export const CLEARED_GRID_BONUS = 100;

export const SHAPES: Shape[] = [
  {
    id: "3x LEFT L",
    grid: [
      [1, 1, 1],
      [0, 0, 1],
      [0, 0, 1],
    ],
  },
  {
    id: "3x RIGHT L",
    grid: [
      [1, 1, 1],
      [1, 0, 0],
      [1, 0, 0],
    ],
  },
  {
    id: "2x3 LEFT L",
    grid: [
      [1, 1, 1],
      [0, 0, 1],
    ],
  },
  {
    id: "2x3 RIGHT L",
    grid: [
      [1, 1, 1],
      [1, 0, 0],
    ],
  },
  {
    id: "3x2 LEFT L",
    grid: [
      [1, 1],
      [0, 1],
      [0, 1],
    ],
  },
  {
    id: "3x2 RIGHT L",
    grid: [
      [1, 1],
      [1, 0],
      [1, 0],
    ],
  },
  {
    id: "2x VERT LINE",
    grid: [[1], [1]],
  },
  {
    id: "2x HORIZ LINE",
    grid: [[1, 1]],
  },
  {
    id: "3x VERT LINE",
    grid: [[1], [1], [1]],
  },
  {
    id: "3x HORIZ LINE",
    grid: [[1, 1, 1]],
  },
  {
    id: "4x VERT LINE",
    grid: [[1], [1], [1], [1]],
  },
  {
    id: "4x HORIZ LINE",
    grid: [[1, 1, 1, 1]],
  },
  {
    id: "SMALL SQUARE",
    grid: [
      [1, 1],
      [1, 1],
    ],
  },
  {
    id: "BIG SQUARE",
    grid: [
      [1, 1, 1],
      [1, 1, 1],
      [1, 1, 1],
    ],
  },
  {
    id: "Z",
    grid: [
      [0, 1, 1],
      [1, 1, 0],
    ],
  },
  {
    id: "Z CW 90",
    grid: [
      [1, 0],
      [1, 1],
      [0, 1],
    ],
  },
  {
    id: "Z MIRRORED",
    grid: [
      [1, 1, 0],
      [0, 1, 1],
    ],
  },
  {
    id: "Z MIRRORED CW 90",
    grid: [
      [0, 1],
      [1, 1],
      [1, 0],
    ],
  },
] as const;

export const CellSchema = z.union([z.literal(0), z.literal(1)]);

export const GridSchema = z
  .array(z.array(CellSchema).length(GRID_SIZE))
  .length(GRID_SIZE);

export const GameShapeSchema = z.object({
  id: z.string(),
  uniqueId: z.string(),
  grid: z.array(z.array(CellSchema)),
});
