# Nhịp Tập - LTWNC TH02, Phần 1–3

Đã triển khai **Phần 1: Kho 10.000 bài tập**, **Phần 2: Đồng hồ buổi tập, bài tập đã lưu bằng Zustand** và **Phần 3: Giáo án, giao diện sáng/tối, tải trang theo route**. Phần 4 chỉ thực hiện khi người dùng yêu cầu.

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

Trang `/saved`, `/routines`, `/routines/:id` và thanh buổi tập dùng cùng header, kiểu chữ, nút và màu sắc. Chế độ tối chuyển sang nền nâu đen, giữ điểm nhấn nâu ấm; tất cả màu ở `tokens.css`. Chưa triển khai bộ kiểm thử của Phần 4.

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

## Nội dung Phần 2

- `src/features/session/useSessionStore.ts`: Zustand store chứa hàng đợi bài tập, vị trí hiện tại, trạng thái chạy và số giây đã tập. Có đủ `startSession`, `toggleRun`, `next`, `prev`, `addToSession`, `tick`.
- Bấm **Bắt đầu** ở một dòng để lấy toàn bộ danh sách đang lọc/sắp xếp làm buổi tập và bắt đầu đúng bài đó. Thay bộ lọc sau đó không làm đổi buổi tập đang chạy.
- **+ Buổi tập** thêm vào cuối hàng đợi, bỏ qua ID trùng. Khi chưa chọn bài, có thể thêm vài bài rồi bấm Bắt đầu ở thanh dưới.
- `SessionBar` cố định ở đáy mọi trang, hiển thị tên bài, huấn luyện viên, số bài, thời gian còn lại và tiến trình. Chừa khoảng trống theo chiều cao thực tế để không che nội dung trên màn hình nhỏ.
- Chỉ có một interval 1000ms khi đang chạy, được dọn khi tạm dừng hoặc unmount. Chỉ `CountdownBar` đăng ký đọc `elapsed`; trang danh sách và nút điều khiển không đăng ký giá trị thay đổi mỗi giây.
- Hết thời lượng tự sang bài sau; hết bài cuối thì dừng. Nút Sau ở bài cuối cũng dừng. Nút Trước đặt lại bài hiện tại nếu đã quá 3 giây, nếu chưa thì lùi một bài; ở bài đầu luôn đặt lại về 0.
- `src/features/saved/useSavedStore.ts`: store riêng dùng `persist`, chỉ lưu `ids` vào localStorage với key `workout-saved`. Ngôi sao đổi ☆/★, có nhãn truy cập Lưu bài tập/Bỏ lưu.
- `/saved` liệt kê bài đã lưu theo thứ tự lưu, cho bỏ lưu, thêm vào buổi tập, bắt đầu từ một bài hoặc **Tập tất cả**. Tải lại trang vẫn giữ bài đã lưu; hàng đợi và đồng hồ không được lưu.

## Kiểm tra Phần 2

| Thao tác | Kết quả mong đợi |
| --- | --- |
| Bắt đầu ở dòng 2 (e2) | Kéo tạ đơn 1, HLV Phương Anh; còn 1:07, sau 5 giây còn 1:02 |
| Tạm dừng, đợi 3 giây | Thời gian đứng yên; Bắt đầu chạy tiếp |
| Bấm Sau từ e2 | Gập tạ đơn 1, HLV Đức Anh, còn 1:44 |
| Bắt đầu e1, chờ 30 giây | Tự chuyển sang e2 |
| Tìm `đẩy`, bắt đầu dòng đầu rồi bấm Sau | Bài tiếp theo vẫn có chữ Đẩy |
| Bấm Trước ở e2 sau 4 giây | Vẫn e2, thời gian về đầu bài |
| Bấm Trước ở e2 trong 3 giây đầu | Trở lại e1 |
| Thêm cùng một bài hai lần | Chỉ xuất hiện một lần trong số bài của buổi tập |
| Lưu e1, e3 rồi mở `/saved` và F5 | Vẫn có hai bài, localStorage `workout-saved` chứa e1 và e3 |
| Bấm Tập tất cả ở `/saved` | Buổi tập gồm đúng các bài đã lưu |
| Bật Highlight updates khi đồng hồ chạy | Mỗi giây chỉ phần thời gian và tiến trình cập nhật |

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

## Nội dung Phần 3

- `src/features/routines/routineReducer.ts`: kiểu `Routine`, discriminated union `RoutineAction`, reducer thuần với `create`, `rename`, `remove`, `addExercise`, `removeExercise`. Không sửa state gốc; thêm bài trùng hoặc thao tác với ID không tồn tại giữ nguyên state.
- `withLogger.ts`: bọc reducer, chỉ log action và state trước/sau khi `import.meta.env.DEV`. Bản production không ghi log này.
- `RoutineContext.tsx`: tách `RoutineStateContext` và `RoutineDispatchContext`, cung cấp `useRoutines` và `useRoutineDispatch`; hook báo lỗi rõ khi dùng ngoài provider. Khởi tạo giáo án từ localStorage key `workout-routines` và lưu mỗi khi danh sách thay đổi.
- Form tạo giáo án chỉ dùng Context dispatch. Callback kiểm tra tên giữ tham chiếu ổn định, đọc danh sách mới nhất lúc gửi; form được `memo` để cập nhật giáo án không buộc form render lại.
- `/routines`: tạo, đếm số bài, mở chi tiết và xóa giáo án. Tên được trim; chặn tên trống và tên trùng không phân biệt hoa/thường.
- Kho bài tập có ô **Giáo án đang chọn** và nút **+ Giáo án** trên từng dòng. Chưa có giáo án thì nút bị khóa; bài đã có cũng bị khóa để tránh thêm trùng. Ô chọn dùng chung `SelectField`, bảng giữ dòng 56px và cuộn ngang khi cần.
- `/routines/:id`: hiển thị tên, các bài và nút Bỏ; tính tổng thời gian bằng `reduce`; **Tập tất cả** đưa đúng thứ tự bài trong giáo án vào Zustand session. Có trạng thái giáo án rỗng và không tìm thấy giáo án.
- `src/contexts/ThemeContext.tsx`: Context riêng chứa `theme: 'light' | 'dark'` và `toggleTheme`, value bọc `useMemo`. Nút trên menu đổi nhãn Giao diện tối/Giao diện sáng. Lựa chọn được nhớ ở `workout-theme`.
- Ba trang Đã lưu, Giáo án và Chi tiết giáo án dùng `React.lazy` + `Suspense` với trạng thái Đang tải trang...; build tạo ba file JS riêng. Header và thanh đồng hồ nằm ngoài Suspense nên tiếp tục hiển thị khi tải route.

## Kiểm tra Phần 3

| Thao tác | Kết quả mong đợi |
| --- | --- |
| Gửi tên rỗng hoặc toàn khoảng trắng | Tên giáo án không được để trống |
| Tạo `Ngày ngực`, sau đó tạo `ngày NGỰC` | Tên giáo án đã tồn tại |
| Chọn Ngày ngực trong Kho bài tập, thêm e1, e2, thêm lại e1 | Giáo án có đúng 2 bài |
| Mở chi tiết giáo án trên | Tổng thời gian: 1 phút 37 giây |
| Bấm Tập tất cả | Đang tập Đẩy tạ đơn 1, HLV Minh Khang; buổi tập 2 bài |
| F5 ở trang chi tiết | Giáo án vẫn giữ đủ bài |
| Bỏ e1 ở chi tiết | Còn e2; tổng thời gian 1 phút 7 giây |
| Mở `/routines/khong-ton-tai` | Không tìm thấy giáo án |
| Chuyển Giao diện tối rồi sang các trang khác | Header, bảng, form và thanh đồng hồ cùng chuyển màu |
| Mở Console khi thêm bài ở bản dev | Thấy log addExercise, state trước/sau |
| Mở Network rồi vào Giáo án lần đầu | Trình duyệt tải file JS của trang Giáo án khi vào route |
| Chạy `npm run build` | Có SavedPage, RoutinesPage, RoutineDetailPage thành file JS riêng |

Cách tách Context và tải component theo route theo tài liệu [React Context + reducer](https://react.dev/learn/scaling-up-with-reducer-and-context) và [React.lazy](https://react.dev/reference/react/lazy).

Trên màn hình nhỏ, bộ lọc xếp dọc và vùng bảng cuộn ngang riêng để giữ đầy đủ các cột và chiều cao dòng 56px.

Dữ liệu bài tập và huấn luyện viên là dữ liệu giả lập theo đề; nguồn tài liệu nằm trong `../LTWNC_TH02.pdf` và `../Slide/`.
