import * as T from '../types';
import * as Result from './result';
import * as Instruction from './instruction';
import { defaultBoardWithObstacles, findPath } from './game-board';

test('when navigating to own coordinate', () => {
  expect(
    findPath({ x: 1, y: 1 }, { x: 1, y: 1 }, defaultBoardWithObstacles([]))
  ).toEqual(Result.success([{ x: 1, y: 1 }]));
});

test('when navigating in a line to the right', () => {
  expect(
    findPath({ x: 0, y: 0 }, { x: 3, y: 0 }, defaultBoardWithObstacles([]))
  ).toEqual(
    Result.success([
      { x: 0, y: 0 },
      { x: 1, y: 0 },
      { x: 2, y: 0 },
      { x: 3, y: 0 }
    ])
  );
});

test('when navigating in a zigzag', () => {
  expect(
    findPath({ x: 0, y: 0 }, { x: 2, y: 2 }, defaultBoardWithObstacles([]))
  ).toEqual(
    Result.success([
      { x: 0, y: 0 },
      { x: 1, y: 0 },
      { x: 2, y: 0 },
      { x: 2, y: 1 },
      { x: 2, y: 2 }
    ])
  );
});

test('when navigating in a zigzag with obstacle', () => {
  expect(
    findPath(
      { x: 0, y: 0 },
      { x: 2, y: 2 },
      defaultBoardWithObstacles([{ x: 1, y: 0 }])
    )
  ).toEqual(
    Result.success([
      { x: 0, y: 0 },
      { x: 0, y: 1 },
      { x: 1, y: 1 },
      { x: 2, y: 1 },
      { x: 2, y: 2 }
    ])
  );
});

test('when navigating in a backwards zigzag with obstacle', () => {
  expect(
    findPath(
      { x: 2, y: 2 },
      { x: 0, y: 0 },
      defaultBoardWithObstacles([{ x: 1, y: 0 }])
    )
  ).toEqual(
    Result.success([
      { x: 2, y: 2 },
      { x: 1, y: 2 },
      { x: 0, y: 2 },
      { x: 0, y: 1 },
      { x: 0, y: 0 }
    ])
  );
});

test('when navigating an impossible path', () => {
  expect(
    findPath(
      { x: 0, y: 0 },
      { x: 2, y: 0 },
      defaultBoardWithObstacles([
        { x: 1, y: 0 },
        { x: 0, y: 1 }
      ])
    )
  ).toEqual(Result.failure('No path!'));
});

test('when navigating off the board', () => {
  expect(
    findPath({ x: 0, y: 0 }, { x: 5, y: 0 }, defaultBoardWithObstacles([]))
  ).toEqual(Result.failure('No path!'));
});

test('zigzag to instructions', () => {
  expect(
    findPath(
      { x: 0, y: 0 },
      { x: 1, y: 0 },
      { x: 1, y: 1 },
      T.CardinalDirection.North
    )
  ).toEqual(
    Result.success([
      Instruction.move(),
      Instruction.rotate(T.RotationalDirection.Right),
      Instruction.move()
    ])
  );
});

// ----|----
// ----|----
// -R1-|--G-
// ----|----
// ----|----
