import {
  EMPTY_ROW,
  type GameShape,
  type Grid,
  GRID_SIZE,
  GridSchema,
  SHAPES,
} from "~/types/game";
import { v4 as uuidv4 } from "uuid";

/**
 *
 * @param grid - current game grid
 * @param shape - shape to place on the grid
 * @param position - Where on the grid to place the shape
 * @returns { Grid } grid - Updated grid with the shape placed on it
 * @throws { Error } - If the shape cannot be placed on the grid
 */
export function placeShapeOnGrid(
  grid: Grid,
  shape: GameShape,
  position: { x: number; y: number },
): Grid {
  const parsedGrid = GridSchema.parse(grid);
  const newGrid = structuredClone(parsedGrid);
  console.log("valid placement", isValidPlacement(grid, shape, position));
  if (!isValidPlacement(grid, shape, position)) {
    throw new Error("Invalid placement");
  }
  for (let y = 0; y < shape.grid.length; y++) {
    for (let x = 0; x < shape.grid[y]!.length; x++) {
      if (shape.grid[y]![x] === 1) {
        newGrid[position.y + y]![position.x + x] = 1;
      }
    }
  }
  return newGrid;
}

/**
 * Identify any column or row where all values are set to 1, tally how many lines were cleared,
 * and return the new grid with the full lines removed.
 * @param grid
 * @returns
 */
export function clearFullLines(grid: Grid): {
  clearedGrid: Grid;
  clearedLines: number;
} {
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
  const rowsRemoved = parsedGrid.map((row, rowIndex) =>
    fullRows.includes(rowIndex) ? EMPTY_ROW : row,
  );

  // remove the full columns
  const clearedGrid = rowsRemoved.map((row) =>
    row.map((cell, colIndex) => (fullColumns.includes(colIndex) ? 0 : cell)),
  );

  return { clearedGrid, clearedLines };
}

//
export function calculateScore(clearedLines: number): number {
  return clearedLines * 10;
}

// Is there any way this shape can be placed on the current grid?
export function canPlaceShape(grid: Grid, shape: GameShape): boolean {
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
export function isValidPlacement(
  grid: Grid,
  shape: GameShape,
  position: { x: number; y: number },
): boolean {
  if (shape.grid.length + position.y > GRID_SIZE) {
    return false;
  }
  if (shape.grid[0]!.length + position.x > GRID_SIZE) {
    return false;
  }
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

// Are all grid cells set to 0?
export function isGridEmpty(grid: Grid): boolean {
  return grid.every((row) => row.every((cell) => cell === 0));
}

export function getRandomShapes(count: number): GameShape[] {
  return Array(count)
    .fill(null)
    .map(() => {
      const randomIndex = Math.floor(Math.random() * SHAPES.length);
      if (!SHAPES[randomIndex]) {
        throw new Error("Invalid shape");
      }
      const shape = SHAPES[randomIndex];
      return {
        ...shape,
        uniqueId: uuidv4(),
      };
    });
}
