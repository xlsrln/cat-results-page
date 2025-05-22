
export const parseTimeToSeconds = (timeString: string | undefined | null): number | null => {
  if (!timeString || typeof timeString !== 'string' || timeString.toUpperCase() === "N/A") {
    return null;
  }

  const parts = timeString.split(':');
  let totalSeconds = 0;

  try {
    if (parts.length === 1) { // SS.mmm or SSSS.mmm
      totalSeconds = parseFloat(parts[0]);
    } else if (parts.length === 2) { // MM:SS.mmm
      const minutes = parseFloat(parts[0]);
      const seconds = parseFloat(parts[1]);
      if (isNaN(minutes) || isNaN(seconds)) return null;
      totalSeconds = minutes * 60 + seconds;
    } else if (parts.length === 3) { // HH:MM:SS.mmm
      const hours = parseFloat(parts[0]);
      const minutes = parseFloat(parts[1]);
      const seconds = parseFloat(parts[2]);
      if (isNaN(hours) || isNaN(minutes) || isNaN(seconds)) return null;
      totalSeconds = hours * 3600 + minutes * 60 + seconds;
    } else {
      return null; // Invalid format
    }
  } catch (e) {
    console.error("Error parsing time string:", timeString, e);
    return null;
  }

  return isNaN(totalSeconds) ? null : totalSeconds;
};
