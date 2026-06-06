export interface Layer {
  id: string; // "L1", "L2"...
  name: string; // "传感器层"
  description: string;
  icon: string; // emoji
  color: string; // tailwind color class
}

export interface Implementation {
  type: "mainstream" | "advanced";
  name: string;
  vendor: string;
  description: string;
  pros: string[];
  cons: string[];
  citations: string[]; // citation IDs
}

export interface Reference {
  id: string;
  title: string;
  authors?: string;
  url?: string;
  doi?: string;
  year?: number;
  type: "paper" | "website" | "patent" | "documentation" | "book";
  zhSummary?: string;
}

export interface Module {
  id: string; // "L1:ppg"
  layer: string; // "L1"
  name: string;
  summary: string;
  description: string;
  importance: string;
  dependsOn: string[]; // module IDs this depends on
  feedsInto: string[]; // module IDs this feeds into
  tags: string[]; // categories
  implementations: Implementation[];
  glossaryTerms: string[]; // glossary term IDs used in this module
  references: string[]; // reference IDs
}

export interface GlossaryTerm {
  id: string;
  term: string;
  category: string;
  definition: string;
  references: string[];
}
