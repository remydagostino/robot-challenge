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
      getEffectsForInstruction(proposedBoardState, instruction)
    ];    
  } else {
    return [ boardState, () => {}];
  }
}

export function getEffectsForInstruction(boardState: T.BoardState, instruction: T.Instruction): T.EffectFn {
  if (instruction.type === 'report' && boardState.robot !== null) {
    const { x, y, direction } = boardState.robot;

    return (effects: T.AppEffects) => {
      effects.report(x, y, direction);
    };
  } else {
    return () => {};
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
    case 'rotate':
      return rotateRobot(robotState, instruction.direction);
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
  };
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

function rotateRobot(robotState: T.RobotState | null, direction: T.RotationalDirection): T.RobotState | null {
  if (robotState === null) {
    return robotState;
  }

  return { 
    x: robotState.x,
    y: robotState.y,
    direction: degreesToCardinalDirection(
      cardinalDirectionToDegrees(robotState.direction) + 
      rotationalDirectionToDegrees(direction)
    )
  };
}

function rotationalDirectionToDegrees(direction: T.RotationalDirection): number {
  switch (direction) {
    case T.RotationalDirection.Left:  return -90;
    case T.RotationalDirection.Right: return 90;
  }
}

function cardinalDirectionToDegrees(direction: T.CardinalDirection): number {
  switch (direction) {
    case T.CardinalDirection.North: return 0;
    case T.CardinalDirection.East:  return 90;
    case T.CardinalDirection.South: return 180;
    case T.CardinalDirection.West:  return 270;
  }
}

function degreesToCardinalDirection(deg: number): T.CardinalDirection {
  // Normalize the degrees with clock arithmatic and adding 360 to negative values
  // ... I know, this is a bit excessive... :P
  const ndeg = deg > 0 
    ? (deg % 360) 
    : (deg % 360) + 360;

  if (ndeg >= 45 && ndeg < 135) {
    return T.CardinalDirection.East;
  } else if (ndeg >= 135 && ndeg < 225) {
    return T.CardinalDirection.South; 
  } else if (ndeg >= 225 && ndeg < 315) {
    return T.CardinalDirection.West;
  } else {
    return T.CardinalDirection.North;
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