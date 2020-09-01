import * as T from './types';
import * as Direction from './data/directions';

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
    x: robotState.x + Direction.forwardXDelta(robotState.direction),
    y: robotState.y + Direction.forwardYDelta(robotState.direction),
    direction: robotState.direction
  };
}


function rotateRobot(robotState: T.RobotState | null, direction: T.RotationalDirection): T.RobotState | null {
  if (robotState === null) {
    return robotState;
  }

  return { 
    x: robotState.x,
    y: robotState.y,
    direction: Direction.degreesToCardinal(
      Direction.cardinalToDegrees(robotState.direction) + 
      Direction.rotationToDegrees(direction)
    )
  };
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