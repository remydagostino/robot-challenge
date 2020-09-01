// Contains logic for converting strings into robot instructions
import { Instruction } from './types';

export function parseLine(line: string): Instruction {
  return { type: 'move' };
}