const fs = require('fs');
const path = require('path');
const { execSync } = require('child_process');

const REPOS = [
  { name: "Kora-Tutor", path: "../Nama Language" },
  { name: "Namka Control Dashboard", path: "." },
  { name: "Odoo-BA-API", path: "../Odoo-BA-API" },
  { name: "Odoo-POS-Terminal", path: "../Odoo POS/odoo-pos-terminal" },
  { name: "EventSaas", path: "../EventSAAS" },
  { name: "SmartPress", path: "../SmartCompress/smart-compressor" },
  { name: "Atlas-Website", path: "../Atlas" },
  { name: "Event Serve", path: "../Events Website" }
];

function getProjectSync(repoPath, name) {
  const masterPath = path.join(repoPath, 'Master.md');
  let version = "0.0.0";
  let lastUpdated = new Date().toISOString().split('T')[0];

  if (fs.existsSync(masterPath)) {
    const content = fs.readFileSync(masterPath, 'utf8');
    const vMatch = content.match(/Version:\s*([\d.]+)/);
    if (vMatch) version = vMatch[1];
    const uMatch = content.match(/Last updated:\s*(\d{4}-\d{2}-\d{2})/);
    if (uMatch) lastUpdated = uMatch[1];
  }

  let commitMsg = "Initial sync";
  let sha = "unknown";
  try {
    commitMsg = execSync('git log -1 --pretty=%B', { cwd: repoPath }).toString().trim();
    sha = execSync('git rev-parse --short HEAD', { cwd: repoPath }).toString().trim();
  } catch (e) {}

  return {
    project: name,
    repo: `AliMora83/${name.toLowerCase().replace(/ /g, '-')}`, // Approximate
    branch: "main",
    stack: "TypeScript / Next.js / Tailwind", // Fallback
    status: "Active",
    priority: 2,
    priority_label: "🟡 Priority 2 — Active Development",
    progress_percent: 50,
    progress_label: "Development in progress",
    current_phase: "Phase 1",
    next_step: "See Master.md",
    blocker: null,
    live_url: null,
    deploy_target: "Hostinger VPS",
    agents: ["AG"],
    version: version,
    last_push: {
      timestamp: new Date().toISOString(),
      actor: "AliMora83",
      commit_message: commitMsg,
      sha: sha
    },
    last_updated: lastUpdated
  };
}

async function bootstrap() {
  for (const repo of REPOS) {
    const fullPath = path.resolve(__dirname, '..', repo.path);
    console.log(`Processing ${repo.name} at ${fullPath}...`);
    
    if (!fs.existsSync(fullPath)) {
      console.warn(`Path ${fullPath} does not exist. Skipping.`);
      continue;
    }

    const syncData = getProjectSync(fullPath, repo.name);
    const syncFilePath = path.join(fullPath, 'PROJECT-SYNC.json');
    
    fs.writeFileSync(syncFilePath, JSON.stringify(syncData, null, 2));
    console.log(`✅ Generated local PROJECT-SYNC.json for ${repo.name}`);

    try {
      execSync('git add PROJECT-SYNC.json && git commit -m "chore: bootstrap project-sync metadata" && git push origin main', { cwd: fullPath });
      console.log(`🚀 Pushed to origin main for ${repo.name}`);
    } catch (e) {
      console.error(`❌ Failed to push for ${repo.name}: ${e.message}`);
    }
  }
}

bootstrap();
