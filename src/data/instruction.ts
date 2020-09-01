import * as T from '../types';

export function place(x: number, y: number, direction: T.CardinalDirection): T.PlaceInstruction {
  return {
    type: 'place',
    x,
    y,
    direction
  }
}

export function move(): T.MoveInstruction {
  return { type: 'move' }
}

export function rotate(direction: T.RotationalDirection): T.RotateInstruction {
  return {
    type: 'rotate', 
    direction
  }
}

export function report(): T.ReportInstruction {
  return { type: 'report' };
}
