import { NextResponse } from "next/server";

const apiKeys = [
  "0ddb94b973ce499fa95bcaf95a4efe91",
  "73bc66ed028d40b28e50d50c078f8c9f",
];

export async function GET(request: Request) {
  // Get the path parameters
  return NextResponse.json({ message: "Hello World" });
  const { searchParams } = new URL(request.url);
  const path = request.url.split("/api/news")[1] || "";
  const baseUrl = "https://newsapi.org/v2";

  try {
    const response = await fetch(`${baseUrl}${path}`, {
      headers: {
        "X-Api-Key": apiKeys[0],
      },
    });

    const data = await response.json();

    if (!response.ok) {
      // Try other API keys if the first one fails
      for (let i = 1; i < apiKeys.length; i++) {
        const retryResponse = await fetch(`${baseUrl}${path}`, {
          headers: {
            "X-Api-Key": apiKeys[i],
          },
        });
        if (retryResponse.ok) {
          const data = await retryResponse.json();
          return NextResponse.json(data, {
            headers: {
              "Access-Control-Allow-Origin": "*",
              "Access-Control-Allow-Methods": "GET, OPTIONS",
              "Access-Control-Allow-Headers": "Content-Type",
            },
          });
        }
      }
    }

    return NextResponse.json(data, {
      headers: {
        "Access-Control-Allow-Origin": "*",
        "Access-Control-Allow-Methods": "GET, OPTIONS",
        "Access-Control-Allow-Headers": "Content-Type",
      },
    });
  } catch (error) {
    return NextResponse.json(
      { error: "Failed to fetch from News API" },
      { status: 500 }
    );
  }
}

export async function OPTIONS(request: Request) {
  return NextResponse.json(
    {},
    {
      headers: {
        "Access-Control-Allow-Origin": "*",
        "Access-Control-Allow-Methods": "GET, OPTIONS",
        "Access-Control-Allow-Headers": "Content-Type",
      },
    }
  );
}
