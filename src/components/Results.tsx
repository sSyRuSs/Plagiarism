'use client';

import { useMemo } from 'react';
import styles from './Results.module.css';
import { PlagiarismResult } from '@/lib/plagiarism';
import { exportToJSON, exportToPDF, exportToText } from '@/lib/utils/export';
import { useLanguage } from '@/contexts/LanguageContext';

interface ResultsProps {
  result: PlagiarismResult;
  originalText: string;
}

export default function Results({ result, originalText }: ResultsProps) {
  const { t } = useLanguage();
  
  const highlightedText = useMemo(() => {
    if (!result.matches.length) return originalText;
    
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

  const getSimilarityColor = (similarity: number) => {
    if (similarity < 20) return 'var(--color-success)';
    if (similarity < 50) return 'var(--color-warning)';
    return 'var(--color-error)';
  };

  const getSimilarityLabel = (similarity: number) => {
    if (similarity < 20) return t('results.low');
    if (similarity < 50) return t('results.moderate');
    return t('results.high');
  };

  const getQualityColor = (score: number) => {
    if (score >= 80) return 'var(--color-success)';
    if (score >= 50) return 'var(--color-warning)';
    return 'var(--color-error)';
  };

  const getQualityLabel = (score: number) => {
    if (score >= 80) return t('results.strong');
    if (score >= 50) return t('results.moderate');
    return t('results.needsWork');
  };

  const similarityColor = getSimilarityColor(result.similarity);
  const similarityLabel = getSimilarityLabel(result.similarity);
  const aiCheck = result.aiCheck;
  const aiColor = getSimilarityColor(aiCheck.score);
  const writingQuality = result.writingQuality;
  const overallQualityColor = getQualityColor(writingQuality.overallScore);
  const grammarColor = getQualityColor(writingQuality.grammarScore);
  const vocabularyColor = getQualityColor(writingQuality.vocabularyScore);

  const handleCopyReport = () => {
    const report = `PLAGIARISM CHECK REPORT
========================
Similarity: ${result.similarity}%
Risk Level: ${similarityLabel}
Words: ${result.wordCount}
Characters: ${result.charCount}
${result.matches.length > 0 ? `\nMatches Found: ${result.matches.length}` : '\nNo matches found'}

AI WRITING CHECK
================
AI Likelihood: ${
      aiCheck.status === 'ready' ? `${aiCheck.score}% (${aiCheck.label})` : aiCheck.note ?? 'Insufficient text'
    }

WRITING QUALITY
===============
Overall: ${
      writingQuality.status === 'ready'
        ? `${writingQuality.overallScore}% (${getQualityLabel(writingQuality.overallScore)})`
        : writingQuality.note ?? 'Insufficient text'
    }
Grammar: ${writingQuality.status === 'ready' ? `${writingQuality.grammarScore}%` : '—'}
Vocabulary: ${writingQuality.status === 'ready' ? `${writingQuality.vocabularyScore}%` : '—'}
${
  writingQuality.status === 'ready' && writingQuality.issues.length > 0
    ? `\nNotes: ${writingQuality.issues.map(issue => issue.message).join(' ')}`
    : ''
}`;

    navigator.clipboard.writeText(report);
  };

  const circumference = 2 * Math.PI * 45;
  const strokeDashoffset = circumference - (result.similarity / 100) * circumference;

  return (
    <section className={styles.section}>
      <div className={styles.container}>
        <div className={styles.header}>
          <h2 className={styles.title}>{t('results.title')}</h2>
        </div>

        <div className={styles.content}>
          <div className={styles.scoreCard}>
            <div className={styles.circleWrapper}>
              <svg className={styles.circle} viewBox="0 0 100 100">
                <circle
                  className={styles.circleBg}
                  cx="50"
                  cy="50"
                  r="45"
                />
                <circle
                  className={styles.circleProgress}
                  cx="50"
                  cy="50"
                  r="45"
                  style={{
                    strokeDasharray: circumference,
                    strokeDashoffset,
                    stroke: similarityColor,
                  }}
                />
              </svg>
              <div className={styles.scoreValue}>
                <span className={styles.percentage}>{result.similarity}</span>
                <span className={styles.percentSign}>%</span>
              </div>
            </div>
            <div className={styles.scoreInfo}>
              <span 
                className={styles.riskLabel}
                style={{ color: similarityColor }}
              >
                {similarityLabel} {t('results.similarity')}
              </span>
              <span className={styles.statsLabel}>
                {result.wordCount} {t('input.words')} • {result.charCount} {t('input.characters')}
              </span>
            </div>
          </div>

          <div className={styles.aiCard}>
            <div className={styles.aiHeader}>
              <div>
                <h3 className={styles.aiTitle}>{t('results.aiCheck')}</h3>
                <p className={styles.aiSubtitle}>
                  {t('results.aiCheckSubtitle')}
                </p>
              </div>
              <div className={styles.aiScore}>
                {aiCheck.status === 'ready' ? (
                  <>
                    <span className={styles.aiScoreValue}>{aiCheck.score}</span>
                    <span className={styles.aiScoreUnit}>%</span>
                  </>
                ) : (
                  <span className={styles.aiScoreValue}>—</span>
                )}
              </div>
            </div>
            <div className={styles.aiMeter}>
              <div
                className={styles.aiMeterFill}
                style={{
                  width: `${aiCheck.status === 'ready' ? aiCheck.score : 0}%`,
                  background: aiColor,
                }}
              />
            </div>
            <div className={styles.aiMeta}>
              {aiCheck.status === 'ready' ? (
                <span className={styles.aiLabel} style={{ color: aiColor }}>
                  {aiCheck.label} {t('results.aiLikelihood')}
                </span>
              ) : (
                <span className={styles.aiNote}>{aiCheck.note}</span>
              )}
            </div>
            {aiCheck.status === 'ready' && (
              <div className={styles.aiSignals}>
                {aiCheck.signals.map(signal => (
                  <div key={signal.name} className={styles.aiSignal}>
                    <span className={styles.aiSignalName}>{signal.name}</span>
                    <span className={styles.aiSignalValue}>{signal.value}</span>
                  </div>
                ))}
              </div>
            )}
          </div>

          <div className={styles.qualityCard}>
            <div className={styles.qualityHeader}>
              <div>
                <h3 className={styles.qualityTitle}>{t('results.writingQuality')}</h3>
                <p className={styles.qualitySubtitle}>
                  {t('results.writingQualitySubtitle')}
                </p>
              </div>
              <div className={styles.qualityScore}>
                {writingQuality.status === 'ready' ? (
                  <>
                    <span className={styles.qualityScoreValue}>{writingQuality.overallScore}</span>
                    <span className={styles.qualityScoreUnit}>%</span>
                  </>
                ) : (
                  <span className={styles.qualityScoreValue}>—</span>
                )}
              </div>
            </div>
            <div className={styles.qualityMeter}>
              <div
                className={styles.qualityMeterFill}
                style={{
                  width: `${writingQuality.status === 'ready' ? writingQuality.overallScore : 0}%`,
                  background: overallQualityColor,
                }}
              />
            </div>
            <div className={styles.qualityMeta}>
              {writingQuality.status === 'ready' ? (
                <span className={styles.qualityLabel} style={{ color: overallQualityColor }}>
                  {getQualityLabel(writingQuality.overallScore)} {t('results.writingQualityLabel')}
                </span>
              ) : (
                <span className={styles.qualityNote}>{writingQuality.note}</span>
              )}
            </div>
            {writingQuality.status === 'ready' && (
              <>
                <div className={styles.qualityRows}>
                  <div className={styles.qualityRow}>
                    <span className={styles.qualityRowLabel}>{t('results.grammar')}</span>
                    <div className={styles.qualityRowBar}>
                      <div
                        className={styles.qualityRowFill}
                        style={{ width: `${writingQuality.grammarScore}%`, background: grammarColor }}
                      />
                    </div>
                    <span className={styles.qualityRowValue}>{writingQuality.grammarScore}%</span>
                  </div>
                  <div className={styles.qualityRow}>
                    <span className={styles.qualityRowLabel}>{t('results.vocabulary')}</span>
                    <div className={styles.qualityRowBar}>
                      <div
                        className={styles.qualityRowFill}
                        style={{ width: `${writingQuality.vocabularyScore}%`, background: vocabularyColor }}
                      />
                    </div>
                    <span className={styles.qualityRowValue}>{writingQuality.vocabularyScore}%</span>
                  </div>
                </div>
                <div className={styles.qualityIssues}>
                  {writingQuality.issues.length > 0 ? (
                    writingQuality.issues.map((issue, index) => (
                      <div key={`${issue.category}-${index}`} className={styles.qualityIssue}>
                        <span className={styles.qualityIssueCategory}>{issue.category}</span>
                        <span className={styles.qualityIssueText}>{issue.message}</span>
                      </div>
                    ))
                  ) : (
                    <span className={styles.qualityIssueText}>No major grammar or vocabulary issues detected.</span>
                  )}
                </div>
              </>
            )}
          </div>

          {result.matches.length > 0 && (
            <div className={styles.matchesSection}>
              <h3 className={styles.matchesTitle}>
                <span>⚠</span> {t('results.matchesFound')} ({result.matches.length})
              </h3>
              <div className={styles.matchesList}>
                {result.matches.slice(0, 10).map((match, index) => (
                  <div key={index} className={styles.matchItem}>
                    <span className={styles.matchText}>&quot;{match.text}&quot;</span>
                    <span className={styles.matchSource}>{t('results.from')}: {match.source}</span>
                  </div>
                ))}
              </div>
            </div>
          )}

          {result.matches.length === 0 && (
            <div className={styles.noMatches}>
              <span className={styles.noMatchesIcon}>✓</span>
              <h3>{t('results.noMatches')}</h3>
              <p>{t('results.noMatchesDesc')}</p>
            </div>
          )}

          <div className={styles.highlightedText}>
            <h3 className={styles.highlightedTitle}>{t('results.highlightedText')}</h3>
            <div className={styles.textDisplay}>
              {Array.isArray(highlightedText) ? (
                highlightedText.map((part, index) => (
                  <span
                    key={index}
                    className={part.isMatch ? styles.highlighted : ''}
                  >
                    {part.text}
                  </span>
                ))
              ) : (
                <span>{highlightedText}</span>
              )}
            </div>
          </div>

          <div className={styles.exportButtons}>
            <button className={styles.copyBtn} onClick={handleCopyReport}>
              <span>📋</span> {t('results.copyReport')}
            </button>
            <button className={styles.exportBtn} onClick={() => exportToPDF(result, originalText)}>
              <span>📄</span> {t('results.exportPDF')}
            </button>
            <button className={styles.exportBtn} onClick={() => exportToJSON(result, originalText)}>
              <span>💾</span> {t('results.exportJSON')}
            </button>
            <button className={styles.exportBtn} onClick={() => exportToText(result, originalText)}>
              <span>📝</span> {t('results.exportTXT')}
            </button>
          </div>
        </div>
      </div>
    </section>
  );
}
