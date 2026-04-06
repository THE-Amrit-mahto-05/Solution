// Utility validation functions
const isValidEmail = (email) => {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
};

const isValidDate = (dateString) => {
  const date = new Date(dateString);
  return date instanceof Date && !isNaN(date);
};

const isFutureDate = (dateString) => {
  const date = new Date(dateString);
  const now = new Date();
  return date > now;
};

const sanitizeString = (str) => {
  if (typeof str !== 'string') return '';
  return str.trim().replace(/[<>]/g, '');
};

module.exports = {
  isValidEmail,
  isValidDate,
  isFutureDate,
  sanitizeString
};