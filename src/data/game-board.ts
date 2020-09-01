import * as T from '../types';

export function defaultBoard(): T.GameBoard {
  return {
    type: 'rectangular',
    height: 5,
    width: 5
  };
}
