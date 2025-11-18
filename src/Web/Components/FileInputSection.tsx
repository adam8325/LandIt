import React from 'react';
import { X, FileText, Upload } from 'lucide-react';
import { scrollbarStyle } from './ScrollbarStyle';

interface FileInputSectionProps {
  title: string;
  description: string;
  text: string;
  file: File | null;
  inputRef: React.RefObject<HTMLInputElement | null>;
  isLoading: boolean;
  onTextChange: (text: string) => void;
  onFileUpload: (event: React.ChangeEvent<HTMLInputElement>) => void;
  onTriggerUpload: () => void;
  onRemoveFile: () => void;
  placeholder: string;
}

export function FileInputSection({
  title,
  description,
  text,
  file,
  inputRef,
  isLoading,
  onTextChange,
  onFileUpload,
  onTriggerUpload,
  onRemoveFile,
  placeholder,
}: FileInputSectionProps) {
  return (
    <section className="sm:w-1/2 flex flex-col bg-gradient-to-b from-gray-900 via-transparent to-gray-900 border border-cyan-950 px-4 py-2 text-center gap-3 rounded-lg">
      <div className="flex items-center justify-between">
        <div>
          <div className="flex items-center gap-2">
            <FileText className="text-blue-500 h-3 w-3" />
            <h3 className="text-left font-semibold text-md sm:text-xl">{title}</h3>
          </div>
          <p className="text-gray-400 text-xs sm:text-sm">{description}</p>
        </div>
      </div>

      <div>
        <button
          className={`w-full border-1 border-dashed rounded-lg py-4 border-gray-700 flex flex-col gap-1 items-center ${
            isLoading || text !== "" 
              ? "cursor-not-allowed opacity-50" 
              : "cursor-pointer hover:border-sky-700"
          }`}
          onClick={onTriggerUpload}
          disabled={isLoading || text !== ""}
        >
          <Upload className="h-6 w-6 text-gray-500" />
          <p className="font-semibold text-sm sm:text-md text-gray-300">
            Klik for at uploade {title}
          </p>
          <div className="p-2 flex items-center justify-center gap-2 min-w-70">
            <p className="text-gray-500 text-xs sm:text-sm">
              {file ? file.name : "Understøttede formater: PDF, DOC, DOCX"}
            </p>
            {file && (
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  onRemoveFile();
                }}
                className="text-white cursor-pointer bg-gray-500 rounded-full w-5 h-5 flex items-center justify-center"
              >
                <X className="w-3 h-3" />
              </button>
            )}
          </div>
        </button>
        <input
          ref={inputRef}
          type="file"
          accept=".pdf,.doc,.docx"
          onChange={onFileUpload}
          style={{ display: 'none' }}
          disabled={isLoading}
        />
      </div>

      <div className="flex items-center">
        <div className="flex-grow h-[1px] bg-gradient-to-r from-blue-400 to-blue-600"></div>
        <span className="mx-4 text-gray-600">eller</span>
        <div className="flex-grow h-[1px] bg-gradient-to-r from-blue-600 to-blue-400"></div>
      </div>

      <div>
        <textarea
          className={`w-full h-65 p-2 bg-slate-800 rounded-lg text-xs focus:outline-none focus:ring-1 focus:ring-blue-400 placeholder:text-xs sm:placeholder:text-sm resize-none ${scrollbarStyle} ${
            isLoading || file !== null ? "opacity-50 cursor-not-allowed" : ""
          }`}
          placeholder={placeholder}
          value={text}
          onChange={(e) => onTextChange(e.target.value)}
          disabled={isLoading || file !== null}
        />
      </div>
    </section>
  );
}