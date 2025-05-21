export interface Contribution {
  id: number;
  title: string;
  description: string;
  startTime: string;
  endTime: string;
  owner: string;
}

export interface ContributionResponse {
  contributions: Contribution[];
  total: number;
  skip: number;
  limit: number;
}
