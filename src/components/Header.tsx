'use client';

import { useState, useEffect } from 'react';
import { useLanguage } from '@/contexts/LanguageContext';
import Settings from './Settings';
import styles from './Header.module.css';

export default function Header() {
  const [scrolled, setScrolled] = useState(false);
  const { t } = useLanguage();

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 50);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <header className={`${styles.header} ${scrolled ? styles.scrolled : ''}`}>
      <div className={styles.container}>
        <a href="/" className={styles.logo}>
          <span className={styles.logoIcon}>⚡</span>
          <span className={styles.logoText}>PlagiarismChecker</span>
        </a>
        <nav className={styles.nav}>
          <a href="#home" className={styles.navLink}>{t('nav.home')}</a>
          <a href="#how-it-works" className={styles.navLink}>{t('nav.howItWorks')}</a>
          <a href="#about" className={styles.navLink}>{t('nav.about')}</a>
        </nav>
        <Settings />
      </div>
    </header>
  );
}