'use client';

import { useState, useRef } from 'react';
import Header from '@/components/Header';
import Hero from '@/components/Hero';
import TextInput from '@/components/TextInput';
import Results from '@/components/Results';
import ComparisonView from '@/components/ComparisonView';
import HowItWorks from '@/components/HowItWorks';
import History from '@/components/History';
import Analytics from '@/components/Analytics';
import Footer from '@/components/Footer';
import { checkPlagiarism, PlagiarismResult } from '@/lib/plagiarism';
import { useHistory } from '@/contexts/HistoryContext';

export default function Home() {
  const [result, setResult] = useState<PlagiarismResult | null>(null);
  const [originalText, setOriginalText] = useState('');
  const [isChecking, setIsChecking] = useState(false);
  const [showComparison, setShowComparison] = useState(false);
  const [realtimeEnabled, setRealtimeEnabled] = useState(false);
  const resultsRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLDivElement>(null);
  const { addToHistory } = useHistory();

  const handleStartCheck = () => {
    const inputSection = document.getElementById('text-input');
    if (inputSection) {
      inputSection.scrollIntoView({ behavior: 'smooth' });
    }
  };

  const performCheck = (text: string) => {
    const plagiarismResult = checkPlagiarism(text);
    setResult(plagiarismResult);
    return plagiarismResult;
  };

  const handleCheck = (text: string) => {
    setIsChecking(true);
    setOriginalText(text);
    
    setTimeout(() => {
      const plagiarismResult = performCheck(text);
      addToHistory(text, plagiarismResult);
      setIsChecking(false);
      
      setTimeout(() => {
        if (resultsRef.current) {
          resultsRef.current.scrollIntoView({ behavior: 'smooth' });
        }
      }, 100);
    }, 500);
  };

  const handleRealtimeChange = (text: string) => {
    if (text.length >= 50) {
      setOriginalText(text);
      const plagiarismResult = performCheck(text);
      setResult(plagiarismResult);
    }
  };

  const handleLoadFromHistory = (text: string) => {
    setOriginalText(text);
    if (inputRef.current) {
      inputRef.current.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <>
      <Header />
      <main>
        <Hero onStartCheck={handleStartCheck} />
        
        <div id="text-input" ref={inputRef}>
          <TextInput 
            onCheck={handleCheck} 
            isChecking={isChecking} 
            initialText={originalText}
            onRealtimeChange={handleRealtimeChange}
            realtimeEnabled={realtimeEnabled}
          />
        </div>
        
        {result && (
          <div ref={resultsRef}>
            <Results result={result} originalText={originalText} />
            
            {result.matches.length > 0 && (
              <div style={{ textAlign: 'center', margin: '2rem 0' }}>
                <button
                  onClick={() => setShowComparison(!showComparison)}
                  style={{
                    padding: '0.75rem 2rem',
                    fontSize: '1rem',
                    fontWeight: '600',
                    color: 'white',
                    background: 'var(--color-accent)',
                    border: 'none',
                    borderRadius: '0.5rem',
                    cursor: 'pointer',
                    transition: 'all 0.3s ease',
                  }}
                >
                  {showComparison ? '✕ Hide Comparison' : '⚡ Show Side-by-Side Comparison'}
                </button>
              </div>
            )}
            
            {showComparison && result.matches.length > 0 && (
              <ComparisonView result={result} originalText={originalText} />
            )}
          </div>
        )}
        
        <History onLoadFromHistory={handleLoadFromHistory} />
        
        <Analytics />
        
        <HowItWorks />
      </main>
      <Footer />
    </>
  );
}