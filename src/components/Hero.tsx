'use client';

import styles from './Hero.module.css';

interface HeroProps {
  onStartCheck: () => void;
}

export default function Hero({ onStartCheck }: HeroProps) {
  return (
    <section id="home" className={styles.hero}>
      <div className={styles.container}>
        <div className={styles.content}>
          <span className={styles.badge}>✨ Free Online Tool</span>
          <h1 className={styles.title}>
            Check Your Text for <span className={styles.highlight}>Plagiarism</span>, AI & Grammar
          </h1>
          <p className={styles.subtitle}>
            Instantly detect copied content, AI patterns, and writing quality issues with our advanced analysis. 
            Perfect for students, writers, and educators.
          </p>
          <button className={styles.cta} onClick={onStartCheck}>
            Start Checking
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
