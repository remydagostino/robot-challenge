import * as T from './types';
import { parseLine } from './parser';
import * as Instruction from './data/instruction';
import * as Result from './data/result';

test('parses the PLACE command', () => {
  const examples: Array<[string, T.Instruction]> = [
    ['PLACE 1,2,EAST', Instruction.place(1, 2, T.CardinalDirection.East)],
    ['PLACE 1,2,NORTH', Instruction.place(1, 2, T.CardinalDirection.North)],
    ['PLACE 1,2,SOUTH', Instruction.place(1, 2, T.CardinalDirection.South)],
    ['PLACE 1,2,WEST', Instruction.place(1, 2, T.CardinalDirection.West)],

    ['PLACE 0,0,EAST', Instruction.place(0, 0, T.CardinalDirection.East)],
    ['PLACE -3,8,EAST', Instruction.place(-3, 8, T.CardinalDirection.East)],
    ['place 1,2,WEST', Instruction.place(1, 2, T.CardinalDirection.West)],
    ['  place 1 ,2,  WEST', Instruction.place(1, 2, T.CardinalDirection.West)],
  ];

  examples.forEach(([input, output]) => {
    expect(parseLine(input)).toEqual(Result.success(output));
  });
});

test('parses the MOVE instruction', () => {
  caseAndSpacePermeations('move').forEach((line) => {
    expect(parseLine(line)).toEqual(Result.success(Instruction.move()));
  });
});

test('parses the LEFT instruction', () => {
  caseAndSpacePermeations('left').forEach((line) => {
    expect(parseLine(line)).toEqual(Result.success(Instruction.rotate(T.RotationalDirection.Left)));
  });
});

test('parses the RIGHT instruction', () => {
  caseAndSpacePermeations('right').forEach((line) => {
    expect(parseLine(line)).toEqual(Result.success(Instruction.rotate(T.RotationalDirection.Right)));
  });
});

test('parses the REPORT instruction', () => {
  caseAndSpacePermeations('report').forEach((line) => {
    expect(parseLine(line)).toEqual(Result.success(Instruction.report()));
  });
});

test('parses blank instructions as comments', () => {
  expect(parseLine('')).toEqual(
    Result.success(Instruction.ignore())
  );
});

test('fails to parse unsupported instructions', () => {
  [
    'MORRVE',
    'Reverse',
    '~~~~',
  ].forEach((line) => {
    expect(parseLine(line)).toEqual(
      Result.failure(`Unrecognized command: ${line}`)
    );
  });
});

test('fails to parse instructions with unexpected arguments', () => {
  expect(parseLine('MOVE BACKWARDS')).toEqual(
    Result.failure(`Unrecognized arguments for MOVE command: BACKWARDS`)
  );
  expect(parseLine('LEFT LEFT')).toEqual(
    Result.failure(`Unrecognized arguments for LEFT command: LEFT`)
  );
  expect(parseLine('PLACE upside down')).toEqual(
    Result.failure(`Unrecognized arguments for PLACE command: upside down`)
  );
  expect(parseLine('PLACE 1.2,2.55,NORTH')).toEqual(
    Result.failure(`Could not parse string as integer: 1.2`)
  );
  expect(parseLine('PLACE 0,0,NORTH-WEST')).toEqual(
    Result.failure(`Could not parse string as cardinal direction: NORTH-WEST`)
  );
});


// Takes "move" and creates ["MOVE", "Move", "move", "  move   "]
function caseAndSpacePermeations(word: string): Array<string> {
  return [
    word.toUpperCase(),
    word[0].toUpperCase() + word.split('').slice(1).join('').toLowerCase(),
    word.toLowerCase(),
    `    ${word}   `
  ];
}