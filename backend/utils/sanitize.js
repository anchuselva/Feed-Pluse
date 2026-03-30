import validator from 'validator';

export function sanitizeFeedbackInput(body) {
  return {
    title: sanitizeString(body.title),
    description: sanitizeString(body.description),
    category: sanitizeString(body.category),
    submitterName: sanitizeString(body.submitterName),
    submitterEmail: body.submitterEmail ? sanitizeEmail(body.submitterEmail) : undefined,
  };
}

export function sanitizeString(value) {
  if (typeof value !== 'string') {
    return '';
  }

  return value.trim().replace(/<[^>]*>/g, '');
}

export function sanitizeEmail(value) {
  if (typeof value !== 'string') {
    return undefined;
  }

  const email = value.trim().toLowerCase();
  return validator.isEmail(email) ? validator.normalizeEmail(email) : undefined;
}

export function isValidEmail(value) {
  return typeof value === 'string' && validator.isEmail(value.trim());
}
