export class ErrorUtils {
  static getErrorMessage(error: any): string {
    if (error.error && error.error.message) {
      return error.error.message;
    } else if (error.message) {
      return error.message;
    }
    return 'An unknown error occurred';
  }
}
