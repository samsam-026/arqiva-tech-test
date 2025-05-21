import { ContributionOrder } from "@/app/form-options";

const ENDPOINT = "http://localhost:8000/contributions";
export const PAGE_SIZE = 14;

export const getContributions = (
  page: number,
  orderBy: ContributionOrder,
  searchType: ContributionOrder,
  searchQuery: string
) => {
  const skip = (page - 1) * PAGE_SIZE;

  let endpoint = `${ENDPOINT}?skip=${skip}&limit=${PAGE_SIZE}&order_by=${orderBy}`;

  if (searchQuery.length > 0) {
    endpoint += `&${searchType}=${searchQuery}&match=all`;
  }

  return fetch(endpoint, {
    method: "GET",
    headers: {
      "Content-Type": "application/json"
    }
  }).then(res => res.json());
};
