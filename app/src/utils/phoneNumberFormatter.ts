export const parsePhoneNumber = (formattedValue: string) => {
  let cleaned = formattedValue.toString().replace(/\D/g, '');

  if (cleaned.startsWith('8')) {
    cleaned = '7' + cleaned.substring(1);
  }

  return cleaned;
};

export const formatPhoneNumber = (value: string) => {
  let cleaned = value.toString().replace(/\D/g, '');

  if (cleaned.startsWith('8')) {
    cleaned = '7' + cleaned.substring(1);
  }

  if (cleaned.length > 0 && !cleaned.startsWith('7')) {
    cleaned = '7' + cleaned;
  }

  cleaned = cleaned.substring(0, 11);

  const match = cleaned.match(/^(\d{1})(\d{0,3})(\d{0,3})(\d{0,2})(\d{0,2})$/);

  if (!match) return value;

  const [, country, code, triple, double1, double2] = match;

  let result = `+${country}`;
  if (code) result += ` (${code}`;
  if (code?.length === 3) result += `)`;
  if (triple) result += ` ${triple}`;
  if (double1) result += ` ${double1}`;
  if (double2) result += ` ${double2}`;

  return result;
};
