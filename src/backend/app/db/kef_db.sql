-- phpMyAdmin SQL Dump
-- version 5.2.1
-- https://www.phpmyadmin.net/
--
-- Host: 127.0.0.1
-- Generation Time: Nov 25, 2025 at 11:44 AM
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

-- --------------------------------------------------------

--
-- Table structure for table `baocaovipham`
--

CREATE TABLE `baocaovipham` (
  `maBaoCao` int(11) NOT NULL,
  `maQuanTriVien` int(11) NOT NULL,
  `maTaiLieu` int(11) DEFAULT NULL,
  `maSinhVien` int(11) NOT NULL,
  `maCauHoi` int(11) DEFAULT NULL,
  `maCauTraLoi` int(11) DEFAULT NULL,
  `lyDo` text NOT NULL,
  `ngayBC` datetime NOT NULL DEFAULT current_timestamp(),
  `trangThaiBC` enum('pending','approved','rejected') NOT NULL,
  `loaiBaoCao` enum('document','question','answer') NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_vietnamese_ci;

--
-- Dumping data for table `baocaovipham`
--

INSERT INTO `baocaovipham` (`maBaoCao`, `maQuanTriVien`, `maTaiLieu`, `maSinhVien`, `maCauHoi`, `maCauTraLoi`, `lyDo`, `ngayBC`, `trangThaiBC`, `loaiBaoCao`) VALUES
(1, 1, NULL, 1, NULL, NULL, 'spam', '2025-11-18 23:59:00', 'pending', 'document'),
(2, 1, NULL, 2, NULL, NULL, 'invalid_content', '2025-11-18 23:59:00', 'approved', 'document'),
(3, 1, NULL, 3, NULL, NULL, 'other', '2025-11-18 23:59:00', 'pending', 'document'),
(4, 1, NULL, 1, NULL, NULL, 'spam', '2025-11-18 23:59:00', 'pending', 'question'),
(5, 1, NULL, 2, NULL, NULL, 'misinformation', '2025-11-18 23:59:00', 'approved', 'question'),
(6, 1, NULL, 3, NULL, NULL, 'other', '2025-11-18 23:59:00', 'rejected', 'question');

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
  `trangThaiCH` enum('open','answered','closed') NOT NULL,
  `luotTraLoi` int(11) NOT NULL,
  `imagePath` text DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_vietnamese_ci;

--
-- Dumping data for table `cauhoi`
--

INSERT INTO `cauhoi` (`maCauHoi`, `maSinhVien`, `maMon`, `tieuDeCH`, `noiDungCH`, `ngayDatCH`, `trangThaiCH`, `luotTraLoi`, `imagePath`) VALUES
(1, 1, 1, 'Khai báo biến trong C như thế nào?', 'Mình mới học lập trình C và còn khá mơ hồ về cách khai báo biến: cú pháp, vị trí khai báo và kiểu dữ liệu. Mọi người có thể giải thích rõ và cho ví dụ minh họa được không?', '2025-11-18 22:11:00', 'open', 3, ''),
(2, 2, 2, 'Hướng dẫn thiết kế cơ sở dữ liệu từ đầu?', 'Mình đang muốn tự thiết kế một cơ sở dữ liệu đơn giản cho bài tập nhóm. Không biết quy trình chuẩn để bắt đầu từ phân tích tới thiết kế bảng như thế nào. Ai có thể chia sẻ quy trình chi tiết?', '2025-11-18 22:12:00', 'open', 3, ''),
(3, 3, 3, 'Thuật toán QuickSort hoạt động như thế nào?', 'Mình biết đây là thuật toán sắp xếp nhanh nhưng vẫn chưa hiểu được cơ chế chia mảng, chọn pivot và cách đệ quy hoạt động. Mong mọi người giải thích chi tiết giúp.', '2025-11-18 22:13:00', 'open', 3, ''),
(4, 1, 4, 'Khái niệm cơ bản trong Nguyên lý kế toán?', 'Môn Nguyên lý kế toán có nhiều khái niệm như tài sản, nguồn vốn, nợ phải trả... Bạn nào có tài liệu hoặc lời giải thích dễ hiểu cho người mới học không?', '2025-11-18 22:14:00', 'open', 3, ''),
(5, 2, 5, 'Cách tính thuế GTGT đầu ra và đầu vào?', 'Mình đang làm bài tập kế toán và bị rối phần tính thuế GTGT. Không biết công thức tính thuế đầu ra – đầu vào như thế nào. Ai có thể giải thích bằng ví dụ?', '2025-11-18 22:15:00', 'open', 3, ''),
(6, 3, 7, 'Phân biệt âm hữu thanh và vô thanh trong tiếng Anh?', 'Mình học môn Ngữ âm học và gặp phần âm hữu thanh (voiced) và vô thanh (voiceless). Khó nhất là phân biệt khi phát âm. Ai có cách nhớ dễ không?', '2025-11-18 22:16:00', 'open', 3, ''),
(7, 1, 8, 'Hỏi về cách dịch câu tiếng Anh đúng ngữ cảnh?', 'Mình đang tập dịch các câu trong bài tập nhưng không biết phải dựa vào những yếu tố nào để dịch đúng ý và tự nhiên. Ai có các mẹo căn bản chỉ giúp mình?', '2025-11-18 22:17:00', 'open', 3, ''),
(8, 2, 10, 'Marketing Mix (4P) gồm những nội dung gì?', 'Trong môn Marketing căn bản, nhóm mình được giao thuyết trình về mô hình 4P nhưng thông tin hơi rối. Mong mọi người giải thích dễ hiểu về 4P.', '2025-11-18 22:18:00', 'open', 3, ''),
(9, 3, 11, 'Khái niệm quản trị là gì?', 'Mình học Quản trị học và muốn hiểu đúng khái niệm quản trị, vai trò và chức năng của nhà quản trị. Ai giải thích gọn giúp mình?', '2025-11-18 22:19:00', 'open', 3, ''),
(10, 1, 13, 'Quy trình trồng lúa từ lúc làm đất đến thu hoạch?', 'Mình làm bài tập môn Khoa học cây trồng nhưng chưa rõ từng bước quy trình trồng lúa. Ai có thể mô tả ngắn gọn các giai đoạn chính?', '2025-11-18 22:20:00', 'open', 3, '');

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
  `trangThaiCTL` enum('show','hidden') NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_vietnamese_ci;

--
-- Dumping data for table `cautraloi`
--

INSERT INTO `cautraloi` (`maCauTraLoi`, `maSinhVien`, `maCauHoi`, `noiDungCTL`, `ngayTraLoi`, `trangThaiCTL`) VALUES
(1, 1, 1, 'Bạn có thể khai báo biến bằng cú pháp: <kiểu dữ liệu> <tên biến>; Ví dụ: int a; float b; Việc khai báo nên thực hiện ở đầu hàm để tránh lỗi.', '2025-11-18 23:01:00', ''),
(2, 2, 1, 'Trong C, biến phải khai báo trước khi sử dụng. Các kiểu phổ biến: int, float, double, char. Ví dụ: char c = \'\'A\'\';', '2025-11-18 23:02:00', ''),
(3, 3, 1, 'Bạn xem lại phần khai báo biến trong giáo trình chương 2, trong đó có giải thích rõ về phạm vi biến và khai báo nhiều biến cùng lúc.', '2025-11-18 23:03:00', ''),
(4, 1, 2, 'Thiết kế CSDL nên bắt đầu bằng xác định yêu cầu, sau đó vẽ mô hình thực thể – liên kết (ERD), rồi mới chuyển sang mô hình quan hệ.', '2025-11-18 23:04:00', ''),
(5, 2, 2, 'Bạn nên chuẩn hóa dữ liệu đến 3NF để giảm dư thừa. Các bước: xác định khóa chính, loại bỏ phụ thuộc bắc cầu...', '2025-11-18 23:05:00', ''),
(6, 3, 2, 'Dùng MySQL Workbench để mô hình hóa rất tiện. Bạn chỉ cần kéo thả để tạo bảng và quan hệ.', '2025-11-18 23:06:00', ''),
(7, 1, 3, 'QuickSort chia mảng thành 2 phần dựa vào pivot, sau đó đệ quy sắp xếp từng phần. Đây là thuật toán rất hiệu quả.', '2025-11-18 23:07:00', ''),
(8, 2, 3, 'Pivot nên chọn phần tử giữa mảng để hạn chế trường hợp xấu. Sau khi chia, chỉ cần tiếp tục đệ quy là xong.', '2025-11-18 23:08:00', ''),
(9, 3, 3, 'QuickSort trung bình có độ phức tạp O(n log n), nhưng trường hợp xấu là O(n^2).', '2025-11-18 23:09:00', ''),
(10, 1, 4, 'Nguyên lý kế toán cung cấp khái niệm tài sản, nguồn vốn, doanh thu, chi phí… Hiểu rõ các khái niệm là nền tảng để học sâu hơn.', '2025-11-18 23:10:00', ''),
(11, 2, 4, 'Công thức kế toán cơ bản: Tài sản = Nợ phải trả + Vốn chủ sở hữu. Công thức này luôn đúng.', '2025-11-18 23:11:00', ''),
(12, 3, 4, 'Bạn nên đọc giáo trình chương 1 và 2 để nắm rõ các nguyên tắc và chuẩn mực.', '2025-11-18 23:12:00', ''),
(13, 1, 5, 'Thuế GTGT đầu ra = Giá tính thuế * thuế suất. Thuế đầu vào tính dựa trên hóa đơn mua vào hợp lệ.', '2025-11-18 23:13:00', ''),
(14, 2, 5, 'Tùy loại hàng hóa mà thuế suất có thể 5% hoặc 10%. Cần xác định đúng để tránh sai sót.', '2025-11-18 23:14:00', ''),
(15, 3, 5, 'Bạn nên xem bảng thuế GTGT do Bộ Tài chính ban hành để tính chính xác.', '2025-11-18 23:15:00', ''),
(16, 1, 6, 'Âm hữu thanh khi phát âm sẽ rung dây thanh quản. Bạn có thể dùng tay đặt lên cổ để kiểm tra.', '2025-11-18 23:16:00', ''),
(17, 2, 6, 'Ví dụ âm hữu thanh: /b/, /d/, /g/. Âm vô thanh: /p/, /t/, /k/.', '2025-11-18 23:17:00', ''),
(18, 3, 6, 'Bạn xem video trên YouTube về “voiced vs voiceless sounds”, rất dễ hiểu.', '2025-11-18 23:18:00', ''),
(19, 1, 7, 'Dịch câu phải xét ngữ cảnh, người nói, mục đích, thời điểm. Không nên dịch từng từ.', '2025-11-18 23:19:00', ''),
(20, 2, 7, 'Bạn nên dùng từ điển Oxford hoặc Cambridge để tra collocation cho tự nhiên.', '2025-11-18 23:20:00', ''),
(21, 3, 7, 'Hãy đọc nhiều câu mẫu để quen ngữ pháp và cách diễn đạt.', '2025-11-18 23:21:00', ''),
(22, 1, 8, '4P gồm: Product (sản phẩm), Price (giá), Place (kênh phân phối).', '2025-11-18 23:22:00', ''),
(23, 2, 8, 'Ngoài 3P trên, yếu tố cuối là Promotion (xúc tiến).', '2025-11-18 23:23:00', ''),
(24, 3, 8, 'Bạn có thể tìm mô hình 4P trong bất kỳ giáo trình Marketing căn bản.', '2025-11-18 23:24:00', ''),
(25, 1, 9, 'Quản trị là quá trình hoạch định, tổ chức, lãnh đạo và kiểm soát để đạt mục tiêu.', '2025-11-18 23:25:00', ''),
(26, 2, 9, 'Nhà quản trị có vai trò điều hành nhân sự, đưa ra quyết định và giải quyết vấn đề.', '2025-11-18 23:26:00', ''),
(27, 3, 9, 'Quản trị giúp sử dụng hiệu quả nguồn lực như con người, tài chính và thời gian.', '2025-11-18 23:27:00', ''),
(28, 1, 10, 'Quy trình gồm: làm đất, gieo sạ hoặc cấy, chăm sóc, bón phân, phòng sâu bệnh, thu hoạch.', '2025-11-18 23:28:00', ''),
(29, 2, 10, 'Giai đoạn chăm sóc cần theo dõi nước và dinh dưỡng điều hòa.', '2025-11-18 23:29:00', ''),
(30, 3, 10, 'Thu hoạch khi lúa đạt độ chín vàng 85–90%.', '2025-11-18 23:30:00', '');

-- --------------------------------------------------------

--
-- Table structure for table `danhgiacauhoi`
--

CREATE TABLE `danhgiacauhoi` (
  `maSinhVien` int(11) NOT NULL,
  `maCauHoi` int(11) NOT NULL,
  `Upvote` enum('0','1') NOT NULL DEFAULT '0',
  `Downvote` enum('0','1') NOT NULL DEFAULT '0'
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_vietnamese_ci;

--
-- Dumping data for table `danhgiacauhoi`
--

INSERT INTO `danhgiacauhoi` (`maSinhVien`, `maCauHoi`, `Upvote`, `Downvote`) VALUES
(1, 1, '1', '0'),
(1, 2, '1', '0'),
(1, 3, '0', '0'),
(2, 1, '1', '0'),
(2, 2, '0', '1'),
(2, 3, '0', '0'),
(3, 1, '0', '1'),
(3, 2, '1', '0'),
(3, 3, '1', '0');

-- --------------------------------------------------------

--
-- Table structure for table `danhgiacautraloi`
--

CREATE TABLE `danhgiacautraloi` (
  `maSinhVien` int(11) NOT NULL,
  `maCauTraLoi` int(11) NOT NULL,
  `Upvote` enum('0','1') NOT NULL DEFAULT '0',
  `Downvote` enum('0','1') NOT NULL DEFAULT '0'
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_vietnamese_ci;

--
-- Dumping data for table `danhgiacautraloi`
--

INSERT INTO `danhgiacautraloi` (`maSinhVien`, `maCauTraLoi`, `Upvote`, `Downvote`) VALUES
(1, 1, '1', '0'),
(1, 4, '1', '0'),
(2, 1, '0', '0'),
(2, 4, '1', '0'),
(3, 1, '0', '1'),
(3, 4, '0', '0');

-- --------------------------------------------------------

--
-- Table structure for table `danhsachtag`
--

CREATE TABLE `danhsachtag` (
  `maTag` int(11) NOT NULL,
  `maCauHoi` int(11) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_vietnamese_ci;

--
-- Dumping data for table `danhsachtag`
--

INSERT INTO `danhsachtag` (`maTag`, `maCauHoi`) VALUES
(1, 1),
(2, 2),
(3, 3),
(4, 4),
(5, 5),
(6, 6),
(7, 7),
(8, 8),
(9, 9),
(10, 10);

-- --------------------------------------------------------

--
-- Table structure for table `danhsachtailieu`
--

CREATE TABLE `danhsachtailieu` (
  `maMon` int(11) NOT NULL,
  `maTaiLieu` int(11) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_vietnamese_ci;

--
-- Dumping data for table `danhsachtailieu`
--

INSERT INTO `danhsachtailieu` (`maMon`, `maTaiLieu`) VALUES
(1, 1),
(2, 2),
(3, 3),
(4, 4),
(5, 5),
(6, 6),
(7, 7),
(8, 8),
(10, 9),
(12, 10);

-- --------------------------------------------------------

--
-- Table structure for table `dinhdang`
--

CREATE TABLE `dinhdang` (
  `maDinhDang` int(11) NOT NULL,
  `tenDinhDang` varchar(255) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_vietnamese_ci;

--
-- Dumping data for table `dinhdang`
--

INSERT INTO `dinhdang` (`maDinhDang`, `tenDinhDang`) VALUES
(1, '.pdf'),
(2, '.docx'),
(3, '.pptx'),
(4, '.ppt'),
(5, '.txt');

-- --------------------------------------------------------

--
-- Table structure for table `loaitailieu`
--

CREATE TABLE `loaitailieu` (
  `maLoai` int(11) NOT NULL,
  `loaiTaiLieu` varchar(255) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_vietnamese_ci;

--
-- Dumping data for table `loaitailieu`
--

INSERT INTO `loaitailieu` (`maLoai`, `loaiTaiLieu`) VALUES
(1, 'Giáo trình'),
(2, 'Slide bài giảng'),
(3, 'Đề thi'),
(4, 'Tài liệu tham khảo'),
(5, 'Bài tập lớn'),
(6, 'Bài báo khoa học'),
(7, 'Sổ tay môn học');

-- --------------------------------------------------------

--
-- Table structure for table `luutailieu`
--

CREATE TABLE `luutailieu` (
  `maTaiLieu` int(11) NOT NULL,
  `maSinhVien` int(11) NOT NULL,
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

--
-- Dumping data for table `mon`
--

INSERT INTO `mon` (`maMon`, `maNganh`, `tenMon`) VALUES
(1, 1, 'Lập trình C'),
(2, 1, 'Cơ sở dữ liệu'),
(3, 1, 'Thuật toán'),
(4, 2, 'Nguyên lý kế toán'),
(5, 2, 'Thuế doanh nghiệp'),
(6, 2, 'Kế toán tài chính'),
(7, 3, 'Ngữ âm học'),
(8, 3, 'Dịch thuật cơ bản'),
(9, 3, 'Ngữ pháp nâng cao'),
(10, 4, 'Marketing căn bản'),
(11, 4, 'Quản trị học'),
(12, 4, 'Tài chính doanh nghiệp'),
(13, 5, 'Khoa học cây trồng'),
(14, 5, 'Chăn nuôi đại cương'),
(15, 5, 'Bảo vệ thực vật');

-- --------------------------------------------------------

--
-- Table structure for table `nganh`
--

CREATE TABLE `nganh` (
  `maNganh` int(11) NOT NULL,
  `tenNganh` varchar(500) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_vietnamese_ci;

--
-- Dumping data for table `nganh`
--

INSERT INTO `nganh` (`maNganh`, `tenNganh`) VALUES
(1, 'Công nghệ thông tin'),
(2, 'Kế toán'),
(3, 'Ngôn ngữ Anh'),
(4, 'Quản trị kinh doanh'),
(5, 'Nông nghiệp');

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

--
-- Dumping data for table `quantrivien`
--

INSERT INTO `quantrivien` (`maQuanTriVien`, `hoTenQTV`, `emailQTV`, `matKhauQTV`) VALUES
(1, 'Admin 1', 'admin1@gmail.com', '$2a$10$G.4fWcGZjNkJJ2TbvU7tPOtORW5owAnZ9COexVEgZM9ExTUNqkBWK'),
(2, 'Admin 2', 'admin2@gmail.com', '$2a$10$MrZcWJor99G8.5mwPXBoBu9baQmKZ4AV8dp2..OAgafpnUx6wfhJi');

-- --------------------------------------------------------

--
-- Table structure for table `sinhvien`
--

CREATE TABLE `sinhvien` (
  `maSinhVien` int(11) NOT NULL,
  `maNganh` int(11) DEFAULT NULL,
  `hoTenSV` varchar(255) NOT NULL,
  `emailSV` varchar(255) NOT NULL,
  `matKhauSV` varchar(255) NOT NULL,
  `ngayTao` datetime NOT NULL DEFAULT current_timestamp(),
  `truongHoc` varchar(255) DEFAULT NULL,
  `avatarPath` text DEFAULT NULL,
  `trangThaiTK` enum('active','locked') NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Dumping data for table `sinhvien`
--

INSERT INTO `sinhvien` (`maSinhVien`, `maNganh`, `hoTenSV`, `emailSV`, `matKhauSV`, `ngayTao`, `truongHoc`, `avatarPath`, `trangThaiTK`) VALUES
(1, 1, 'Nguyễn Văn A', 'sva@gmail.com', '$2a$10$i2eieYsa8q3oQanl/IdKJOS99UlKgzIWrtLyEwPzh5TMxyLjANrjO', '2025-11-18 22:20:04', NULL, NULL, ''),
(2, 2, 'Tran Thi B', 'svb@gmail.com', '$2a$10$x.Mu3TpgSQq4GSvHjIdO1eGmJFzdBGHTXzqaW2vQgklwbBtRA1D6O', '2025-11-18 22:21:45', NULL, NULL, ''),
(3, 1, 'Le Van C', 'svc@gmail.com', '$2a$10$bLjmW7Pm/KwTmCH9LCWIBu1iKksKCh964kQfCv/CjWVI6KEssBM/6', '2025-11-18 22:22:13', NULL, NULL, ''),
(4, 1, 'Hà Gia Lộc', 'hagialoc@gmail.com', '$2a$10$46SbHE19S13/0I.GJmUVIeETluzX5O9TmAh3iRPwcff0iaOfkVYfu', '2025-11-19 00:27:50', NULL, NULL, '');

-- --------------------------------------------------------

--
-- Table structure for table `tag`
--

CREATE TABLE `tag` (
  `maTag` int(11) NOT NULL,
  `tenTag` varchar(255) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_vietnamese_ci;

--
-- Dumping data for table `tag`
--

INSERT INTO `tag` (`maTag`, `tenTag`) VALUES
(1, 'C'),
(2, 'SQL'),
(3, 'Algorithm'),
(4, 'Accounting'),
(5, 'Tax'),
(6, 'English'),
(7, 'Translate'),
(8, 'Marketing'),
(9, 'Management'),
(10, 'Agriculture');

-- --------------------------------------------------------

--
-- Table structure for table `tailieu`
--

CREATE TABLE `tailieu` (
  `maTaiLieu` int(11) NOT NULL,
  `maLoai` int(11) NOT NULL,
  `maDinhDang` int(11) NOT NULL,
  `maSinhVien` int(11) NOT NULL,
  `tieuDeTL` varchar(255) NOT NULL,
  `ngayChiaSe` datetime NOT NULL DEFAULT current_timestamp(),
  `trangThaiTL` enum('show','hidden') NOT NULL,
  `filePath` text NOT NULL,
  `fileSizes` bigint(20) NOT NULL,
  `soLanLuu` int(11) NOT NULL,
  `luotTaiXuong` int(11) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_vietnamese_ci;

--
-- Dumping data for table `tailieu`
--

INSERT INTO `tailieu` (`maTaiLieu`, `maLoai`, `maDinhDang`, `maSinhVien`, `tieuDeTL`, `ngayChiaSe`, `trangThaiTL`, `filePath`, `fileSizes`, `soLanLuu`, `luotTaiXuong`) VALUES
(1, 1, 1, 1, 'Giáo trình C căn bản', '2025-11-18 22:20:04', '', 'tl1.pdf', 50000, 10, 5),
(2, 2, 3, 2, 'Slide CSDL chương 1', '2025-11-18 22:21:45', '', 'tl2.pptx', 30000, 4, 3),
(3, 3, 1, 3, 'Đề thi lập trình C', '2025-11-18 22:22:13', '', 'tl3.pdf', 20000, 2, 1),
(4, 4, 1, 1, 'Tài liệu thuật toán nâng cao', '2025-11-18 22:30:00', '', 'tl4.pdf', 44000, 5, 2),
(5, 5, 2, 2, 'BTL cơ sở dữ liệu', '2025-11-18 22:40:00', '', 'tl5.docx', 35000, 7, 4),
(6, 6, 1, 3, 'Bài báo về AI', '2025-11-18 22:50:00', '', 'tl6.pdf', 60000, 8, 6),
(7, 7, 1, 1, 'Sổ tay sinh viên CNTT', '2025-11-18 23:00:00', '', 'tl7.pdf', 25000, 3, 2),
(8, 1, 1, 2, 'Giáo trình kế toán', '2025-11-18 23:10:00', '', 'tl8.pdf', 45000, 1, 1),
(9, 2, 4, 3, 'Slide Marketing', '2025-11-18 23:20:00', '', 'tl9.ppt', 30000, 0, 0),
(10, 4, 1, 1, 'Tài liệu dịch thuật', '2025-11-18 23:30:00', '', 'tl10.pdf', 38000, 9, 7);

--
-- Indexes for dumped tables
--

--
-- Indexes for table `baocaovipham`
--
ALTER TABLE `baocaovipham`
  ADD PRIMARY KEY (`maBaoCao`),
  ADD KEY `fk_baocaovipham_sinhvien` (`maSinhVien`),
  ADD KEY `fk_baocaovipham_quantrivien` (`maQuanTriVien`),
  ADD KEY `fk_baocaovipham_tailieu` (`maTaiLieu`),
  ADD KEY `fk_baocaovipham_cauhoi` (`maCauHoi`),
  ADD KEY `fk_baocaovipham_cautraloi` (`maCauTraLoi`);

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
-- Indexes for table `dinhdang`
--
ALTER TABLE `dinhdang`
  ADD PRIMARY KEY (`maDinhDang`);

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
  ADD KEY `fk_sinhvien_nganh` (`maNganh`);

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
  ADD KEY `fk_tailieu_loaitailieu` (`maLoai`),
  ADD KEY `fk_tailieu_dinhdang` (`maDinhDang`);

--
-- AUTO_INCREMENT for dumped tables
--

--
-- AUTO_INCREMENT for table `baocaovipham`
--
ALTER TABLE `baocaovipham`
  MODIFY `maBaoCao` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=7;

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
-- AUTO_INCREMENT for table `dinhdang`
--
ALTER TABLE `dinhdang`
  MODIFY `maDinhDang` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=6;

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
  MODIFY `maQuanTriVien` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=3;

--
-- AUTO_INCREMENT for table `sinhvien`
--
ALTER TABLE `sinhvien`
  MODIFY `maSinhVien` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=5;

--
-- AUTO_INCREMENT for table `tag`
--
ALTER TABLE `tag`
  MODIFY `maTag` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=11;

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
