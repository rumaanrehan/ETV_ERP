export class StringUtils {
  static capitalizeFirstLetter(string: string): string {
    return string.charAt(0).toUpperCase() + string.slice(1);
  }

  static isEmpty(string: string): boolean {
    return !string || string.trim().length === 0;
  }
}
