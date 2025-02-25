import { NextResponse } from "next/server";

import { apiKeys } from "../keys";

export async function GET() {
  try {
    const response = await fetch("https://newsapi.org/v2/sources", {
      headers: {
        "X-Api-Key": apiKeys[0],
      },
    });

    const data = await response.json();

    if (!response.ok) {
      // Try other API keys if the first one fails
      for (let i = 1; i < apiKeys.length; i++) {
        const retryResponse = await fetch("https://newsapi.org/v2/sources", {
          headers: {
            "X-Api-Key": apiKeys[i],
          },
        });
        if (retryResponse.ok) {
          const data = await retryResponse.json();
          return NextResponse.json(data);
        }
      }
    }

    return NextResponse.json(data);
  } catch {
    return NextResponse.json(
      { error: "Failed to fetch from News API" },
      { status: 500 }
    );
  }
}
