import { PlagiarismResult } from '../plagiarism';

export function exportToJSON(result: PlagiarismResult, originalText: string): void {
  const data = {
    timestamp: new Date().toISOString(),
    text: originalText,
    result: {
      similarity: result.similarity,
      wordCount: result.wordCount,
      charCount: result.charCount,
      matches: result.matches.map(m => ({
        text: m.text,
        source: m.source,
        similarity: m.similarity,
      })),
      aiCheck: result.aiCheck,
      writingQuality: result.writingQuality,
    },
  };

  const jsonString = JSON.stringify(data, null, 2);
  const blob = new Blob([jsonString], { type: 'application/json' });
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.href = url;
  link.download = `plagiarism-report-${Date.now()}.json`;
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  URL.revokeObjectURL(url);
}

export function exportToPDF(result: PlagiarismResult, originalText: string): void {
  // Escape HTML to prevent XSS
  const escapeHtml = (text: string): string => {
    const div = document.createElement('div');
    div.textContent = text;
    return div.innerHTML;
  };

  const getSimilarityLabel = (similarity: number) => {
    if (similarity < 20) return 'Low';
    if (similarity < 50) return 'Moderate';
    return 'High';
  };

  const getQualityLabel = (score: number) => {
    if (score >= 80) return 'Strong';
    if (score >= 50) return 'Moderate';
    return 'Needs Work';
  };

  const escapedText = escapeHtml(originalText.substring(0, 1000)) + (originalText.length > 1000 ? '...' : '');

  const html = `
<!DOCTYPE html>
<html>
<head>
  <meta charset="UTF-8">
  <title>Plagiarism Check Report</title>
  <style>
    * {
      margin: 0;
      padding: 0;
      box-sizing: border-box;
    }
    body {
      font-family: 'Arial', sans-serif;
      padding: 40px;
      max-width: 800px;
      margin: 0 auto;
      background: white;
      color: #1a1a1a;
    }
    .header {
      border-bottom: 3px solid #e94560;
      padding-bottom: 20px;
      margin-bottom: 30px;
    }
    h1 {
      color: #e94560;
      font-size: 28px;
      margin-bottom: 10px;
    }
    .date {
      color: #666;
      font-size: 14px;
    }
    .section {
      margin-bottom: 30px;
      padding: 20px;
      background: #f9f9f9;
      border-radius: 8px;
    }
    h2 {
      color: #1a1a2e;
      font-size: 20px;
      margin-bottom: 15px;
      border-bottom: 2px solid #e94560;
      padding-bottom: 10px;
    }
    .metric {
      display: flex;
      justify-content: space-between;
      margin-bottom: 10px;
      padding: 10px;
      background: white;
      border-radius: 4px;
    }
    .metric-label {
      font-weight: bold;
      color: #333;
    }
    .metric-value {
      color: #666;
    }
    .high-risk {
      color: #ef4444;
      font-weight: bold;
    }
    .moderate-risk {
      color: #fbbf24;
      font-weight: bold;
    }
    .low-risk {
      color: #4ade80;
      font-weight: bold;
    }
    .matches {
      margin-top: 20px;
    }
    .match-item {
      padding: 12px;
      background: white;
      margin-bottom: 10px;
      border-left: 4px solid #e94560;
      border-radius: 4px;
    }
    .match-text {
      font-style: italic;
      margin-bottom: 5px;
    }
    .match-source {
      font-size: 12px;
      color: #666;
    }
    .text-preview {
      padding: 15px;
      background: white;
      border-left: 4px solid #16213e;
      margin-top: 15px;
      font-size: 14px;
      line-height: 1.6;
      max-height: 400px;
      overflow: hidden;
    }
    .footer {
      margin-top: 40px;
      padding-top: 20px;
      border-top: 2px solid #eee;
      text-align: center;
      color: #999;
      font-size: 12px;
    }
    @media print {
      body {
        padding: 20px;
      }
    }
  </style>
</head>
<body>
  <div class="header">
    <h1>Plagiarism Check Report</h1>
    <p class="date">Generated: ${new Date().toLocaleString()}</p>
  </div>

  <div class="section">
    <h2>Plagiarism Analysis</h2>
    <div class="metric">
      <span class="metric-label">Similarity Score:</span>
      <span class="metric-value ${
        result.similarity >= 50 ? 'high-risk' : result.similarity >= 20 ? 'moderate-risk' : 'low-risk'
      }">${result.similarity}% (${getSimilarityLabel(result.similarity)})</span>
    </div>
    <div class="metric">
      <span class="metric-label">Word Count:</span>
      <span class="metric-value">${result.wordCount}</span>
    </div>
    <div class="metric">
      <span class="metric-label">Character Count:</span>
      <span class="metric-value">${result.charCount}</span>
    </div>
    <div class="metric">
      <span class="metric-label">Matches Found:</span>
      <span class="metric-value">${result.matches.length}</span>
    </div>
  </div>

  <div class="section">
    <h2>AI Writing Detection</h2>
    <div class="metric">
      <span class="metric-label">AI Likelihood Score:</span>
      <span class="metric-value ${
        result.aiCheck.status === 'ready'
          ? result.aiCheck.score >= 60
            ? 'high-risk'
            : result.aiCheck.score >= 30
            ? 'moderate-risk'
            : 'low-risk'
          : ''
      }">${
    result.aiCheck.status === 'ready'
      ? `${result.aiCheck.score}% (${result.aiCheck.label})`
      : result.aiCheck.note || 'Insufficient text'
  }</span>
    </div>
    ${
      result.aiCheck.status === 'ready'
        ? `
    <div class="metric">
      <span class="metric-label">Sentence Uniformity:</span>
      <span class="metric-value">${result.aiCheck.signals[0]?.value || 'N/A'}</span>
    </div>
    <div class="metric">
      <span class="metric-label">Repetition Signal:</span>
      <span class="metric-value">${result.aiCheck.signals[1]?.value || 'N/A'}</span>
    </div>
    <div class="metric">
      <span class="metric-label">Transition Phrases:</span>
      <span class="metric-value">${result.aiCheck.signals[2]?.value || 'N/A'}</span>
    </div>
    `
        : ''
    }
  </div>

  <div class="section">
    <h2>Writing Quality</h2>
    <div class="metric">
      <span class="metric-label">Overall Score:</span>
      <span class="metric-value ${
        result.writingQuality.status === 'ready'
          ? result.writingQuality.overallScore >= 80
            ? 'low-risk'
            : result.writingQuality.overallScore >= 50
            ? 'moderate-risk'
            : 'high-risk'
          : ''
      }">${
    result.writingQuality.status === 'ready'
      ? `${result.writingQuality.overallScore}% (${getQualityLabel(result.writingQuality.overallScore)})`
      : result.writingQuality.note || 'Insufficient text'
  }</span>
    </div>
    ${
      result.writingQuality.status === 'ready'
        ? `
    <div class="metric">
      <span class="metric-label">Grammar Score:</span>
      <span class="metric-value">${result.writingQuality.grammarScore}%</span>
    </div>
    <div class="metric">
      <span class="metric-label">Vocabulary Score:</span>
      <span class="metric-value">${result.writingQuality.vocabularyScore}%</span>
    </div>
    `
        : ''
    }
    ${
      result.writingQuality.status === 'ready' && result.writingQuality.issues.length > 0
        ? `
    <div style="margin-top: 15px;">
      <strong>Issues Found:</strong>
      ${result.writingQuality.issues
        .map(
          issue => `
        <div style="padding: 8px; background: white; margin-top: 5px; border-radius: 4px;">
          <span style="color: #e94560; font-weight: bold;">${issue.category}:</span> ${issue.message}
        </div>
      `
        )
        .join('')}
    </div>
    `
        : ''
    }
  </div>

  ${
    result.matches.length > 0
      ? `
  <div class="section matches">
    <h2>Detected Matches (${result.matches.length})</h2>
    ${result.matches
      .slice(0, 10)
      .map(
        match => `
      <div class="match-item">
        <div class="match-text">"${match.text}"</div>
        <div class="match-source">Source: ${match.source}</div>
      </div>
    `
      )
      .join('')}
    ${result.matches.length > 10 ? `<p style="text-align: center; color: #666; margin-top: 10px;">... and ${result.matches.length - 10} more matches</p>` : ''}
  </div>
  `
      : `
  <div class="section">
    <h2>Matches</h2>
    <p style="text-align: center; color: #4ade80; font-weight: bold;">✓ No matches found - text appears original</p>
  </div>
  `
  }

  <div class="section">
    <h2>Text Preview</h2>
    <div class="text-preview">
      ${escapedText}
    </div>
  </div>

  <div class="footer">
    <p>Generated by Plagiarism Checker Tool</p>
    <p>This is an automated report. Results are for reference only.</p>
  </div>
</body>
</html>
  `;

  const printWindow = window.open('', '_blank');
  if (printWindow) {
    printWindow.document.write(html);
    printWindow.document.close();
    printWindow.focus();
    setTimeout(() => {
      printWindow.print();
    }, 250);
  }
}

export function exportToText(result: PlagiarismResult, originalText: string): void {
  const getSimilarityLabel = (similarity: number) => {
    if (similarity < 20) return 'Low';
    if (similarity < 50) return 'Moderate';
    return 'High';
  };

  const getQualityLabel = (score: number) => {
    if (score >= 80) return 'Strong';
    if (score >= 50) return 'Moderate';
    return 'Needs Work';
  };

  const report = `
PLAGIARISM CHECK REPORT
========================
Generated: ${new Date().toLocaleString()}

PLAGIARISM ANALYSIS
-------------------
Similarity Score: ${result.similarity}%
Risk Level: ${getSimilarityLabel(result.similarity)}
Word Count: ${result.wordCount}
Character Count: ${result.charCount}
Matches Found: ${result.matches.length}

AI WRITING DETECTION
--------------------
AI Likelihood: ${
    result.aiCheck.status === 'ready'
      ? `${result.aiCheck.score}% (${result.aiCheck.label})`
      : result.aiCheck.note || 'Insufficient text'
  }
${
  result.aiCheck.status === 'ready'
    ? `Sentence Uniformity: ${result.aiCheck.signals[0]?.value || 'N/A'}
Repetition Signal: ${result.aiCheck.signals[1]?.value || 'N/A'}
Transition Phrases: ${result.aiCheck.signals[2]?.value || 'N/A'}`
    : ''
}

WRITING QUALITY
---------------
Overall Score: ${
    result.writingQuality.status === 'ready'
      ? `${result.writingQuality.overallScore}% (${getQualityLabel(result.writingQuality.overallScore)})`
      : result.writingQuality.note || 'Insufficient text'
  }
${
  result.writingQuality.status === 'ready'
    ? `Grammar Score: ${result.writingQuality.grammarScore}%
Vocabulary Score: ${result.writingQuality.vocabularyScore}%`
    : ''
}
${
  result.writingQuality.status === 'ready' && result.writingQuality.issues.length > 0
    ? `
Issues Found:
${result.writingQuality.issues.map(issue => `- ${issue.category}: ${issue.message}`).join('\n')}`
    : ''
}

${
  result.matches.length > 0
    ? `DETECTED MATCHES (${result.matches.length})
${'-'.repeat(50)}
${result.matches
  .slice(0, 10)
  .map((match, index) => `${index + 1}. "${match.text}"\n   Source: ${match.source}`)
  .join('\n\n')}
${result.matches.length > 10 ? `\n... and ${result.matches.length - 10} more matches` : ''}`
    : `MATCHES
-------
✓ No matches found - text appears original`
}

TEXT PREVIEW
------------
${originalText.substring(0, 500)}${originalText.length > 500 ? '...' : ''}

---
This is an automated report. Results are for reference only.
Generated by Plagiarism Checker Tool
  `.trim();

  const blob = new Blob([report], { type: 'text/plain' });
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.href = url;
  link.download = `plagiarism-report-${Date.now()}.txt`;
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  URL.revokeObjectURL(url);
}
