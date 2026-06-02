'use client';

import { useState, useRef } from 'react';
import Header from '@/components/Header';
import Hero from '@/components/Hero';
import TextInput from '@/components/TextInput';
import Results from '@/components/Results';
import HowItWorks from '@/components/HowItWorks';
import History from '@/components/History';
import Footer from '@/components/Footer';
import { checkPlagiarism, PlagiarismResult } from '@/lib/plagiarism';
import { useHistory } from '@/contexts/HistoryContext';

export default function Home() {
  const [result, setResult] = useState<PlagiarismResult | null>(null);
  const [originalText, setOriginalText] = useState('');
  const [isChecking, setIsChecking] = useState(false);
  const resultsRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLDivElement>(null);
  const { addToHistory } = useHistory();

  const handleStartCheck = () => {
    const inputSection = document.getElementById('text-input');
    if (inputSection) {
      inputSection.scrollIntoView({ behavior: 'smooth' });
    }
  };

  const handleCheck = (text: string) => {
    setIsChecking(true);
    setOriginalText(text);
    
    setTimeout(() => {
      const plagiarismResult = checkPlagiarism(text);
      setResult(plagiarismResult);
      addToHistory(text, plagiarismResult);
      setIsChecking(false);
      
      setTimeout(() => {
        if (resultsRef.current) {
          resultsRef.current.scrollIntoView({ behavior: 'smooth' });
        }
      }, 100);
    }, 500);
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
          <TextInput onCheck={handleCheck} isChecking={isChecking} initialText={originalText} />
        </div>
        
        {result && (
          <div ref={resultsRef}>
            <Results result={result} originalText={originalText} />
          </div>
        )}
        
        <History onLoadFromHistory={handleLoadFromHistory} />
        
        <HowItWorks />
      </main>
      <Footer />
    </>
  );
}