// Definining the domain and types used throughout the solution

export type Instruction 
  = PlaceInstruction
  | MoveInstruction
  | RotateInstruction
  | ReportInstruction;

export type PlaceInstruction = {
  type: 'place',
  x: number,
  y: number,
  direction: CardinalDirection
}

export type MoveInstruction = {
  type: 'move'
}

export type RotateInstruction = {
  type: 'rotate',
  direction: RotationalDirection
}

export type ReportInstruction = {
  type: 'report'
}

export enum CardinalDirection {
  North,
  East,
  South,
  West
}

export enum RotationalDirection {
  Left,
  Right
}

// Just one kind of game board for now
export type GameBoard 
  = RectangularBoard

export type RectangularBoard = {
  type: 'rectangular',
  height: number,
  width: number
}

// A wrapper type for handling synchronous success/fail actions
export type Result<A, E>
  = Success<A>
  | Failure<E>

export type Success<A> = {
  type: 'success',
  value: A
}

export type Failure<E> = {
  type: 'failure',
  error: E
}

export type ParseError = {
  type: 'parseError'
  message: string
  lineNumber: number
}

