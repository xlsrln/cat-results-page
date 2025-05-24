
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
  "G2D Righto": {
    name: "G2D Righto",
    description: "Perennial competitors, G2D Racing has a mercenary reputation in the paddock despite their humble enthusiast origins, aggressively pursuing and fielding promising drivers. G2D's philosophy of The Racer's Choice revolves around letting each driver find the package that they can extract the most from, be it car or setup.",
    foundedYear: 2022,
    philosophy: "fun is good but winning is better",
    achievements: ["Champions of CAT S2 and S3"]
  },
  "Brick Motorsports": {
    name: "Brick Motorsports",
    description: "Brick Motorsports was created in 2021 by an international group of racers united by the mission to make bricks fly. Throughout the years Brick Motorsports has worked with talented drivers from Finland, Germany, USA, UK, Ukraine, Norway, and Antarctica.",
    foundedYear: 2021,
    philosophy: "make bricks fly",
    achievements: ["Season 4 Team champions"]
  },
  "Noot Squad Rally": {
    name: "Noot Squad Rally",
    description: "The newest addition to the championship, bringing fresh energy and innovative approaches to rally racing. Despite being newcomers, they've shown impressive potential and determination.",
    foundedYear: 2023,
    philosophy: "New perspectives, unlimited potential.",
    achievements: ["Rising stars in the championship", "Rapid skill development"]
  },
  "superturbo": {
    name: "Superturbo",
    description: "superturbo was founded in 1967 by a small group of British privateers - and has evolved into an internationally-based outfit. our team has a long relationship with the manufacturers of ‘il gorilla’, ensuring that our team always aims to bring home victories, without compromising style",
    foundedYear: 1967,
    philosophy: "superturbo - the crowd’s choice.",
    achievements: ["Great success individually", "Real life karting kings"]
  },
"purple sunset": {
    name: "purple sunset",
    description: "Founded in 2024 by two guys originating from the desolate arctic wastelands of Finland and northern Canada, these two have honed their driving skills in the hostile forest and backroads, mostly out of necessity rather than training. Armed with Fujin FRXs modified to group A spec, a couple Cozzie Transfer vans and a crippling debt with their houses on the line, Purple Sunset Motorsports is purely driven by the determination to prove itself in the Catface Rally, and maybe on the side win enough money to pay of their debts or at least convince the banks not to foreclose their houses.",
    foundedYear: 2023,
    philosophy: "drive hills, pay bills",
    achievements: []
  },
  "bike-a-cycle": {
    name: "bike-a-cycle",
    description: "A group of mechanics of the continental bicycle racing team, bike-a-cycle, decided to use their vacation to go rallying after being suspended for putting petrol in their rider's water bottles. So here they are, roof racks installed, partially lycra clad, and confused as to why the gears are in a box and not just screwed onto the rear wheel, ready to go racing in cat!",
    foundedYear: 2023,
    philosophy: "allez allez allez",
    achievements: []
  }
};
