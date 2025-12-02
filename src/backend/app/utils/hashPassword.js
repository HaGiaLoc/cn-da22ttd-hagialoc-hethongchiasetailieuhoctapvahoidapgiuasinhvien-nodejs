import bcrypt from 'bcryptjs';

/**
 * Hash password using bcrypt
 * @param {string} password - Plain text password
 * @returns {Promise<string>} Hashed password
 */
export async function hashPassword(password) {
  return await bcrypt.hash(password, 10);
}

/**
 * Compare plain password with hashed password
 * @param {string} plainPassword - Plain text password
 * @param {string} hashedPassword - Hashed password from database
 * @returns {Promise<boolean>} True if passwords match
 */
export async function comparePassword(plainPassword, hashedPassword) {
  return await bcrypt.compare(plainPassword, hashedPassword);
}

/**
 * Generate hash for a given password (for CLI/scripts)
 * @param {string} password - Plain text password
 */
export async function generateHash(password) {
  const hash = await hashPassword(password);
  console.log('\n=== HASH PASSWORD ===');
  console.log('Password gốc:', password);
  console.log('Hash (copy vào DB):', hash);
  console.log('\nCập nhật vào database:');
  console.log(`UPDATE sinhvien SET matKhauSV = '${hash}' WHERE emailSV = 'your@email.com';`);
  console.log(`UPDATE quantrivien SET matKhauQTV = '${hash}' WHERE emailQTV = 'admin@example.com';`);
  return hash;
}
