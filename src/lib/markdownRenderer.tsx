
import React from 'react';

interface MarkdownRendererProps {
  content: string;
  className?: string;
}

export const MarkdownRenderer: React.FC<MarkdownRendererProps> = ({ content, className = "" }) => {
  // Simple markdown parser for basic formatting
  const parseMarkdown = (text: string): JSX.Element[] => {
    const lines = text.split('\n');
    const elements: JSX.Element[] = [];
    let key = 0;

    for (let i = 0; i < lines.length; i++) {
      const line = lines[i];
      
      // Headers
      if (line.startsWith('### ')) {
        elements.push(
          <h3 key={key++} className="text-xl font-semibold text-black mt-6 mb-3">
            {line.substring(4)}
          </h3>
        );
      } else if (line.startsWith('## ')) {
        elements.push(
          <h2 key={key++} className="text-2xl font-bold text-black mt-8 mb-4">
            {line.substring(3)}
          </h2>
        );
      } else if (line.startsWith('# ')) {
        elements.push(
          <h1 key={key++} className="text-3xl font-bold text-black mt-8 mb-6">
            {line.substring(2)}
          </h1>
        );
      }
      // Horizontal rule
      else if (line.trim() === '---') {
        elements.push(<hr key={key++} className="my-8 border-gray-300" />);
      }
      // Bold text with italic (emphasis)
      else if (line.startsWith('*') && line.endsWith('*') && !line.startsWith('**')) {
        elements.push(
          <p key={key++} className="text-gray-600 italic text-center mb-4">
            {line.substring(1, line.length - 1)}
          </p>
        );
      }
      // Lists
      else if (line.startsWith('- ')) {
        const listItems = [line];
        // Collect consecutive list items
        while (i + 1 < lines.length && lines[i + 1].startsWith('- ')) {
          i++;
          listItems.push(lines[i]);
        }
        elements.push(
          <ul key={key++} className="list-disc list-inside mb-4 space-y-1">
            {listItems.map((item, idx) => (
              <li key={idx} className="text-gray-700">
                {parseInlineMarkdown(item.substring(2))}
              </li>
            ))}
          </ul>
        );
      }
      // Numbered lists
      else if (/^\d+\. /.test(line)) {
        const listItems = [line];
        // Collect consecutive numbered list items
        while (i + 1 < lines.length && /^\d+\. /.test(lines[i + 1])) {
          i++;
          listItems.push(lines[i]);
        }
        elements.push(
          <ol key={key++} className="list-decimal list-inside mb-4 space-y-1">
            {listItems.map((item, idx) => (
              <li key={idx} className="text-gray-700">
                {parseInlineMarkdown(item.replace(/^\d+\. /, ''))}
              </li>
            ))}
          </ol>
        );
      }
      // Regular paragraphs
      else if (line.trim() !== '') {
        elements.push(
          <p key={key++} className="text-gray-700 mb-4 leading-relaxed">
            {parseInlineMarkdown(line)}
          </p>
        );
      }
      // Empty lines
      else {
        elements.push(<div key={key++} className="mb-2" />);
      }
    }

    return elements;
  };

  const parseInlineMarkdown = (text: string): React.ReactNode => {
    // Handle links [text](url)
    const linkRegex = /\[([^\]]+)\]\(([^)]+)\)/g;
    const parts = text.split(linkRegex);
    
    if (parts.length === 1) {
      // No links found, handle other inline formatting
      return handleOtherInlineFormatting(text);
    }

    const result: React.ReactNode[] = [];
    for (let i = 0; i < parts.length; i += 3) {
      if (i + 2 < parts.length) {
        // Add text before link
        if (parts[i]) {
          result.push(handleOtherInlineFormatting(parts[i]));
        }
        // Add link
        result.push(
          <a
            key={i}
            href={parts[i + 2]}
            className="text-blue-600 hover:text-blue-800 underline"
          >
            {parts[i + 1]}
          </a>
        );
      } else {
        // Add remaining text
        if (parts[i]) {
          result.push(handleOtherInlineFormatting(parts[i]));
        }
      }
    }

    return result;
  };

  const handleOtherInlineFormatting = (text: string): React.ReactNode => {
    // Handle bold **text**
    const boldRegex = /\*\*([^*]+)\*\*/g;
    const parts = text.split(boldRegex);
    
    if (parts.length === 1) {
      return text;
    }

    const result: React.ReactNode[] = [];
    for (let i = 0; i < parts.length; i++) {
      if (i % 2 === 0) {
        result.push(parts[i]);
      } else {
        result.push(<strong key={i} className="font-semibold">{parts[i]}</strong>);
      }
    }

    return result;
  };

  return (
    <div className={`prose prose-gray max-w-none ${className}`}>
      {parseMarkdown(content)}
    </div>
  );
};
