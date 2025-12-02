-- phpMyAdmin SQL Dump
-- version 5.2.1
-- https://www.phpmyadmin.net/
--
-- Host: 127.0.0.1
-- Generation Time: Dec 02, 2025 at 12:24 PM
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

--
-- Dumping data for table `baocaovipham`
--

INSERT INTO `baocaovipham` (`maBaoCao`, `maQuanTriVien`, `maTaiLieu`, `maSinhVien`, `maCauHoi`, `maCauTraLoi`, `lyDo`, `ngayBC`, `trangThaiBC`, `loaiBaoCao`) VALUES
(1, 1, 7, 1, NULL, NULL, 'spam', '2025-11-18 23:59:00', 'pending', 'document'),
(2, 1, 3, 2, NULL, NULL, 'invalid_content', '2025-11-18 23:59:00', 'approved', 'document'),
(3, 1, 2, 3, NULL, NULL, 'other', '2025-11-18 23:59:00', 'pending', 'document'),
(4, 1, NULL, 1, 8, NULL, 'spam', '2025-11-18 23:59:00', 'pending', 'question'),
(5, 1, NULL, 2, 3, NULL, 'misinformation', '2025-11-18 23:59:00', 'approved', 'question'),
(6, 1, NULL, 3, 2, NULL, 'other', '2025-11-18 23:59:00', 'rejected', 'question');

--
-- Dumping data for table `cauhoi`
--

INSERT INTO `cauhoi` (`maCauHoi`, `maSinhVien`, `maMon`, `tieuDeCH`, `noiDungCH`, `ngayDatCH`, `trangThaiCH`, `luotTraLoi`, `imagePath`) VALUES
(1, 1, 1, 'Khai báo biến trong C như thế nào?', 'Mình mới học lập trình C và còn khá mơ hồ về cách khai báo biến: cú pháp, vị trí khai báo và kiểu dữ liệu. Mọi người có thể giải thích rõ và cho ví dụ minh họa được không?', '2025-11-18 22:11:00', 'show', 3, ''),
(2, 2, 2, 'Hướng dẫn thiết kế cơ sở dữ liệu từ đầu?', 'Mình đang muốn tự thiết kế một cơ sở dữ liệu đơn giản cho bài tập nhóm. Không biết quy trình chuẩn để bắt đầu từ phân tích tới thiết kế bảng như thế nào. Ai có thể chia sẻ quy trình chi tiết?', '2025-11-18 22:12:00', 'show', 3, ''),
(3, 3, 3, 'Thuật toán QuickSort hoạt động như thế nào?', 'Mình biết đây là thuật toán sắp xếp nhanh nhưng vẫn chưa hiểu được cơ chế chia mảng, chọn pivot và cách đệ quy hoạt động. Mong mọi người giải thích chi tiết giúp.', '2025-11-18 22:13:00', 'show', 3, ''),
(4, 1, 4, 'Khái niệm cơ bản trong Nguyên lý kế toán?', 'Môn Nguyên lý kế toán có nhiều khái niệm như tài sản, nguồn vốn, nợ phải trả... Bạn nào có tài liệu hoặc lời giải thích dễ hiểu cho người mới học không?', '2025-11-18 22:14:00', 'show', 3, ''),
(5, 2, 5, 'Cách tính thuế GTGT đầu ra và đầu vào?', 'Mình đang làm bài tập kế toán và bị rối phần tính thuế GTGT. Không biết công thức tính thuế đầu ra – đầu vào như thế nào. Ai có thể giải thích bằng ví dụ?', '2025-11-18 22:15:00', 'show', 3, ''),
(6, 3, 7, 'Phân biệt âm hữu thanh và vô thanh trong tiếng Anh?', 'Mình học môn Ngữ âm học và gặp phần âm hữu thanh (voiced) và vô thanh (voiceless). Khó nhất là phân biệt khi phát âm. Ai có cách nhớ dễ không?', '2025-11-18 22:16:00', 'show', 3, ''),
(7, 1, 8, 'Hỏi về cách dịch câu tiếng Anh đúng ngữ cảnh?', 'Mình đang tập dịch các câu trong bài tập nhưng không biết phải dựa vào những yếu tố nào để dịch đúng ý và tự nhiên. Ai có các mẹo căn bản chỉ giúp mình?', '2025-11-18 22:17:00', 'show', 3, ''),
(8, 2, 10, 'Marketing Mix (4P) gồm những nội dung gì?', 'Trong môn Marketing căn bản, nhóm mình được giao thuyết trình về mô hình 4P nhưng thông tin hơi rối. Mong mọi người giải thích dễ hiểu về 4P.', '2025-11-18 22:18:00', 'show', 3, ''),
(9, 3, 11, 'Khái niệm quản trị là gì?', 'Mình học Quản trị học và muốn hiểu đúng khái niệm quản trị, vai trò và chức năng của nhà quản trị. Ai giải thích gọn giúp mình?', '2025-11-18 22:19:00', 'show', 3, ''),
(10, 1, 13, 'Quy trình trồng lúa từ lúc làm đất đến thu hoạch?', 'Mình làm bài tập môn Khoa học cây trồng nhưng chưa rõ từng bước quy trình trồng lúa. Ai có thể mô tả ngắn gọn các giai đoạn chính?', '2025-11-18 22:20:00', 'show', 3, '');

--
-- Dumping data for table `cautraloi`
--

INSERT INTO `cautraloi` (`maCauTraLoi`, `maSinhVien`, `maCauHoi`, `noiDungCTL`, `ngayTraLoi`, `trangThaiCTL`) VALUES
(1, 1, 1, 'Bạn có thể khai báo biến bằng cú pháp: <kiểu dữ liệu> <tên biến>; Ví dụ: int a; float b; Việc khai báo nên thực hiện ở đầu hàm để tránh lỗi.', '2025-11-18 23:01:00', 'show'),
(2, 2, 1, 'Trong C, biến phải khai báo trước khi sử dụng. Các kiểu phổ biến: int, float, double, char. Ví dụ: char c = \'\'A\'\';', '2025-11-18 23:02:00', 'show'),
(3, 3, 1, 'Bạn xem lại phần khai báo biến trong giáo trình chương 2, trong đó có giải thích rõ về phạm vi biến và khai báo nhiều biến cùng lúc.', '2025-11-18 23:03:00', 'show'),
(4, 1, 2, 'Thiết kế CSDL nên bắt đầu bằng xác định yêu cầu, sau đó vẽ mô hình thực thể – liên kết (ERD), rồi mới chuyển sang mô hình quan hệ.', '2025-11-18 23:04:00', 'show'),
(5, 2, 2, 'Bạn nên chuẩn hóa dữ liệu đến 3NF để giảm dư thừa. Các bước: xác định khóa chính, loại bỏ phụ thuộc bắc cầu...', '2025-11-18 23:05:00', 'show'),
(6, 3, 2, 'Dùng MySQL Workbench để mô hình hóa rất tiện. Bạn chỉ cần kéo thả để tạo bảng và quan hệ.', '2025-11-18 23:06:00', 'show'),
(7, 1, 3, 'QuickSort chia mảng thành 2 phần dựa vào pivot, sau đó đệ quy sắp xếp từng phần. Đây là thuật toán rất hiệu quả.', '2025-11-18 23:07:00', 'show'),
(8, 2, 3, 'Pivot nên chọn phần tử giữa mảng để hạn chế trường hợp xấu. Sau khi chia, chỉ cần tiếp tục đệ quy là xong.', '2025-11-18 23:08:00', 'show'),
(9, 3, 3, 'QuickSort trung bình có độ phức tạp O(n log n), nhưng trường hợp xấu là O(n^2).', '2025-11-18 23:09:00', 'show'),
(10, 1, 4, 'Nguyên lý kế toán cung cấp khái niệm tài sản, nguồn vốn, doanh thu, chi phí… Hiểu rõ các khái niệm là nền tảng để học sâu hơn.', '2025-11-18 23:10:00', 'show'),
(11, 2, 4, 'Công thức kế toán cơ bản: Tài sản = Nợ phải trả + Vốn chủ sở hữu. Công thức này luôn đúng.', '2025-11-18 23:11:00', 'show'),
(12, 3, 4, 'Bạn nên đọc giáo trình chương 1 và 2 để nắm rõ các nguyên tắc và chuẩn mực.', '2025-11-18 23:12:00', 'show'),
(13, 1, 5, 'Thuế GTGT đầu ra = Giá tính thuế * thuế suất. Thuế đầu vào tính dựa trên hóa đơn mua vào hợp lệ.', '2025-11-18 23:13:00', 'show'),
(14, 2, 5, 'Tùy loại hàng hóa mà thuế suất có thể 5% hoặc 10%. Cần xác định đúng để tránh sai sót.', '2025-11-18 23:14:00', 'show'),
(15, 3, 5, 'Bạn nên xem bảng thuế GTGT do Bộ Tài chính ban hành để tính chính xác.', '2025-11-18 23:15:00', 'show'),
(16, 1, 6, 'Âm hữu thanh khi phát âm sẽ rung dây thanh quản. Bạn có thể dùng tay đặt lên cổ để kiểm tra.', '2025-11-18 23:16:00', 'show'),
(17, 2, 6, 'Ví dụ âm hữu thanh: /b/, /d/, /g/. Âm vô thanh: /p/, /t/, /k/.', '2025-11-18 23:17:00', 'show'),
(18, 3, 6, 'Bạn xem video trên YouTube về “voiced vs voiceless sounds”, rất dễ hiểu.', '2025-11-18 23:18:00', 'show'),
(19, 1, 7, 'Dịch câu phải xét ngữ cảnh, người nói, mục đích, thời điểm. Không nên dịch từng từ.', '2025-11-18 23:19:00', 'show'),
(20, 2, 7, 'Bạn nên dùng từ điển Oxford hoặc Cambridge để tra collocation cho tự nhiên.', '2025-11-18 23:20:00', 'show'),
(21, 3, 7, 'Hãy đọc nhiều câu mẫu để quen ngữ pháp và cách diễn đạt.', '2025-11-18 23:21:00', 'show'),
(22, 1, 8, '4P gồm: Product (sản phẩm), Price (giá), Place (kênh phân phối).', '2025-11-18 23:22:00', 'show'),
(23, 2, 8, 'Ngoài 3P trên, yếu tố cuối là Promotion (xúc tiến).', '2025-11-18 23:23:00', 'show'),
(24, 3, 8, 'Bạn có thể tìm mô hình 4P trong bất kỳ giáo trình Marketing căn bản.', '2025-11-18 23:24:00', 'show'),
(25, 1, 9, 'Quản trị là quá trình hoạch định, tổ chức, lãnh đạo và kiểm soát để đạt mục tiêu.', '2025-11-18 23:25:00', 'show'),
(26, 2, 9, 'Nhà quản trị có vai trò điều hành nhân sự, đưa ra quyết định và giải quyết vấn đề.', '2025-11-18 23:26:00', ''),
(27, 3, 9, 'Quản trị giúp sử dụng hiệu quả nguồn lực như con người, tài chính và thời gian.', '2025-11-18 23:27:00', ''),
(28, 1, 10, 'Quy trình gồm: làm đất, gieo sạ hoặc cấy, chăm sóc, bón phân, phòng sâu bệnh, thu hoạch.', '2025-11-18 23:28:00', ''),
(29, 2, 10, 'Giai đoạn chăm sóc cần theo dõi nước và dinh dưỡng điều hòa.', '2025-11-18 23:29:00', ''),
(30, 3, 10, 'Thu hoạch khi lúa đạt độ chín vàng 85–90%.', '2025-11-18 23:30:00', '');

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

--
-- Dumping data for table `dinhdang`
--

INSERT INTO `dinhdang` (`maDinhDang`, `tenDinhDang`) VALUES
(1, '.pdf'),
(2, '.docx'),
(3, '.pptx'),
(4, '.ppt'),
(5, '.txt');

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

--
-- Dumping data for table `nganh`
--

INSERT INTO `nganh` (`maNganh`, `tenNganh`) VALUES
(1, 'Công nghệ thông tin'),
(2, 'Kế toán'),
(3, 'Ngôn ngữ Anh'),
(4, 'Quản trị kinh doanh'),
(5, 'Nông nghiệp');

--
-- Dumping data for table `quantrivien`
--

INSERT INTO `quantrivien` (`maQuanTriVien`, `hoTenQTV`, `emailQTV`, `matKhauQTV`) VALUES
(1, 'Admin 1', 'admin1@gmail.com', '$2a$10$G.4fWcGZjNkJJ2TbvU7tPOtORW5owAnZ9COexVEgZM9ExTUNqkBWK'),
(2, 'Admin 2', 'admin2@gmail.com', '$2a$10$MrZcWJor99G8.5mwPXBoBu9baQmKZ4AV8dp2..OAgafpnUx6wfhJi');

--
-- Dumping data for table `sinhvien`
--

INSERT INTO `sinhvien` (`maSinhVien`, `maNganh`, `hoTenSV`, `emailSV`, `matKhauSV`, `ngayTao`, `truongHoc`, `avatarPath`, `trangThaiTK`) VALUES
(1, 1, 'Nguyễn Văn A', 'sva@gmail.com', '$2a$10$i2eieYsa8q3oQanl/IdKJOS99UlKgzIWrtLyEwPzh5TMxyLjANrjO', '2025-11-18 22:20:04', NULL, NULL, 'active'),
(2, 2, 'Tran Thi B', 'svb@gmail.com', '$2a$10$x.Mu3TpgSQq4GSvHjIdO1eGmJFzdBGHTXzqaW2vQgklwbBtRA1D6O', '2025-11-18 22:21:45', NULL, NULL, 'active'),
(3, 1, 'Le Van C', 'svc@gmail.com', '$2a$10$bLjmW7Pm/KwTmCH9LCWIBu1iKksKCh964kQfCv/CjWVI6KEssBM/6', '2025-11-18 22:22:13', NULL, NULL, 'active'),
(4, 1, 'Hà Gia Lộc', 'hagialoc@gmail.com', '$2a$10$46SbHE19S13/0I.GJmUVIeETluzX5O9TmAh3iRPwcff0iaOfkVYfu', '2025-11-19 00:27:50', NULL, NULL, 'active');

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

--
-- Dumping data for table `tailieu`
--

INSERT INTO `tailieu` (`maTaiLieu`, `maLoai`, `maDinhDang`, `maSinhVien`, `tieuDeTL`, `ngayChiaSe`, `trangThaiTL`, `filePath`, `fileSizes`, `soLanLuu`, `luotTaiXuong`) VALUES
(1, 1, 1, 1, 'Giáo trình C căn bản', '2025-11-18 22:20:04', 'show', 'tl1.pdf', 50000, 10, 5),
(2, 2, 3, 2, 'Slide CSDL chương 1', '2025-11-18 22:21:45', 'show', 'tl2.pptx', 30000, 4, 3),
(3, 3, 1, 3, 'Đề thi lập trình C', '2025-11-18 22:22:13', 'show', 'tl3.pdf', 20000, 2, 1),
(4, 4, 1, 1, 'Tài liệu thuật toán nâng cao', '2025-11-18 22:30:00', 'show', 'tl4.pdf', 44000, 5, 2),
(5, 5, 2, 2, 'BTL cơ sở dữ liệu', '2025-11-18 22:40:00', 'show', 'tl5.docx', 35000, 7, 4),
(6, 6, 1, 3, 'Bài báo về AI', '2025-11-18 22:50:00', 'show', 'tl6.pdf', 60000, 8, 6),
(7, 7, 1, 1, 'Sổ tay sinh viên CNTT', '2025-11-18 23:00:00', 'show', 'tl7.pdf', 25000, 3, 2),
(8, 1, 1, 2, 'Giáo trình kế toán', '2025-11-18 23:10:00', 'show', 'tl8.pdf', 45000, 1, 1),
(9, 2, 4, 3, 'Slide Marketing', '2025-11-18 23:20:00', 'show', 'tl9.ppt', 30000, 0, 0),
(10, 4, 1, 1, 'Tài liệu dịch thuật', '2025-11-18 23:30:00', 'show', 'tl10.pdf', 38000, 9, 7);
COMMIT;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
