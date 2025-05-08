// Sample character data structure matching the SuperHero API format
// Used for development and fallback when API is unavailable

import { Character } from './superhero';

const mockCharacters: Character[] = [
  {
    id: "1",
    name: "Batman",
    powerstats: {
      intelligence: "100",
      strength: "26",
      speed: "27",
      durability: "50",
      power: "47",
      combat: "100"
    },
    biography: {
      "full-name": "Bruce Wayne",
      "alter-egos": "No alter egos found.",
      aliases: ["Matches Malone", "The Dark Knight", "The Caped Crusader"],
      "place-of-birth": "Gotham City",
      "first-appearance": "Detective Comics #27",
      publisher: "DC Comics",
      alignment: "good"
    },
    appearance: {
      gender: "Male",
      race: "Human",
      height: ["6'2", "188 cm"],
      weight: ["210 lb", "95 kg"],
      "eye-color": "Blue",
      "hair-color": "Black"
    },
    work: {
      occupation: "Businessman",
      base: "Batcave, Stately Wayne Manor, Gotham City"
    },
    connections: {
      "group-affiliation": "Justice League, Batman Family",
      relatives: "Thomas Wayne (father, deceased), Martha Wayne (mother, deceased), Alfred Pennyworth (surrogate father)"
    },
    image: {
      url: "https://www.superherodb.com/pictures2/portraits/10/100/639.jpg"
    }
  },
  {
    id: "13",
    name: "Deadpool",
    powerstats: {
      intelligence: "69",
      strength: "32",
      speed: "50",
      durability: "100",
      power: "100",
      combat: "100"
    },
    biography: {
      "full-name": "Wade Wilson",
      "alter-egos": "No alter egos found.",
      aliases: ["Merc with a Mouth", "Regenerating Degenerate", "Captain Deadpool"],
      "place-of-birth": "Canada",
      "first-appearance": "New Mutants #98",
      publisher: "Marvel Comics",
      alignment: "neutral"
    },
    appearance: {
      gender: "Male",
      race: "Mutant",
      height: ["6'2", "188 cm"],
      weight: ["210 lb", "95 kg"],
      "eye-color": "Brown",
      "hair-color": "No Hair"
    },
    work: {
      occupation: "Mercenary",
      base: "Mobile"
    },
    connections: {
      "group-affiliation": "X-Force, Avengers",
      relatives: "Unknown"
    },
    image: {
      url: "https://www.superherodb.com/pictures2/portraits/10/100/835.jpg"
    }
  },
  {
    id: "14",
    name: "Silver Surfer",
    powerstats: {
      intelligence: "80",
      strength: "100",
      speed: "100",
      durability: "90",
      power: "100",
      combat: "70"
    },
    biography: {
      "full-name": "Norrin Radd",
      "alter-egos": "No alter egos found.",
      aliases: ["Sentinel of the Spaceways", "Herald of Galactus", "Norrin Radd"],
      "place-of-birth": "Zenn-La",
      "first-appearance": "Fantastic Four #48",
      publisher: "Marvel Comics",
      alignment: "good"
    },
    appearance: {
      gender: "Male",
      race: "Alien",
      height: ["6'4", "193 cm"],
      weight: ["225 lb", "102 kg"],
      "eye-color": "White",
      "hair-color": "No Hair"
    },
    work: {
      occupation: "Herald of Galactus",
      base: "Mobile throughout the universe"
    },
    connections: {
      "group-affiliation": "Former member of Defenders, former herald of Galactus",
      relatives: "Shalla-Bal (wife, deceased)"
    },
    image: {
      url: "https://www.superherodb.com/pictures2/portraits/10/100/127.jpg"
    }
  },
  {
    id: "2",
    name: "Superman",
    powerstats: {
      intelligence: "94",
      strength: "100",
      speed: "100",
      durability: "100",
      power: "100",
      combat: "85"
    },
    biography: {
      "full-name": "Clark Kent",
      "alter-egos": "Superman Prime One-Million",
      aliases: ["The Man of Steel", "The Man of Tomorrow", "Kal-El"],
      "place-of-birth": "Krypton",
      "first-appearance": "Action Comics #1",
      publisher: "DC Comics",
      alignment: "good"
    },
    appearance: {
      gender: "Male",
      race: "Kryptonian",
      height: ["6'3", "191 cm"],
      weight: ["225 lb", "101 kg"],
      "eye-color": "Blue",
      "hair-color": "Black"
    },
    work: {
      occupation: "Reporter",
      base: "Metropolis"
    },
    connections: {
      "group-affiliation": "Justice League of America, The Legion of Super-Heroes (pre-Crisis as Superboy)",
      relatives: "Jor-El (father, deceased), Lara (mother, deceased), Jonathan Kent (adoptive father), Martha Kent (adoptive mother)"
    },
    image: {
      url: "https://www.superherodb.com/pictures2/portraits/10/100/791.jpg"
    }
  },
  {
    id: "3",
    name: "Spider-Man",
    powerstats: {
      intelligence: "90",
      strength: "55",
      speed: "67",
      durability: "75",
      power: "74",
      combat: "85"
    },
    biography: {
      "full-name": "Peter Parker",
      "alter-egos": "No alter egos found.",
      aliases: ["Spidey", "Wall-crawler", "Webhead"],
      "place-of-birth": "Queens, New York City",
      "first-appearance": "Amazing Fantasy #15",
      publisher: "Marvel Comics",
      alignment: "good"
    },
    appearance: {
      gender: "Male",
      race: "Human",
      height: ["5'10", "178 cm"],
      weight: ["165 lb", "75 kg"],
      "eye-color": "Hazel",
      "hair-color": "Brown"
    },
    work: {
      occupation: "Freelance photographer, teacher",
      base: "New York City"
    },
    connections: {
      "group-affiliation": "Avengers, formerly the Secret Defenders, New Fantastic Four",
      relatives: "Richard Parker (father, deceased), Mary Parker (mother, deceased), Uncle Ben (deceased), Aunt May"
    },
    image: {
      url: "https://www.superherodb.com/pictures2/portraits/10/100/133.jpg"
    }
  },
  {
    id: "4",
    name: "Wonder Woman",
    powerstats: {
      intelligence: "88",
      strength: "100",
      speed: "79",
      durability: "100",
      power: "100",
      combat: "100"
    },
    biography: {
      "full-name": "Diana Prince",
      "alter-egos": "No alter egos found.",
      aliases: ["Princess Diana", "The Amazon Princess"],
      "place-of-birth": "Themyscira",
      "first-appearance": "All Star Comics #8",
      publisher: "DC Comics",
      alignment: "good"
    },
    appearance: {
      gender: "Female",
      race: "Amazon",
      height: ["6'0", "183 cm"],
      weight: ["165 lb", "75 kg"],
      "eye-color": "Blue",
      "hair-color": "Black"
    },
    work: {
      occupation: "Diplomat, Adventurer",
      base: "Themyscira, Gateway City, Washington DC"
    },
    connections: {
      "group-affiliation": "Justice League of America, Justice Society of America (pre-Crisis)",
      relatives: "Queen Hippolyta (mother)"
    },
    image: {
      url: "https://www.superherodb.com/pictures2/portraits/10/100/807.jpg"
    }
  },
  {
    id: "5",
    name: "Iron Man",
    powerstats: {
      intelligence: "100",
      strength: "85",
      speed: "58",
      durability: "85",
      power: "100",
      combat: "64"
    },
    biography: {
      "full-name": "Tony Stark",
      "alter-egos": "No alter egos found.",
      aliases: ["Iron Knight", "Shellhead", "Armored Avenger"],
      "place-of-birth": "Long Island, New York",
      "first-appearance": "Tales of Suspense #39",
      publisher: "Marvel Comics",
      alignment: "good"
    },
    appearance: {
      gender: "Male",
      race: "Human",
      height: ["6'6", "198 cm"],
      weight: ["425 lb", "191 kg"],
      "eye-color": "Blue",
      "hair-color": "Black"
    },
    work: {
      occupation: "Inventor, Industrialist, CEO of Stark Industries",
      base: "Stark Tower, New York City"
    },
    connections: {
      "group-affiliation": "Avengers, S.H.I.E.L.D.",
      relatives: "Howard Stark (father, deceased), Maria Stark (mother, deceased)"
    },
    image: {
      url: "https://www.superherodb.com/pictures2/portraits/10/100/85.jpg"
    }
  },
  {
    id: "6",
    name: "The Flash",
    powerstats: {
      intelligence: "88",
      strength: "48",
      speed: "100",
      durability: "60",
      power: "100",
      combat: "60"
    },
    biography: {
      "full-name": "Barry Allen",
      "alter-egos": "No alter egos found.",
      aliases: ["The Scarlet Speedster", "The Fastest Man Alive"],
      "place-of-birth": "Fallville, Iowa",
      "first-appearance": "Showcase #4",
      publisher: "DC Comics",
      alignment: "good"
    },
    appearance: {
      gender: "Male",
      race: "Human",
      height: ["6'0", "183 cm"],
      weight: ["190 lb", "86 kg"],
      "eye-color": "Blue",
      "hair-color": "Blond"
    },
    work: {
      occupation: "Forensic Scientist",
      base: "Central City"
    },
    connections: {
      "group-affiliation": "Justice League of America, Flash Family",
      relatives: "Henry Allen (father), Nora Allen (mother, deceased)"
    },
    image: {
      url: "https://www.superherodb.com/pictures2/portraits/10/100/892.jpg"
    }
  },
  {
    id: "7",
    name: "Thor",
    powerstats: {
      intelligence: "69",
      strength: "100",
      speed: "83",
      durability: "100",
      power: "100",
      combat: "100"
    },
    biography: {
      "full-name": "Thor Odinson",
      "alter-egos": "Rune King Thor",
      aliases: ["God of Thunder", "Donald Blake"],
      "place-of-birth": "Asgard",
      "first-appearance": "Journey into Mystery #83",
      publisher: "Marvel Comics",
      alignment: "good"
    },
    appearance: {
      gender: "Male",
      race: "Asgardian",
      height: ["6'6", "198 cm"],
      weight: ["640 lb", "288 kg"],
      "eye-color": "Blue",
      "hair-color": "Blond"
    },
    work: {
      occupation: "King of Asgard, Physician",
      base: "Asgard, New York City"
    },
    connections: {
      "group-affiliation": "Avengers",
      relatives: "Odin (father), Frigga (mother), Loki (adopted brother)"
    },
    image: {
      url: "https://www.superherodb.com/pictures2/portraits/10/100/140.jpg"
    }
  },
  {
    id: "8",
    name: "Hulk",
    powerstats: {
      intelligence: "88",
      strength: "100",
      speed: "63",
      durability: "100",
      power: "98",
      combat: "85"
    },
    biography: {
      "full-name": "Bruce Banner",
      "alter-egos": "No alter egos found.",
      aliases: ["Annihilator", "Green Scar", "World-Breaker"],
      "place-of-birth": "Dayton, Ohio",
      "first-appearance": "Incredible Hulk #1",
      publisher: "Marvel Comics",
      alignment: "good"
    },
    appearance: {
      gender: "Male",
      race: "Human / Radiation",
      height: ["8'0", "244 cm"],
      weight: ["1400 lb", "630 kg"],
      "eye-color": "Green",
      "hair-color": "Green"
    },
    work: {
      occupation: "Nuclear physicist, Agent of S.H.I.E.L.D.",
      base: "New Mexico"
    },
    connections: {
      "group-affiliation": "Avengers, former member of the Defenders",
      relatives: "Betty Ross (wife), Brian Banner (father, deceased)"
    },
    image: {
      url: "https://www.superherodb.com/pictures2/portraits/10/100/83.jpg"
    }
  },
  {
    id: "9",
    name: "Black Widow",
    powerstats: {
      intelligence: "75",
      strength: "13",
      speed: "33",
      durability: "30",
      power: "36",
      combat: "100"
    },
    biography: {
      "full-name": "Natasha Romanoff",
      "alter-egos": "No alter egos found.",
      aliases: ["Natalia Romanova", "Natalia Ivanovna Romanova"],
      "place-of-birth": "Stalingrad, Russia",
      "first-appearance": "Tales of Suspense #52",
      publisher: "Marvel Comics",
      alignment: "good"
    },
    appearance: {
      gender: "Female",
      race: "Human",
      height: ["5'7", "170 cm"],
      weight: ["131 lb", "59 kg"],
      "eye-color": "Green",
      "hair-color": "Red"
    },
    work: {
      occupation: "Spy, Agent of S.H.I.E.L.D.",
      base: "Mobile"
    },
    connections: {
      "group-affiliation": "Avengers, formerly KGB",
      relatives: "Unknown"
    },
    image: {
      url: "https://www.superherodb.com/pictures2/portraits/10/100/248.jpg"
    }
  },
  {
    id: "10",
    name: "Green Lantern",
    powerstats: {
      intelligence: "80",
      strength: "90",
      speed: "53",
      durability: "64",
      power: "100",
      combat: "74"
    },
    biography: {
      "full-name": "Hal Jordan",
      "alter-egos": "No alter egos found.",
      aliases: ["Green Lantern", "Parallax", "Spectre"],
      "place-of-birth": "Coast City, California",
      "first-appearance": "Showcase #22",
      publisher: "DC Comics",
      alignment: "good"
    },
    appearance: {
      gender: "Male",
      race: "Human",
      height: ["6'2", "188 cm"],
      weight: ["200 lb", "90 kg"],
      "eye-color": "Brown",
      "hair-color": "Brown"
    },
    work: {
      occupation: "Test Pilot",
      base: "Coast City, California"
    },
    connections: {
      "group-affiliation": "Green Lantern Corps, Justice League of America",
      relatives: "Martin Jordan (father, deceased), Jessica Jordan (mother), Jack Jordan (brother), Jim Jordan (brother)"
    },
    image: {
      url: "https://www.superherodb.com/pictures2/portraits/10/100/697.jpg"
    }
  },
  {
    id: "11",
    name: "Captain America",
    powerstats: {
      intelligence: "69",
      strength: "19",
      speed: "38",
      durability: "55",
      power: "60",
      combat: "100"
    },
    biography: {
      "full-name": "Steve Rogers",
      "alter-egos": "No alter egos found.",
      aliases: ["Nomad", "The Captain"],
      "place-of-birth": "Manhattan, New York",
      "first-appearance": "Captain America Comics #1",
      publisher: "Marvel Comics",
      alignment: "good"
    },
    appearance: {
      gender: "Male",
      race: "Human",
      height: ["6'2", "188 cm"],
      weight: ["240 lb", "108 kg"],
      "eye-color": "Blue",
      "hair-color": "Blond"
    },
    work: {
      occupation: "Adventurer, federal official, intelligence operative, former soldier",
      base: "New York City"
    },
    connections: {
      "group-affiliation": "Avengers, formerly Secret Avengers",
      relatives: "Joseph Rogers (father, deceased), Sarah Rogers (mother, deceased)"
    },
    image: {
      url: "https://www.superherodb.com/pictures2/portraits/10/100/274.jpg"
    }
  },
  {
    id: "12",
    name: "Joker",
    powerstats: {
      intelligence: "100",
      strength: "10",
      speed: "12",
      durability: "60",
      power: "43",
      combat: "70"
    },
    biography: {
      "full-name": "Unknown",
      "alter-egos": "No alter egos found.",
      aliases: ["Red Hood", "Clown Prince of Crime", "Harlequin of Hate"],
      "place-of-birth": "Unknown",
      "first-appearance": "Batman #1",
      publisher: "DC Comics",
      alignment: "bad"
    },
    appearance: {
      gender: "Male",
      race: "Human",
      height: ["6'5", "196 cm"],
      weight: ["192 lb", "86 kg"],
      "eye-color": "Green",
      "hair-color": "Green"
    },
    work: {
      occupation: "Criminal, Former Chemical Engineer",
      base: "Arkham Asylum, Gotham City"
    },
    connections: {
      "group-affiliation": "Injustice Gang, Injustice League, formerly Harley Quinn",
      relatives: "Unknown"
    },
    image: {
      url: "https://www.superherodb.com/pictures2/portraits/10/100/719.jpg"
    }
  }
];

export default mockCharacters; 