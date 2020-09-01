import * as T from './types';
import { simulate } from './simulation';
import * as GameBoard from './data/game-board';
import * as Instruction from './data/instruction';
import * as Result from './data/result';

test('Instructions issued (other than place) are ignored without a robot', () => {
  const boardState = { robot: null, board: GameBoard.defaultBoard() };

  expect(simulate(boardState, Instruction.move())[0]).toEqual(boardState);
  expect(simulate(boardState, Instruction.rotate(T.RotationalDirection.Left))[0]).toEqual(boardState);
  expect(simulate(boardState, Instruction.rotate(T.RotationalDirection.Right))[0]).toEqual(boardState);
  expect(simulate(boardState, Instruction.report())[0]).toEqual(boardState);
});

test('Place instruction puts the robot on the board', () => {
  const [ updatedBoardState, effectFn ] = simulate(
    { robot: null, board: GameBoard.defaultBoard() },
    Instruction.place(0, 0, T.CardinalDirection.North)
  );

  expect(updatedBoardState).toEqual({
    robot: { x: 0, y: 0, direction: T.CardinalDirection.North },
    board: GameBoard.defaultBoard()
  });
});

test('Place instruction moves the robot on the board', () => {
  const [ updatedBoardState, effectFn ] = simulate(
    { robot: { x: 0, y: 0, direction: T.CardinalDirection.North }, board: GameBoard.defaultBoard() },
    Instruction.place(3, 3, T.CardinalDirection.West)
  );

  expect(updatedBoardState).toEqual({
    robot: { x: 3, y: 3, direction: T.CardinalDirection.West },
    board: GameBoard.defaultBoard()
  });
});

test('The robot moves in the direction it is facing', () => {
  const directionData: Array<[T.CardinalDirection, [number, number], [number, number]]> = [
    // Direction                from    to
    [T.CardinalDirection.North, [1, 1], [1, 2]],
    [T.CardinalDirection.East,  [1, 1], [2, 1]],
    [T.CardinalDirection.South, [1, 1], [1, 0]],
    [T.CardinalDirection.West,  [1, 1], [0, 1]]
  ]

  directionData.forEach(([direction, from, to]) => {
    const [ updatedBoardState, effectFn ] = simulate(
      { robot: { x: from[0], y: from[1], direction }, board: GameBoard.defaultBoard() },
      Instruction.move()
    );

    expect(updatedBoardState).toEqual({
      robot: { x: to[0], y: to[1], direction },
      board: GameBoard.defaultBoard()
    });
  })
});

test('The robot does not move off the table', () => {
  const [ updatedBoardState, effectFn ] = simulate(
    { robot: { x: 0, y: 0, direction: T.CardinalDirection.South }, board: GameBoard.defaultBoard() },
    Instruction.move()
  );

  expect(updatedBoardState).toEqual({
    robot: { x: 0, y: 0, direction: T.CardinalDirection.South },
    board: GameBoard.defaultBoard()
  });
});

test('The robot rotates', () => {
  const directionData = [
    // Direction                Left                       Right
    [T.CardinalDirection.North, T.CardinalDirection.West,  T.CardinalDirection.East],
    [T.CardinalDirection.East,  T.CardinalDirection.North, T.CardinalDirection.South],
    [T.CardinalDirection.South, T.CardinalDirection.East,  T.CardinalDirection.West],
    [T.CardinalDirection.West,  T.CardinalDirection.South, T.CardinalDirection.North]
  ].forEach(([direction, left, right]) => {
    const boardState = { robot: { x: 0, y: 0, direction }, board: GameBoard.defaultBoard() };

    expect(simulate(boardState, Instruction.rotate(T.RotationalDirection.Left))[0]).toEqual({
      robot: { x: 0, y: 0, direction: left },
      board: GameBoard.defaultBoard()
    });

    expect(simulate(boardState, Instruction.rotate(T.RotationalDirection.Right))[0]).toEqual({
      robot: { x: 0, y: 0, direction: right },
      board: GameBoard.defaultBoard()
    });
  });
});

test('Invalid place instruction does not moves the robot', () => {
  const [ updatedBoardState, effectFn ] = simulate(
    { robot: { x: 0, y: 0, direction: T.CardinalDirection.North }, board: GameBoard.defaultBoard() },
    Instruction.place(-2, 5, T.CardinalDirection.West)
  );

  expect(updatedBoardState).toEqual({
    robot: { x: 0, y: 0, direction: T.CardinalDirection.North },
    board: GameBoard.defaultBoard()
  });
});

test('The effectFn calls the report effect for the report instruction', () => {
  const [ updatedBoardState, effectFn ] = simulate(
    { robot: { x: 2, y: 3, direction: T.CardinalDirection.North }, board: GameBoard.defaultBoard() },
    Instruction.report()
  );

  const effects: T.AppEffects = {
    report: jest.fn()
  };

  effectFn(effects);

  expect((effects.report as jest.Mock).mock.calls).toEqual(
    [[2, 3, T.CardinalDirection.North]]
  );
});