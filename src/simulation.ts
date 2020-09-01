import * as T from './types';

export function simulate(boardState: T.BoardState, instruction: T.Instruction): [T.BoardState, T.EffectFn] {
  const proposedRobotState = updateRobotState(boardState.robot, instruction);
  const proposedBoardState = {
    robot: proposedRobotState,
    board: boardState.board
  };

  if (isBoardStateValid(proposedBoardState)) {
    return [
      proposedBoardState,
      (eff) => {}
    ];    
  } else {
    return [ boardState, () => {}];
  }
}

// Executes the requested instruction without concern for whether the new state is valid
function updateRobotState(robotState: T.RobotState | null, instruction: T.Instruction): T.RobotState | null {
  switch (instruction.type) {
    case 'place': 
      return { 
        x: instruction.x,
        y: instruction.y,
        direction: instruction.direction
      };
    case 'move':
      return moveRobotForwards(robotState);
    default: 
      return robotState;
  } 
}

function moveRobotForwards(robotState: T.RobotState | null): T.RobotState | null {
  if (robotState === null) {
    return null;
  }

  return { 
    x: robotState.x + forwardXDelta(robotState.direction),
    y: robotState.y + forwardYDelta(robotState.direction),
    direction: robotState.direction
  }
}

function forwardXDelta(direction: T.CardinalDirection): number {
  switch (direction) {
    case T.CardinalDirection.North:
    case T.CardinalDirection.South:
      return 0;
    case T.CardinalDirection.East:
      return 1;
    case T.CardinalDirection.West:
      return -1;
  }
}

function forwardYDelta(direction: T.CardinalDirection): number {
  switch (direction) {
    case T.CardinalDirection.East:
    case T.CardinalDirection.West:
      return 0;
    case T.CardinalDirection.North:
      return 1;
    case T.CardinalDirection.South:
      return -1;
  }
}

function isBoardStateValid({ robot, board }: T.BoardState): boolean {
  if (robot === null) {
    return true;
  }

  if (board.type === 'rectangular') {
    return (
      robot.x >= 0 &&
      robot.y >= 0 &&
      robot.x < board.width &&
      robot.y < board.height
    );
  } else {
    // Rectangular is the only kind of board we understand right now
    return false;
  }
}