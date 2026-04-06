const STORAGE_KEY = "uniqueUserId";

const NINE_DIGITS = /^\d{9}$/;

function isValidNineDigitId(value: string | null): value is string {
  return value != null && NINE_DIGITS.test(value);
}

function randomNineDigitId(): string {
  return String(Math.floor(100000000 + Math.random() * 900000000));
}

export function getUniqueUserId(): string {
  if (typeof window === "undefined") {
    return "";
  }
  try {
    const existing = localStorage.getItem(STORAGE_KEY);
    if (isValidNineDigitId(existing)) {
      return existing;
    }
    const created = randomNineDigitId();
    localStorage.setItem(STORAGE_KEY, created);
    return created;
  } catch {
    return "";
  }
}
