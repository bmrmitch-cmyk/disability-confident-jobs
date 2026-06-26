export type Article = {
  slug: string;
  title: string;
  excerpt: string;
  body: string[];
  category: string;
  readTime: string;
};

export const articles: Article[] = [
  {
    slug: "best-jobs-adhd",
    title: "Best Jobs if you have ADHD",
    category: "Neurodiversity",
    readTime: "6 min",
    excerpt: "From cybersecurity to emergency services — roles that play to the strengths of an ADHD brain.",
    body: [
      'ADHD brains thrive on variety, urgency, and hands-on problem-solving. The best jobs channel that energy rather than fighting it. Cybersecurity incident response, for example, demands quick pattern recognition and the ability to hyperfocus during a live threat — both natural ADHD strengths. Emergency services like paramedic or firefighter provide constant novelty and clear, high-stakes protocols.',
      'Sales development is another strong fit. The short feedback loops, competitive structure, and permission to move fast between leads keep dopamine flowing. For the same reason, creative production roles in video editing, game design, or UX prototyping offer a mix of open-ended exploration and tight deadlines.',
      'What matters most is the workplace itself. Disability Confident employers at Leader level often provide flexible hours, noise-cancelling headphones as a standard desk option, written instructions alongside verbal briefings, and regular check-ins that help with task organisation. These adjustments cost little but make ADHD-friendly roles genuinely sustainable.',
      'If you are job hunting with ADHD, look for job ads that mention "fast-paced", "self-starter", or "varied workload" — these often signal environments where ADHD traits are seen as assets rather than liabilities.',
    ],
  },
  {
    slug: "autism-pay-gap",
    title: "Why is there such a Large Autism Pay Gap?",
    category: "Research",
    readTime: "8 min",
    excerpt: "Autistic workers earn 34% less on average. The reasons are structural — and fixable.",
    body: [
      'Research from the Office for National Statistics and Autistica consistently shows an autism pay gap of around 34% in the UK — larger than the gender pay gap or the disability pay gap as a whole. This is not simply about education or skill levels; autistic people are actually more likely to hold degrees than the general population.',
      'The gap stems from systematic exclusion during recruitment. Traditional panel interviews penalise autistic candidates by weighting eye contact, small talk, and reading social cues above actual competency. Once in work, autistic employees are less likely to be promoted because networking, self-promotion, and informal mentorship opportunities often bypass them.',
      'There is also a sector divide. Autistic workers are overrepresented in low-paid administrative and IT support roles and underrepresented in senior leadership, even within the same organisation. Many employers still equate autism with a lack of "cultural fit" rather than recognising the deep focus, pattern recognition, and honesty it brings.',
      'Disability Confident employers at Leader level are beginning to fix this. They offer structured interview formats with questions sent in advance, work-sample tests instead of panel grilling, autism mentors, and quiet workspaces. The best also track pay and promotion data by neurotype — because what gets measured gets acted on.',
    ],
  },
  {
    slug: "what-employers-want-to-know",
    title: "What Employers want to know?",
    category: "Advice",
    readTime: "5 min",
    excerpt: "The questions employers actually ask about disability — and how to answer them with confidence.",
    body: [
      'When employers find out a candidate has a disability, most want to know three things: can you do the job safely, what adjustments will you need, and how much will it cost them. These are rarely asked directly, but they shape every stage of the hiring process.',
      'The safest way to address the first question is to focus on outcomes. Every job description is a list of outcomes the employer wants delivered. Frame your CV and interview answers around what you have achieved, not how you achieved it. If an adjustment was part of the process, name the outcome — not the adjustment itself.',
      'On adjustments, most employers overestimate the cost. The Access to Work scheme covers 100% of approved adjustments for newly hired disabled employees, including specialist equipment, BSL interpreters, taxi fares when public transport is inaccessible, and even support workers. Telling an employer "this is fully funded by Access to Work" removes their financial concern instantly.',
      'The third question — cultural fit — is where Disability Confident status matters most. Leaders and Employers have signed a public commitment to inclusive hiring. If you feel an interview is assessing you unfairly on disability-related grounds, you can gently remind them of their Disability Confident pledge. Most will course-correct immediately.',
    ],
  },
  {
    slug: "what-reasonable-adjustments",
    title: "What Reasonable Adjustments do I Need?",
    category: "Guide",
    readTime: "7 min",
    excerpt: "A step-by-step guide to identifying the adjustments that will actually help you thrive at work.",
    body: [
      'Reasonable adjustments are changes an employer must make so a disabled person is not substantially disadvantaged at work. The legal duty sits in the Equality Act 2010 and covers everything from physical access to how information is communicated. But knowing your rights is only half the battle — you also need to know what will actually help.',
      'Start by auditing your current or past work environments. What drained your energy? What made a good day good? Common adjustments fall into five buckets: physical (ergonomic chair, standing desk, step-free access), sensory (quiet workspace, dimmable lighting, fragrance-free policy), communication (BSL interpreter, captioned meetings, written follow-ups), flexibility (staggered hours, homeworking, extra breaks), and technology (speech-to-text, screen reader, ergonomic keyboard).',
      'The best way to figure out what you need is to keep a "barrier log" for a week. Every time you hit a wall — mentally, physically, or practically — write it down. After seven days, patterns will emerge. Those patterns are your adjustment wishlist.',
      'Present that list to an employer as suggestions, not demands. Most Disability Confident employers will implement at least 80% of what you ask for. If they hesitate, point them to the Access to Work scheme, which covers the cost. You can even apply for Access to Work before you have a job offer — the assessment wait time is currently 8-10 weeks, so apply early.',
    ],
  },
  {
    slug: "reasonable-adjustments-statistics",
    title: "Statistics on How Reasonable Adjustments Improve Work Outcomes",
    category: "Research",
    readTime: "6 min",
    excerpt: "The data is clear: adjustments boost productivity, retention, and wellbeing — often at zero net cost.",
    body: [
      'A 2023 study by the Centre for Mental Health found that 72% of employees who received reasonable adjustments reported higher productivity, and 68% said they were less likely to leave their job in the next 12 months. The median cost of an adjustment was just £75, and 62% of adjustments cost nothing at all — they were simply changes to policy, communication style, or working hours.',
      'The Department for Work and Pensions estimates that for every £1 spent on Access to Work adjustments, the UK economy gains £1.50 through reduced sickness absence, higher output, and lower staff turnover. That is a 50% social return on investment, before counting the human impact on individual lives.',
      'Deloitte research on neurodiversity programmes found that companies proactively offering adjustments saw 30% higher retention rates among neurodivergent staff and 25% higher team-level productivity. The same report noted that inclusive recruitment processes (including adjustments at interview) expanded the talent pool by an average of 16% without reducing quality of hire.',
      'Perhaps the most compelling statistic: 89% of employees who received a reasonable adjustment said it had improved their mental health at work. Reduced presenteeism, fewer sick days, and higher engagement follow naturally. Adjustments are not a cost — they are an investment with measurable, rapid returns.',
    ],
  },
  {
    slug: "how-to-disclose-disability-in-interview",
    title: "How to Disclose a Disability in a Job Interview",
    category: "Advice",
    readTime: "5 min",
    excerpt: "Should you tell an employer about your disability before or after the offer? Here is the strategy.",
    body: [
      'Disclosing a disability in an interview is a personal decision with no right answer. Legally, you do not have to disclose at any stage. Practically, disclosure unlocks reasonable adjustments and can protect you from being performance-managed for disability-related issues later. The key is timing and framing.',
      'If you need adjustments at interview — a quiet room, extra time, questions in advance — disclose early enough for the employer to arrange them. You can do this on the application form or in a brief email to HR. You do not need to name your condition; just state what you need. Example: "I would find it helpful to receive interview questions 24 hours in advance. Please let me know if this is possible."',
      'If you do not need interview adjustments but want adjustments in the role, the safest time to disclose is after receiving an offer but before signing the contract. At this point the employer has already decided they want you, and the Equality Act 2010 makes it unlawful to withdraw an offer because of a disability. You can then negotiate adjustments as a new hire, supported by Access to Work.',
      'Some candidates choose to disclose during the interview itself as a way of being authentic and signalling confidence. This can work well when framed positively: "I want you to know that I am autistic, and one reason I applied is that your Disability Confident commitment suggests you already have structures in place to support neurodivergent employees." This turns disclosure into a compliment to the employer, not a risk.',
    ],
  },
  {
    slug: "disability-confident-scheme-explained",
    title: "The Disability Confident Scheme Explained",
    category: "Guide",
    readTime: "7 min",
    excerpt: "What each Disability Confident level actually means for jobseekers — and how to use the status to your advantage.",
    body: [
      'The Disability Confident scheme has three levels: Committed, Employer, and Leader. Each represents a different stage of inclusive hiring maturity, and understanding the difference helps you prioritise which employers to target.',
      'Committed is the entry level. The employer has signed a pledge to take at least one action — such as advertising a job through Disability Confident channels or offering one work experience placement. It is a start, but it does not guarantee adjustments or inclusive processes. Treat Committed employers as you would any other organisation; the scheme is a signal of intent, not a guarantee of practice.',
      'Employer level means the organisation has implemented a specific action plan covering recruitment, retention, and development of disabled staff. They have published a disability policy, offered training to hiring managers, and reviewed their recruitment process for barriers. These employers are more likely to have a named disability contact and a clear adjustments process. They are a safer bet for jobseekers who need modifications.',
      'Leader is the gold standard. These organisations have evidence of outcomes — higher disabled representation, employee network groups, published disability pay gaps, and adjustments embedded as a standard offer rather than an exception. Leaders include many government departments, NHS trusts, and large private-sector employers like Lloyds, Barclays, and BT. If you see a Leader badge on a job ad, you can be confident the organisation has done the work.',
    ],
  },
  {
    slug: "remote-work-disability-perfect-match",
    title: "Remote Work and Disability: A Perfect Match?",
    category: "Advice",
    readTime: "5 min",
    excerpt: "Why remote and hybrid working has been transformative for disabled employees — and how to find genuinely flexible employers.",
    body: [
      'The shift to remote and hybrid work since 2020 has been one of the most impactful reasonable adjustments ever introduced. For disabled employees, homeworking removes commuting fatigue, allows full control over sensory environment, and makes it easier to manage health conditions alongside work. A 2022 Scope survey found that 67% of disabled people wanted to work remotely most or all of the time.',
      'But not all remote jobs are genuinely accessible. Some employers expect cameras on at all times, which can be exhausting for autistic employees or those with energy-limiting conditions. Others track keyboard activity or require instant Slack responses, creating a new kind of surveillance that replaces office-based barriers with digital ones.',
      'Look for employers who offer "remote by default" policies rather than ad-hoc arrangements. Disability Confident Leaders tend to have formal remote-work policies that include provision for equipment at home, contributions to heating and internet costs, and clear boundaries around core hours. Avoid roles that say "occasional remote" or "hybrid with 3 days mandatory in-office" unless you live very close to the office.',
      'The best clue is how the job ad itself is written. If it specifies "remote UK-wide" and mentions adjustments in the body of the advert, the employer has thought about inclusion. If remote work is buried in the small print or mentioned as something you can "discuss at interview", it may be more of a negotiation than a right.',
    ],
  },
];
