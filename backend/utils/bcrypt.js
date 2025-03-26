import bcrypt from 'bcryptjs';

// Hash password
export const hashPassword = async (password) => {
  const salt = await bcrypt.genSalt(10);
  return await bcrypt.hash(password, salt);
};

// Compare passwords
export const comparePasswords = async (candidatePassword, hashedPassword) => {
  if (!candidatePassword || !hashedPassword) {
    throw new Error('Both password and hash are required for comparison');
  }
  return await bcrypt.compare(candidatePassword, hashedPassword);
};