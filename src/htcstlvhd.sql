-- phpMyAdmin SQL Dump
-- version 5.2.1
-- https://www.phpmyadmin.net/
--
-- Host: 127.0.0.1
-- Generation Time: Nov 17, 2025 at 01:55 PM
-- Server version: 10.4.32-MariaDB
-- PHP Version: 8.2.12

SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";
START TRANSACTION;
SET time_zone = "+00:00";


/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8mb4 */;

--
-- Database: `htcstlvhd`
--

-- --------------------------------------------------------

--
-- Table structure for table `baocaovipham`
--

CREATE TABLE `baocaovipham` (
  `maBaoCao` int(11) NOT NULL,
  `maQuanTriVien` int(11) NOT NULL,
  `maSinhVien` int(11) NOT NULL,
  `lyDo` varchar(255) NOT NULL,
  `ngayBC` datetime NOT NULL DEFAULT current_timestamp(),
  `trangThaiBC` varchar(255) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_vietnamese_ci;

-- --------------------------------------------------------

--
-- Table structure for table `binhluan`
--

CREATE TABLE `binhluan` (
  `maBinhLuan` int(11) NOT NULL,
  `maSinhVien` int(11) NOT NULL,
  `maTaiLieu` int(11) NOT NULL,
  `noiDungBinhLuan` text DEFAULT NULL,
  `ngayBinhLuan` datetime NOT NULL DEFAULT current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_vietnamese_ci;

-- --------------------------------------------------------

--
-- Table structure for table `cauhoi`
--

CREATE TABLE `cauhoi` (
  `maCauHoi` int(11) NOT NULL,
  `maSinhVien` int(11) NOT NULL,
  `maDanhMuc` int(11) NOT NULL,
  `tieuDeCH` varchar(255) NOT NULL,
  `noiDungCH` text DEFAULT NULL,
  `ngayDatCH` datetime NOT NULL DEFAULT current_timestamp(),
  `trangThaiCH` enum('open','answered','closed','') NOT NULL,
  `luotTruyCap` int(11) NOT NULL,
  `Tag` varchar(255) NOT NULL,
  `Mon` varchar(255) NOT NULL,
  `Nganh` varchar(255) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_vietnamese_ci;

-- --------------------------------------------------------

--
-- Table structure for table `cautraloi`
--

CREATE TABLE `cautraloi` (
  `maCauTraLoi` int(11) NOT NULL,
  `maSinhVien` int(11) NOT NULL,
  `maCauHoi` int(11) NOT NULL,
  `noiDungCTL` text NOT NULL,
  `ngayTraLoi` datetime NOT NULL DEFAULT current_timestamp(),
  `ChapNhan` int(11) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_vietnamese_ci;

-- --------------------------------------------------------

--
-- Table structure for table `danhgiacauhoi`
--

CREATE TABLE `danhgiacauhoi` (
  `maSinhVien` int(11) NOT NULL,
  `maCauHoi` int(11) NOT NULL,
  `Upvote` int(11) NOT NULL,
  `Downvote` int(11) NOT NULL,
  `diemTong` int(11) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_vietnamese_ci;

-- --------------------------------------------------------

--
-- Table structure for table `danhgiacautraloi`
--

CREATE TABLE `danhgiacautraloi` (
  `maSinhVien` int(11) NOT NULL,
  `maCauTraLoi` int(11) NOT NULL,
  `Upvote` int(11) NOT NULL,
  `Downvote` int(11) NOT NULL,
  `diemTong` int(11) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_vietnamese_ci;

-- --------------------------------------------------------

--
-- Table structure for table `danhgiatailieu`
--

CREATE TABLE `danhgiatailieu` (
  `maTaiLieu` int(11) NOT NULL,
  `maSinhVien` int(11) NOT NULL,
  `diemDanhGia` float NOT NULL,
  `ngayDanhGia` datetime NOT NULL DEFAULT current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_vietnamese_ci;

-- --------------------------------------------------------

--
-- Table structure for table `luutailieu`
--

CREATE TABLE `luutailieu` (
  `maSinhVien` int(11) NOT NULL,
  `maTaiLieu` int(11) NOT NULL,
  `ngayLuu` datetime NOT NULL DEFAULT current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_vietnamese_ci;

-- --------------------------------------------------------

--
-- Table structure for table `quantrivien`
--

CREATE TABLE `quantrivien` (
  `maQuanTriVien` int(11) NOT NULL,
  `hoTenQTV` varchar(255) NOT NULL,
  `emailQTV` varchar(255) NOT NULL,
  `matKhauQTV` varchar(255) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_vietnamese_ci;

-- --------------------------------------------------------

--
-- Table structure for table `sinhvien`
--

CREATE TABLE `sinhvien` (
  `maSinhVien` int(11) NOT NULL,
  `maQuanTriVien` int(11) NOT NULL,
  `hoTenSV` varchar(255) NOT NULL,
  `emailSV` varchar(255) NOT NULL,
  `matKhauSV` varchar(255) NOT NULL,
  `ngayTao` datetime NOT NULL DEFAULT current_timestamp(),
  `nganh` varchar(255) DEFAULT NULL,
  `truongHoc` varchar(255) DEFAULT NULL,
  `avatarURL` varchar(500) NOT NULL,
  `tokenGhiNhoDN` varchar(255) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- --------------------------------------------------------

--
-- Table structure for table `tailieu`
--

CREATE TABLE `tailieu` (
  `maTaiLieu` int(11) NOT NULL,
  `maQuanTriVien` int(11) NOT NULL,
  `maSinhVien` int(11) NOT NULL,
  `tieuDeTL` varchar(255) NOT NULL,
  `moTaTL` text NOT NULL,
  `ngayChiaSe` datetime NOT NULL DEFAULT current_timestamp(),
  `trangThaiTL` enum('pending','approved','rejected','') NOT NULL,
  `URL` varchar(500) NOT NULL,
  `fileSizes` bigint(20) NOT NULL,
  `luotXem` int(11) NOT NULL,
  `luotTaiXuong` int(11) NOT NULL,
  `Mon` varchar(255) NOT NULL,
  `Nganh` varchar(255) NOT NULL,
  `LoaiTaiLieu` varchar(255) NOT NULL,
  `DinhDang` varchar(10) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_vietnamese_ci;

--
-- Indexes for dumped tables
--

--
-- Indexes for table `baocaovipham`
--
ALTER TABLE `baocaovipham`
  ADD PRIMARY KEY (`maBaoCao`),
  ADD KEY `fk_baocaovipham_sinhvien` (`maSinhVien`),
  ADD KEY `fk_baocaovipham_quantrivien` (`maQuanTriVien`);

--
-- Indexes for table `binhluan`
--
ALTER TABLE `binhluan`
  ADD PRIMARY KEY (`maBinhLuan`),
  ADD KEY `fk_binhluan_sinhvien` (`maSinhVien`),
  ADD KEY `fk_binhluan_tailieu` (`maTaiLieu`);

--
-- Indexes for table `cauhoi`
--
ALTER TABLE `cauhoi`
  ADD PRIMARY KEY (`maCauHoi`),
  ADD KEY `fk_cauhoi_sinhvien` (`maSinhVien`),
  ADD KEY `fk_cauhoi_danhmuccauhoi` (`maDanhMuc`);

--
-- Indexes for table `cautraloi`
--
ALTER TABLE `cautraloi`
  ADD PRIMARY KEY (`maCauTraLoi`),
  ADD KEY `fk_cautraloi_sinhvien` (`maSinhVien`),
  ADD KEY `fk_cautraloi_cauhoi` (`maCauHoi`);

--
-- Indexes for table `danhgiacauhoi`
--
ALTER TABLE `danhgiacauhoi`
  ADD PRIMARY KEY (`maSinhVien`,`maCauHoi`),
  ADD KEY `fk_danhgiacauhoi_cauhoi` (`maCauHoi`);

--
-- Indexes for table `danhgiacautraloi`
--
ALTER TABLE `danhgiacautraloi`
  ADD PRIMARY KEY (`maSinhVien`,`maCauTraLoi`),
  ADD KEY `fk_danhgiacautraloi_cautraloi` (`maCauTraLoi`);

--
-- Indexes for table `danhgiatailieu`
--
ALTER TABLE `danhgiatailieu`
  ADD PRIMARY KEY (`maTaiLieu`,`maSinhVien`),
  ADD KEY `fk_danhgiatailieu_sinhvien` (`maSinhVien`);

--
-- Indexes for table `luutailieu`
--
ALTER TABLE `luutailieu`
  ADD PRIMARY KEY (`maSinhVien`,`maTaiLieu`),
  ADD KEY `fk_luutailieu_tailieu` (`maTaiLieu`);

--
-- Indexes for table `quantrivien`
--
ALTER TABLE `quantrivien`
  ADD PRIMARY KEY (`maQuanTriVien`);

--
-- Indexes for table `sinhvien`
--
ALTER TABLE `sinhvien`
  ADD PRIMARY KEY (`maSinhVien`),
  ADD KEY `fk_sinhvien_quantrivien` (`maQuanTriVien`);

--
-- Indexes for table `tailieu`
--
ALTER TABLE `tailieu`
  ADD PRIMARY KEY (`maTaiLieu`),
  ADD KEY `fk_tailieu_quantrivien` (`maQuanTriVien`),
  ADD KEY `fk_tailieu_sinhvien` (`maSinhVien`);

--
-- AUTO_INCREMENT for dumped tables
--

--
-- AUTO_INCREMENT for table `baocaovipham`
--
ALTER TABLE `baocaovipham`
  MODIFY `maBaoCao` int(11) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT for table `binhluan`
--
ALTER TABLE `binhluan`
  MODIFY `maBinhLuan` int(11) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT for table `cauhoi`
--
ALTER TABLE `cauhoi`
  MODIFY `maCauHoi` int(11) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT for table `cautraloi`
--
ALTER TABLE `cautraloi`
  MODIFY `maCauTraLoi` int(11) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT for table `quantrivien`
--
ALTER TABLE `quantrivien`
  MODIFY `maQuanTriVien` int(11) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT for table `sinhvien`
--
ALTER TABLE `sinhvien`
  MODIFY `maSinhVien` int(11) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT for table `tailieu`
--
ALTER TABLE `tailieu`
  MODIFY `maTaiLieu` int(11) NOT NULL AUTO_INCREMENT;

--
-- Constraints for dumped tables
--

--
-- Constraints for table `baocaovipham`
--
ALTER TABLE `baocaovipham`
  ADD CONSTRAINT `fk_baocaovipham_quantrivien` FOREIGN KEY (`maQuanTriVien`) REFERENCES `quantrivien` (`maQuanTriVien`),
  ADD CONSTRAINT `fk_baocaovipham_sinhvien` FOREIGN KEY (`maSinhVien`) REFERENCES `sinhvien` (`maSinhVien`);

--
-- Constraints for table `binhluan`
--
ALTER TABLE `binhluan`
  ADD CONSTRAINT `fk_binhluan_sinhvien` FOREIGN KEY (`maSinhVien`) REFERENCES `sinhvien` (`maSinhVien`),
  ADD CONSTRAINT `fk_binhluan_tailieu` FOREIGN KEY (`maTaiLieu`) REFERENCES `tailieu` (`maTaiLieu`);

--
-- Constraints for table `cauhoi`
--
ALTER TABLE `cauhoi`
  ADD CONSTRAINT `fk_cauhoi_sinhvien` FOREIGN KEY (`maSinhVien`) REFERENCES `sinhvien` (`maSinhVien`);

--
-- Constraints for table `cautraloi`
--
ALTER TABLE `cautraloi`
  ADD CONSTRAINT `fk_cautraloi_cauhoi` FOREIGN KEY (`maCauHoi`) REFERENCES `cauhoi` (`maCauHoi`),
  ADD CONSTRAINT `fk_cautraloi_sinhvien` FOREIGN KEY (`maSinhVien`) REFERENCES `sinhvien` (`maSinhVien`);

--
-- Constraints for table `danhgiacauhoi`
--
ALTER TABLE `danhgiacauhoi`
  ADD CONSTRAINT `fk_danhgiacauhoi_cauhoi` FOREIGN KEY (`maCauHoi`) REFERENCES `cauhoi` (`maCauHoi`),
  ADD CONSTRAINT `fk_danhgiacauhoi_sinhvien` FOREIGN KEY (`maSinhVien`) REFERENCES `sinhvien` (`maSinhVien`);

--
-- Constraints for table `danhgiacautraloi`
--
ALTER TABLE `danhgiacautraloi`
  ADD CONSTRAINT `fk_danhgiacautraloi_cautraloi` FOREIGN KEY (`maCauTraLoi`) REFERENCES `cautraloi` (`maCauTraLoi`),
  ADD CONSTRAINT `fk_danhgiacautraloi_sinhvien` FOREIGN KEY (`maSinhVien`) REFERENCES `sinhvien` (`maSinhVien`);

--
-- Constraints for table `danhgiatailieu`
--
ALTER TABLE `danhgiatailieu`
  ADD CONSTRAINT `fk_danhgiatailieu_sinhvien` FOREIGN KEY (`maSinhVien`) REFERENCES `sinhvien` (`maSinhVien`),
  ADD CONSTRAINT `fk_danhgiatailieu_tailieu` FOREIGN KEY (`maTaiLieu`) REFERENCES `tailieu` (`maTaiLieu`);

--
-- Constraints for table `luutailieu`
--
ALTER TABLE `luutailieu`
  ADD CONSTRAINT `fk_luutailieu_sinhvien` FOREIGN KEY (`maSinhVien`) REFERENCES `sinhvien` (`maSinhVien`),
  ADD CONSTRAINT `fk_luutailieu_tailieu` FOREIGN KEY (`maTaiLieu`) REFERENCES `tailieu` (`maTaiLieu`);

--
-- Constraints for table `sinhvien`
--
ALTER TABLE `sinhvien`
  ADD CONSTRAINT `fk_sinhvien_quantrivien` FOREIGN KEY (`maQuanTriVien`) REFERENCES `quantrivien` (`maQuanTriVien`);

--
-- Constraints for table `tailieu`
--
ALTER TABLE `tailieu`
  ADD CONSTRAINT `fk_tailieu_quantrivien` FOREIGN KEY (`maQuanTriVien`) REFERENCES `quantrivien` (`maQuanTriVien`),
  ADD CONSTRAINT `fk_tailieu_sinhvien` FOREIGN KEY (`maSinhVien`) REFERENCES `sinhvien` (`maSinhVien`);
COMMIT;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
