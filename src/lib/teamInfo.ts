
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
    description: "Active since 2021, team Cat Face NoSpace come from the cold northern forests and refer to themselves as the beasts of the north.",
    foundedYear: 2021,
    philosophy: "Drive fast, take every shortcut, never brake.",
    achievements: ["Season 1 Team Champions", "Multiple individual rally wins"]
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
    description: "Brick Motorsports was created in 2021 by an international group of racers united by the mission to make bricks fly. Throughout the years Brick Motorsports has worked with talented drivers from Finland, Germany, USA, UK, Ukraine, Norway, and Antarctica.",
    foundedYear: 2021,
    philosophy: "make bricks fly",
    achievements: ["Team champions S4"]
  },
  "Noot Squad Rally": {
    name: "Noot Squad Rally",
    description: "The newest addition to the championship, bringing fresh energy and innovative approaches to rally racing. Despite being newcomers, they've shown impressive potential and determination.",
    foundedYear: 2023,
    philosophy: "New perspectives, unlimited potential.",
    achievements: ["Rising stars in the championship", "Rapid skill development"]
  }
};
