"use client";
export async function fetchData(url: string) {
  try {
    const response = await fetch(url);
    if (!response.ok) {
      throw new Error(response.statusText);
    }
    const data = await response.json();
    if (data.length === 0) {
      throw new Error('No data found');
    }
    return data;
  } catch(error) {
    console.error('Unable to fetch the data: ', error);
    return false;
  }
};
