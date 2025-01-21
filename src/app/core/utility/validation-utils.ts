export class ValidationUtils {
  static isEmailValid(email: string): boolean {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  }

  static isPhoneNumberValid(phone: string): boolean {
    const phoneRegex = /^[0-9]{10}$/; // Simple example for a 10-digit phone number
    return phoneRegex.test(phone);
  }
}
