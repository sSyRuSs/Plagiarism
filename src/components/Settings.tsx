'use client';

import { useTheme } from '@/contexts/ThemeContext';
import { useLanguage } from '@/contexts/LanguageContext';
import styles from './Settings.module.css';

export default function Settings() {
  const { theme, toggleTheme } = useTheme();
  const { language, setLanguage } = useLanguage();

  return (
    <div className={styles.settings}>
      <button
        onClick={toggleTheme}
        className={styles.themeToggle}
        aria-label="Toggle theme"
        title={`Switch to ${theme === 'dark' ? 'light' : 'dark'} mode`}
      >
        {theme === 'dark' ? '☀️' : '🌙'}
      </button>
      
      <div className={styles.languageToggle}>
        <button
          onClick={() => setLanguage('en')}
          className={language === 'en' ? styles.active : ''}
          aria-label="Switch to English"
        >
          EN
        </button>
        <button
          onClick={() => setLanguage('vi')}
          className={language === 'vi' ? styles.active : ''}
          aria-label="Switch to Vietnamese"
        >
          VI
        </button>
      </div>
    </div>
  );
}
