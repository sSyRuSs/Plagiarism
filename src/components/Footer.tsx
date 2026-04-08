'use client';

import styles from './Footer.module.css';

export default function Footer() {
  return (
    <footer id="about" className={styles.footer}>
      <div className={styles.container}>
        <div className={styles.content}>
          <div className={styles.brand}>
            <span className={styles.logoIcon}>⚡</span>
            <span className={styles.logoText}>PlagiarismChecker</span>
          </div>
          <p className={styles.description}>
            A free online tool for checking text similarity, AI writing signals, and grammar quality. 
            Perfect for students, writers, and educators.
          </p>
          <div className={styles.links}>
            <a href="#home">Home</a>
            <a href="#how-it-works">How It Works</a>
          </div>
        </div>
        <div className={styles.bottom}>
          <p>© {new Date().getFullYear()} PlagiarismChecker. All rights reserved.</p>
        </div>
      </div>
    </footer>
  );
}
