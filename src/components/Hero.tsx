'use client';

import { useLanguage } from '@/contexts/LanguageContext';
import styles from './Hero.module.css';

interface HeroProps {
  onStartCheck: () => void;
}

export default function Hero({ onStartCheck }: HeroProps) {
  const { t } = useLanguage();
  
  return (
    <section id="home" className={styles.hero}>
      <div className={styles.container}>
        <div className={styles.content}>
          <span className={styles.badge}>✨ Free Online Tool</span>
          <h1 className={styles.title}>
            {t('hero.title')}
          </h1>
          <p className={styles.subtitle}>
            {t('hero.subtitle')}
          </p>
          <button className={styles.cta} onClick={onStartCheck}>
            {t('hero.cta')}
            <span className={styles.ctaIcon}>→</span>
          </button>
        </div>
        <div className={styles.visual}>
          <div className={styles.circleOuter}>
            <div className={styles.circleMiddle}>
              <div className={styles.circleInner}>
                <span className={styles.checkIcon}>✓</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
