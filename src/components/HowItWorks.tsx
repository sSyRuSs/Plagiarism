'use client';

import { useLanguage } from '@/contexts/LanguageContext';
import styles from './HowItWorks.module.css';

export default function HowItWorks() {
  const { t } = useLanguage();
  
  const steps = [
    {
      icon: '✏️',
      title: t('howItWorks.step1.title'),
      description: t('howItWorks.step1.desc'),
    },
    {
      icon: '🔍',
      title: t('howItWorks.step2.title'),
      description: t('howItWorks.step2.desc'),
    },
    {
      icon: '📊',
      title: t('howItWorks.step3.title'),
      description: t('howItWorks.step3.desc'),
    },
  ];
  
  return (
    <section id="how-it-works" className={styles.section}>
      <div className={styles.container}>
        <div className={styles.header}>
          <h2 className={styles.title}>{t('howItWorks.title')}</h2>
          <p className={styles.subtitle}>
            Check your text for plagiarism in three simple steps
          </p>
        </div>
        
        <div className={styles.steps}>
          {steps.map((step, index) => (
            <div key={index} className={styles.stepCard}>
              <div className={styles.stepNumber}>{index + 1}</div>
              <span className={styles.stepIcon}>{step.icon}</span>
              <h3 className={styles.stepTitle}>{step.title}</h3>
              <p className={styles.stepDescription}>{step.description}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
