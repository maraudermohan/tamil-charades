"use client";

import { TrackEvents, type MoviesListType } from "constant";
import { track } from "utils";

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
      track(
        TrackEvents.GAME_ERROR,
        {
          category: "fetch-data",
          code: response.statusText,
          status: response.status,
          path: url,
        },
        {},
      );
      throw new Error(response.statusText);
    }
    const data = (await response.json()) as MoviesListType[];
    if (data.length === 0) {
      track(
        TrackEvents.GAME_ERROR,
        {
          category: "fetch-data",
          code: "empty-list",
          status: response.status,
          path: url,
        },
        {},
      );
      throw new Error("No data found");
    }
    return data;
  } catch (error) {
    console.error("Unable to fetch the data: ", error);
    return false;
  }
}
