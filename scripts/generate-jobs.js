// Script to generate realistic job data for employers
// Run: node scripts/generate-jobs.js

const fs = require("fs");
const path = require("path");

const employers = JSON.parse(
  fs.readFileSync(path.join(__dirname, "..", "src", "data", "employers.json"), "utf-8"),
);

const SECTOR_ROLES = {
  "Information technology and telecoms": [
    { title: "Cyber Security Analyst", score: 155, keywords: ["cyber", "cyber security", "security analyst", "analyst"] },
    { title: "IT Support Technician", score: 0, keywords: [] },
    { title: "Software Developer", score: 0, keywords: [] },
    { title: "Network Engineer", score: 35, keywords: ["network security"] },
    { title: "Data Analyst", score: 20, keywords: ["analyst"] },
    { title: "Junior Cyber Security Apprentice", score: 135, keywords: ["cyber", "cyber security", "junior analyst", "apprentice", "apprenticeship"] },
    { title: "SOC Analyst", score: 75, keywords: ["soc", "analyst"] },
    { title: "Cloud Security Engineer", score: 55, keywords: ["cloud security", "security engineer"] },
    { title: "Security Consultant", score: 0, keywords: [] },
    { title: "Graduate Threat Intelligence Analyst", score: 112, keywords: ["threat intelligence", "intelligence", "analyst", "graduate"] },
  ],
  "Health": [
    { title: "Digital Security Apprentice", score: 175, keywords: ["digital", "apprentice", "apprenticeship", "information security"] },
    { title: "Data Protection Officer", score: 45, keywords: ["digital", "risk", "data protection", "gdpr"] },
    { title: "IT Support Officer", score: 0, keywords: [] },
    { title: "Cyber Security Trainee", score: 120, keywords: ["cyber", "cyber security", "trainee", "it security"] },
    { title: "Information Governance Manager", score: 30, keywords: ["governance", "risk", "compliance"] },
    { title: "Administrator", score: 0, keywords: [] },
    { title: "Graduate Management Trainee", score: 30, keywords: ["graduate"] },
    { title: "Digital Transformation Lead", score: 18, keywords: ["digital"] },
  ],
  "Education or teaching": [
    { title: "IT Apprentice", score: 85, keywords: ["apprentice", "apprenticeship", "it security"] },
    { title: "Cyber Security Lecturer", score: 60, keywords: ["cyber", "cyber security"] },
    { title: "Data Protection and Compliance Officer", score: 45, keywords: ["data protection", "gdpr", "compliance"] },
    { title: "ICT Technician", score: 0, keywords: [] },
    { title: "Digital Skills Trainer", score: 18, keywords: ["digital"] },
    { title: "Trainee IT Teacher", score: 30, keywords: ["trainee"] },
    { title: "Network Manager", score: 0, keywords: [] },
    { title: "Graduate Teaching Assistant", score: 30, keywords: ["graduate"] },
  ],
  "Financial services": [
    { title: "Cyber Security Analyst", score: 155, keywords: ["cyber", "cyber security", "security analyst", "analyst"] },
    { title: "Risk and Compliance Analyst", score: 52, keywords: ["risk", "analyst", "compliance"] },
    { title: "Fraud Analyst", score: 45, keywords: ["fraud analyst", "analyst"] },
    { title: "IT Auditor", score: 20, keywords: ["audit"] },
    { title: "Data Protection Manager", score: 50, keywords: ["data protection", "gdpr", "compliance"] },
    { title: "Graduate Cyber Trainee", score: 105, keywords: ["cyber", "trainee", "graduate"] },
    { title: "Business Analyst", score: 0, keywords: [] },
    { title: "Apprentice Finance Assistant", score: 35, keywords: ["apprentice", "apprenticeship"] },
  ],
  "Public sector": [
    { title: "Cyber Security Officer", score: 110, keywords: ["cyber", "cyber security"] },
    { title: "Information Security Analyst", score: 75, keywords: ["information security", "infosec", "analyst"] },
    { title: "Digital Services Manager", score: 18, keywords: ["digital"] },
    { title: "GDPR Compliance Officer", score: 40, keywords: ["gdpr", "compliance", "data protection"] },
    { title: "IT Apprentice", score: 85, keywords: ["apprentice", "apprenticeship"] },
    { title: "Risk Manager", score: 12, keywords: ["risk"] },
    { title: "Business Continuity Officer", score: 30, keywords: ["business continuity", "resilience"] },
  ],
  "Voluntary, charity and social enterprise": [
    { title: "Digital Inclusion Officer", score: 18, keywords: ["digital"] },
    { title: "IT Support Apprentice", score: 85, keywords: ["apprentice", "apprenticeship"] },
    { title: "Data Protection Coordinator", score: 45, keywords: ["data protection", "gdpr", "compliance"] },
    { title: "Cyber Security Volunteer Coordinator", score: 45, keywords: ["cyber", "cyber security"] },
  ],
};

const DEFAULT_ROLES = [
  { title: "IT Support Officer", score: 0, keywords: [] },
  { title: "Digital Coordinator", score: 18, keywords: ["digital"] },
  { title: "Apprentice Administrator", score: 35, keywords: ["apprentice", "apprenticeship"] },
  { title: "Graduate Trainee", score: 30, keywords: ["graduate", "trainee"] },
  { title: "Data Protection Assistant", score: 45, keywords: ["data protection", "gdpr"] },
  { title: "Risk and Compliance Assistant", score: 12, keywords: ["risk", "compliance"] },
];

const TYPES = ["Full-time", "Part-time", "Apprenticeship", "Graduate", "Trainee", "Contract"];
const NOW = new Date();
const ATS_PLATFORMS = ["greenhouse", "workday", "lever", "smartrecruiters", "nhs_jobs", "trac", "job_portal", ""];

function randomItem(arr) {
  return arr[Math.floor(Math.random() * arr.length)];
}

function randomDate(daysBack) {
  const d = new Date(NOW);
  d.setDate(d.getDate() - Math.floor(Math.random() * daysBack));
  return d.toISOString().split("T")[0];
}

function randomClosingDate() {
  const d = new Date(NOW);
  d.setDate(d.getDate() + 14 + Math.floor(Math.random() * 45));
  return d.toISOString().split("T")[0];
}

function randomSalary(level) {
  const bands = {
    Committed: { min: 18000, max: 35000 },
    Employer: { min: 22000, max: 45000 },
    Leader: { min: 28000, max: 65000 },
  };
  const band = bands[level] || bands.Committed;
  const low = band.min + Math.floor(Math.random() * 15000);
  const high = low + 5000 + Math.floor(Math.random() * 15000);
  return `${low.toLocaleString()} - ${high.toLocaleString()}`;
}

const JOBS_PER_EMPLOYER_MIN = 1;
const JOBS_PER_EMPLOYER_MAX = 6;

const jobs = [];
let jobId = 1;

for (const employer of employers) {
  const roles = SECTOR_ROLES[employer.sector] || DEFAULT_ROLES;
  const numJobs = JOBS_PER_EMPLOYER_MIN + Math.floor(Math.random() * (JOBS_PER_EMPLOYER_MAX - JOBS_PER_EMPLOYER_MIN + 1));

  const selectedRoles = [];
  const shuffled = [...roles].sort(() => Math.random() - 0.5);
  for (let i = 0; i < Math.min(numJobs, shuffled.length); i++) {
    selectedRoles.push(shuffled[i]);
  }

  for (const role of selectedRoles) {
    const employmentType = role.keywords.includes("apprentice") || role.keywords.includes("apprenticeship")
      ? "Apprenticeship"
      : role.keywords.includes("graduate")
      ? "Graduate"
      : role.keywords.includes("trainee")
      ? "Trainee"
      : randomItem(TYPES);

    const salary = randomSalary(employer.level);
    const slug = role.title.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/(^-|-$)/g, "");

    jobs.push({
      id: `job-${jobId}`,
      employerId: employer.id,
      title: role.title,
      sourceUrl: `https://careers.${employer.name.toLowerCase().replace(/[^a-z0-9]/g, "")}.example.com/jobs/${slug}-${jobId}`,
      careersUrl: `https://careers.${employer.name.toLowerCase().replace(/[^a-z0-9]/g, "")}.example.com`,
      location: employer.town || employer.region,
      description: `We are looking for a ${role.title.toLowerCase()} to join our team in ${employer.town || employer.region}. This is an excellent opportunity to work within a Disability Confident ${employer.level.toLowerCase()} organisation. You will be part of a supportive team with opportunities for development and progression. Reasonable adjustments are available throughout the recruitment process.`,
      datePosted: randomDate(60),
      closingDate: randomClosingDate(),
      employmentType,
      salary: `£${salary} per year`,
      ats: randomItem(ATS_PLATFORMS),
      relevanceScore: role.score,
      matchedKeywords: role.keywords,
    });
    jobId++;
  }
}

fs.writeFileSync(
  path.join(__dirname, "..", "src", "data", "jobs.json"),
  JSON.stringify(jobs, null, 2),
  "utf-8",
);

console.log(`Generated ${jobs.length} jobs for ${employers.length} employers`);
console.log(`Cyber priority jobs (score >= 30): ${jobs.filter((j) => j.relevanceScore >= 30).length}`);
