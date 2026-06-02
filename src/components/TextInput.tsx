'use client';

import { useState, useRef, useEffect } from 'react';
import * as mammoth from 'mammoth/mammoth.browser';
import { useLanguage } from '@/contexts/LanguageContext';
import styles from './TextInput.module.css';

interface TextInputProps {
  onCheck: (text: string) => void;
  isChecking: boolean;
  initialText?: string;
  onRealtimeChange?: (text: string) => void;
  realtimeEnabled?: boolean;
}

const SAMPLE_TEXT = `Machine learning is a subset of artificial intelligence that enables systems to learn and improve from experience without being explicitly programmed. The field has gained tremendous popularity in recent years due to the abundance of data and increased computing power.`;

export default function TextInput({ 
  onCheck, 
  isChecking, 
  initialText,
  onRealtimeChange,
  realtimeEnabled = false 
}: TextInputProps) {
  const { t } = useLanguage();
  const [text, setText] = useState(initialText || '');
  const [error, setError] = useState('');
  const [fileName, setFileName] = useState('');
  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const debounceTimerRef = useRef<NodeJS.Timeout | null>(null);
  const allowedTypes = ['.txt', '.doc', '.docx', '.pdf'];

  useEffect(() => {
    if (initialText) {
      setText(initialText);
    }
  }, [initialText]);

  useEffect(() => {
    if (textareaRef.current) {
      textareaRef.current.focus();
    }
  }, []);

  useEffect(() => {
    if (realtimeEnabled && onRealtimeChange && text.length >= 50) {
      if (debounceTimerRef.current) {
        clearTimeout(debounceTimerRef.current);
      }
      
      debounceTimerRef.current = setTimeout(() => {
        onRealtimeChange(text);
      }, 1500); // 1.5 second debounce
    }

    return () => {
      if (debounceTimerRef.current) {
        clearTimeout(debounceTimerRef.current);
      }
    };
  }, [text, realtimeEnabled, onRealtimeChange]);

  const handleTextChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    const value = e.target.value;
    setText(value);
    setError('');
    setFileName('');
  };

  const extractTextFromFile = async (file: File, extension: string) => {
    if (extension === '.txt') {
      return file.text();
    }
    if (extension === '.docx') {
      const arrayBuffer = await file.arrayBuffer();
      const result = await mammoth.extractRawText({ arrayBuffer });
      return result.value;
    }
    if (extension === '.doc') {
      throw new Error('DOC files are not supported yet. Please convert to DOCX.');
    }
    if (extension === '.pdf') {
      throw new Error('PDF parsing is not supported yet. Please paste text instead.');
    }
    throw new Error('Please upload a .txt, .docx, or .pdf file');
  };

  const handleFile = async (file: File) => {
    const extension = file.name.substring(file.name.lastIndexOf('.')).toLowerCase();
    
    if (!allowedTypes.includes(extension)) {
      setError('Please upload a .txt, .docx, or .pdf file');
      return;
    }

    if (file.size > 5 * 1024 * 1024) {
      setError('File size must be less than 5MB');
      return;
    }

    try {
      const fileText = await extractTextFromFile(file, extension);
      if (!fileText.trim()) {
        setError('No readable text found in this file. Please paste the text instead.');
        return;
      }
      setText(fileText);
      setFileName(file.name);
      setError('');
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to read file. Please try again.');
    }
  };

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    await handleFile(file);

    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  const handleDrop = async (e: React.DragEvent<HTMLTextAreaElement>) => {
    e.preventDefault();
    const file = e.dataTransfer.files?.[0];
    if (!file) return;
    await handleFile(file);
  };

  const handleCheck = () => {
    if (!text.trim()) {
      setError(t('input.errorEmpty'));
      return;
    }
    if (text.length < 50) {
      setError(t('input.errorShort'));
      return;
    }
    onCheck(text);
  };

  const handleClear = () => {
    setText('');
    setError('');
    setFileName('');
    textareaRef.current?.focus();
  };

  const handleLoadSample = () => {
    setText(SAMPLE_TEXT);
    setError('');
    setFileName('');
  };

  const wordCount = text.trim() ? text.trim().split(/\s+/).length : 0;
  const charCount = text.length;

  return (
    <section className={styles.section}>
      <div className={styles.container}>
        <div className={styles.header}>
          <h2 className={styles.title}>{t('input.title')}</h2>
          <p className={styles.description}>
            {t('input.description')}
          </p>
        </div>

        <div className={styles.uploadSection}>
          <label className={styles.uploadLabel}>
            <input
              ref={fileInputRef}
              type="file"
              accept=".txt,.doc,.docx,.pdf"
              onChange={handleFileChange}
              className={styles.fileInput}
              disabled={isChecking}
            />
            <span className={styles.uploadBtn}>
              <span>📁</span> {t('input.upload')}
            </span>
          </label>
          <span className={styles.uploadHint}>
            {t('input.uploadHint')}
          </span>
        </div>
        
        <div className={styles.inputWrapper}>
          {fileName && (
            <div className={styles.fileBadge}>
              <span>📄</span> {fileName}
              <button 
                type="button" 
                className={styles.removeFile}
                onClick={() => { setText(''); setFileName(''); }}
              >
                ×
              </button>
            </div>
          )}
          <textarea
            ref={textareaRef}
            value={text}
            onChange={handleTextChange}
            onDrop={handleDrop}
            onDragOver={(e) => e.preventDefault()}
            placeholder={t('input.placeholder')}
            className={styles.textarea}
            disabled={isChecking}
          />
          <div className={styles.stats}>
            <span>{charCount} {t('input.characters')}</span>
            <span>•</span>
            <span>{wordCount} {t('input.words')}</span>
          </div>
        </div>

        {error && (
          <div className={styles.error}>
            <span>⚠</span> {error}
          </div>
        )}

        <div className={styles.actions}>
          <button 
            className={styles.primaryBtn} 
            onClick={handleCheck}
            disabled={isChecking || !text.trim()}
          >
            {isChecking ? (
              <>
                <span className={styles.spinner}></span>
                {t('input.checking')}
              </>
            ) : (
              <>
                <span>🔍</span>
                {t('input.checkButton')}
              </>
            )}
          </button>
          <button 
            className={styles.secondaryBtn} 
            onClick={handleClear}
            disabled={isChecking || !text.trim()}
          >
            <span>🗑</span>
            {t('input.clear')}
          </button>
          <button 
            className={styles.secondaryBtn} 
            onClick={handleLoadSample}
            disabled={isChecking}
          >
            <span>📄</span>
            {t('input.loadSample')}
          </button>
        </div>
      </div>
    </section>
  );
}
