export type Job = {
  id: string;
  employerId: string;
  employerName: string;
  title: string;
  sourceUrl: string;
  careersUrl: string;
  location: string;
  description: string;
  datePosted: string;
  closingDate: string;
  employmentType: string;
  salary: string;
  ats: string;
  relevanceScore: number;
  matchedKeywords: string;
  accessRemote: boolean;
  accessFlexible: boolean;
  accessStepFree: boolean;
  accessSensory: boolean;
  accessAssistive: boolean;
  featured: boolean;
};

export type JobSearchResult = {
  items: Job[];
  total: number;
  page: number;
  pageSize: number;
  totalPages: number;
};

export type JobsStats = {
  total: number;
  cyberPriority: number;
  apprenticeships: number;
  locations: Array<{ name: string; count: number }>;
  employmentTypes: Array<{ name: string; count: number }>;
};
