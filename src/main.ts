import * as T from './types';
import * as GameBoard from './data/game-board';
import * as Readline from 'readline';
import { prettyPrintCardinal } from './data/directions';
import {
  executeInstructions,
  instructionGeneratorFromAsyncIterator
} from './executor';

const main = async (): Promise<void> => {
  const initialState = {
    robot: null,
    board: GameBoard.defaultBoard()
  };

  const rl = Readline.createInterface({
    input: process.stdin,
    terminal: false
  });

  const execution = executeInstructions(
    initialState,
    instructionGeneratorFromAsyncIterator(rl[Symbol.asyncIterator]())
  );

  for await (const effectFn of execution) {
    effectFn({
      report: (x: number, y: number, direction: T.CardinalDirection) => {
        process.stdout.write(
          `Output: ${x},${y},${prettyPrintCardinal(direction)}\n`
        );
      }
    });
  }
};

main().catch((err: Error) => {
  console.log(err);
});
