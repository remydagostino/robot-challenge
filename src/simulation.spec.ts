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

test('The move instruction drives UP when the robot direction is NORTH', () => {
  const [ updatedBoardState, effectFn ] = simulate(
    { robot: { x: 1, y: 1, direction: T.CardinalDirection.North }, board: GameBoard.defaultBoard() },
    Instruction.move()
  );

  expect(updatedBoardState).toEqual({
    robot: { x: 1, y: 2, direction: T.CardinalDirection.North },
    board: GameBoard.defaultBoard()
  });
});

test('The move instruction drives RIGHT when the robot direction is EAST', () => {
  const [ updatedBoardState, effectFn ] = simulate(
    { robot: { x: 1, y: 1, direction: T.CardinalDirection.East }, board: GameBoard.defaultBoard() },
    Instruction.move()
  );

  expect(updatedBoardState).toEqual({
    robot: { x: 2, y: 1, direction: T.CardinalDirection.East },
    board: GameBoard.defaultBoard()
  });
});

test('The move instruction drives DOWN when the robot direction is SOUTH', () => {
  const [ updatedBoardState, effectFn ] = simulate(
    { robot: { x: 1, y: 1, direction: T.CardinalDirection.South }, board: GameBoard.defaultBoard() },
    Instruction.move()
  );

  expect(updatedBoardState).toEqual({
    robot: { x: 1, y: 0, direction: T.CardinalDirection.South },
    board: GameBoard.defaultBoard()
  });
});

test('The move instruction drives LEFT when the robot direction is WEST', () => {
  const [ updatedBoardState, effectFn ] = simulate(
    { robot: { x: 1, y: 1, direction: T.CardinalDirection.West }, board: GameBoard.defaultBoard() },
    Instruction.move()
  );

  expect(updatedBoardState).toEqual({
    robot: { x: 0, y: 1, direction: T.CardinalDirection.West },
    board: GameBoard.defaultBoard()
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