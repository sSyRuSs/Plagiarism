'use client';

import { useState } from 'react';
import { useHistory } from '@/contexts/HistoryContext';
import { useLanguage } from '@/contexts/LanguageContext';
import styles from './History.module.css';

interface HistoryProps {
  onLoadFromHistory?: (text: string) => void;
}

export default function History({ onLoadFromHistory }: HistoryProps) {
  const { history, clearHistory, deleteHistoryItem } = useHistory();
  const { t } = useLanguage();
  const [showHistory, setShowHistory] = useState(false);

  const handleLoad = (text: string) => {
    if (onLoadFromHistory) {
      onLoadFromHistory(text);
      setShowHistory(false);
    }
  };

  const formatDate = (timestamp: number) => {
    const date = new Date(timestamp);
    return date.toLocaleDateString() + ' ' + date.toLocaleTimeString();
  };

  if (history.length === 0 && !showHistory) {
    return null;
  }

  return (
    <section className={styles.section}>
      <div className={styles.container}>
        <div className={styles.header}>
          <h2 className={styles.title}>
            <span>📚</span> {t('history.title')}
          </h2>
          {history.length > 0 && (
            <button
              className={styles.clearBtn}
              onClick={() => {
                if (confirm('Are you sure you want to clear all history?')) {
                  clearHistory();
                }
              }}
            >
              {t('history.clear')}
            </button>
          )}
        </div>

        {history.length === 0 ? (
          <div className={styles.empty}>
            <p>{t('history.empty')}</p>
          </div>
        ) : (
          <div className={styles.list}>
            {history.map((item) => (
              <div key={item.id} className={styles.item}>
                <div className={styles.itemHeader}>
                  <span className={styles.itemDate}>
                    {formatDate(item.timestamp)}
                  </span>
                  <div className={styles.itemStats}>
                    <span
                      className={styles.itemSimilarity}
                      style={{
                        color:
                          item.result.similarity < 20
                            ? 'var(--color-success)'
                            : item.result.similarity < 50
                            ? 'var(--color-warning)'
                            : 'var(--color-error)',
                      }}
                    >
                      {item.result.similarity}% {t('results.similarity')}
                    </span>
                  </div>
                </div>
                <p className={styles.itemPreview}>{item.preview}</p>
                <div className={styles.itemActions}>
                  <button
                    className={styles.loadBtn}
                    onClick={() => handleLoad(item.text)}
                  >
                    {t('history.viewDetails')}
                  </button>
                  <button
                    className={styles.deleteBtn}
                    onClick={() => deleteHistoryItem(item.id)}
                  >
                    {t('history.delete')}
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </section>
  );
}
