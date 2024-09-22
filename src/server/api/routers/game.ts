import { z } from "zod";

import { createTRPCRouter, protectedProcedure } from "~/server/api/trpc";
import {
  type Cell,
  type Grid,
  GRID_SIZE,
  GridSchema,
  type Shape,
  SHAPES,
} from "~/types/game";

const EMPTY_CELL: Cell = 0;
const EMPTY_ROW: Cell[] = Array<Cell>(GRID_SIZE).fill(EMPTY_CELL);
const EMPTY_GRID: Grid = Array<Cell[]>(GRID_SIZE).fill(EMPTY_ROW);
const CLEARED_GRID_BONUS = 100;

export const gameRouter = createTRPCRouter({
  newGame: protectedProcedure.mutation(() => {
    const emptyGrid = EMPTY_GRID;
    const shapes = getRandomShapes(3);
    return { grid: emptyGrid, shapes, score: 0 };
  }),

  placeShape: protectedProcedure
    .input(
      z.object({
        shapeId: z.string(),
        position: z.object({ x: z.number(), y: z.number() }),
        grid: z.array(z.array(z.union([z.literal(0), z.literal(1)]))),
      }),
    )
    .mutation(async ({ ctx, input }) => {
      const { shapeId, position, grid } = input;
      const shape = SHAPES.find((s) => s.id === shapeId);
      if (!shape) throw new Error("Invalid shape");

      const newGrid = placeShapeOnGrid(grid, shape, position);
      const { clearedGrid, clearedLines } = clearFullLines(newGrid);
      const score =
        calculateScore(clearedLines) +
        (isGridEmpty(clearedGrid) ? CLEARED_GRID_BONUS : 0);
      const shapes = getRandomShapes(3);

      const isGameOver = !shapes.some((shape) =>
        canPlaceShape(clearedGrid, shape),
      );

      if (isGameOver) {
        // Save the game result
        await ctx.db.gameResult.create({
          data: {
            userId: ctx.session.user.id,
            score,
          },
        });
      }

      return { grid: clearedGrid, shapes, score, isGameOver };
    }),
});

// Are all grid cells set to 0?
function isGridEmpty(grid: Grid): boolean {
  return grid.every((row) => row.every((cell) => cell === 0));
}

function getRandomShapes(count: number): Shape[] {
  return Array(count)
    .fill(null)
    .map(() => {
      const randomIndex = Math.floor(Math.random() * SHAPES.length);
      if (!SHAPES[randomIndex]) {
        throw new Error("Invalid shape");
      }
      return SHAPES[randomIndex];
    });
}

function placeShapeOnGrid(
  grid: Grid,
  shape: Shape,
  position: { x: number; y: number },
): Grid {
  try {
    const parsedGrid = GridSchema.parse(grid);
    const newGrid = structuredClone(parsedGrid);
    if (!isValidPlacement(grid, shape, position)) {
      console.warn("Invalid placement");
      return newGrid;
    }
    for (let y = 0; y < shape.grid.length; y++) {
      for (let x = 0; x < shape.grid[y]!.length; x++) {
        if (shape.grid[y]![x] === 1) {
          newGrid[position.y + y]![position.x + x] = 1;
        }
      }
    }
    return newGrid;
  } catch (error) {
    console.error(error);
    return grid;
  }
}

/**
 * Identify any column or row where all values are set to 1, tally how many lines were cleared,
 * and return the new grid with the full lines removed.
 * @param grid
 * @returns
 */
function clearFullLines(grid: Grid): {
  clearedGrid: Grid;
  clearedLines: number;
} {
  console.log("current grid", grid);
  const parsedGrid = GridSchema.parse(grid);

  // Find and record the index of any full row
  const fullRows: number[] = [];
  for (let row = 0; row < grid.length; row++) {
    if (grid[row]!.every((cell) => cell === 1)) {
      fullRows.push(row);
    }
  }

  // find and record the idnex of any full column
  const fullColumns: number[] = [];
  for (let col = 0; col < parsedGrid[0]!.length; col++) {
    if (parsedGrid.every((row) => row[col] === 1)) {
      fullColumns.push(col);
    }
  }

  // tally the total lines cleared
  const clearedLines = fullRows.length + fullColumns.length;

  // remove the full rows
  const clearedGrid = structuredClone(parsedGrid);
  fullRows.forEach((row) => {
    clearedGrid.splice(row, 1);
    clearedGrid.unshift(EMPTY_ROW);
  });

  // remove the full columns
  fullColumns.forEach((col) => {
    clearedGrid.forEach((row) => {
      row.splice(col, 1);
      row.unshift(EMPTY_CELL);
    });
  });

  return { clearedGrid, clearedLines };
}

//
function calculateScore(clearedLines: number): number {
  return clearedLines * 10;
}

// Is there any way this shape can be placed on the current grid?
function canPlaceShape(grid: Grid, shape: Shape): boolean {
  for (let y = 0; y <= GRID_SIZE - shape.grid.length; y++) {
    for (let x = 0; x <= GRID_SIZE - shape.grid[0]!.length; x++) {
      if (isValidPlacement(grid, shape, { x, y })) {
        return true;
      }
    }
  }
  return false;
}

// Does the shape fit in the grid at the given position without overlapping with filled cells?
function isValidPlacement(
  grid: Grid,
  shape: Shape,
  position: { x: number; y: number },
): boolean {
  // For each cell in the shape, check if it overlaps with a filled cell in the grid
  for (let y = 0; y < shape.grid.length; y++) {
    // Each set of rows
    for (let x = 0; x < shape.grid[y]!.length; x++) {
      // each column within the row
      if (shape.grid[y]![x] === 1) {
        // If the cell is filled
        if (grid[position.y + y]![position.x + x] === 1) {
          // does the corresponding cell in the grid have a filled cell?
          return false;
        }
      }
    }
  }
  return true;
}
