import db from '../app/config/database.js';

async function run() {
  try {
    const [rows] = await db.execute('SELECT maTaiLieu, maLoai, maDinhDang, maSinhVien, tieuDeTL, trangThaiTL, filePath, fileSizes, soLanLuu, luotTaiXuong FROM tailieu LIMIT 20');
    console.log('Found', rows.length, 'rows');
    console.dir(rows, { depth: 2 });
  } catch (err) {
    console.error('Query error:', err.message);
  } finally {
    // close pool (mysql2 promise pool doesn't have end method on exported promise, so skip)
    process.exit(0);
  }
}

run();
