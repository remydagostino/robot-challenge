import * as T from '../types';

export const success = <A>(value: A): T.Success<A> => {
  return { type: 'success', value };
};

export const failure = <E>(error: E): T.Failure<E> => {
  return { type: 'failure', error };
};

export const map = <A, B, E>(
  fn: (a: A) => B,
  result: T.Result<A, E>
): T.Result<B, E> => {
  return flatMap((a) => success(fn(a)), result);
};

export const map2 = <A, B, C, E>(
  fn: (a: A, b: B) => C,
  result1: T.Result<A, E>,
  result2: T.Result<B, E>
): T.Result<C, E> => {
  return flatMap((a) => map((b) => fn(a, b), result2), result1);
};

export const map3 = <A, B, C, D, E>(
  fn: (a: A, b: B, c: C) => D,
  result1: T.Result<A, E>,
  result2: T.Result<B, E>,
  result3: T.Result<C, E>
): T.Result<D, E> => {
  return flatMap(
    (a) => flatMap((b) => map((c) => fn(a, b, c), result3), result2),
    result1
  );
};

export const flatMap = <A, B, E>(
  fn: (a: A) => T.Result<B, E>,
  result: T.Result<A, E>
): T.Result<B, E> => {
  return result.type === 'success' ? fn(result.value) : result;
};
