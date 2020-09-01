// Runs the simulator over a data source
import * as T from './types';
import { parseLine } from './parser';
import { simulate } from './simulation';

export async function* instructionGeneratorFromAsyncIterator(
  stringIterator: AsyncIterableIterator<string>
): AsyncIterableIterator<T.Instruction> {
  let inputIndex = 0;

  for await (const line of stringIterator) {
    inputIndex++;
    const parseResult = parseLine(line);

    if (parseResult.type === 'success') {
      yield parseResult.value;
    } else {
      throw new Error(
        `Parsing error, line ${inputIndex}: ${parseResult.error}`
      );
    }
  }
}

export async function* executeInstructions(
  boardState: T.BoardState,
  instructions: AsyncIterableIterator<T.Instruction>
): AsyncIterableIterator<T.EffectFn> {
  let currentBoardState = boardState;

  for await (const instruction of instructions) {
    const [nextState, effectFn] = simulate(currentBoardState, instruction);

    currentBoardState = nextState;

    yield effectFn;
  }
}
