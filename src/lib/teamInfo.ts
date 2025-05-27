
export interface TeamInfo {
  name: string;
  description: string;
  foundedYear?: number;
  achievements?: string[];
  philosophy?: string;
  imageUrl?: string; // Updated imageUrl property
}

export const teamInformation: Record<string, TeamInfo> = {
  "cat face nospace": {
    name: "Cat Face Nospace",
    description: "The elusive team Cat Face NoSpace come from the cold northern forests and refer to themselves as the beasts of the north. They claim to take every shortcut and to never brake.",
    foundedYear: 2021,
    philosophy: "Take every shortcut and never brake.",
    achievements: ["Season 1 team Champions", "Oldest team in CAT"],
    imageUrl: new URL('../content/images/catface-nospace.png', import.meta.url).href
  },
  "G2D Righto": {
    name: "G2D Righto",
    description: "Perennial competitors, G2D Racing has a mercenary reputation in the paddock despite their humble enthusiast origins, aggressively pursuing and fielding promising drivers. G2D's philosophy of The Racer's Choice revolves around letting each driver find the package that they can extract the most from, be it car or setup.",
    foundedYear: 2022,
    philosophy: "fun is good but winning is better",
    achievements: ["Champions of season 2, 3 and 5", "Only team with a separate development team"],
    imageUrl: new URL('../content/images/g2d-righto.png', import.meta.url).href
  },
  "Brick Motorsports": {
    name: "Brick Motorsports",
    description: "Brick Motorsports was created in 2021 by an international group of racers united by the mission to make bricks fly. Throughout the years Brick Motorsports has worked with talented drivers from Finland, Germany, USA, UK, Ukraine, Norway, and Antarctica.",
    foundedYear: 2021,
    philosophy: "make bricks fly",
    achievements: ["Season 4 Team champions", "Largest roster in CAT"],
    imageUrl: new URL('../content/images/brick-motorsports.png', import.meta.url).href
  },
  "noot squad": {
    name: "Noot Squad Rally",
    description: "In 1990, two Swiss stop-motion artists created an anthropomorphic penguin children's show. Three decades later, two lads from across Europe banded together to chill around and play, thus creating the Noot Squad. Their latest endeavor: to rally across the world, and to have fun along the way!",
    foundedYear: 2022,
    philosophy: "New perspectives, unlimited potential.",
    achievements: ["Rising stars in the championship", "Rapid skill development"],
    imageUrl: new URL('../content/images/noot-squad.png', import.meta.url).href
  },
  "superturbo": {
    name: "Superturbo",
    description: "superturbo was founded in 1967 by a small group of British privateers - and has evolved into an internationally-based outfit. our team has a long relationship with the manufacturers of ‘il gorilla’, ensuring that our team always aims to bring home victories, without compromising style",
    foundedYear: 1967,
    philosophy: "superturbo - the crowd’s choice.",
    achievements: ["Great success individually", "Real life karting kings"],
    imageUrl: new URL('../content/images/superturbo.png', import.meta.url).href
  },
  "purple sunset": {
    name: "purple sunset",
    description: "Founded in 2024 by two individuals from Finland and northern Canada, Purple Sunset Motorsports was born out of necessity and determination. With their driving skills forged on treacherous forest roads, the team now competes in the Catface Rally Club, driven by a two-fold need to prove themselves and pay off the debts that threaten their homes.",
    foundedYear: 2024,
    philosophy: "drive hills, pay bills",
    achievements: ["Managed to stay solvent", "Highest output of cool liveries"],
    imageUrl: new URL('../content/images/purple-sunset.png', import.meta.url).href
  },
  "bike-a-cycle": {
    name: "bike-a-cycle",
    description: "After being suspended for putting petrol in their rider's water bottles, a group of mechanics of the continental bicycle racing team, bike-a-cycle, decided to try rallying. So here they are, roof racks installed, partially lycra clad, and confused as to why the gears are in a box and not just screwed onto the rear wheel, ready to go racing in cat!",
    foundedYear: 2022,
    philosophy: "allez allez allez",
    achievements: ['Holds many KOMs', 'Previously successful in ski jumping'],
    imageUrl: new URL('../content/images/bike-a-cycle.png', import.meta.url).href
  },
  "void rallysports": {
    name: "void rallysports",
    description: "After astrophysicists had found and understood all of space's anomalies, they turned to something more peculiar, the rally driver. They decided to make their own team and were met with little success but soon found their ryhthm. They now strive for speed and a great time.",
    foundedYear: 2023,
    philosophy: "'Rally with us if times are none and fun is all.' -Captn Sharkhorse",
    achievements: ['Managers of the only black hole in the club'],
    imageUrl: new URL('../content/images/void-rallysports.png', import.meta.url).href
  }
};
