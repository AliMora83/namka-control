import { NextResponse } from "next/server";

const GITHUB_API = "https://api.github.com";

export async function GET() {
  const owner  = process.env.GITHUB_OWNER  ?? "AliMora83";
  const repo   = process.env.GITHUB_REPO   ?? "namka-control";
  const branch = process.env.GITHUB_BRANCH ?? "main";
  const token  = process.env.GITHUB_TOKEN;

  if (!token) {
    return NextResponse.json(
      { error: "GITHUB_TOKEN is not set" },
      { status: 500 }
    );
  }

  const url = `${GITHUB_API}/repos/${owner}/${repo}/contents/Master.md?ref=${branch}`;

  const res = await fetch(url, {
    headers: {
      Authorization: `Bearer ${token}`,
      Accept: "application/vnd.github.v3.raw",
      "X-GitHub-Api-Version": "2022-11-28",
    },
    next: { revalidate: 60 }, // ISR: revalidate every 60 seconds
  });

  if (!res.ok) {
    return NextResponse.json(
      { error: `GitHub API error: ${res.status} ${res.statusText}` },
      { status: res.status }
    );
  }

  const raw = await res.text();
  return NextResponse.json({ raw });
}
