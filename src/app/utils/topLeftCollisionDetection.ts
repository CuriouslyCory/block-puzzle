import { type ClientRect, type CollisionDescriptor } from "@dnd-kit/core";
import {
  type Active,
  type DroppableContainer,
  type RectMap,
} from "@dnd-kit/core/dist/store";
import { type Coordinates } from "@dnd-kit/utilities";

type CollsionArgs = {
  active: Active;
  collisionRect: ClientRect;
  droppableRects: RectMap;
  droppableContainers: DroppableContainer[];
  pointerCoordinates: Coordinates | null;
};

/**
 * Returns the coordinates of the center of a given ClientRect
 */
function centerOfRectangle(
  rect: ClientRect,
  left = rect.left,
  top = rect.top,
): Coordinates {
  return {
    x: left + 16,
    y: top + 16,
  };
}

function distanceBetween(p1: Coordinates, p2: Coordinates) {
  return Math.sqrt(Math.pow(p1.x - p2.x, 2) + Math.pow(p1.y - p2.y, 2));
}

function sortCollisionsAsc(
  { data: { value: a } }: CollisionDescriptor,
  { data: { value: b } }: CollisionDescriptor,
) {
  return a - b;
}

export function topLeftCollisionDetection({
  collisionRect,
  droppableRects,
  droppableContainers,
}: CollsionArgs) {
  const centerRect = centerOfRectangle(
    collisionRect,
    collisionRect.left,
    collisionRect.top,
  );
  const collisions: CollisionDescriptor[] = [];

  for (const droppableContainer of droppableContainers) {
    const { id } = droppableContainer;
    const rect = droppableRects.get(id);

    if (rect) {
      const distBetween = distanceBetween(centerOfRectangle(rect), centerRect);

      collisions.push({ id, data: { droppableContainer, value: distBetween } });
    }
  }

  return collisions.sort(sortCollisionsAsc);
}
