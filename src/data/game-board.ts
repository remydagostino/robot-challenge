import * as T from '../types';

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
