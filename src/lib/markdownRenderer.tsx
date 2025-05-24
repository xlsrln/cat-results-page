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
      const headers = headerRow.split('|').map(h => h.trim());
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
