export interface Match {
  text: string;
  startIndex: number;
  endIndex: number;
  source: string;
  similarity: number;
}

export interface AICheckSignal {
  name: string;
  value: string;
  score: number;
}

export interface AICheckResult {
  status: 'ready' | 'insufficient';
  score: number;
  label: 'Low' | 'Moderate' | 'High';
  signals: AICheckSignal[];
  note?: string;
}

export interface WritingIssue {
  category: 'Grammar' | 'Vocabulary';
  message: string;
}

export interface WritingQualityResult {
  status: 'ready' | 'insufficient';
  overallScore: number;
  grammarScore: number;
  vocabularyScore: number;
  issues: WritingIssue[];
  note?: string;
}

export interface PlagiarismResult {
  similarity: number;
  matches: Match[];
  wordCount: number;
  charCount: number;
  aiCheck: AICheckResult;
  writingQuality: WritingQualityResult;
}

const SAMPLE_DOCUMENTS = [
  {
    id: 'academic-1',
    title: 'Introduction to Machine Learning',
    content: `Machine learning is a subset of artificial intelligence that enables systems to learn and improve from experience without being explicitly programmed. It focuses on developing algorithms that can access data and use it to learn patterns and make decisions. The field has gained tremendous popularity in recent years due to the abundance of data and increased computing power. Machine learning algorithms build mathematical models based on training data to make predictions or decisions without being specifically programmed to perform the task.`,
  },
  {
    id: 'academic-2',
    title: 'Climate Change and Its Impact',
    content: `Climate change refers to long-term shifts in global temperatures and weather patterns. Since the industrial revolution, human activities have been the main driver of climate change, primarily through burning fossil fuels which generates greenhouse gas emissions. These gases trap heat in the atmosphere, causing the planet to warm up. The impacts of climate change include rising sea levels, more extreme weather events, and changes in precipitation patterns. Addressing climate change requires immediate action to reduce greenhouse gas emissions and transition to renewable energy sources.`,
  },
  {
    id: 'academic-3',
    title: 'The History of the Internet',
    content: `The internet was originally developed as a military project in the 1960s by the United States Department of Defense. The initial concept was to create a decentralized communication network that could survive partial destruction. ARPANET, the first network to implement the TCP/IP protocol, connected universities and research institutions. Throughout the 1980s and 1990s, the network grew rapidly as more institutions connected. The invention of the World Wide Web in 1989 by Tim Berners-Lee revolutionized how people access and share information online. Today, the internet has become an essential part of modern life.`,
  },
  {
    id: 'creative-1',
    title: 'The Last Sunset',
    content: `The sun dipped below the horizon, painting the sky in shades of orange and pink. Maria stood at the edge of the cliff, watching the waves crash against the rocks below. She had come to this place every evening for the past year, ever since her grandmother passed away. The view was their special place, shared across many summers. The colors reminded her of the stories her grandmother used to tell about magical lands beyond the sea. As the last light faded, Maria smiled, feeling a connection to something eternal.`,
  },
  {
    id: 'creative-2',
    title: 'The Coffee Shop Mystery',
    content: `The coffee shop on Corner Street had been there for as long as anyone could remember. It was the kind of place where everyone knew each other's names and orders. One rainy Tuesday, a stranger walked in wearing a long coat and ordered the same black coffee every day for a week. The regulars whispered theories about who he might be - a detective, a writer, perhaps even a spy. But Sarah, the owner, had a theory of her own. She noticed he always sat at the same table, looking at the building across the street.`,
  },
  {
    id: 'technical-1',
    title: 'Getting Started with React',
    content: `React is a JavaScript library for building user interfaces. It was developed by Facebook and has become one of the most popular front-end frameworks. React uses a component-based architecture, allowing developers to create reusable UI components. Each component can maintain its own state and render based on that state. To get started with React, you'll need Node.js installed on your computer. Create a new project using create-react-app or Vite. Components can be written as functions that return JSX, a syntax extension that looks similar to HTML.`,
  },
  {
    id: 'technical-2',
    title: 'Understanding Python Lists',
    content: `Python lists are one of the most versatile data structures in the language. A list is an ordered collection of items that can be of any type. You can create a list by enclosing comma-separated values in square brackets. Lists are mutable, meaning you can add, remove, or modify elements after creation. Common operations include appending items, inserting at specific positions, and slicing to get portions of the list. List comprehensions provide a concise way to create new lists based on existing ones. Understanding lists is essential for any Python developer.`,
  },
  {
    id: 'general-1',
    title: 'Healthy Eating Habits',
    content: `Maintaining a healthy diet is essential for overall well-being. A balanced diet includes a variety of fruits, vegetables, whole grains, and lean proteins. Drinking plenty of water throughout the day helps keep the body hydrated and supports essential functions. Limiting processed foods and added sugars can reduce the risk of chronic diseases. Meal planning is a useful strategy for maintaining healthy eating habits. Taking time to eat slowly and mindfully can also improve digestion and satisfaction from meals.`,
  },
];

function generateNGrams(text: string, n: number): Set<string> {
  const words = text.toLowerCase().split(/\s+/).filter(w => w.length > 0);
  const ngrams = new Set<string>();
  
  for (let i = 0; i <= words.length - n; i++) {
    const ngram = words.slice(i, i + n).join(' ');
    if (ngram.trim().length > 0) {
      ngrams.add(ngram);
    }
  }
  
  return ngrams;
}

function generateMultiNGrams(text: string, sizes: number[]): Map<number, Set<string>> {
  const ngramsMap = new Map<number, Set<string>>();
  
  for (const size of sizes) {
    ngramsMap.set(size, generateNGrams(text, size));
  }
  
  return ngramsMap;
}

function clamp(value: number, min = 0, max = 1): number {
  return Math.min(max, Math.max(min, value));
}

function escapeRegex(value: string): string {
  return value.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
}

function getAiLabel(score: number): 'Low' | 'Moderate' | 'High' {
  if (score < 30) return 'Low';
  if (score < 60) return 'Moderate';
  return 'High';
}

function analyzeAIWriting(text: string): AICheckResult {
  const words = text.toLowerCase().match(/\b[\w']+\b/g) ?? [];
  const wordCount = words.length;
  const MIN_WORDS = 80;

  if (wordCount < MIN_WORDS) {
    return {
      status: 'insufficient',
      score: 0,
      label: 'Low',
      signals: [],
      note: `Add at least ${MIN_WORDS} words for AI detection.`,
    };
  }

  const sentences = text
    .replace(/\s+/g, ' ')
    .split(/[.!?]+/)
    .map(sentence => sentence.trim())
    .filter(Boolean);

  const sentenceLengths = sentences
    .map(sentence => sentence.split(/\s+/).filter(Boolean).length)
    .filter(length => length > 0);

  const meanLength = sentenceLengths.length
    ? sentenceLengths.reduce((sum, length) => sum + length, 0) / sentenceLengths.length
    : 0;
  const variance = sentenceLengths.length
    ? sentenceLengths.reduce((sum, length) => sum + Math.pow(length - meanLength, 2), 0) / sentenceLengths.length
    : 0;
  const stdDev = Math.sqrt(variance);
  const coefficientOfVariation = meanLength > 0 ? stdDev / meanLength : 0;
  const uniformityScore = 1 - clamp(coefficientOfVariation / 0.7);

  const bigramTotal = Math.max(words.length - 1, 0);
  const bigramCounts = new Map<string, number>();
  for (let i = 0; i < words.length - 1; i++) {
    const bigram = `${words[i]} ${words[i + 1]}`;
    bigramCounts.set(bigram, (bigramCounts.get(bigram) ?? 0) + 1);
  }
  let duplicateBigrams = 0;
  for (const count of bigramCounts.values()) {
    if (count > 1) {
      duplicateBigrams += count - 1;
    }
  }
  const duplicateRatio = bigramTotal > 0 ? duplicateBigrams / bigramTotal : 0;
  const repetitionScore = clamp(duplicateRatio / 0.2);

  const transitionPhrases = [
    'in conclusion',
    'moreover',
    'furthermore',
    'in addition',
    'as a result',
    'overall',
    'in summary',
    'on the other hand',
    'for example',
    'for instance',
    'in contrast',
    'as well as',
  ];
  const lowerText = text.toLowerCase();
  let transitionHits = 0;
  for (const phrase of transitionPhrases) {
    const regex = new RegExp(`\\b${escapeRegex(phrase)}\\b`, 'g');
    const matches = lowerText.match(regex);
    if (matches) {
      transitionHits += matches.length;
    }
  }
  const transitionsPer100Words = (transitionHits / wordCount) * 100;
  const transitionScore = clamp(transitionsPer100Words / 4);

  const uniqueWords = new Set(words).size;
  const diversityRatio = wordCount > 0 ? uniqueWords / wordCount : 0;
  const diversityScore = 1 - clamp((diversityRatio - 0.35) / 0.4);

  const rawScore =
    0.32 * uniformityScore +
    0.28 * repetitionScore +
    0.25 * diversityScore +
    0.15 * transitionScore;
  const score = Math.round(clamp(rawScore) * 1000) / 10;

  const signals: AICheckSignal[] = [
    {
      name: 'Sentence uniformity',
      value: `${Math.round(uniformityScore * 100)}%`,
      score: Math.round(uniformityScore * 100),
    },
    {
      name: 'Repetition signal',
      value: `${Math.round(repetitionScore * 100)}%`,
      score: Math.round(repetitionScore * 100),
    },
    {
      name: 'Transition phrases',
      value: `${Math.round(transitionScore * 100)}%`,
      score: Math.round(transitionScore * 100),
    },
  ];

  return {
    status: 'ready',
    score,
    label: getAiLabel(score),
    signals,
  };
}

function analyzeWritingQuality(text: string): WritingQualityResult {
  const words = text.toLowerCase().match(/\b[\w']+\b/g) ?? [];
  const wordCount = words.length;
  const MIN_WORDS = 30;

  if (wordCount < MIN_WORDS) {
    return {
      status: 'insufficient',
      overallScore: 0,
      grammarScore: 0,
      vocabularyScore: 0,
      issues: [],
      note: `Add at least ${MIN_WORDS} words for grammar and vocabulary analysis.`,
    };
  }

  const sentences = text
    .replace(/\s+/g, ' ')
    .split(/[.!?]+/)
    .map(sentence => sentence.trim())
    .filter(Boolean);
  const sentenceLengths = sentences.map(sentence => sentence.split(/\s+/).filter(Boolean).length);
  const avgSentenceLength = sentenceLengths.length
    ? sentenceLengths.reduce((sum, length) => sum + length, 0) / sentenceLengths.length
    : 0;
  const longSentenceCount = sentenceLengths.filter(length => length > 30).length;

  const repeatedWordMatches = text.toLowerCase().match(/\b(\w+)\s+\1\b/g) ?? [];
  const repeatedWordCount = repeatedWordMatches.length;
  const endsWithPunctuation = /[.!?]\s*$/.test(text.trim());

  let grammarScore = 100;
  grammarScore -= Math.min(30, repeatedWordCount * 3);
  grammarScore -= Math.min(20, longSentenceCount * 4);
  if (!endsWithPunctuation && wordCount > 20) {
    grammarScore -= 10;
  }
  grammarScore = Math.round(clamp(grammarScore / 100) * 1000) / 10;

  const uniqueWords = new Set(words).size;
  const uniqueRatio = wordCount > 0 ? uniqueWords / wordCount : 0;
  const avgWordLength = wordCount > 0
    ? words.reduce((sum, word) => sum + word.length, 0) / wordCount
    : 0;
  const diversityScore = clamp((uniqueRatio - 0.25) / 0.5) * 100;
  const lengthScore = clamp((avgWordLength - 3.5) / 3.5) * 100;
  const vocabularyScore = Math.round((0.7 * diversityScore + 0.3 * lengthScore) * 10) / 10;

  const overallScore = Math.round(((grammarScore + vocabularyScore) / 2) * 10) / 10;

  const issues: WritingIssue[] = [];
  if (repeatedWordCount > 0) {
    issues.push({
      category: 'Grammar',
      message: `Repeated words detected (${repeatedWordCount}).`,
    });
  }
  if (longSentenceCount > 0) {
    issues.push({
      category: 'Grammar',
      message: `Long sentences found (${longSentenceCount}). Consider splitting them.`,
    });
  }
  if (!endsWithPunctuation && wordCount > 20) {
    issues.push({
      category: 'Grammar',
      message: 'Some sentences may be missing ending punctuation.',
    });
  }
  if (uniqueRatio < 0.35) {
    issues.push({
      category: 'Vocabulary',
      message: 'Vocabulary variety could be improved.',
    });
  }
  if (avgWordLength < 4) {
    issues.push({
      category: 'Vocabulary',
      message: 'Consider using more precise word choices for clarity.',
    });
  }

  return {
    status: 'ready',
    overallScore,
    grammarScore,
    vocabularyScore,
    issues,
  };
}

function calculateSimilarity(ngrams1: Set<string>, ngrams2: Set<string>): number {
  if (ngrams1.size === 0 || ngrams2.size === 0) return 0;
  
  let intersection = 0;
  for (const ngram of ngrams1) {
    if (ngrams2.has(ngram)) {
      intersection++;
    }
  }
  
  const union = ngrams1.size + ngrams2.size - intersection;
  return (intersection / union) * 100;
}

function findMatches(inputText: string, docContent: string, threshold: number): Match[] {
  const matches: Match[] = [];
  const inputWords = inputText.toLowerCase().split(/\s+/).filter(w => w.length > 0);
  const docWords = docContent.toLowerCase().split(/\s+/).filter(w => w.length > 0);
  
  const trigramSize = 3;
  
  for (let i = 0; i <= inputWords.length - trigramSize; i++) {
    const inputTrigram = inputWords.slice(i, i + trigramSize).join(' ');
    
    for (let j = 0; j <= docWords.length - trigramSize; j++) {
      const docTrigram = docWords.slice(j, j + trigramSize).join(' ');
      
      if (inputTrigram === docTrigram) {
        const startIndex = inputWords.slice(0, i).join(' ').length + (i > 0 ? 1 : 0);
        const endIndex = inputWords.slice(0, i + trigramSize).join(' ').length;
        
        const existingMatch = matches.find(
          m => m.startIndex <= startIndex && m.endIndex >= startIndex
        );
        
        if (!existingMatch) {
          matches.push({
            text: inputWords.slice(i, i + trigramSize).join(' '),
            startIndex,
            endIndex,
            source: '',
            similarity: 100,
          });
        }
      }
    }
  }
  
  return matches;
}

export function checkPlagiarism(text: string, includeCustomDocs: boolean = true): PlagiarismResult {
  const MIN_LENGTH = 50;
  const MAX_LENGTH = 10000;
  const NGRAM_SIZES = [2, 3, 4]; // Use bi-grams, tri-grams, and 4-grams
  const SIMILARITY_THRESHOLD = 60;
  
  if (text.length < MIN_LENGTH) {
    return {
      similarity: 0,
      matches: [],
      wordCount: 0,
      charCount: text.length,
      aiCheck: analyzeAIWriting(text),
      writingQuality: analyzeWritingQuality(text),
    };
  }
  
  const truncatedText = text.length > MAX_LENGTH ? text.substring(0, MAX_LENGTH) : text;
  
  // Combine sample documents with custom documents
  let allDocuments = [...SAMPLE_DOCUMENTS];
  if (includeCustomDocs && typeof window !== 'undefined') {
    try {
      const customDocs = localStorage.getItem('custom-documents');
      if (customDocs) {
        const parsed = JSON.parse(customDocs);
        allDocuments = [...allDocuments, ...parsed];
      }
    } catch (error) {
      console.error('Failed to load custom documents:', error);
    }
  }
  
  // Generate multi n-grams for better detection
  const inputNGramsMap = generateMultiNGrams(truncatedText, NGRAM_SIZES);
  let totalSimilarity = 0;
  let maxSimilarity = 0;
  const allMatches: Match[] = [];
  
  for (const doc of allDocuments) {
    const docNGramsMap = generateMultiNGrams(doc.content, NGRAM_SIZES);
    
    // Calculate weighted similarity across different n-gram sizes
    let weightedSimilarity = 0;
    const weights = [0.2, 0.5, 0.3]; // Weights for bi-gram, tri-gram, 4-gram
    
    NGRAM_SIZES.forEach((size, index) => {
      const inputNGrams = inputNGramsMap.get(size)!;
      const docNGrams = docNGramsMap.get(size)!;
      const similarity = calculateSimilarity(inputNGrams, docNGrams);
      weightedSimilarity += similarity * weights[index];
    });
    
    if (weightedSimilarity > maxSimilarity) {
      maxSimilarity = weightedSimilarity;
    }
    
    totalSimilarity += weightedSimilarity;
    
    if (weightedSimilarity >= SIMILARITY_THRESHOLD) {
      const matches = findMatches(truncatedText, doc.content, SIMILARITY_THRESHOLD);
      matches.forEach(m => {
        m.source = doc.title;
      });
      allMatches.push(...matches);
    }
  }
  
  const avgSimilarity = allDocuments.length > 0 
    ? totalSimilarity / allDocuments.length 
    : 0;
  
  const finalSimilarity = Math.max(maxSimilarity, avgSimilarity);
  
  const words = truncatedText.split(/\s+/).filter(w => w.length > 0);
  
  return {
    similarity: Math.round(finalSimilarity * 10) / 10,
    matches: allMatches,
    wordCount: words.length,
    charCount: truncatedText.length,
    aiCheck: analyzeAIWriting(truncatedText),
    writingQuality: analyzeWritingQuality(truncatedText),
  };
}

export function getSampleDocuments() {
  return SAMPLE_DOCUMENTS;
}
