// Runs the simulator over a data source
import * as T from './types';
import { parseLine } from './parser';
import { simulate } from './simulation';

async function* execute(boardState: T.BoardState, input: AsyncGenerator<string>): AsyncGenerator<T.EffectFn> {
  let currentBoardState = boardState;
  let inputIndex = 0;

  for await (const line of input) {
    inputIndex++;
    const parseResult = parseLine(line);

    if (parseResult.type === 'success') {
      const [ nextState, effectFn ] = simulate(currentBoardState, parseResult.value);

      currentBoardState = nextState;

      yield effectFn;
    } else {
      throw new Error('Oh no! at line: ' + inputIndex);
    }
  }
}