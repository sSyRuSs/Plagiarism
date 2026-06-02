'use client';

import { useLanguage } from '@/contexts/LanguageContext';
import styles from './Footer.module.css';

export default function Footer() {
  const { t } = useLanguage();
  
  return (
    <footer id="about" className={styles.footer}>
      <div className={styles.container}>
        <div className={styles.content}>
          <div className={styles.brand}>
            <span className={styles.logoIcon}>⚡</span>
            <span className={styles.logoText}>PlagiarismChecker</span>
          </div>
          <p className={styles.description}>
            {t('footer.text')}
          </p>
          <div className={styles.links}>
            <a href="#home">{t('nav.home')}</a>
            <a href="#how-it-works">{t('nav.howItWorks')}</a>
          </div>
        </div>
        <div className={styles.bottom}>
          <p>© {new Date().getFullYear()} PlagiarismChecker. All rights reserved.</p>
        </div>
      </div>
    </footer>
  );
}
