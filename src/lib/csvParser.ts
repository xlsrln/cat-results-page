
interface ParsedRow {
  [key: string]: string;
}

export const parseCSV = (csvText: string): ParsedRow[] => {
  const lines = csvText.trim().split('\n');
  if (lines.length === 0) {
    return [];
  }

  // Use a regex to handle commas inside quotes
  const splitCsvLine = (line: string): string[] => {
    const result: string[] = [];
    let currentField = '';
    let inQuotes = false;
    for (let i = 0; i < line.length; i++) {
      const char = line[i];
      if (char === '"') {
        inQuotes = !inQuotes;
      } else if (char === ',' && !inQuotes) {
        result.push(currentField.trim());
        currentField = '';
      } else {
        currentField += char;
      }
    }
    result.push(currentField.trim()); // Add the last field
    return result;
  };
  
  const headers = splitCsvLine(lines[0]);
  const data: ParsedRow[] = [];

  for (let i = 1; i < lines.length; i++) {
    const values = splitCsvLine(lines[i]);
    if (values.length === headers.length) { // Ensure row has same number of columns as headers
      const row: ParsedRow = {};
      headers.forEach((header, index) => {
        row[header] = values[index];
      });
      data.push(row);
    } else {
      console.warn(`Skipping malformed CSV line ${i + 1}: ${lines[i]}`);
    }
  }
  return data;
};
