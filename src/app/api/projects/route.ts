import { NextResponse } from "next/server";
import { getAggregatedProjects } from "@/lib/getProjects";

export async function GET() {
  const data = await getAggregatedProjects();
  
  if (data.projects.length === 0 && data.errors.length > 0) {
     const isAuthError = data.errors.some(e => e.includes("GITHUB_TOKEN"));
     if (isAuthError) {
        return NextResponse.json({ error: "GITHUB_TOKEN is not correctly configured" }, { status: 500 });
     }
  }

  return NextResponse.json(data);
}
