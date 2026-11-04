# RSVP → Google Sheets

Browser → same-origin `POST /api/rsvp` (Cloudflare Pages Function) → Google Apps
Script web app → the owner's private Google Sheet. No D1 database is required.
The browser never receives the shared token or Google credentials.

## Quyền chia sẻ

**Không bật “Anyone with the link can edit” cho spreadsheet.** Đặt General access
là **Restricted**, chỉ chia sẻ với người cần quản lý khách mời. Apps Script chạy
bằng tài khoản chủ sở hữu có quyền sửa sheet. Quyền truy cập web app **Anyone**
là quyền gọi script, không phải quyền xem/sửa spreadsheet. Script chỉ cho ghi khi
token phía server hợp lệ và không có endpoint đọc danh sách khách.

## Thiết lập bằng tài khoản của chủ sheet

1. Mở spreadsheet đã chọn:
   https://docs.google.com/spreadsheets/d/1c7TpzxU7pS5JtdgGbt_1cFwR336KVPWPQqdzLD1ARc0/edit
2. Chọn **Extensions → Apps Script**, chép nội dung `apps-script/Code.gs` vào
   `Code.gs` rồi Save. File đã cấu hình đúng spreadsheet ID. Script tạo tab riêng
   **RSVP**, không thay đổi tab hiện có. Nếu đã có tab RSVP chứa tiêu đề khác,
   đổi tên tab đó trước; script từ chối ghi đè dữ liệu không đúng cấu trúc.
3. Tạo chuỗi ngẫu nhiên ít nhất 32 ký tự (nên dùng 32 byte ngẫu nhiên, dạng hex).
   Trong **Project Settings → Script Properties**, đặt `RSVP_API_TOKEN` bằng chuỗi
   này. Không đặt trong mã nguồn, frontend, Git hay gửi khóa trong chat.
4. **Deploy → New deployment → Web app**:
   - **Execute as: Me** (tài khoản có quyền sửa sheet).
   - **Who has access: Anyone** (không phải “Anyone with Google account”).
   - Xác nhận quyền truy cập Google Sheets bằng tài khoản của bạn. Nếu tài khoản
     Workspace không cho phép truy cập ẩn danh, cần quản trị viên cho phép hoặc
     chọn tài khoản được phép; không bật quyền chỉnh sửa công khai cho sheet để
     giải quyết lỗi này. Không bỏ qua cảnh báo bảo mật không xác định.
5. Copy **Web app URL** kết thúc bằng `/exec`, không dùng `/dev` hay URL của sheet.
6. Trong **Cloudflare Pages → Settings → Variables and Secrets**, cấu hình cho
   production (và preview riêng nếu cần):
   - `RSVP_SCRIPT_URL`: URL `/exec` vừa deploy.
   - `RSVP_API_TOKEN`: **Secret**, cùng giá trị đã đặt trong Script Properties.
   Không thêm tiền tố `VITE_`. Không dùng token production trong bản preview nếu
   không muốn dữ liệu thử vào danh sách thật; preview nên có sheet/script riêng.
7. Deploy lại Pages **bao gồm `functions/` từ repository root**, không chỉ upload
   `dist/`. Workflow AWS S3/CloudFront trong repo chỉ deploy static files; nó
   không chạy được endpoint này. Cần Pages Git integration hoặc Wrangler Pages
   deployment bao gồm Functions. Vite dev server cũng không chạy endpoint.
8. Gửi một RSVP thử từ website, xác nhận có đúng một dòng trong tab RSVP; gửi lại
   cùng request ID và nội dung phải không tạo dòng thứ hai. Sau đó xóa dòng thử.
   Chưa hoàn tất bước này thì chưa thể khẳng định đã kết nối sheet thật.

Khi sửa Apps Script, **Deploy → Manage deployments → Edit → New version → Deploy**
để URL `/exec` dùng code mới. Chỉ Save không cập nhật bản deployment.

## Dữ liệu và retry

API nhận JSON `{ requestId, name, attendance, count, note, website }`:

- UUID `requestId`, giữ nguyên cho retry của cùng nội dung; nội dung đổi thì ID mới.
- Tên bắt buộc ≤80 ký tự UTF-16; lời nhắn tùy chọn ≤400; lưu sau khi trim.
- `attendance`: `attending` hoặc `absent`; `count`: số nguyên 1–10 (vắng gửi 1).
- `website`: honeypot, bỏ qua hoặc chuỗi rỗng. Body UTF-8 tối đa 8 KiB.
- Kiểm tra Origin nếu có; không mở CORS cho trình duyệt khác origin.

Tab RSVP có cột: Request ID, Thời gian, Họ tên, Tham dự, Số người, Lời nhắn,
Payload. Cột Payload giữ JSON chuẩn hóa để so sánh retry chính xác; không sửa cột
này hay Request ID, không sort riêng từng cột. Tên/lời nhắn có ký tự mở đầu công
thức được escape để không chạy thành công thức trong sheet.

Apps Script dùng script lock cho thao tác tìm ID + ghi, flush rồi kiểm tra dữ liệu
trước khi trả `{ok:true,requestId}`. Retry giống hệt không ghi thêm hoặc đổi thời
gian; nội dung khác cùng ID trả lỗi `idempotency_conflict`. Đây không phải xác
thực danh tính: một người cố ý gửi ID mới vẫn tạo phản hồi mới.

Function chỉ trả HTTP 200 khi nhận JSON xác nhận đúng ID. Lỗi Google, timeout,
token/cấu hình thiếu hoặc trang đăng nhập HTML → 503 an toàn; conflict → 409.
Không có thành công giả do `no-cors`. Form giữ nội dung khi lỗi và chờ tối đa 15s;
proxy chờ Google tối đa 12s. Sau timeout, script có thể đã ghi nên phải retry với
cùng ID. Apps Script có quota và không có SLA như database; Cloudflare rate
limiting nên được cấu hình nếu cần chống spam. Honeypot không thay thế rate limit.
Token chỉ ngăn gọi trực tiếp script trái phép, không biến form công khai thành
form riêng tư. Không ghi PII/token vào log, không có API đọc dữ liệu công khai.

## Local verification

`bun run check` chạy type-check và kiểm thử handler cùng **mã Apps Script thật**
trong VM, mô phỏng các dịch vụ Google. Test bao gồm retry/mất phản hồi, conflict,
validation, token, công thức, lỗi upstream/lock và không xác nhận sớm. Đây **không
phải** bằng chứng ghi vào Google Sheets thật; cần hoàn tất deployment và bước 8.

`bun run build` kiểm tra production bundle. Muốn chạy full stack local, đặt
`RSVP_SCRIPT_URL` và `RSVP_API_TOKEN` trong file `.dev.vars` (đã gitignore), dùng
script/sheet thử riêng rồi chạy `bun run pages:dev`. Không còn migration D1.
