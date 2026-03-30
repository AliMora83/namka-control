import { NextResponse } from "next/server";

const GITHUB_API = "https://api.github.com";

export async function GET() {
  const owner  = process.env.GITHUB_OWNER  ?? "AliMora83";
  const repo   = process.env.GITHUB_REPO   ?? "namka-control";
  const branch = process.env.GITHUB_BRANCH ?? "main";
  const token  = process.env.GITHUB_TOKEN;

  if (!token) {
    return NextResponse.json(
      { error: "GITHUB_TOKEN is not set", detail: "Set GITHUB_TOKEN in your environment variables." },
      { status: 500 }
    );
  }

  const headers = {
    Authorization: `Bearer ${token}`,
    Accept: "application/vnd.github.v3.raw",
    "X-GitHub-Api-Version": "2022-11-28",
  };

  try {
    // Fetch Master.md (metadata: version, date, phase, reviews)
    const masterRes = await fetch(
      `${GITHUB_API}/repos/${owner}/${repo}/contents/Master.md?ref=${branch}`,
      { headers, next: { revalidate: 60 } }
    );

    if (!masterRes.ok) {
      return NextResponse.json(
        { error: "GitHub API error", detail: `Master.md fetch failed: ${masterRes.status} ${masterRes.statusText}` },
        { status: 502 }
      );
    }

    // Fetch Active-Projects.md (all project data)
    const projectsRes = await fetch(
      `${GITHUB_API}/repos/${owner}/${repo}/contents/Active-Projects.md?ref=${branch}`,
      { headers, next: { revalidate: 60 } }
    );

    if (!projectsRes.ok) {
      return NextResponse.json(
        { error: "GitHub API error", detail: `Active-Projects.md fetch failed: ${projectsRes.status} ${projectsRes.statusText}` },
        { status: 502 }
      );
    }

    const raw         = await masterRes.text();
    const projectsRaw = await projectsRes.text();

    return NextResponse.json({ raw, projectsRaw, projectSource: "Active-Projects.md" });

  } catch (err) {
    const message = err instanceof Error ? err.message : "Unknown error";
    return NextResponse.json(
      { error: "Internal server error", detail: message },
      { status: 500 }
    );
  }
}
