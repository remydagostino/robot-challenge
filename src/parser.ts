// Contains logic for converting strings into robot instructions
import * as T from './types';
import * as Result from './data/result';
import * as Instruction from './data/instruction';

type CommandAndArgs = { command: string, args: string };

export function parseLine(line: string): T.Result<T.Instruction, string> {
  return Result.flatMap(parseCommandAndArgs, splitLine(line));
}

function parseCommandAndArgs({ command, args }: CommandAndArgs): T.Result<T.Instruction, string> {
  switch (command.toLowerCase()) {
    case 'place':
      return parsePlaceCommandWithArgs(args);
    case 'move':
      return !args
        ? Result.success(Instruction.move())
        : Result.failure(`Unrecognized arguments for MOVE command: ${args}`);
    case 'left':
      return !args
        ? Result.success(Instruction.rotate(T.RotationalDirection.Left))
        : Result.failure(`Unrecognized arguments for LEFT command: ${args}`);
    case 'right':
      return !args
        ? Result.success(Instruction.rotate(T.RotationalDirection.Right))
        : Result.failure(`Unrecognized arguments for RIGHT command: ${args}`);
    case 'report':
      return !args
        ? Result.success(Instruction.report())
        : Result.failure(`Unrecognized arguments for REPORT command: ${args}`);
    default:
      return Result.failure(`Unrecognized command: ${command}`);
  }
}

function splitLine(line: string): T.Result<CommandAndArgs, string> {
  const matchResult = /^(\S+)\s*(.+)?$/.exec(line.trim());

  if (matchResult != null) {
    const [_, command, args] = matchResult;

    return Result.success({ command, args: args || '' });
  } else {
    return Result.failure(`Could not parse line: ${line}`)
  }
}

function parsePlaceCommandWithArgs(args: string): T.Result<T.PlaceInstruction, string> {
  const argsMatch = args.split(',');

  if (argsMatch.length === 3) {
    const [xMatch, yMatch, directionMatch] = args.split(',');

    return Result.map3(
      Instruction.place,
      stringToInt(xMatch),
      stringToInt(yMatch),
      stringToCardinalDirection(directionMatch)
    )
  } else {
    return Result.failure(`Unrecognized arguments for PLACE command: ${args}`);
  }
}

function stringToInt(str: string): T.Result<number, string> {
  const num = Number(str);

  // Only integers and not not numbers allowed! :D
  return !Number.isNaN(num) && /^\-?\d+$/.test(str.trim())
    ? Result.success(num)
    : Result.failure(`Could not parse string as integer: ${str}`);
}

function stringToCardinalDirection(str: string): T.Result<T.CardinalDirection, string> {
  switch (str.trim().toLowerCase()) {
    case 'north': 
      return Result.success(T.CardinalDirection.North);
    case 'east': 
      return Result.success(T.CardinalDirection.East);
    case 'south': 
      return Result.success(T.CardinalDirection.South);
    case 'west': 
      return Result.success(T.CardinalDirection.West);
    default:
      return Result.failure(`Could not parse string as cardinal direction: ${str}`)
  }
}