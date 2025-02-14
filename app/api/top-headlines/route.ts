import { NextResponse } from "next/server";

const apiKeys = [
  "0ddb94b973ce499fa95bcaf95a4efe91",
  "73bc66ed028d40b28e50d50c078f8c9f",
];

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
          return NextResponse.json(data);
        }
      }
    }

    return NextResponse.json(data);
  } catch (error) {
    return NextResponse.json(
      { error: "Failed to fetch from News API" },
      { status: 500 }
    );
  }
}
