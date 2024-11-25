import bcrypt from 'bcrypt';

export interface HashedPassword {
  salt: string;
  hashedPassword: string;
}

export async function hashPassword(password: string): Promise<HashedPassword> {
  // Generate a salt with 10 rounds of hashing
  const salt = await bcrypt.genSalt(10);

  // Hash the password with the salt
  const hashedPassword = await bcrypt.hash(password, salt);

  // Return the hashed password and salt
  return {
    salt,
    hashedPassword,
  };
}