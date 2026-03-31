"use client";

import type { MoviesListType } from "constant";

export async function fetchData(
  url: string,
  init?: RequestInit
): Promise<false | MoviesListType[]> {
  try {
    const response = await fetch(url, {
      cache: "no-store",
      ...init,
    });
    if (!response.ok) {
      throw new Error(response.statusText);
    }
    const data = (await response.json()) as MoviesListType[];
    if (data.length === 0) {
      throw new Error("No data found");
    }
    return data;
  } catch (error) {
    console.error("Unable to fetch the data: ", error);
    return false;
  }
}
