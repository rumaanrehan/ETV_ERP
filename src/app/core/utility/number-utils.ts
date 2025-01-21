export class NumberUtils {
  static formatCurrency(amount: number, currency: string = 'USD'): string {
    return new Intl.NumberFormat('en-US', { style: 'currency', currency }).format(amount);
  }

  static roundToTwoDecimalPlaces(value: number): number {
    return Math.round(value * 100) / 100;
  }
}
