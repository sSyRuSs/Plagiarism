# Plagiarism Checker - Advanced Features

A comprehensive plagiarism detection tool with AI writing detection, grammar analysis, and multi-language support.

## 🚀 Features

### Core Features
- **Plagiarism Detection**: Advanced multi n-gram algorithm (bi-gram, tri-gram, 4-gram) for accurate similarity detection
- **AI Writing Detection**: Analyzes text patterns to detect AI-generated content
- **Grammar & Vocabulary Analysis**: Comprehensive writing quality assessment
- **Custom Document Database**: Add your own reference documents for comparison

### Advanced Features

#### 🎨 Dark Mode & Themes
- Beautiful dark and light theme support
- Smooth transitions between themes
- Persists user preference in localStorage
- System preference detection

#### 🌐 Multi-Language Support
- **English** and **Vietnamese** translations
- Easy language switching
- Persists language preference
- All UI elements fully translated

#### 💾 Export Capabilities
- **PDF Export**: Professional formatted reports with print support
- **JSON Export**: Machine-readable format with complete data
- **TXT Export**: Plain text reports for easy sharing
- **Copy to Clipboard**: Quick report copying

#### 📚 Check History
- Automatic history tracking of all checks
- View past results with timestamps
- Load previous checks for reanalysis
- Delete individual or all history items
- Stores up to 50 recent checks

#### 📱 PWA Support
- Progressive Web App with offline capabilities
- Install as native app on desktop/mobile
- Service worker for caching
- Fast loading and responsive

#### 📁 File Upload
- Support for .txt, .docx, and .pdf files
- Drag & drop interface
- File size limit: 5MB
- Automatic text extraction

#### 🎯 Enhanced Plagiarism Detection
- **Multi N-Gram Analysis**: Uses 2-gram, 3-gram, and 4-gram patterns
- **Weighted Similarity**: Smart algorithm weighs different n-gram sizes
- **Custom Documents**: Include your own reference documents
- **Source Attribution**: Shows exact sources of matches

## 📦 Installation

```bash
# Install dependencies
npm install

# Run development server
npm run dev

# Build for production
npm run build

# Run production build
npm start
```

## 🛠️ Tech Stack

- **Framework**: Next.js 14 (App Router)
- **Language**: TypeScript
- **Styling**: CSS Modules
- **File Processing**: mammoth (for DOCX)
- **State Management**: React Context API
- **Storage**: localStorage for persistence

## 📂 Project Structure

```
src/
├── app/
│   ├── layout.tsx          # Root layout with providers
│   ├── page.tsx            # Home page
│   └── globals.css         # Global styles & themes
├── components/
│   ├── Header.tsx          # Navigation with settings
│   ├── Hero.tsx            # Landing section
│   ├── TextInput.tsx       # Text input & file upload
│   ├── Results.tsx         # Results display
│   ├── History.tsx         # Check history list
│   ├── Settings.tsx        # Theme & language toggle
│   ├── HowItWorks.tsx      # How it works section
│   └── Footer.tsx          # Footer section
├── contexts/
│   ├── ThemeContext.tsx    # Theme state management
│   ├── LanguageContext.tsx # i18n state management
│   └── HistoryContext.tsx  # History state management
├── lib/
│   ├── plagiarism.ts       # Plagiarism detection algorithm
│   ├── customDocuments.ts  # Custom documents management
│   └── utils/
│       └── export.ts       # Export utilities
└── public/
    ├── manifest.json       # PWA manifest
    └── sw.js              # Service worker
```

## 🎯 Usage

### Basic Check
1. Enter or paste your text
2. Click "Check for Plagiarism, AI & Grammar"
3. View detailed results with:
   - Similarity percentage
   - AI likelihood score
   - Grammar and vocabulary scores
   - Highlighted matches

### Advanced Features

#### Using Custom Documents
```typescript
import { addCustomDocument } from '@/lib/customDocuments';

addCustomDocument({
  title: 'My Reference Document',
  content: 'Document content here...',
  category: 'Academic'
});
```

#### Exporting Results
```typescript
import { exportToPDF, exportToJSON, exportToText } from '@/lib/utils/export';

// Export as PDF (opens print dialog)
exportToPDF(result, originalText);

// Export as JSON
exportToJSON(result, originalText);

// Export as TXT
exportToText(result, originalText);
```

#### Theme & Language
```typescript
import { useTheme } from '@/contexts/ThemeContext';
import { useLanguage } from '@/contexts/LanguageContext';

// Toggle theme
const { theme, toggleTheme } = useTheme();
toggleTheme(); // Switches between light/dark

// Change language
const { language, setLanguage } = useLanguage();
setLanguage('vi'); // Switch to Vietnamese
setLanguage('en'); // Switch to English
```

## 🔧 Configuration

### Adding More Languages

Edit `src/contexts/LanguageContext.tsx`:

```typescript
const translations: Record<Language, Record<string, string>> = {
  en: { /* English translations */ },
  vi: { /* Vietnamese translations */ },
  // Add your language here
  fr: { /* French translations */ },
};
```

### Customizing Theme Colors

Edit `src/app/globals.css`:

```css
:root, [data-theme="dark"] {
  --color-primary: #1a1a2e;
  --color-accent: #e94560;
  /* Add more custom colors */
}

[data-theme="light"] {
  --color-primary: #f8f9fa;
  --color-accent: #e94560;
  /* Light theme colors */
}
```

## 📊 Plagiarism Detection Algorithm

The tool uses a sophisticated multi n-gram approach:

1. **Text Preprocessing**: Tokenizes input into words
2. **N-Gram Generation**: Creates bi-grams, tri-grams, and 4-grams
3. **Similarity Calculation**: Uses Jaccard similarity coefficient
4. **Weighted Scoring**: 
   - Bi-grams: 20%
   - Tri-grams: 50%
   - 4-grams: 30%
5. **Match Detection**: Identifies exact phrase matches
6. **Source Attribution**: Links matches to source documents

## 🤖 AI Detection

Analyzes several signals:
- **Sentence Uniformity**: Consistency in sentence length
- **Repetition Patterns**: Duplicate word sequences
- **Transition Phrases**: Usage of common AI transitions
- **Vocabulary Diversity**: Word choice variety

## ✍️ Writing Quality Analysis

Checks for:
- **Grammar Issues**: Repeated words, missing punctuation
- **Vocabulary Range**: Word diversity and sophistication
- **Sentence Structure**: Length and complexity

## 📝 License

MIT License - feel free to use this project for any purpose.

## 🙏 Acknowledgments

- Next.js team for the amazing framework
- mammoth.js for DOCX parsing
- The open-source community

## 🔮 Future Enhancements

- [ ] Real-time checking as you type
- [ ] Side-by-side comparison view
- [ ] Analytics dashboard with statistics
- [ ] More file format support (RTF, ODT)
- [ ] API endpoint for programmatic access
- [ ] Browser extension
- [ ] Citation generator
- [ ] Paraphrasing suggestions

## 📞 Support

For issues, questions, or suggestions, please open an issue on GitHub.

---

Made with ❤️ for students, writers, and educators worldwide.
