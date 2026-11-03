# Nhịp Tập - LTWNC TH02, Phần 1

Hiện tại chỉ triển khai chức năng **Phần 1: Kho 10.000 bài tập**. Phần 2, 3 và 4 chỉ thực hiện khi người dùng yêu cầu.

## Chạy ứng dụng

Yêu cầu Node.js 22.12 trở lên, khuyến nghị Node 22 hoặc 24 LTS.

```powershell
npm ci
npm run dev
```

Mở địa chỉ Local do Vite hiển thị, thường là `http://localhost:5173`.

```powershell
npm run build
npm run preview
```

## Giao diện dùng chung

Áp dụng bố cục **B** đã chọn: bộ lọc nằm ngang, bảng chiếm toàn bộ chiều rộng nội dung. Nền giấy ấm, chữ đen nâu và điểm nhấn nâu espresso. Tiêu đề gọn, không có thẻ thống kê, gradient, avatar trang trí hoặc badge nhiều màu cho nhóm cơ.

- `src/styles/tokens.css`: font, màu, cỡ chữ, bán kính bo góc và chiều cao điều khiển. Đây là nơi đổi nhận diện cho toàn app.
- `src/index.css`: khung trang, điều hướng, form, bảng, trạng thái rỗng và responsive.
- `src/components/brand/ProductBrand.tsx`: logo hai thanh bấm giờ cùng tên ứng dụng, dùng chung trong header. Dấu nằm ở `BrandMark.tsx`; favicon cùng dấu trong `public/favicon.svg`.
- `src/components/ui/Button.tsx`: bốn kiểu dùng chung `outline`, `primary`, `secondary`, `ghost`. Mặc định là nút viền; `primary` dành cho hành động chính.
- `src/components/ui/SelectField.tsx`: ô chọn có cùng kích thước và màu với ô nhập; danh sách nổi dùng portal, hỗ trợ phím mũi tên, Home/End, Enter, Escape và tìm nhanh bằng ký tự.
- `src/components/ui/ScrollbarAutohide.tsx`: thanh cuộn mảnh, hiện khi rê chuột hoặc đang cuộn, dọn listener và timer khi unmount.
- Font Inter được phục vụ từ `public/fonts/InterVariable.woff2`; giấy phép trong `public/fonts/LICENSE-Inter.txt`. Ứng dụng không cần gọi Google Fonts khi chạy.

Các trang khung `/saved`, `/routines`, `/routines/:id` đã dùng cùng header, kiểu chữ, nút và trạng thái rỗng. Chưa có logic lưu bài, buổi tập, giáo án, sáng/tối hoặc bộ kiểm thử của các phần tiếp theo.

Khi triển khai phần sau, tái sử dụng component và token trên. Ô nhập dùng `.input`, nhãn dùng `.field-label`, tên trang dùng `.page-heading`; tránh thêm bảng màu hoặc font riêng theo từng trang.

## Nội dung Phần 1

- React + TypeScript, điều hướng React Router v6 bằng NavLink.
- Dữ liệu giả lập được sinh một lần bằng hàm trong đề.
- `FixedSizeList` cao 560px, mỗi dòng 56px, overscan 2, key là `exercise.id`.
- Mỗi dòng có số thứ tự, tên bài, huấn luyện viên, nhóm cơ, thời lượng phút:giây và ba nút thao tác.
- Tìm tên bài hoặc huấn luyện viên không phân biệt hoa thường, debounce 300ms bằng `useDebounce<T>`.
- Lọc nhóm cơ và sắp xếp mặc định, tên A-Z tiếng Việt hoặc thời lượng tăng dần.
- Lọc/sắp xếp dùng `useMemo`, không sửa dữ liệu gốc. Row dùng `React.memo`, itemData ổn định khi đang gõ trước thời điểm debounce.
- Có xóa tìm kiếm, đặt lại bộ lọc và trạng thái không tìm thấy.

Các nút Bắt đầu, Lưu bài tập và + Buổi tập đang bị khóa, chờ yêu cầu triển khai Phần 2.

## Kiểm tra Phần 1

| Thao tác | Kết quả mong đợi |
| --- | --- |
| Mở `/` | Tìm thấy 10000 bài tập |
| Gõ `đẩy`, đợi 300ms | 1250 bài |
| Giữ `đẩy`, chọn Vai | 250 bài |
| Xóa bộ lọc, gõ `đức anh` | 1000 bài |
| Gõ `xyz` | Không tìm thấy bài tập nào |
| Xóa tìm kiếm, chọn Tên A-Z | Dòng đầu: Bật chậm 1 |
| Mở DevTools Elements | Khoảng 10-15 dòng được mount khi mở danh sách |

Trên màn hình nhỏ, bộ lọc xếp dọc và vùng bảng cuộn ngang riêng để giữ đầy đủ các cột và chiều cao dòng 56px.

Dữ liệu bài tập và huấn luyện viên là dữ liệu giả lập theo đề; nguồn tài liệu nằm trong `../LTWNC_TH02.pdf` và `../Slide/`.
