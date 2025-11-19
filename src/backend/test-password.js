import bcrypt from 'bcryptjs';

// Script để tạo hash password cho database
async function generateHash() {
  const password = 'admin123'; // Đổi thành mật khẩu bạn muốn
  const hash = await bcrypt.hash(password, 10);
  
  console.log('\n=== HASH PASSWORD ===');
  console.log('Password gốc:', password);
  console.log('Hash (copy vào DB):', hash);
  console.log('\nCập nhật vào database:');
  console.log(`UPDATE sinhvien SET matKhauSV = '${hash}' WHERE emailSV = 'your@email.com';`);
}

// Test so sánh password
async function testPassword() {
  const plainPassword = '123456';
  const hashedPassword = '$2a$10$abcdefghijklmnopqrstuvwxyz123456789'; // Hash từ DB
  
  const isMatch = await bcrypt.compare(plainPassword, hashedPassword);
  console.log('\n=== TEST PASSWORD ===');
  console.log('Plain password:', plainPassword);
  console.log('Hashed password:', hashedPassword);
  console.log('Match:', isMatch);
}

console.log('Chọn chức năng:');
console.log('1. Tạo hash mới');
console.log('2. Test password hiện tại');

// Chạy tạo hash
generateHash();
