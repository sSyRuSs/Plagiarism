'use client';

import { useMemo } from 'react';
import styles from './ComparisonView.module.css';
import { PlagiarismResult } from '@/lib/plagiarism';
import { useLanguage } from '@/contexts/LanguageContext';

interface ComparisonViewProps {
  originalText: string;
  result: PlagiarismResult;
}

export default function ComparisonView({ originalText, result }: ComparisonViewProps) {
  const { t } = useLanguage();

  const highlightedOriginal = useMemo(() => {
    if (!result.matches.length) return [{ text: originalText, isMatch: false }];
    
    const matches = [...result.matches].sort((a, b) => a.startIndex - b.startIndex);
    const parts: { text: string; isMatch: boolean }[] = [];
    let lastEnd = 0;
    
    for (const match of matches) {
      if (match.startIndex > lastEnd) {
        parts.push({
          text: originalText.substring(lastEnd, match.startIndex),
          isMatch: false,
        });
      }
      if (match.startIndex >= lastEnd) {
        parts.push({
          text: originalText.substring(match.startIndex, match.endIndex),
          isMatch: true,
        });
        lastEnd = match.endIndex;
      }
    }
    
    if (lastEnd < originalText.length) {
      parts.push({
        text: originalText.substring(lastEnd),
        isMatch: false,
      });
    }
    
    return parts;
  }, [result.matches, originalText]);

  // Group matches by source
  const matchesBySource = useMemo(() => {
    const grouped: Record<string, typeof result.matches> = {};
    result.matches.forEach(match => {
      if (!grouped[match.source]) {
        grouped[match.source] = [];
      }
      grouped[match.source].push(match);
    });
    return grouped;
  }, [result.matches]);

  return (
    <section className={styles.section}>
      <div className={styles.container}>
        <div className={styles.header}>
          <h2 className={styles.title}>{t('comparison.title')}</h2>
          <p className={styles.description}>
            {t('comparison.description')}
          </p>
        </div>

        <div className={styles.comparisonWrapper}>
          {/* Original Text Column */}
          <div className={styles.column}>
            <div className={styles.columnHeader}>
              <h3 className={styles.columnTitle}>
                {t('comparison.originalText')}
              </h3>
              <span className={styles.matchCount}>
                {result.matches.length} {t('comparison.matches')}
              </span>
            </div>
            <div className={styles.textDisplay}>
              {highlightedOriginal.map((part, index) => (
                <span
                  key={index}
                  className={part.isMatch ? styles.highlighted : styles.normal}
                  data-match={part.isMatch}
                >
                  {part.text}
                </span>
              ))}
            </div>
          </div>

          {/* Divider */}
          <div className={styles.divider}></div>

          {/* Sources Column */}
          <div className={styles.column}>
            <div className={styles.columnHeader}>
              <h3 className={styles.columnTitle}>
                {t('comparison.sources')}
              </h3>
              <span className={styles.sourceCount}>
                {Object.keys(matchesBySource).length} {t('comparison.sources')}
              </span>
            </div>
            <div className={styles.sourcesList}>
              {Object.entries(matchesBySource).map(([source, matches], idx) => (
                <div key={idx} className={styles.sourceCard}>
                  <div className={styles.sourceHeader}>
                    <span className={styles.sourceName}>📄 {source}</span>
                    <span className={styles.sourceMatches}>
                      {matches.length} {t('comparison.matches')}
                    </span>
                  </div>
                  <div className={styles.sourceMatches}>
                    {matches.slice(0, 5).map((match, matchIdx) => (
                      <div key={matchIdx} className={styles.matchItem}>
                        <span className={styles.matchQuote}>&quot;{match.text}&quot;</span>
                      </div>
                    ))}
                    {matches.length > 5 && (
                      <div className={styles.moreMatches}>
                        +{matches.length - 5} {t('comparison.more')}
                      </div>
                    )}
                  </div>
                </div>
              ))}
              {Object.keys(matchesBySource).length === 0 && (
                <div className={styles.noSources}>
                  <span className={styles.noSourcesIcon}>✓</span>
                  <p>{t('comparison.noSources')}</p>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
