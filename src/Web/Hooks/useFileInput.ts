// hooks/useFileInput.ts
import { useRef, useState } from 'react';

interface UseFileInputReturn {
  // State
  text: string;
  file: File | null;
  inputRef: React.RefObject<HTMLInputElement | null>;
  
  // Actions
  setText: (text: string) => void;
  setFile: (file: File | null) => void;
  handleFileUpload: (event: React.ChangeEvent<HTMLInputElement>) => void;
  triggerFileUpload: () => void;
  removeFile: () => void;
  reset: () => void;
}

export function useFileInput(): UseFileInputReturn {
  const [text, setText] = useState("");
  const [file, setFile] = useState<File | null>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const uploadedFile = event.target.files?.[0];
    if (uploadedFile) {
      const allowedTypes = [
        'application/pdf',
        'application/msword',
        'application/vnd.openxmlformats-officedocument.wordprocessingml.document'
      ];
      
      if (allowedTypes.includes(uploadedFile.type)) {
        setFile(uploadedFile);
      } else {
        alert('Kun PDF, DOC og DOCX filer er tilladt');
        setFile(null);
      }
    }
  };

  const triggerFileUpload = () => {
    inputRef.current?.click();
  };

  const removeFile = () => {
    setFile(null);
  };

  const reset = () => {
    setText("");
    setFile(null);
  };

  return {
    text,
    file,
    inputRef,
    setText,
    setFile,
    handleFileUpload,
    triggerFileUpload,
    removeFile,
    reset,
  };
}