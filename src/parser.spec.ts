import { parseLine } from './parser';

test('parses the move instruction', () => {
  expect(parseLine('MOVE')).toEqual({ type: 'move' });
});