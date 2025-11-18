-- phpMyAdmin SQL Dump
-- version 5.2.1
-- https://www.phpmyadmin.net/
--
-- Host: 127.0.0.1
-- Generation Time: Nov 18, 2025 at 02:18 PM
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
  `maSinhVien` int(11) NOT NULL,
  `maQuanTriVien` int(11) NOT NULL,
  `lyDo` enum('invalid_content','spam','copyrigth_violation','misinformation','inapproriate_language','other') NOT NULL,
  `ngayBC` datetime NOT NULL DEFAULT current_timestamp(),
  `trangThaiBC` enum('pending','approved','rejected','') NOT NULL,
  `loaiBaoCao` enum('document','question','answer','') NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_vietnamese_ci;

-- --------------------------------------------------------

--
-- Table structure for table `cauhoi`
--

CREATE TABLE `cauhoi` (
  `maCauHoi` int(11) NOT NULL,
  `maSinhVien` int(11) NOT NULL,
  `maMon` int(11) NOT NULL,
  `tieuDeCH` varchar(255) NOT NULL,
  `noiDungCH` text DEFAULT NULL,
  `ngayDatCH` datetime NOT NULL DEFAULT current_timestamp(),
  `trangThaiCH` enum('open','answered','closed','') NOT NULL
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
  `ChapNhan` bit(1) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_vietnamese_ci;

-- --------------------------------------------------------

--
-- Table structure for table `danhgiacauhoi`
--

CREATE TABLE `danhgiacauhoi` (
  `maSinhVien` int(11) NOT NULL,
  `maCauHoi` int(11) NOT NULL,
  `Upvote` bit(1) NOT NULL,
  `Downvote` bit(1) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_vietnamese_ci;

-- --------------------------------------------------------

--
-- Table structure for table `danhgiacautraloi`
--

CREATE TABLE `danhgiacautraloi` (
  `maSinhVien` int(11) NOT NULL,
  `maCauTraLoi` int(11) NOT NULL,
  `Upvote` bit(1) NOT NULL,
  `Downvote` bit(1) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_vietnamese_ci;

-- --------------------------------------------------------

--
-- Table structure for table `danhsachtag`
--

CREATE TABLE `danhsachtag` (
  `maTag` int(11) NOT NULL,
  `maCauHoi` int(11) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_vietnamese_ci;

-- --------------------------------------------------------

--
-- Table structure for table `danhsachtailieu`
--

CREATE TABLE `danhsachtailieu` (
  `maMon` int(11) NOT NULL,
  `maTaiLieu` int(11) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_vietnamese_ci;

-- --------------------------------------------------------

--
-- Table structure for table `loaitailieu`
--

CREATE TABLE `loaitailieu` (
  `maLoai` int(11) NOT NULL,
  `loaiTaiLieu` varchar(255) NOT NULL
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
-- Table structure for table `mon`
--

CREATE TABLE `mon` (
  `maMon` int(11) NOT NULL,
  `maNganh` int(11) NOT NULL,
  `tenMon` varchar(500) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_vietnamese_ci;

-- --------------------------------------------------------

--
-- Table structure for table `nganh`
--

CREATE TABLE `nganh` (
  `maNganh` int(11) NOT NULL,
  `tenNganh` varchar(500) NOT NULL
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
  `truongHoc` varchar(255) DEFAULT NULL,
  `avatarURL` varchar(500) NOT NULL,
  `tokenGhiNhoDN` varchar(255) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- --------------------------------------------------------

--
-- Table structure for table `tag`
--

CREATE TABLE `tag` (
  `maTag` int(11) NOT NULL,
  `tenTag` varchar(255) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_vietnamese_ci;

-- --------------------------------------------------------

--
-- Table structure for table `tailieu`
--

CREATE TABLE `tailieu` (
  `maTaiLieu` int(11) NOT NULL,
  `maLoai` int(11) NOT NULL,
  `maSinhVien` int(11) NOT NULL,
  `tieuDeTL` varchar(255) NOT NULL,
  `ngayChiaSe` datetime NOT NULL DEFAULT current_timestamp(),
  `trangThaiTL` enum('pending','approved','rejected','') NOT NULL,
  `URL` varchar(500) NOT NULL,
  `fileSizes` bigint(20) NOT NULL,
  `soLanLuu` int(11) NOT NULL,
  `luotTaiXuong` int(11) NOT NULL,
  `DinhDang` enum('.pdf','.doc','.docx','.ppt','.pptx','.xls','.xlsx','.txt','.zip','.rar') NOT NULL
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
-- Indexes for table `cauhoi`
--
ALTER TABLE `cauhoi`
  ADD PRIMARY KEY (`maCauHoi`),
  ADD KEY `fk_cauhoi_sinhvien` (`maSinhVien`),
  ADD KEY `fk_cauhoi_mon` (`maMon`);

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
-- Indexes for table `danhsachtag`
--
ALTER TABLE `danhsachtag`
  ADD PRIMARY KEY (`maTag`,`maCauHoi`),
  ADD KEY `fk_danhsachtag_cauhoi` (`maCauHoi`);

--
-- Indexes for table `danhsachtailieu`
--
ALTER TABLE `danhsachtailieu`
  ADD PRIMARY KEY (`maMon`,`maTaiLieu`),
  ADD KEY `fk_danhsachtailieu_tailieu` (`maTaiLieu`);

--
-- Indexes for table `loaitailieu`
--
ALTER TABLE `loaitailieu`
  ADD PRIMARY KEY (`maLoai`);

--
-- Indexes for table `luutailieu`
--
ALTER TABLE `luutailieu`
  ADD PRIMARY KEY (`maSinhVien`,`maTaiLieu`),
  ADD KEY `fk_luutailieu_tailieu` (`maTaiLieu`);

--
-- Indexes for table `mon`
--
ALTER TABLE `mon`
  ADD PRIMARY KEY (`maMon`),
  ADD KEY `fk_mon_nganh` (`maNganh`);

--
-- Indexes for table `nganh`
--
ALTER TABLE `nganh`
  ADD PRIMARY KEY (`maNganh`);

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
-- Indexes for table `tag`
--
ALTER TABLE `tag`
  ADD PRIMARY KEY (`maTag`);

--
-- Indexes for table `tailieu`
--
ALTER TABLE `tailieu`
  ADD PRIMARY KEY (`maTaiLieu`),
  ADD KEY `fk_tailieu_sinhvien` (`maSinhVien`),
  ADD KEY `fk_tailieu_loaitailieu` (`maLoai`);

--
-- AUTO_INCREMENT for dumped tables
--

--
-- AUTO_INCREMENT for table `baocaovipham`
--
ALTER TABLE `baocaovipham`
  MODIFY `maBaoCao` int(11) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT for table `cauhoi`
--
ALTER TABLE `cauhoi`
  MODIFY `maCauHoi` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=11;

--
-- AUTO_INCREMENT for table `cautraloi`
--
ALTER TABLE `cautraloi`
  MODIFY `maCauTraLoi` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=31;

--
-- AUTO_INCREMENT for table `loaitailieu`
--
ALTER TABLE `loaitailieu`
  MODIFY `maLoai` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=8;

--
-- AUTO_INCREMENT for table `mon`
--
ALTER TABLE `mon`
  MODIFY `maMon` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=16;

--
-- AUTO_INCREMENT for table `nganh`
--
ALTER TABLE `nganh`
  MODIFY `maNganh` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=6;

--
-- AUTO_INCREMENT for table `quantrivien`
--
ALTER TABLE `quantrivien`
  MODIFY `maQuanTriVien` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=2;

--
-- AUTO_INCREMENT for table `sinhvien`
--
ALTER TABLE `sinhvien`
  MODIFY `maSinhVien` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=4;

--
-- AUTO_INCREMENT for table `tag`
--
ALTER TABLE `tag`
  MODIFY `maTag` int(11) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT for table `tailieu`
--
ALTER TABLE `tailieu`
  MODIFY `maTaiLieu` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=11;

--
-- Constraints for dumped tables
--

--
-- Constraints for table `baocaovipham`
--
ALTER TABLE `baocaovipham`
  ADD CONSTRAINT `fk_baocaovipham_quantrivien` FOREIGN KEY (`maQuanTriVien`) REFERENCES `quantrivien` (`maQuanTriVien`) ON UPDATE CASCADE,
  ADD CONSTRAINT `fk_baocaovipham_sinhvien` FOREIGN KEY (`maSinhVien`) REFERENCES `sinhvien` (`maSinhVien`) ON DELETE CASCADE ON UPDATE CASCADE;

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
-- Constraints for table `tailieu`
--
ALTER TABLE `tailieu`
  ADD CONSTRAINT `fk_tailieu_loaitailieu` FOREIGN KEY (`maLoai`) REFERENCES `loaitailieu` (`maLoai`) ON UPDATE CASCADE,
  ADD CONSTRAINT `fk_tailieu_sinhvien` FOREIGN KEY (`maSinhVien`) REFERENCES `sinhvien` (`maSinhVien`) ON DELETE CASCADE ON UPDATE CASCADE;
COMMIT;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
