import * as T from '../types';

export const place = (
  x: number,
  y: number,
  direction: T.CardinalDirection
): T.PlaceInstruction => {
  return {
    type: 'place',
    x,
    y,
    direction
  };
};

export const move = (): T.MoveInstruction => {
  return { type: 'move' };
};

export const rotate = (
  direction: T.RotationalDirection
): T.RotateInstruction => {
  return {
    type: 'rotate',
    direction
  };
};

export const report = (): T.ReportInstruction => {
  return { type: 'report' };
};

export const ignore = (): T.IgnoreInstruction => {
  return { type: 'ignore' };
};
