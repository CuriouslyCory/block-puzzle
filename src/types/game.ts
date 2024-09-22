import { z } from "zod";

export type Cell = 0 | 1; // 0 for empty, 1 for filled

export type Grid = Cell[][];

export type Shape = {
  id: string;
  grid: Grid;
};

export const GRID_SIZE = 8;

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
    id: "DOT",
    grid: [[1]],
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
    id: "T",
    grid: [
      [1, 1, 1],
      [0, 1, 0],
      [0, 1, 0],
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
