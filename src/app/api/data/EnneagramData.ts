// All Enneagram knowledge and reference data
export type EnneagramType = "1" | "2" | "3" | "4" | "5" | "6" | "7" | "8" | "9";

export type TriadType = 
  | "Centers of Intelligence" 
  | "Harmonics" 
  | "Object Relations" 
  | "Hornevian";

export const typeNames: { [key: string]: string } = {
  "1": "The Reformer",
  "2": "The Helper",
  "3": "The Achiever",
  "4": "The Individualist",
  "5": "The Investigator",
  "6": "The Loyalist",
  "7": "The Enthusiast",
  "8": "The Challenger",
  "9": "The Peacemaker"
};

export const triadDescriptions: { [key: string]: string } = {
  "Centers of Intelligence": "How we process information and make decisions",
  "Harmonics": "How we cope with difficulty",
  "Object Relations": "How we maintain relationships and boundaries",
  "Hornevian": "How we engage with the world and meet our needs"
};

// You can add more Enneagram-specific knowledge here, such as:
// - Type descriptions
// - Wing information
// - Growth/stress arrows
// - Core fears/desires
// etc.