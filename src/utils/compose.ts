/**
 * @name compose
 * @param {...Function} fns - The functions to compose.
 * @returns {Function} - The composed function.
 * @example
 * const add = (x, y) => x + y
 * const multiply = (x, y) => x * y
 * const addThenMultiply = compose(multiply, add)
 * addThenMultiply(2, 3) // => 10
 */
export const compose =
    (...fns: Function[]) =>
    (x: unknown) =>
        fns.reduceRight((y, f) => f(y), x)
