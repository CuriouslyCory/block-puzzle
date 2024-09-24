import { z } from "zod";
import { createTRPCRouter, protectedProcedure } from "~/server/api/trpc";
import { TRPCError } from "@trpc/server";

import {
  CLEARED_GRID_BONUS,
  EMPTY_GRID,
  GameShapeSchema,
  type Grid,
  GridSchema,
} from "~/types/game";
import {
  calculateScore,
  canPlaceShape,
  clearFullLines,
  getRandomShapes,
  isGridEmpty,
  placeShapeOnGrid,
} from "~/app/utils/game-helpers";

export const gameRouter = createTRPCRouter({
  newGame: protectedProcedure.mutation(() => {
    const emptyGrid = structuredClone(EMPTY_GRID);
    const shapes = getRandomShapes(3);
    return { grid: emptyGrid, shapes, score: 0 };
  }),

  placeShape: protectedProcedure
    .input(
      z.object({
        shapeId: z.string(),
        position: z.object({ x: z.number(), y: z.number() }),
        grid: GridSchema,
        remainingShapes: z.array(GameShapeSchema),
      }),
    )
    .mutation(async ({ ctx, input }) => {
      const { shapeId, position, grid, remainingShapes } = input;
      const shape = remainingShapes.find((s) => s.uniqueId === shapeId);
      if (!shape) throw new Error("Invalid shape");
      let newGrid: Grid | null = null;
      try {
        newGrid = placeShapeOnGrid(grid, shape, position);
      } catch (error) {
        let message: string;
        if (error instanceof Error) {
          message = error.message;
        } else {
          message = "Invalid placement";
        }
        throw new TRPCError({
          message,
          code: "BAD_REQUEST",
        });
      }

      const { clearedGrid, clearedLines } = clearFullLines(newGrid);
      const score =
        calculateScore(clearedLines) +
        (isGridEmpty(clearedGrid) ? CLEARED_GRID_BONUS : 0);

      // Remove the placed shape from remainingShapes
      const updatedShapes = remainingShapes.filter(
        (s) => s.uniqueId !== shapeId,
      );

      // Only add new shapes if all initial shapes have been played
      const shapes =
        updatedShapes.length === 0 ? getRandomShapes(3) : updatedShapes;

      const isGameOver = !shapes.some((shape) =>
        canPlaceShape(clearedGrid, shape),
      );

      if (isGameOver) {
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
