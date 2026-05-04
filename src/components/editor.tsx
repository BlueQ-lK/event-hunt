import React, { useEffect, useRef } from 'react';
import pell from 'pell';
import 'pell/dist/pell.min.css';

interface EditorProps {
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
}

export function Editor({ value, onChange, placeholder }: EditorProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const editorRef = useRef<any>(null);
  const isInternalChange = useRef(false);

  useEffect(() => {
    if (containerRef.current && !editorRef.current) {
      editorRef.current = pell.init({
        element: containerRef.current,
        onChange: (html: string) => {
          isInternalChange.current = true;
          onChange(html);
          setTimeout(() => {
            isInternalChange.current = false;
          }, 0);
        },
        defaultParagraphSeparator: 'p',
        actions: [
          'bold',
          'italic',
          'underline',
          'olist',
          'ulist',
        ],
        classes: {
          actionbar: 'pell-actionbar custom-actionbar',
          button: 'pell-button custom-button',
          content: 'pell-content custom-content',
          selected: 'pell-button-selected custom-button-selected'
        }
      });

      // Set initial value
      const contentElement = containerRef.current.querySelector('.pell-content');
      if (contentElement) {
        contentElement.innerHTML = value || '';
        if (placeholder) {
           // Pell doesn't have native placeholder support easily, but we can manage it
        }
      }
    }
  }, []);

  // Update content if value changes externally
  useEffect(() => {
    if (editorRef.current && !isInternalChange.current) {
      const contentElement = containerRef.current?.querySelector('.pell-content');
      if (contentElement && contentElement.innerHTML !== value) {
        contentElement.innerHTML = value || '';
      }
    }
  }, [value]);

  return (
    <div className="pell-editor-wrapper">
      <div ref={containerRef} className="border border-slate-200 rounded-xl overflow-hidden focus-within:ring-2 focus-within:ring-primary/20 focus-within:border-primary/50 transition-all bg-white" />
      <style>{`
        .custom-actionbar {
          border: none;
          display: flex;
          flex-wrap: wrap;
          padding: 4px;
        }
        .custom-button {
          background-color: transparent;
          border: none;
          cursor: pointer;
          height: 32px;
          outline: 0;
          width: 32px;
          color: #64748b;
          font-weight: 600;
          transition: all 0.2s;
          display: flex;
          align-items: center;
          justify-content: center;
          border-radius: 6px;
          margin: 2px;
        }
        .custom-button:hover {
          background-color: #f1f5f9;
          color: blue;
        }
        .custom-button-selected {
          background-color: #e2e8f0 !important;
          color: blue !important;
        }
        .custom-content {
          outline: 0;
          padding: 1.25rem;
          min-height: 200px;
          background-color: white;
          font-family: inherit;
          font-size: 0.9375rem;
          line-height: 1.6;
          color: #334155;
        }
        .pell-content p {
          margin-bottom: 1rem;
        }
        .pell-content h1 {
          font-size: 1.5rem;
          font-weight: 800;
          margin-bottom: 1rem;
          color: #0f172a;
        }
        .pell-content h2 {
          font-size: 1.25rem;
          font-weight: 700;
          margin-bottom: 0.75rem;
          color: #1e293b;
        }
        .pell-content ul, .pell-content ol {
          margin-bottom: 1rem;
          padding-left: 1.5rem;
        }
        .pell-content ul {
          list-style-type: disc;
        }
        .pell-content ol {
          list-style-type: decimal;
        }
        .pell-content blockquote {
          border-left: 4px solid #e2e8f0;
          padding-left: 1rem;
          color: #64748b;
          font-style: italic;
          margin-bottom: 1rem;
        }
        .pell-content pre {
          background-color: #f1f5f9;
          padding: 1rem;
          border-radius: 0.5rem;
          font-family: monospace;
          margin-bottom: 1rem;
          overflow-x: auto;
        }
      `}</style>
    </div>
  );
}
