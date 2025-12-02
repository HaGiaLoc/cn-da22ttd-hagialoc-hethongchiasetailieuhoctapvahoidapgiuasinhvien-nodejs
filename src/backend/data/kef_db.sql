-- phpMyAdmin SQL Dump
-- version 5.2.1
-- https://www.phpmyadmin.net/
--
-- Host: 127.0.0.1
-- Generation Time: Dec 02, 2025 at 12:23 PM
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
-- Database: `kef_db`
--
CREATE DATABASE IF NOT EXISTS `kef_db` DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
USE `kef_db`;

-- --------------------------------------------------------

--
-- Table structure for table `baocaovipham`
--

CREATE TABLE IF NOT EXISTS `baocaovipham` (
  `maBaoCao` int(11) NOT NULL AUTO_INCREMENT,
  `maQuanTriVien` int(11) NOT NULL,
  `maTaiLieu` int(11) DEFAULT NULL,
  `maSinhVien` int(11) NOT NULL,
  `maCauHoi` int(11) DEFAULT NULL,
  `maCauTraLoi` int(11) DEFAULT NULL,
  `lyDo` text NOT NULL,
  `ngayBC` datetime NOT NULL DEFAULT current_timestamp(),
  `trangThaiBC` enum('pending','approved','rejected') NOT NULL,
  `loaiBaoCao` enum('document','question','answer') NOT NULL,
  PRIMARY KEY (`maBaoCao`),
  KEY `fk_baocaovipham_sinhvien` (`maSinhVien`),
  KEY `fk_baocaovipham_quantrivien` (`maQuanTriVien`),
  KEY `fk_baocaovipham_tailieu` (`maTaiLieu`),
  KEY `fk_baocaovipham_cauhoi` (`maCauHoi`),
  KEY `fk_baocaovipham_cautraloi` (`maCauTraLoi`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_vietnamese_ci;

-- --------------------------------------------------------

--
-- Table structure for table `cauhoi`
--

CREATE TABLE IF NOT EXISTS `cauhoi` (
  `maCauHoi` int(11) NOT NULL AUTO_INCREMENT,
  `maSinhVien` int(11) NOT NULL,
  `maMon` int(11) NOT NULL,
  `tieuDeCH` varchar(255) NOT NULL,
  `noiDungCH` text DEFAULT NULL,
  `ngayDatCH` datetime NOT NULL DEFAULT current_timestamp(),
  `trangThaiCH` enum('show','answered','hidden') NOT NULL,
  `luotTraLoi` int(11) NOT NULL,
  `imagePath` text DEFAULT NULL,
  PRIMARY KEY (`maCauHoi`),
  KEY `fk_cauhoi_sinhvien` (`maSinhVien`),
  KEY `fk_cauhoi_mon` (`maMon`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_vietnamese_ci;

-- --------------------------------------------------------

--
-- Table structure for table `cautraloi`
--

CREATE TABLE IF NOT EXISTS `cautraloi` (
  `maCauTraLoi` int(11) NOT NULL AUTO_INCREMENT,
  `maSinhVien` int(11) NOT NULL,
  `maCauHoi` int(11) NOT NULL,
  `noiDungCTL` text NOT NULL,
  `ngayTraLoi` datetime NOT NULL DEFAULT current_timestamp(),
  `trangThaiCTL` enum('show','hidden') NOT NULL,
  PRIMARY KEY (`maCauTraLoi`),
  KEY `fk_cautraloi_sinhvien` (`maSinhVien`),
  KEY `fk_cautraloi_cauhoi` (`maCauHoi`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_vietnamese_ci;

-- --------------------------------------------------------

--
-- Table structure for table `danhgiacauhoi`
--

CREATE TABLE IF NOT EXISTS `danhgiacauhoi` (
  `maSinhVien` int(11) NOT NULL,
  `maCauHoi` int(11) NOT NULL,
  `Upvote` enum('0','1') NOT NULL DEFAULT '0',
  `Downvote` enum('0','1') NOT NULL DEFAULT '0',
  PRIMARY KEY (`maSinhVien`,`maCauHoi`),
  KEY `fk_danhgiacauhoi_cauhoi` (`maCauHoi`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_vietnamese_ci;

-- --------------------------------------------------------

--
-- Table structure for table `danhgiacautraloi`
--

CREATE TABLE IF NOT EXISTS `danhgiacautraloi` (
  `maSinhVien` int(11) NOT NULL,
  `maCauTraLoi` int(11) NOT NULL,
  `Upvote` enum('0','1') NOT NULL DEFAULT '0',
  `Downvote` enum('0','1') NOT NULL DEFAULT '0',
  PRIMARY KEY (`maSinhVien`,`maCauTraLoi`),
  KEY `fk_danhgiacautraloi_cautraloi` (`maCauTraLoi`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_vietnamese_ci;

-- --------------------------------------------------------

--
-- Table structure for table `danhsachtag`
--

CREATE TABLE IF NOT EXISTS `danhsachtag` (
  `maTag` int(11) NOT NULL,
  `maCauHoi` int(11) NOT NULL,
  PRIMARY KEY (`maTag`,`maCauHoi`),
  KEY `fk_danhsachtag_cauhoi` (`maCauHoi`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_vietnamese_ci;

-- --------------------------------------------------------

--
-- Table structure for table `danhsachtailieu`
--

CREATE TABLE IF NOT EXISTS `danhsachtailieu` (
  `maMon` int(11) NOT NULL,
  `maTaiLieu` int(11) NOT NULL,
  PRIMARY KEY (`maMon`,`maTaiLieu`),
  KEY `fk_danhsachtailieu_tailieu` (`maTaiLieu`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_vietnamese_ci;

-- --------------------------------------------------------

--
-- Table structure for table `dinhdang`
--

CREATE TABLE IF NOT EXISTS `dinhdang` (
  `maDinhDang` int(11) NOT NULL AUTO_INCREMENT,
  `tenDinhDang` varchar(255) NOT NULL,
  PRIMARY KEY (`maDinhDang`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_vietnamese_ci;

-- --------------------------------------------------------

--
-- Table structure for table `loaitailieu`
--

CREATE TABLE IF NOT EXISTS `loaitailieu` (
  `maLoai` int(11) NOT NULL AUTO_INCREMENT,
  `loaiTaiLieu` varchar(255) NOT NULL,
  PRIMARY KEY (`maLoai`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_vietnamese_ci;

-- --------------------------------------------------------

--
-- Table structure for table `luutailieu`
--

CREATE TABLE IF NOT EXISTS `luutailieu` (
  `maTaiLieu` int(11) NOT NULL,
  `maSinhVien` int(11) NOT NULL,
  `ngayLuu` datetime NOT NULL DEFAULT current_timestamp(),
  PRIMARY KEY (`maSinhVien`,`maTaiLieu`),
  KEY `fk_luutailieu_tailieu` (`maTaiLieu`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_vietnamese_ci;

-- --------------------------------------------------------

--
-- Table structure for table `mon`
--

CREATE TABLE IF NOT EXISTS `mon` (
  `maMon` int(11) NOT NULL AUTO_INCREMENT,
  `maNganh` int(11) NOT NULL,
  `tenMon` varchar(500) NOT NULL,
  PRIMARY KEY (`maMon`),
  KEY `fk_mon_nganh` (`maNganh`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_vietnamese_ci;

-- --------------------------------------------------------

--
-- Table structure for table `nganh`
--

CREATE TABLE IF NOT EXISTS `nganh` (
  `maNganh` int(11) NOT NULL AUTO_INCREMENT,
  `tenNganh` varchar(500) NOT NULL,
  PRIMARY KEY (`maNganh`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_vietnamese_ci;

-- --------------------------------------------------------

--
-- Table structure for table `quantrivien`
--

CREATE TABLE IF NOT EXISTS `quantrivien` (
  `maQuanTriVien` int(11) NOT NULL AUTO_INCREMENT,
  `hoTenQTV` varchar(255) NOT NULL,
  `emailQTV` varchar(255) NOT NULL,
  `matKhauQTV` varchar(255) NOT NULL,
  PRIMARY KEY (`maQuanTriVien`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_vietnamese_ci;

-- --------------------------------------------------------

--
-- Table structure for table `sinhvien`
--

CREATE TABLE IF NOT EXISTS `sinhvien` (
  `maSinhVien` int(11) NOT NULL AUTO_INCREMENT,
  `maNganh` int(11) DEFAULT NULL,
  `hoTenSV` varchar(255) NOT NULL,
  `emailSV` varchar(255) NOT NULL,
  `matKhauSV` varchar(255) NOT NULL,
  `ngayTao` datetime NOT NULL DEFAULT current_timestamp(),
  `truongHoc` varchar(255) DEFAULT NULL,
  `avatarPath` text DEFAULT NULL,
  `trangThaiTK` enum('active','locked') NOT NULL,
  PRIMARY KEY (`maSinhVien`),
  KEY `fk_sinhvien_nganh` (`maNganh`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- --------------------------------------------------------

--
-- Table structure for table `tag`
--

CREATE TABLE IF NOT EXISTS `tag` (
  `maTag` int(11) NOT NULL AUTO_INCREMENT,
  `tenTag` varchar(255) NOT NULL,
  PRIMARY KEY (`maTag`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_vietnamese_ci;

-- --------------------------------------------------------

--
-- Table structure for table `tailieu`
--

CREATE TABLE IF NOT EXISTS `tailieu` (
  `maTaiLieu` int(11) NOT NULL AUTO_INCREMENT,
  `maLoai` int(11) NOT NULL,
  `maDinhDang` int(11) NOT NULL,
  `maSinhVien` int(11) NOT NULL,
  `tieuDeTL` varchar(255) NOT NULL,
  `ngayChiaSe` datetime NOT NULL DEFAULT current_timestamp(),
  `trangThaiTL` enum('show','hidden') NOT NULL,
  `filePath` text NOT NULL,
  `fileSizes` bigint(20) NOT NULL,
  `soLanLuu` int(11) NOT NULL,
  `luotTaiXuong` int(11) NOT NULL,
  PRIMARY KEY (`maTaiLieu`),
  KEY `fk_tailieu_sinhvien` (`maSinhVien`),
  KEY `fk_tailieu_loaitailieu` (`maLoai`),
  KEY `fk_tailieu_dinhdang` (`maDinhDang`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_vietnamese_ci;

--
-- Constraints for dumped tables
--

--
-- Constraints for table `baocaovipham`
--
ALTER TABLE `baocaovipham`
  ADD CONSTRAINT `fk_baocaovipham_cauhoi` FOREIGN KEY (`maCauHoi`) REFERENCES `cauhoi` (`maCauHoi`),
  ADD CONSTRAINT `fk_baocaovipham_cautraloi` FOREIGN KEY (`maCauTraLoi`) REFERENCES `cautraloi` (`maCauTraLoi`),
  ADD CONSTRAINT `fk_baocaovipham_quantrivien` FOREIGN KEY (`maQuanTriVien`) REFERENCES `quantrivien` (`maQuanTriVien`) ON UPDATE CASCADE,
  ADD CONSTRAINT `fk_baocaovipham_sinhvien` FOREIGN KEY (`maSinhVien`) REFERENCES `sinhvien` (`maSinhVien`) ON DELETE CASCADE ON UPDATE CASCADE,
  ADD CONSTRAINT `fk_baocaovipham_tailieu` FOREIGN KEY (`maTaiLieu`) REFERENCES `tailieu` (`maTaiLieu`);

--
-- Constraints for table `cauhoi`
--
ALTER TABLE `cauhoi`
  ADD CONSTRAINT `fk_cauhoi_mon` FOREIGN KEY (`maMon`) REFERENCES `mon` (`maMon`) ON UPDATE CASCADE,
  ADD CONSTRAINT `fk_cauhoi_sinhvien` FOREIGN KEY (`maSinhVien`) REFERENCES `sinhvien` (`maSinhVien`) ON DELETE CASCADE ON UPDATE CASCADE;

--
-- Constraints for table `cautraloi`
--
ALTER TABLE `cautraloi`
  ADD CONSTRAINT `fk_cautraloi_cauhoi` FOREIGN KEY (`maCauHoi`) REFERENCES `cauhoi` (`maCauHoi`) ON DELETE CASCADE ON UPDATE CASCADE,
  ADD CONSTRAINT `fk_cautraloi_sinhvien` FOREIGN KEY (`maSinhVien`) REFERENCES `sinhvien` (`maSinhVien`) ON DELETE CASCADE ON UPDATE CASCADE;

--
-- Constraints for table `danhgiacauhoi`
--
ALTER TABLE `danhgiacauhoi`
  ADD CONSTRAINT `fk_danhgiacauhoi_cauhoi` FOREIGN KEY (`maCauHoi`) REFERENCES `cauhoi` (`maCauHoi`) ON DELETE CASCADE ON UPDATE CASCADE,
  ADD CONSTRAINT `fk_danhgiacauhoi_sinhvien` FOREIGN KEY (`maSinhVien`) REFERENCES `sinhvien` (`maSinhVien`) ON DELETE CASCADE ON UPDATE CASCADE;

--
-- Constraints for table `danhgiacautraloi`
--
ALTER TABLE `danhgiacautraloi`
  ADD CONSTRAINT `fk_danhgiacautraloi_cautraloi` FOREIGN KEY (`maCauTraLoi`) REFERENCES `cautraloi` (`maCauTraLoi`) ON DELETE CASCADE ON UPDATE CASCADE,
  ADD CONSTRAINT `fk_danhgiacautraloi_sinhvien` FOREIGN KEY (`maSinhVien`) REFERENCES `sinhvien` (`maSinhVien`) ON DELETE CASCADE ON UPDATE CASCADE;

--
-- Constraints for table `danhsachtag`
--
ALTER TABLE `danhsachtag`
  ADD CONSTRAINT `fk_danhsachtag_cauhoi` FOREIGN KEY (`maCauHoi`) REFERENCES `cauhoi` (`maCauHoi`) ON DELETE CASCADE ON UPDATE CASCADE,
  ADD CONSTRAINT `fk_danhsachtag_tag` FOREIGN KEY (`maTag`) REFERENCES `tag` (`maTag`) ON DELETE CASCADE ON UPDATE CASCADE;

--
-- Constraints for table `danhsachtailieu`
--
ALTER TABLE `danhsachtailieu`
  ADD CONSTRAINT `fk_danhsachtailieu_mon` FOREIGN KEY (`maMon`) REFERENCES `mon` (`maMon`) ON UPDATE CASCADE,
  ADD CONSTRAINT `fk_danhsachtailieu_tailieu` FOREIGN KEY (`maTaiLieu`) REFERENCES `tailieu` (`maTaiLieu`) ON DELETE CASCADE ON UPDATE CASCADE;

--
-- Constraints for table `luutailieu`
--
ALTER TABLE `luutailieu`
  ADD CONSTRAINT `fk_luutailieu_sinhvien` FOREIGN KEY (`maSinhVien`) REFERENCES `sinhvien` (`maSinhVien`) ON DELETE CASCADE ON UPDATE CASCADE,
  ADD CONSTRAINT `fk_luutailieu_tailieu` FOREIGN KEY (`maTaiLieu`) REFERENCES `tailieu` (`maTaiLieu`) ON DELETE CASCADE ON UPDATE CASCADE;

--
-- Constraints for table `mon`
--
ALTER TABLE `mon`
  ADD CONSTRAINT `fk_mon_nganh` FOREIGN KEY (`maNganh`) REFERENCES `nganh` (`maNganh`) ON UPDATE CASCADE;

--
-- Constraints for table `sinhvien`
--
ALTER TABLE `sinhvien`
  ADD CONSTRAINT `fk_sinhvien_nganh` FOREIGN KEY (`maNganh`) REFERENCES `nganh` (`maNganh`) ON DELETE NO ACTION ON UPDATE CASCADE;

--
-- Constraints for table `tailieu`
--
ALTER TABLE `tailieu`
  ADD CONSTRAINT `fk_tailieu_dinhdang` FOREIGN KEY (`maDinhDang`) REFERENCES `dinhdang` (`maDinhDang`) ON UPDATE CASCADE,
  ADD CONSTRAINT `fk_tailieu_loaitailieu` FOREIGN KEY (`maLoai`) REFERENCES `loaitailieu` (`maLoai`) ON UPDATE CASCADE,
  ADD CONSTRAINT `fk_tailieu_sinhvien` FOREIGN KEY (`maSinhVien`) REFERENCES `sinhvien` (`maSinhVien`) ON DELETE CASCADE ON UPDATE CASCADE;
COMMIT;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
