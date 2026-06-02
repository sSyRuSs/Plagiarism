# Công cụ Kiểm tra Đạo văn - Tính năng Nâng cao

Một công cụ kiểm tra đạo văn toàn diện với phát hiện văn bản AI, phân tích ngữ pháp và hỗ trợ đa ngôn ngữ.

## 🚀 Tính năng

### Tính năng Cốt lõi
- **Phát hiện Đạo văn**: Thuật toán multi n-gram tiên tiến (bi-gram, tri-gram, 4-gram) để phát hiện tương đồng chính xác
- **Phát hiện Văn bản AI**: Phân tích mẫu văn bản để phát hiện nội dung do AI tạo ra
- **Phân tích Ngữ pháp & Từ vựng**: Đánh giá chất lượng viết toàn diện
- **Cơ sở Dữ liệu Tài liệu Tùy chỉnh**: Thêm tài liệu tham khảo của riêng bạn để so sánh

### Tính năng Nâng cao

#### 🎨 Chế độ Tối & Giao diện
- Hỗ trợ giao diện sáng và tối đẹp mắt
- Chuyển đổi mượt mà giữa các giao diện
- Lưu tùy chọn người dùng trong localStorage
- Phát hiện tùy chọn hệ thống

#### 🌐 Hỗ trợ Đa ngôn ngữ
- Bản dịch **Tiếng Anh** và **Tiếng Việt**
- Chuyển đổi ngôn ngữ dễ dàng
- Lưu tùy chọn ngôn ngữ
- Tất cả các phần tử UI được dịch đầy đủ

#### 💾 Khả năng Xuất báo cáo
- **Xuất PDF**: Báo cáo định dạng chuyên nghiệp với hỗ trợ in
- **Xuất JSON**: Định dạng có thể đọc bằng máy với dữ liệu đầy đủ
- **Xuất TXT**: Báo cáo văn bản thuần túy để chia sẻ dễ dàng
- **Sao chép vào Clipboard**: Sao chép báo cáo nhanh chóng

#### 📚 Lịch sử Kiểm tra
- Tự động theo dõi lịch sử tất cả các lần kiểm tra
- Xem kết quả cũ với dấu thời gian
- Tải lại các lần kiểm tra trước để phân tích lại
- Xóa từng mục hoặc toàn bộ lịch sử
- Lưu trữ tối đa 50 lần kiểm tra gần đây

#### 📱 Hỗ trợ PWA
- Progressive Web App với khả năng offline
- Cài đặt như ứng dụng gốc trên desktop/mobile
- Service worker để lưu cache
- Tải nhanh và responsive

#### 📁 Tải lên Tệp
- Hỗ trợ các tệp .txt, .docx và .pdf
- Giao diện kéo và thả
- Giới hạn kích thước tệp: 5MB
- Trích xuất văn bản tự động

#### 🎯 Phát hiện Đạo văn Nâng cao
- **Phân tích Multi N-Gram**: Sử dụng mẫu 2-gram, 3-gram và 4-gram
- **Độ tương đồng Có trọng số**: Thuật toán thông minh cân nhắc các kích thước n-gram khác nhau
- **Tài liệu Tùy chỉnh**: Bao gồm tài liệu tham khảo của riêng bạn
- **Ghi nguồn**: Hiển thị nguồn chính xác của các đoạn trùng khớp

## 📦 Cài đặt

```bash
# Cài đặt dependencies
npm install

# Chạy development server
npm run dev

# Build cho production
npm run build

# Chạy production build
npm start
```

## 🛠️ Công nghệ

- **Framework**: Next.js 14 (App Router)
- **Ngôn ngữ**: TypeScript
- **Styling**: CSS Modules
- **Xử lý File**: mammoth (cho DOCX)
- **Quản lý State**: React Context API
- **Lưu trữ**: localStorage để duy trì dữ liệu

## 📂 Cấu trúc Dự án

```
src/
├── app/
│   ├── layout.tsx          # Layout gốc với providers
│   ├── page.tsx            # Trang chủ
│   └── globals.css         # Style toàn cục & themes
├── components/
│   ├── Header.tsx          # Navigation với settings
│   ├── Hero.tsx            # Phần landing
│   ├── TextInput.tsx       # Nhập văn bản & tải file
│   ├── Results.tsx         # Hiển thị kết quả
│   ├── History.tsx         # Danh sách lịch sử kiểm tra
│   ├── Settings.tsx        # Toggle theme & ngôn ngữ
│   ├── HowItWorks.tsx      # Phần cách hoạt động
│   └── Footer.tsx          # Phần footer
├── contexts/
│   ├── ThemeContext.tsx    # Quản lý state theme
│   ├── LanguageContext.tsx # Quản lý state i18n
│   └── HistoryContext.tsx  # Quản lý state lịch sử
├── lib/
│   ├── plagiarism.ts       # Thuật toán phát hiện đạo văn
│   ├── customDocuments.ts  # Quản lý tài liệu tùy chỉnh
│   └── utils/
│       └── export.ts       # Utilities xuất báo cáo
└── public/
    ├── manifest.json       # PWA manifest
    └── sw.js              # Service worker
```

## 🎯 Cách sử dụng

### Kiểm tra Cơ bản
1. Nhập hoặc dán văn bản của bạn
2. Nhấp "Kiểm tra Đạo văn, AI & Ngữ pháp"
3. Xem kết quả chi tiết với:
   - Phần trăm tương đồng
   - Điểm khả năng là AI
   - Điểm ngữ pháp và từ vựng
   - Các đoạn trùng khớp được đánh dấu

### Tính năng Nâng cao

#### Sử dụng Tài liệu Tùy chỉnh
```typescript
import { addCustomDocument } from '@/lib/customDocuments';

addCustomDocument({
  title: 'Tài liệu Tham khảo của tôi',
  content: 'Nội dung tài liệu ở đây...',
  category: 'Học thuật'
});
```

#### Xuất Kết quả
```typescript
import { exportToPDF, exportToJSON, exportToText } from '@/lib/utils/export';

// Xuất dưới dạng PDF (mở hộp thoại in)
exportToPDF(result, originalText);

// Xuất dưới dạng JSON
exportToJSON(result, originalText);

// Xuất dưới dạng TXT
exportToText(result, originalText);
```

#### Theme & Ngôn ngữ
```typescript
import { useTheme } from '@/contexts/ThemeContext';
import { useLanguage } from '@/contexts/LanguageContext';

// Toggle theme
const { theme, toggleTheme } = useTheme();
toggleTheme(); // Chuyển đổi giữa sáng/tối

// Thay đổi ngôn ngữ
const { language, setLanguage } = useLanguage();
setLanguage('vi'); // Chuyển sang Tiếng Việt
setLanguage('en'); // Chuyển sang Tiếng Anh
```

## 🔧 Cấu hình

### Thêm Ngôn ngữ Mới

Chỉnh sửa `src/contexts/LanguageContext.tsx`:

```typescript
const translations: Record<Language, Record<string, string>> = {
  en: { /* Bản dịch Tiếng Anh */ },
  vi: { /* Bản dịch Tiếng Việt */ },
  // Thêm ngôn ngữ của bạn ở đây
  fr: { /* Bản dịch Tiếng Pháp */ },
};
```

### Tùy chỉnh Màu Theme

Chỉnh sửa `src/app/globals.css`:

```css
:root, [data-theme="dark"] {
  --color-primary: #1a1a2e;
  --color-accent: #e94560;
  /* Thêm màu tùy chỉnh */
}

[data-theme="light"] {
  --color-primary: #f8f9fa;
  --color-accent: #e94560;
  /* Màu theme sáng */
}
```

## 📊 Thuật toán Phát hiện Đạo văn

Công cụ sử dụng phương pháp multi n-gram tinh vi:

1. **Tiền xử lý Văn bản**: Tokenize input thành từ
2. **Tạo N-Gram**: Tạo bi-gram, tri-gram và 4-gram
3. **Tính Độ tương đồng**: Sử dụng hệ số tương đồng Jaccard
4. **Tính điểm Có trọng số**: 
   - Bi-gram: 20%
   - Tri-gram: 50%
   - 4-gram: 30%
5. **Phát hiện Trùng khớp**: Xác định các cụm từ trùng khớp chính xác
6. **Ghi nguồn**: Liên kết các đoạn trùng khớp với tài liệu nguồn

## 🤖 Phát hiện AI

Phân tích nhiều tín hiệu:
- **Độ đồng đều Câu**: Tính nhất quán trong độ dài câu
- **Mẫu Lặp lại**: Chuỗi từ trùng lặp
- **Cụm từ Chuyển tiếp**: Sử dụng các chuyển tiếp phổ biến của AI
- **Sự đa dạng Từ vựng**: Sự đa dạng trong lựa chọn từ

## ✍️ Phân tích Chất lượng Viết

Kiểm tra:
- **Vấn đề Ngữ pháp**: Từ lặp lại, thiếu dấu câu
- **Phạm vi Từ vựng**: Sự đa dạng và tinh tế của từ
- **Cấu trúc Câu**: Độ dài và độ phức tạp

## 📝 Giấy phép

Giấy phép MIT - thoải mái sử dụng dự án này cho bất kỳ mục đích nào.

## 🙏 Ghi nhận

- Team Next.js cho framework tuyệt vời
- mammoth.js cho việc parse DOCX
- Cộng đồng mã nguồn mở

## 🔮 Cải tiến Tương lai

- [ ] Kiểm tra real-time khi gõ
- [ ] Chế độ xem so sánh song song
- [ ] Bảng điều khiển phân tích với thống kê
- [ ] Hỗ trợ thêm định dạng file (RTF, ODT)
- [ ] API endpoint để truy cập theo chương trình
- [ ] Extension trình duyệt
- [ ] Trình tạo trích dẫn
- [ ] Gợi ý diễn đạt lại

## 📞 Hỗ trợ

Đối với các vấn đề, câu hỏi hoặc đề xuất, vui lòng mở một issue trên GitHub.

---

Được tạo với ❤️ cho học sinh, nhà văn và giáo viên trên toàn thế giới.
