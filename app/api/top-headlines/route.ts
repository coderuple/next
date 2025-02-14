import { NextResponse } from "next/server";

import { apiKeys } from "../keys";
export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const queryString = searchParams.toString();

  try {
    const response = await fetch(
      `https://newsapi.org/v2/top-headlines?${queryString}`,
      {
        headers: {
          "X-Api-Key": apiKeys[0],
        },
      }
    );

    const data = await response.json();

    if (!response.ok) {
      // Try other API keys if the first one fails
      for (let i = 1; i < apiKeys.length; i++) {
        const retryResponse = await fetch(
          `https://newsapi.org/v2/top-headlines?${queryString}`,
          {
            headers: {
              "X-Api-Key": apiKeys[i],
            },
          }
        );
        if (retryResponse.ok) {
          const data = await retryResponse.json();
          return new NextResponse(JSON.stringify(data), {
            headers: {
              "Cache-Control": "no-store, no-cache, must-revalidate",
              Pragma: "no-cache",
            },
          });
        } else {
          console.log("Failed to fetch from News API", apiKeys[i]);
        }
      }
    }

    return new NextResponse(JSON.stringify(data));
  } catch {
    return NextResponse.json(
      { error: "Failed to fetch from News API" },
      { status: 500 }
    );
  }
}
