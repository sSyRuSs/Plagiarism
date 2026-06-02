'use client';

import { useMemo } from 'react';
import styles from './Analytics.module.css';
import { useHistory } from '@/contexts/HistoryContext';
import { useLanguage } from '@/contexts/LanguageContext';

export default function Analytics() {
  const { history } = useHistory();
  const { t } = useLanguage();

  const stats = useMemo(() => {
    if (history.length === 0) {
      return {
        totalChecks: 0,
        avgSimilarity: 0,
        avgAiScore: 0,
        avgWritingQuality: 0,
        highRiskCount: 0,
        lowRiskCount: 0,
        topSources: [],
        recentTrend: [],
      };
    }

    let totalSimilarity = 0;
    let totalAiScore = 0;
    let totalWritingQuality = 0;
    let highRiskCount = 0;
    let lowRiskCount = 0;
    const sourceCount: Record<string, number> = {};

    history.forEach(item => {
      totalSimilarity += item.result.similarity;
      
      if (item.result.aiCheck.status === 'ready') {
        totalAiScore += item.result.aiCheck.score;
      }
      
      if (item.result.writingQuality.status === 'ready') {
        totalWritingQuality += item.result.writingQuality.overallScore;
      }

      if (item.result.similarity >= 50) {
        highRiskCount++;
      } else if (item.result.similarity < 20) {
        lowRiskCount++;
      }

      item.result.matches.forEach(match => {
        sourceCount[match.source] = (sourceCount[match.source] || 0) + 1;
      });
    });

    const avgSimilarity = Math.round(totalSimilarity / history.length);
    const avgAiScore = Math.round(totalAiScore / history.length);
    const avgWritingQuality = Math.round(totalWritingQuality / history.length);

    const topSources = Object.entries(sourceCount)
      .sort((a, b) => b[1] - a[1])
      .slice(0, 5)
      .map(([source, count]) => ({ source, count }));

    // Recent trend (last 10 checks)
    const recentTrend = history
      .slice(-10)
      .map(item => ({
        timestamp: item.timestamp,
        similarity: item.result.similarity,
      }));

    return {
      totalChecks: history.length,
      avgSimilarity,
      avgAiScore,
      avgWritingQuality,
      highRiskCount,
      lowRiskCount,
      topSources,
      recentTrend,
    };
  }, [history]);

  if (history.length === 0) {
    return (
      <section className={styles.section}>
        <div className={styles.container}>
          <div className={styles.emptyState}>
            <span className={styles.emptyIcon}>📊</span>
            <h3 className={styles.emptyTitle}>
              {t('analytics.noData') || 'No Analytics Data Yet'}
            </h3>
            <p className={styles.emptyDesc}>
              {t('analytics.noDataDesc') || 'Start checking documents to see analytics and insights'}
            </p>
          </div>
        </div>
      </section>
    );
  }

  return (
    <section className={styles.section}>
      <div className={styles.container}>
        <div className={styles.header}>
          <h2 className={styles.title}>
            {t('analytics.title') || 'Analytics Dashboard'}
          </h2>
          <p className={styles.description}>
            {t('analytics.description') || 'Insights from your plagiarism checks'}
          </p>
        </div>

        <div className={styles.grid}>
          {/* Total Checks */}
          <div className={styles.statCard}>
            <div className={styles.statIcon}>📝</div>
            <div className={styles.statContent}>
              <h4 className={styles.statLabel}>
                {t('analytics.totalChecks') || 'Total Checks'}
              </h4>
              <div className={styles.statValue}>{stats.totalChecks}</div>
            </div>
          </div>

          {/* Average Similarity */}
          <div className={styles.statCard}>
            <div className={styles.statIcon}>📊</div>
            <div className={styles.statContent}>
              <h4 className={styles.statLabel}>
                {t('analytics.avgSimilarity') || 'Avg Similarity'}
              </h4>
              <div className={styles.statValue}>{stats.avgSimilarity}%</div>
              <div className={styles.statTrend}>
                {stats.avgSimilarity < 20 && <span className={styles.trendGood}>Low risk</span>}
                {stats.avgSimilarity >= 20 && stats.avgSimilarity < 50 && (
                  <span className={styles.trendMedium}>Moderate</span>
                )}
                {stats.avgSimilarity >= 50 && <span className={styles.trendHigh}>High risk</span>}
              </div>
            </div>
          </div>

          {/* Average AI Score */}
          <div className={styles.statCard}>
            <div className={styles.statIcon}>🤖</div>
            <div className={styles.statContent}>
              <h4 className={styles.statLabel}>
                {t('analytics.avgAiScore') || 'Avg AI Likelihood'}
              </h4>
              <div className={styles.statValue}>{stats.avgAiScore}%</div>
            </div>
          </div>

          {/* Average Writing Quality */}
          <div className={styles.statCard}>
            <div className={styles.statIcon}>✍️</div>
            <div className={styles.statContent}>
              <h4 className={styles.statLabel}>
                {t('analytics.avgWritingQuality') || 'Avg Writing Quality'}
              </h4>
              <div className={styles.statValue}>{stats.avgWritingQuality}%</div>
            </div>
          </div>
        </div>

        {/* Risk Distribution */}
        <div className={styles.chartCard}>
          <h3 className={styles.chartTitle}>
            {t('analytics.riskDistribution') || 'Risk Distribution'}
          </h3>
          <div className={styles.riskBars}>
            <div className={styles.riskBar}>
              <div className={styles.riskLabel}>
                <span>{t('analytics.lowRisk') || 'Low Risk'}</span>
                <span className={styles.riskCount}>{stats.lowRiskCount}</span>
              </div>
              <div className={styles.barTrack}>
                <div
                  className={`${styles.barFill} ${styles.barLow}`}
                  style={{
                    width: `${(stats.lowRiskCount / stats.totalChecks) * 100}%`,
                  }}
                />
              </div>
            </div>
            <div className={styles.riskBar}>
              <div className={styles.riskLabel}>
                <span>{t('analytics.moderateRisk') || 'Moderate Risk'}</span>
                <span className={styles.riskCount}>
                  {stats.totalChecks - stats.lowRiskCount - stats.highRiskCount}
                </span>
              </div>
              <div className={styles.barTrack}>
                <div
                  className={`${styles.barFill} ${styles.barMedium}`}
                  style={{
                    width: `${
                      ((stats.totalChecks - stats.lowRiskCount - stats.highRiskCount) /
                        stats.totalChecks) *
                      100
                    }%`,
                  }}
                />
              </div>
            </div>
            <div className={styles.riskBar}>
              <div className={styles.riskLabel}>
                <span>{t('analytics.highRisk') || 'High Risk'}</span>
                <span className={styles.riskCount}>{stats.highRiskCount}</span>
              </div>
              <div className={styles.barTrack}>
                <div
                  className={`${styles.barFill} ${styles.barHigh}`}
                  style={{
                    width: `${(stats.highRiskCount / stats.totalChecks) * 100}%`,
                  }}
                />
              </div>
            </div>
          </div>
        </div>

        {/* Top Sources */}
        {stats.topSources.length > 0 && (
          <div className={styles.chartCard}>
            <h3 className={styles.chartTitle}>
              {t('analytics.topSources') || 'Top Matching Sources'}
            </h3>
            <div className={styles.sourcesList}>
              {stats.topSources.map((item, idx) => (
                <div key={idx} className={styles.sourceItem}>
                  <div className={styles.sourceRank}>{idx + 1}</div>
                  <div className={styles.sourceName}>{item.source}</div>
                  <div className={styles.sourceCount}>{item.count} matches</div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Recent Trend */}
        {stats.recentTrend.length > 0 && (
          <div className={styles.chartCard}>
            <h3 className={styles.chartTitle}>
              {t('analytics.recentTrend') || 'Recent Similarity Trend'}
            </h3>
            <div className={styles.trendChart}>
              {stats.recentTrend.map((item, idx) => (
                <div key={idx} className={styles.trendBar}>
                  <div
                    className={styles.trendBarFill}
                    style={{
                      height: `${item.similarity}%`,
                      background:
                        item.similarity < 20
                          ? 'var(--color-success)'
                          : item.similarity < 50
                          ? 'var(--color-warning)'
                          : 'var(--color-error)',
                    }}
                  />
                  <div className={styles.trendLabel}>{item.similarity}%</div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </section>
  );
}
