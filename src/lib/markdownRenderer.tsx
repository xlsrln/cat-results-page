
import React from 'react';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";

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
            {parseInlineMarkdown(line.substring(4))}
          </h3>
        );
      } else if (line.startsWith('## ')) {
        elements.push(
          <h2 key={key++} className="text-2xl font-bold text-black mt-8 mb-4">
            {parseInlineMarkdown(line.substring(3))}
          </h2>
        );
      } else if (line.startsWith('# ')) {
        elements.push(
          <h1 key={key++} className="text-3xl font-bold text-black mt-8 mb-6">
            {parseInlineMarkdown(line.substring(2))}
          </h1>
        );
      }
      // Tables
      else if (line.trim().startsWith('|') && line.trim().endsWith('|')) {
        const tableLines = [line];
        // Collect consecutive table lines
        while (i + 1 < lines.length && lines[i + 1].trim().startsWith('|') && lines[i + 1].trim().endsWith('|')) {
          i++;
          tableLines.push(lines[i]);
        }
        
        if (tableLines.length >= 2) {
          const headerRow = tableLines[0];
          const separatorRow = tableLines[1];
          const dataRows = tableLines.slice(2);
          
          // Check if second row is a separator (contains dashes)
          if (separatorRow.includes('-')) {
            const headers = headerRow.split('|').map(h => h.trim()).filter(h => h);
            const rows = dataRows.map(row => 
              row.split('|').map(cell => cell.trim())
            );
            
            elements.push(
              <div key={key++} className="my-6 overflow-x-auto">
                <Table>
                  <TableHeader>
                    <TableRow>
                      {headers.map((header, idx) => (
                        <TableHead key={idx} className="font-semibold">
                          {parseInlineMarkdown(header)}
                        </TableHead>
                      ))}
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {rows.map((row, rowIdx) => (
                      <TableRow key={rowIdx}>
                        {row.map((cell, cellIdx) => (
                          <TableCell key={cellIdx}>
                            {parseInlineMarkdown(cell)}
                          </TableCell>
                        ))}
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>
            );
          }
        }
      }
      // Horizontal rule
      else if (line.trim() === '---') {
        elements.push(<hr key={key++} className="my-8 border-gray-300" />);
      }
      // Images
      else if (line.includes('<img ')) {
        const imgMatch = line.match(/<img\s+([^>]+)>/);
        if (imgMatch) {
          const attrs = imgMatch[1];
          const srcMatch = attrs.match(/src="([^"]+)"/);
          const altMatch = attrs.match(/alt="([^"]+)"/);
          const styleMatch = attrs.match(/style="([^"]+)"/);
          
          if (srcMatch) {
            let className = "mx-auto my-4";
            if (styleMatch && styleMatch[1].includes('height:200px')) {
              className += " h-48";
            }
            
            elements.push(
              <img 
                key={key++} 
                src={srcMatch[1]} 
                alt={altMatch ? altMatch[1] : ""} 
                className={className}
              />
            );
          }
        }
      }
      // Bold text with italic (emphasis)
      else if (line.startsWith('*') && line.endsWith('*') && !line.startsWith('**')) {
        elements.push(
          <p key={key++} className="text-gray-600 italic text-center mb-4">
            {parseInlineMarkdown(line.substring(1, line.length - 1))}
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
