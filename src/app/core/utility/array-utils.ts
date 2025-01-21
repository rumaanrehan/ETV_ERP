export class ArrayUtils {
  static removeDuplicates<T>(array: T[]): T[] {
    return [...new Set(array)];
  }

  static sortArray<T>(array: T[], compareFn?: (a: T, b: T) => number): T[] {
    return array.slice().sort(compareFn);
  }
}
