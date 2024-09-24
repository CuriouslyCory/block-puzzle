import { z } from "zod";

export const GRID_SIZE = 8;

export const CellSchema = z.union([z.literal(0), z.literal(1)]);

export const GridSchema = z
  .array(z.array(CellSchema).length(GRID_SIZE))
  .length(GRID_SIZE);

export const GameShapeSchema = z.object({
  id: z.string(),
  uniqueId: z.string(),
  grid: z.array(z.array(CellSchema)),
  color: z.string(),
});

export type Cell = 0 | 1; // 0 for empty, 1 for filled

export type Grid = Cell[][];

export type Shape = {
  id: string;
  grid: Grid;
  color: string;
};

export type GameShape = Shape & {
  uniqueId: string;
};

export const EMPTY_CELL: Cell = 0;
export const EMPTY_ROW: Cell[] = Array<Cell>(GRID_SIZE).fill(EMPTY_CELL);
export const EMPTY_GRID: Grid = Array<Cell[]>(GRID_SIZE).fill(EMPTY_ROW);
export const CLEARED_GRID_BONUS = 100;

export const SHAPES: Shape[] = [
  {
    id: "3x3 LEFT L",
    grid: [
      [1, 1, 1],
      [0, 0, 1],
      [0, 0, 1],
    ],
    color: "bg-yellow-600",
  },
  {
    id: "2x2 CORNER",
    grid: [
      [1, 1],
      [1, 0],
    ],
    color: "bg-blue-600",
  },
  {
    id: "2x2 CORNER 90",
    grid: [
      [1, 1],
      [0, 1],
    ],
    color: "bg-blue-600",
  },
  {
    id: "2x2 CORNER 180",
    grid: [
      [0, 1],
      [1, 1],
    ],
    color: "bg-blue-600",
  },
  {
    id: "2x2 CORNER 270",
    grid: [
      [1, 0],
      [1, 1],
    ],
    color: "bg-blue-600",
  },
  {
    id: "3x2 L MIRRORED 90",
    grid: [
      [1, 0, 0],
      [1, 1, 1],
    ],
    color: "bg-green-600",
  },
  {
    id: "3x2 L MIRRORED 270",
    grid: [
      [1, 1, 1],
      [0, 0, 1],
    ],
    color: "bg-green-600",
  },
  {
    id: "3x2 L 90",
    grid: [
      [1, 1, 1],
      [1, 0, 0],
    ],
    color: "bg-orange-600",
  },
  {
    id: "2x3 L 180",
    grid: [
      [1, 1],
      [0, 1],
      [0, 1],
    ],
    color: "bg-orange-600",
  },
  {
    id: "2x3 L",
    grid: [
      [1, 0],
      [1, 0],
      [1, 1],
    ],
    color: "bg-green-600",
  },
  {
    id: "2x3 L MIRRORED",
    grid: [
      [0, 1],
      [0, 1],
      [1, 1],
    ],
    color: "bg-green-600",
  },
  {
    id: "2x3 L MIRRORED 180",
    grid: [
      [1, 1],
      [1, 0],
      [1, 0],
    ],
    color: "bg-green-600",
  },
  {
    id: "1x2 VERT LINE",
    grid: [[1], [1]],
    color: "bg-green-600",
  },
  {
    id: "2x1 HORIZ LINE",
    grid: [[1, 1]],
    color: "bg-green-600",
  },
  {
    id: "1x3 VERT LINE",
    grid: [[1], [1], [1]],
    color: "bg-blue-600",
  },
  {
    id: "3x1 HORIZ LINE",
    grid: [[1, 1, 1]],
    color: "bg-blue-600",
  },
  {
    id: "5x1 HORIZ LINE",
    grid: [[1, 1, 1, 1, 1]],
    color: "bg-blue-600",
  },
  {
    id: "1x5 VERT LINE",
    grid: [[1], [1], [1], [1], [1]],
    color: "bg-blue-600",
  },
  {
    id: "1x4 VERT LINE",
    grid: [[1], [1], [1], [1]],
    color: "bg-purple-600",
  },
  {
    id: "4x1 HORIZ LINE",
    grid: [[1, 1, 1, 1]],
    color: "bg-purple-600",
  },
  {
    id: "2x2 SMALL SQUARE",
    grid: [
      [1, 1],
      [1, 1],
    ],
    color: "bg-yellow-400",
  },
  {
    id: "3x3 BIG SQUARE",
    grid: [
      [1, 1, 1],
      [1, 1, 1],
      [1, 1, 1],
    ],
    color: "bg-red-600",
  },
  {
    id: "RHODE ISLAND Z",
    grid: [
      [0, 1, 1],
      [1, 1, 0],
    ],
    color: "bg-orange-600",
  },
  {
    id: "RHODE ISLAND Z 90",
    grid: [
      [1, 0],
      [1, 1],
      [0, 1],
    ],
    color: "bg-orange-600",
  },
  {
    id: "CLEVELAND Z",
    grid: [
      [1, 1, 0],
      [0, 1, 1],
    ],
    color: "bg-orange-600",
  },
  {
    id: "CLEVELAND Z 90",
    grid: [
      [0, 1],
      [1, 1],
      [1, 0],
    ],
    color: "bg-orange-600",
  },
  {
    id: "TEEWEE",
    grid: [
      [0, 1, 0],
      [1, 1, 1],
    ],
    color: "bg-orange-600",
  },
  {
    id: "TEEWEE 90",
    grid: [
      [1, 0],
      [1, 1],
      [1, 0],
    ],
    color: "bg-orange-600",
  },
  {
    id: "TEEWEE 180",
    grid: [
      [1, 1, 1],
      [0, 1, 0],
    ],
    color: "bg-orange-600",
  },
  {
    id: "TEEWEE 270",
    grid: [
      [0, 1],
      [1, 1],
      [0, 1],
    ],
    color: "bg-orange-600",
  },
] as const;
