import sqlite3, json, sys, os

# read
with open(os.path.join("src", "data", "jobs.json"), "r", encoding="utf-8") as f:
    jobs = json.load(f)

# create db
db_path = os.path.join("src", "data", "jobs.db")
if os.path.exists(db_path):
    os.remove(db_path)
conn = sqlite3.connect(db_path)
conn.execute("PRAGMA journal_mode=WAL")
conn.execute("PRAGMA synchronous=OFF")

conn.execute("""
CREATE TABLE jobs (
    id TEXT PRIMARY KEY,
    employerId TEXT,
    title TEXT,
    sourceUrl TEXT,
    careersUrl TEXT,
    location TEXT,
    description TEXT,
    datePosted TEXT,
    closingDate TEXT,
    employmentType TEXT,
    salary TEXT,
    ats TEXT,
    relevanceScore INTEGER,
    matchedKeywords TEXT
)
""")

conn.execute("CREATE INDEX idx_employer ON jobs(employerId)")
conn.execute("CREATE INDEX idx_location ON jobs(location)")
conn.execute("CREATE INDEX idx_type ON jobs(employmentType)")
conn.execute("CREATE INDEX idx_score ON jobs(relevanceScore)")
conn.execute("CREATE INDEX idx_title ON jobs(title)")

for j in jobs:
    conn.execute(
        "INSERT INTO jobs VALUES (?,?,?,?,?,?,?,?,?,?,?,?,?,?)",
        (
            j["id"], j.get("employerId",""), j.get("title",""),
            j.get("sourceUrl",""), j.get("careersUrl",""),
            j.get("location",""), j.get("description",""),
            j.get("datePosted",""), j.get("closingDate",""),
            j.get("employmentType",""), j.get("salary",""),
            j.get("ats",""), int(j.get("relevanceScore",0)),
            j.get("matchedKeywords","")
        )
    )

conn.commit()
conn.close()

# also build employers db
with open(os.path.join("src", "data", "employers.json"), "r", encoding="utf-8") as f:
    employers = json.load(f)

emp_db = os.path.join("src", "data", "employers.db")
if os.path.exists(emp_db):
    os.remove(emp_db)
conn = sqlite3.connect(emp_db)
conn.execute("PRAGMA journal_mode=WAL")

conn.execute("""
CREATE TABLE employers (
    id TEXT PRIMARY KEY,
    name TEXT,
    townCity TEXT,
    postcode TEXT,
    sector TEXT,
    dcLevel TEXT,
    region TEXT,
    isNew TEXT
)
""")

for e in employers:
    conn.execute(
        "INSERT INTO employers VALUES (?,?,?,?,?,?,?,?)",
        (
            e.get("id",""), e.get("name",""), e.get("townCity",""),
            e.get("postcode",""), e.get("sector",""), e.get("dcLevel",""),
            e.get("region",""), e.get("isNew","")
        )
    )

conn.commit()
conn.close()

print(f"Created jobs.db ({len(jobs)} rows) and employers.db ({len(employers)} rows)")
