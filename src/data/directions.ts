import * as T from '../types';

export const prettyPrintCardinal = (direction: T.CardinalDirection): string => {
  switch (direction) {
    case T.CardinalDirection.North:
      return 'NORTH';
    case T.CardinalDirection.East:
      return 'EAST';
    case T.CardinalDirection.South:
      return 'SOUTH';
    case T.CardinalDirection.West:
      return 'WEST';
  }
};

export const rotationToDegrees = (direction: T.RotationalDirection): number => {
  switch (direction) {
    case T.RotationalDirection.Left:
      return -90;
    case T.RotationalDirection.Right:
      return 90;
  }
};

export const cardinalToDegrees = (direction: T.CardinalDirection): number => {
  switch (direction) {
    case T.CardinalDirection.North:
      return 0;
    case T.CardinalDirection.East:
      return 90;
    case T.CardinalDirection.South:
      return 180;
    case T.CardinalDirection.West:
      return 270;
  }
};

export const degreesToCardinal = (deg: number): T.CardinalDirection => {
  // Normalize the degrees with clock arithmatic and adding 360 to negative values
  // ... I know, this is a bit excessive... :P
  const ndeg = deg > 0 ? deg % 360 : (deg % 360) + 360;

  if (ndeg >= 45 && ndeg < 135) {
    return T.CardinalDirection.East;
  } else if (ndeg >= 135 && ndeg < 225) {
    return T.CardinalDirection.South;
  } else if (ndeg >= 225 && ndeg < 315) {
    return T.CardinalDirection.West;
  } else {
    return T.CardinalDirection.North;
  }
};

export const forwardXDelta = (direction: T.CardinalDirection): number => {
  switch (direction) {
    case T.CardinalDirection.North:
    case T.CardinalDirection.South:
      return 0;
    case T.CardinalDirection.East:
      return 1;
    case T.CardinalDirection.West:
      return -1;
  }
};

export const forwardYDelta = (direction: T.CardinalDirection): number => {
  switch (direction) {
    case T.CardinalDirection.East:
    case T.CardinalDirection.West:
      return 0;
    case T.CardinalDirection.North:
      return 1;
    case T.CardinalDirection.South:
      return -1;
  }
};
