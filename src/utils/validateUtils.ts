export function isString(value: any): value is string  {
    return typeof value === 'string';
}
export function isBoolean(value: any): value is boolean {
    return typeof value === 'boolean';
}
export  function isInteger(value: any): boolean {
    if (typeof value === 'number' && Number.isInteger(value)) {
      // If the value is a number and an integer, return true
      return true;
    } else if (typeof value === 'string') {
      // If the value is a string, try to parse it as an integer
      const parsedValue = parseInt(value);
      if (!isNaN(parsedValue) && Number.isInteger(parsedValue)) {
        // If the parsed value is not NaN and is an integer, return true
        return true;
      }
    }
    // Otherwise, return false
    return false;
}
  
export function isFloat(value: any): boolean {
    if (typeof value === 'number' && !Number.isInteger(value)) {
      // If the value is a number and not an integer, return true
      return true;
    } else if (typeof value === 'string') {
      // If the value is a string, try to parse it as a float
      const parsedValue = parseFloat(value);
      if (!isNaN(parsedValue) && !Number.isInteger(parsedValue)) {
        // If the parsed value is not NaN and not an integer, return true
        return true;
      }
    }
    // Otherwise, return false
    return false;
  }
  
export function isNumber(value: any): boolean {
    if (typeof value === 'number' && !isNaN(value)) {
      // If the value is a number and not NaN, return true
      return true;
    } else if (typeof value === 'string') {
      // If the value is a string, try to parse it as a number
      const parsedValue = parseFloat(value);
      if (!isNaN(parsedValue)) {
        // If the parsed value is not NaN, return true
        return true;
      }
    }
    // Otherwise, return false
    return false;
  }
  
export function isDateTime(value: any): boolean {
    const date = new Date(value);
    return !isNaN(date.getTime());
  }
  
export function isArray(value: any): value is any[] {
    return Array.isArray(value);
}
export function isObject(value: any) {
    return typeof value === 'object' && value !== null;
}
export function isEnum<T extends Record<string, string>>(enumObj: T, value: string): value is T[keyof T] {
    return Object.values(enumObj).includes(value);
}
export function isEnumArray<T extends Record<string, string>>(enumObj: T, values: string[]): values is Array<T[keyof T]> {
    return values.every((value) => Object.values(enumObj).includes(value));
}
export function validateEmail(email: string): boolean {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
}