export interface Paper {
  id: string;
  title: string;
  authors: string[];
  abstract: string;
  publishedDate: string;
  pdfUrl: string;
  sourceUrl: string;
}

export interface GeminiSummary {
  pitch: string;
  problem: string;
  sauce: string;
  whyMatters: string;
  insights: string[];
  curatorNote: string;
}

export type SubjectCuration = {
  id: string;
  name: string;
  query: string;
  color: string;
  borderColor: string;
  bgClass: string;
  icon: string;
};
