import * as T from '../types';
import * as Result from './result';
import * as Instruction from './instruction';

export const defaultBoard = (): T.GameBoard => {
  return {
    type: 'rectangular',
    height: 5,
    width: 5,
    obstacles: []
  };
};

export const defaultBoardWithObstacles = (
  obstacles: Array<T.Obstactle>
): T.GameBoard => {
  return {
    type: 'rectangular',
    height: 5,
    width: 5,
    obstacles
  };
};

type Path = { parent: Path | null; coord: T.Coordinate };

export const coordsToInstructions = (
  coords: Array<T.Coordinate>,
  facing: T.CardinalDirection
): T.Result<Array<T.Instruction>, string> => {
  if (coords.length === 0) {
    return Result.success([]);
  }

  let instructions: Array<T.Instruction> = [];
  let currentFacing = facing;
  let lastCoord = coords[0];

  coords.slice(1).forEach((coord) => {
    // We know what way we're facing, we know where we're coming from, and where we're going to
    const directionToNextCoord = getDirectionToCoord(lastCoord, coord);

    const rotations = getRotations(currentFacing, directionToNextCoord);

    instructions = instructions.concat(rotations).concat(Instruction.move());

    // make this coord last coord
    currentFacing = directionToNextCoord;
    lastCoord = coord;
  });

  return Result.success(instructions);

  // return Result.failure('No instructions possible');
};

const getDirectionToCoord = (
  from: T.Coordinate,
  to: T.Coordinate
): T.CardinalDirection => {
  return T.CardinalDirection.North;
};

const getRotations = (
  from: T.CardinalDirection,
  to: T.CardinalDirection
): Array<T.RotateInstruction> => {
  return [];
};

export const findPath = (
  from: T.Coordinate,
  to: T.Coordinate,
  board: T.RectangularBoard
): T.Result<Array<T.Coordinate>, string> => {
  const nodes: Array<Path> = [{ parent: null, coord: from }];
  const visitedCoords: Array<T.Coordinate> = [from];

  let foundPath: Path | null = null;

  if (from.x === to.x && from.y === to.y) {
    return Result.success([to]);
  }

  while (nodes.length > 0 && foundPath === null) {
    const currentNode = nodes.shift();

    if (!currentNode) {
      break;
    }

    const adjacentNodes = [
      {
        parent: currentNode,
        coord: { x: currentNode.coord.x + 1, y: currentNode.coord.y }
      },
      {
        parent: currentNode,
        coord: { x: currentNode.coord.x - 1, y: currentNode.coord.y }
      },
      {
        parent: currentNode,
        coord: { x: currentNode.coord.x, y: currentNode.coord.y + 1 }
      },
      {
        parent: currentNode,
        coord: { x: currentNode.coord.x, y: currentNode.coord.y - 1 }
      }
    ];

    adjacentNodes.forEach((adj) => {
      const isVisited = Boolean(
        visitedCoords.find((coord) => {
          return coord.x === adj.coord.x && coord.y === adj.coord.y;
        })
      );

      const isOnObstactle = Boolean(
        board.obstacles.find((obstacle) => {
          return obstacle.x === adj.coord.x && obstacle.y === adj.coord.y;
        })
      );

      const isOnBoard =
        adj.coord.x >= 0 &&
        adj.coord.y >= 0 &&
        adj.coord.x < board.width &&
        adj.coord.y < board.height;

      if (isOnBoard && !isVisited && !isOnObstactle) {
        // 1. mark as visited
        visitedCoords.push(adj.coord);

        // 2. Check if it is the goal node
        if (adj.coord.x === to.x && adj.coord.y === to.y) {
          foundPath = adj;
        } else {
          // 3. Otherwise push it in the queue
          nodes.push(adj);
        }
      }
    });
  }

  if (foundPath !== null) {
    return Result.success(pathToCoords(foundPath));
  } else {
    return Result.failure('No path!');
  }
};

const pathToCoords = (path: Path): Array<T.Coordinate> => {
  const pathToCoordsAcc = (
    path: Path,
    acc: Array<T.Coordinate>
  ): Array<T.Coordinate> => {
    if (path.parent === null) {
      return acc.concat(path.coord);
    } else {
      return pathToCoordsAcc(path.parent, acc.concat(path.coord));
    }
  };

  return pathToCoordsAcc(path, []).reverse();
};
