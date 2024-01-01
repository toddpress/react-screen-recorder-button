import { pipe } from "./pipe"

/**
 * ccc (Conditional ClassName Concatenator) concatenates the truthy values of an
 * array.
 *
 * @name ccc Conditional ClassName Concatenator
 * @param {...(string|number|Object|Array.<(string|number|Object|Array)>)} arr - The array whose truthy values will be concatenated.
 * @returns {String} - The concatenated truthy values of the array.
 *
 * @example
 * ccc(isBleep && 'bleep', isBloop && 'bloop', styles.bleepBloop); // => 'bleep bloop parent_bleepBoop_42DA42'
 * ccc('bleep', 'bloop'); // => 'bleep bloop'
 * ccc('bleep', { beep: true }); // => 'bleep beep'
 * ccc({ 'bleep-bloop': true }); // => 'bleep-bloop'
 * ccc({ 'bleep-bloop': false }); // => ''
 * ccc({ bleep: true }, { beep: true }); // => 'bleep beep'
 * ccc({ bleep: true, beep: true }); // => 'bleep beep'
 * ccc('bleep', { beep: true, bloop: false }, 'boop', { beep: true }); // => 'bleep beep boop'
 * ccc(null, false, 'beep', undefined, 0, 1, { beep: null }, ''); // => 'beep 1'
 */
export function ccc(...arr: CccInputType[]): string {
    if (!arr.length) return ''

    return arr
        .reduce((acc: string[], item: CccInputType) => {
            if (item && isStringOrNumber(item)) {
                return acc.concat(item.toString()) // Convert item to string and wrap it in an array
            } else if (isArray(item)) {
                return acc.concat(ccc(...(item as CccInputType[])))
            } else if (isObject(item)) {
                return acc.concat(
                    extractTruthyObjectPropertyNames(
                        item as Record<string, unknown>,
                    ),
                )
            }
            return acc
        }, [])
        .join(' ')
}

const extractTruthyObjectPropertyNames: ExtractPropsType = (obj) => {
    const operations = pipe(
        Object.entries,
        (entries) => entries.filter(([_, val]) => isTruthy(val)),
        (entries) =>
            entries.reduce(
                (acc: string[], [key, val]: [string, unknown]) =>
                    isTruthy(val) ? acc.concat([key]) : acc,
                [],
            ),
        (keys) => keys.join(' '),
    ) as (obj: Record<string, unknown>) => string

    return operations(obj)
}

export const isString = (item: unknown): item is string =>
    typeof item === 'string'
export const isNumber = (item: unknown): item is number =>
    typeof item === 'number'
export const isStringOrNumber = (item: unknown): item is string | number =>
    isString(item) || isNumber(item)
export const isObject = (item: unknown): item is Record<string, unknown> =>
    typeof item === 'object' && item?.constructor === Object
export const isArray = (item: unknown): item is unknown[] => Array.isArray(item)
export const isTruthy = (item: unknown): boolean => !!item

type ExtractPropsType = (obj: Record<string, unknown>) => string
type CccInputType =
    | string
    | boolean
    | number
    | Record<string, unknown>
    | Array<CccInputType>
