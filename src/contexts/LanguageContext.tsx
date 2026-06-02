'use client';

import { createContext, useContext, useState, ReactNode, useEffect } from 'react';

type Language = 'en' | 'vi';

interface LanguageContextType {
  language: Language;
  setLanguage: (lang: Language) => void;
  t: (key: string) => string;
}

const translations: Record<Language, Record<string, string>> = {
  en: {
    // Header
    'nav.home': 'Home',
    'nav.howItWorks': 'How It Works',
    'nav.about': 'About',
    'nav.history': 'History',
    
    // Hero
    'hero.title': 'Check Your Content for Plagiarism, AI Writing & Grammar',
    'hero.subtitle': 'Free online tool to detect similarities, AI-generated text, and writing quality issues',
    'hero.cta': 'Get Started',
    
    // Text Input
    'input.title': 'Enter Text to Check',
    'input.description': 'Paste, type, or upload a file to check for potential plagiarism',
    'input.upload': 'Upload File',
    'input.uploadHint': 'Supports .txt, .docx, .pdf (max 5MB). DOC files must be converted to DOCX.',
    'input.placeholder': 'Paste your essay, article, or any text here... (or drag & drop a file)',
    'input.characters': 'characters',
    'input.words': 'words',
    'input.checkButton': 'Check for Plagiarism, AI & Grammar',
    'input.checking': 'Checking...',
    'input.clear': 'Clear',
    'input.loadSample': 'Load Sample',
    'input.errorEmpty': 'Please enter some text to check',
    'input.errorShort': 'Please enter at least 50 characters',
    
    // Results
    'results.title': 'Results',
    'results.similarity': 'Similarity',
    'results.low': 'Low',
    'results.moderate': 'Moderate',
    'results.high': 'High',
    'results.aiCheck': 'AI Writing Check',
    'results.aiCheckSubtitle': 'Estimates how strongly the text matches common AI writing patterns.',
    'results.aiLikelihood': 'AI likelihood',
    'results.writingQuality': 'Grammar & Vocabulary',
    'results.writingQualitySubtitle': 'Highlights clarity, grammar consistency, and vocabulary range.',
    'results.writingQualityLabel': 'writing quality',
    'results.strong': 'Strong',
    'results.needsWork': 'Needs Work',
    'results.grammar': 'Grammar',
    'results.vocabulary': 'Vocabulary',
    'results.matchesFound': 'Matches Found',
    'results.noMatches': 'No Matches Found',
    'results.noMatchesDesc': 'Your text appears to be original and does not match any sources in our database.',
    'results.highlightedText': 'Highlighted Text',
    'results.copyReport': 'Copy Report',
    'results.exportPDF': 'Export PDF',
    'results.exportJSON': 'Export JSON',
    'results.from': 'from',
    
    // How It Works
    'howItWorks.title': 'How It Works',
    'howItWorks.step1.title': 'Enter or Upload Text',
    'howItWorks.step1.desc': 'Paste your text or upload a document file',
    'howItWorks.step2.title': 'AI Analysis',
    'howItWorks.step2.desc': 'Our algorithm checks for plagiarism, AI patterns, and grammar',
    'howItWorks.step3.title': 'Get Results',
    'howItWorks.step3.desc': 'View detailed reports with highlighted matches',
    
    // Footer
    'footer.text': 'Free Plagiarism Checker Tool',
    
    // History
    'history.title': 'Check History',
    'history.empty': 'No check history yet',
    'history.clear': 'Clear History',
    'history.viewDetails': 'View Details',
    'history.delete': 'Delete',
    'history.checked': 'Checked',
  },
  vi: {
    // Header
    'nav.home': 'Trang chủ',
    'nav.howItWorks': 'Cách hoạt động',
    'nav.about': 'Giới thiệu',
    'nav.history': 'Lịch sử',
    
    // Hero
    'hero.title': 'Kiểm Tra Nội Dung Đạo Văn, AI & Ngữ Pháp',
    'hero.subtitle': 'Công cụ miễn phí để phát hiện sự tương đồng, văn bản do AI tạo ra và lỗi ngữ pháp',
    'hero.cta': 'Bắt đầu',
    
    // Text Input
    'input.title': 'Nhập Văn Bản Để Kiểm Tra',
    'input.description': 'Dán, gõ hoặc tải lên file để kiểm tra đạo văn',
    'input.upload': 'Tải File Lên',
    'input.uploadHint': 'Hỗ trợ .txt, .docx, .pdf (tối đa 5MB). File DOC phải chuyển sang DOCX.',
    'input.placeholder': 'Dán bài luận, bài viết hoặc văn bản của bạn vào đây... (hoặc kéo thả file)',
    'input.characters': 'ký tự',
    'input.words': 'từ',
    'input.checkButton': 'Kiểm Tra Đạo Văn, AI & Ngữ Pháp',
    'input.checking': 'Đang kiểm tra...',
    'input.clear': 'Xóa',
    'input.loadSample': 'Tải Mẫu',
    'input.errorEmpty': 'Vui lòng nhập văn bản để kiểm tra',
    'input.errorShort': 'Vui lòng nhập ít nhất 50 ký tự',
    
    // Results
    'results.title': 'Kết Quả',
    'results.similarity': 'Độ tương đồng',
    'results.low': 'Thấp',
    'results.moderate': 'Trung bình',
    'results.high': 'Cao',
    'results.aiCheck': 'Kiểm Tra Văn Bản AI',
    'results.aiCheckSubtitle': 'Ước tính mức độ văn bản khớp với các mẫu viết AI phổ biến.',
    'results.aiLikelihood': 'Khả năng AI',
    'results.writingQuality': 'Ngữ Pháp & Từ Vựng',
    'results.writingQualitySubtitle': 'Đánh giá tính rõ ràng, ngữ pháp và phạm vi từ vựng.',
    'results.writingQualityLabel': 'chất lượng viết',
    'results.strong': 'Tốt',
    'results.needsWork': 'Cần cải thiện',
    'results.grammar': 'Ngữ pháp',
    'results.vocabulary': 'Từ vựng',
    'results.matchesFound': 'Tìm Thấy Trùng Khớp',
    'results.noMatches': 'Không Tìm Thấy Trùng Khớp',
    'results.noMatchesDesc': 'Văn bản của bạn có vẻ là nguyên bản và không khớp với bất kỳ nguồn nào trong cơ sở dữ liệu.',
    'results.highlightedText': 'Văn Bản Được Đánh Dấu',
    'results.copyReport': 'Sao Chép Báo Cáo',
    'results.exportPDF': 'Xuất PDF',
    'results.exportJSON': 'Xuất JSON',
    'results.from': 'từ',
    
    // How It Works
    'howItWorks.title': 'Cách Hoạt Động',
    'howItWorks.step1.title': 'Nhập hoặc Tải Văn Bản',
    'howItWorks.step1.desc': 'Dán văn bản hoặc tải lên file tài liệu',
    'howItWorks.step2.title': 'Phân Tích AI',
    'howItWorks.step2.desc': 'Thuật toán của chúng tôi kiểm tra đạo văn, mẫu AI và ngữ pháp',
    'howItWorks.step3.title': 'Nhận Kết Quả',
    'howItWorks.step3.desc': 'Xem báo cáo chi tiết với các đoạn trùng khớp được đánh dấu',
    
    // Footer
    'footer.text': 'Công Cụ Kiểm Tra Đạo Văn Miễn Phí',
    
    // History
    'history.title': 'Lịch Sử Kiểm Tra',
    'history.empty': 'Chưa có lịch sử kiểm tra',
    'history.clear': 'Xóa Lịch Sử',
    'history.viewDetails': 'Xem Chi Tiết',
    'history.delete': 'Xóa',
    'history.checked': 'Đã kiểm tra',
  },
};

const LanguageContext = createContext<LanguageContextType | undefined>(undefined);

export function LanguageProvider({ children }: { children: ReactNode }) {
  const [language, setLanguageState] = useState<Language>('en');

  useEffect(() => {
    const savedLang = localStorage.getItem('language') as Language | null;
    if (savedLang && (savedLang === 'en' || savedLang === 'vi')) {
      setLanguageState(savedLang);
    }
  }, []);

  const setLanguage = (lang: Language) => {
    setLanguageState(lang);
    localStorage.setItem('language', lang);
  };

  const t = (key: string): string => {
    return translations[language][key] || key;
  };

  return (
    <LanguageContext.Provider value={{ language, setLanguage, t }}>
      {children}
    </LanguageContext.Provider>
  );
}

export function useLanguage() {
  const context = useContext(LanguageContext);
  if (context === undefined) {
    throw new Error('useLanguage must be used within a LanguageProvider');
  }
  return context;
}
