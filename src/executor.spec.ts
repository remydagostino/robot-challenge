// Some integration tests for the executor

import * as T from './types';
import * as GameBoard from './data/game-board';
import * as Instruction from './data/instruction';

import {
  instructionGeneratorFromAsyncIterator,
  executeInstructions
} from './executor';

const arrayToAsyncGenerator = async function* arrayToAsyncGenerator<A>(
  arr: Array<A>
): AsyncIterableIterator<A> {
  for (const item of arr) {
    yield item;
  }
};

const collectAsyncGeneratorItems = async <A>(
  gen: AsyncIterableIterator<A>
): Promise<Array<A>> => {
  const items: Array<A> = [];

  for await (const item of gen) {
    items.push(item);
  }

  return items;
};

test('instruction generation', async () => {
  const gen = instructionGeneratorFromAsyncIterator(
    arrayToAsyncGenerator(['place 0,0,north', 'move', '', 'move', 'report'])
  );

  const items = await collectAsyncGeneratorItems(gen);

  expect(items).toEqual([
    Instruction.place(0, 0, T.CardinalDirection.North),
    Instruction.move(),
    Instruction.ignore(),
    Instruction.move(),
    Instruction.report()
  ]);
});

test('errors in instructions', async () => {
  const gen = instructionGeneratorFromAsyncIterator(
    arrayToAsyncGenerator(['place 5,5,East', '  move  ', 'Nope', 'Hello'])
  );

  expect.assertions(1);

  try {
    await collectAsyncGeneratorItems(gen);
  } catch (err) {
    expect(err.message).toBe(
      'Parsing error, line 3: Unrecognized command: Nope'
    );
  }
});

test('executing instructions', async () => {
  const gen = executeInstructions(
    {
      robot: null,
      board: GameBoard.defaultBoard()
    },
    arrayToAsyncGenerator([
      Instruction.place(0, 0, T.CardinalDirection.North),
      Instruction.move(),
      Instruction.ignore(),
      Instruction.move(),
      Instruction.report()
    ])
  );

  const effects: T.AppEffects = { report: jest.fn() };
  const items = await collectAsyncGeneratorItems(gen);

  items.forEach((effectFn) => {
    effectFn(effects);
  });

  expect((effects.report as jest.Mock).mock.calls).toEqual([
    [0, 2, T.CardinalDirection.North]
  ]);
});
