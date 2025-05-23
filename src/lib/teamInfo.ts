
export interface TeamInfo {
  name: string;
  description: string;
  foundedYear?: number;
  achievements?: string[];
  philosophy?: string;
}

export const teamInformation: Record<string, TeamInfo> = {
  "cat face nospace": {
    name: "Cat Face Nospace",
    description: "A legendary team known for their precision driving and strategic approach to rally championships. Founded by veterans of the sport, they have consistently performed at the highest level across multiple seasons.",
    foundedYear: 2022,
    philosophy: "Speed through precision, victory through teamwork.",
    achievements: ["Season 1 Team Champions", "Multiple individual race wins"]
  },
  "G2D Racing": {
    name: "G2D Racing",
    description: "An ambitious racing outfit that combines cutting-edge technology with raw talent. Known for their aggressive driving style and never-give-up attitude, they've established themselves as formidable competitors.",
    foundedYear: 2022,
    philosophy: "Innovation drives performance, passion fuels success.",
    achievements: ["Consistent podium finishers", "Strong team coordination"]
  },
  "Brick Motorsports": {
    name: "Brick Motorsports",
    description: "A team built on solid foundations and reliable performance. They may not always be the flashiest, but their consistency and technical expertise make them a threat in every championship.",
    foundedYear: 2022,
    philosophy: "Steady progress leads to lasting success.",
    achievements: ["Multiple season participations", "Strong technical development"]
  },
  "Noot Squad Rally": {
    name: "Noot Squad Rally",
    description: "The newest addition to the championship, bringing fresh energy and innovative approaches to rally racing. Despite being newcomers, they've shown impressive potential and determination.",
    foundedYear: 2023,
    philosophy: "New perspectives, unlimited potential.",
    achievements: ["Rising stars in the championship", "Rapid skill development"]
  }
};
