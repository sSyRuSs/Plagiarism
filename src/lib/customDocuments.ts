export interface CustomDocument {
  id: string;
  title: string;
  content: string;
  category: string;
  dateAdded: number;
}

const STORAGE_KEY = 'custom-documents';
const MAX_DOCUMENTS = 20;

export function getCustomDocuments(): CustomDocument[] {
  try {
    const saved = localStorage.getItem(STORAGE_KEY);
    if (saved) {
      return JSON.parse(saved);
    }
  } catch (error) {
    console.error('Failed to load custom documents:', error);
  }
  return [];
}

export function addCustomDocument(document: Omit<CustomDocument, 'id' | 'dateAdded'>): CustomDocument {
  const customDocs = getCustomDocuments();
  
  const newDoc: CustomDocument = {
    ...document,
    id: `${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
    dateAdded: Date.now(),
  };
  
  const updated = [newDoc, ...customDocs].slice(0, MAX_DOCUMENTS);
  
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(updated));
  } catch (error) {
    console.error('Failed to save custom document:', error);
  }
  
  return newDoc;
}

export function deleteCustomDocument(id: string): void {
  const customDocs = getCustomDocuments();
  const updated = customDocs.filter(doc => doc.id !== id);
  
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(updated));
  } catch (error) {
    console.error('Failed to delete custom document:', error);
  }
}

export function clearCustomDocuments(): void {
  try {
    localStorage.removeItem(STORAGE_KEY);
  } catch (error) {
    console.error('Failed to clear custom documents:', error);
  }
}

export function exportCustomDocuments(): void {
  const docs = getCustomDocuments();
  const jsonString = JSON.stringify(docs, null, 2);
  const blob = new Blob([jsonString], { type: 'application/json' });
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.href = url;
  link.download = `custom-documents-${Date.now()}.json`;
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  URL.revokeObjectURL(url);
}

export function importCustomDocuments(file: File): Promise<number> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    
    reader.onload = (e) => {
      try {
        const content = e.target?.result as string;
        const imported: CustomDocument[] = JSON.parse(content);
        
        if (!Array.isArray(imported)) {
          reject(new Error('Invalid file format'));
          return;
        }
        
        const currentDocs = getCustomDocuments();
        const combined = [...imported, ...currentDocs].slice(0, MAX_DOCUMENTS);
        
        localStorage.setItem(STORAGE_KEY, JSON.stringify(combined));
        resolve(imported.length);
      } catch (error) {
        reject(error);
      }
    };
    
    reader.onerror = () => reject(new Error('Failed to read file'));
    reader.readAsText(file);
  });
}
