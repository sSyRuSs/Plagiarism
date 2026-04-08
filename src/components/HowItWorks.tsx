'use client';

import styles from './HowItWorks.module.css';

const steps = [
  {
    icon: '✏️',
    title: 'Enter Your Text',
    description: 'Paste or type your content into the text area. You can check essays, articles, or any written content.',
  },
  {
    icon: '🔍',
    title: 'Analyze for Similarity',
    description: 'Our engine checks plagiarism sources, AI writing patterns, and grammar/vocabulary signals.',
  },
  {
    icon: '📊',
    title: 'View Results',
    description: 'Get instant feedback with similarity, AI likelihood, grammar/vocabulary scores, and highlights.',
  },
];

export default function HowItWorks() {
  return (
    <section id="how-it-works" className={styles.section}>
      <div className={styles.container}>
        <div className={styles.header}>
          <h2 className={styles.title}>How It Works</h2>
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
