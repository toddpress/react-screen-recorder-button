/**
 * @name pipe
 * @param {...Function} fns - The functions to pipe.
 * @returns {Function} - The piped function.
 * @example
 * const add = (x, y) => x + y
 * const multiply = (x, y) => x * y
 * const addThenMultiply = pipe(multiply, add)
 * addThenMultiply(2, 3) // => 15
 * const multiplyThenAdd = pipe(add, multiply)
 * multiplyThenAdd(2, 3) // => 10
 */
export const pipe =
    (...fns: Function[]) =>
    (x: unknown) =>
        fns.reduce((y, f) => f(y), x)
