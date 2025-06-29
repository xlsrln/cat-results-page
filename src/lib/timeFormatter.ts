
export const formatTime = (timeInSecondsString: string | undefined): string => {
  if (timeInSecondsString === "N/A" || !timeInSecondsString) {
    return "N/A";
  }
  const totalSeconds = parseFloat(timeInSecondsString);
  if (isNaN(totalSeconds) || totalSeconds < 0) {
    // Consider logging an error for invalid non-"N/A" time strings
    // console.warn(`Invalid time string encountered: ${timeInSecondsString}`);
    return "Invalid Time"; 
  }

  const minutes = Math.floor(totalSeconds / 60);
  const seconds = Math.floor(totalSeconds % 60);
  // Ensure milliseconds are handled correctly, even for whole numbers
  const milliseconds = Math.round((totalSeconds - Math.floor(totalSeconds)) * 1000);

  const pad = (num: number, size: number) => num.toString().padStart(size, '0');

  return `${pad(minutes, 2)}:${pad(seconds, 2)}.${pad(milliseconds, 3)}`;
};
