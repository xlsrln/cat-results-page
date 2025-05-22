
/**
 * Parses a time string (e.g., "MM:SS.mmm", "SS.mmm", "N/A") into total seconds or specific markers.
 * @param timeString The time string to parse.
 * @returns Total seconds as a number, "N/A" if the string is "N/A", or undefined for invalid/empty strings.
 */
export const parseTimeToSeconds = (timeString: string | undefined): number | "N/A" | undefined => {
  if (timeString === undefined || timeString.trim() === "") {
    return undefined;
  }
  if (timeString.toUpperCase() === "N/A") {
    return "N/A";
  }

  const parts = timeString.split(':');
  let totalSeconds = 0;

  try {
    if (parts.length === 3) { // HH:MM:SS.mmm
      totalSeconds += parseFloat(parts[0]) * 3600;
      totalSeconds += parseFloat(parts[1]) * 60;
      totalSeconds += parseFloat(parts[2]);
    } else if (parts.length === 2) { // MM:SS.mmm
      totalSeconds += parseFloat(parts[0]) * 60;
      totalSeconds += parseFloat(parts[1]);
    } else if (parts.length === 1) { // SS.mmm
      totalSeconds += parseFloat(parts[0]);
    } else {
      return undefined; // Invalid format
    }
  } catch (e) {
    return undefined; // Error during parseFloat
  }

  return isNaN(totalSeconds) ? undefined : totalSeconds;
};
