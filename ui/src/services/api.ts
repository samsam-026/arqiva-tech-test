import { ContributionOrder } from "@/app/form-options";

const ENDPOINT = "http://localhost:8000/contributions";
export const PAGE_SIZE = 14;

export const getContributions = (page: number, orderBy: ContributionOrder, title: string, owner: string, description: string) => {
    const skip = (page - 1) * PAGE_SIZE;
    let endpoint = `${ENDPOINT}?skip=${skip}&limit=${PAGE_SIZE}&order_by=${orderBy}`;
    if (title.length > 0) {
        endpoint += `&title=${title}`;
    }
    if (owner.length > 0) {
        endpoint += `&owner=${owner}`;
    }
    if (description.length > 0) {
        endpoint += `&description=${description}`;
    }
    if (title.length > 0 || owner.length > 0 || description.length > 0) {
        endpoint += `&match=all`;
    }

    return fetch(
        endpoint,
        {
            method: "GET",
            headers: {
                "Content-Type": "application/json",
            },
        }
    ).then((res) => res.json());
}