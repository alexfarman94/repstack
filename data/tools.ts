import { Tool } from '@/lib/types';

export const tools: Tool[] = [
  {
    id: '1',
    slug: 'deal-prep-brief',
    title: 'Deal Prep Brief',
    description: 'Generate a thorough research brief for any discovery call in under 2 minutes. Walk in knowing the business, the pain, and the opportunity.',
    body: 'Before any important call — discovery, demo, or EBC — you need context. This prompt turns a company name, contact name, and job title into a structured brief covering business model, likely pain points, relevant news, competitive landscape, and suggested discovery questions. Built to work with ChatGPT, Claude, or any frontier model.',
    useCases: [
      'Pre-discovery call research for net-new accounts',
      'Prepping for an enterprise demo or executive briefing',
      'Refreshing context before a re-engagement call',
    ],
    howToUse: [
      'Copy the prompt below',
      'Paste it into ChatGPT, Claude, or your preferred AI',
      'Replace the bracketed fields with your prospect\'s details',
      'Review the output and add any deal-specific context you already have',
    ],
    personas: ['ae', 'se'],
    format: 'prompt',
    tags: ['research', 'discovery', 'preparation'],
    free: true,
    featured: true,
    publishedAt: '2025-03-01',
    content: `You are a senior B2B sales strategist preparing a rep for an important call.

Research the following prospect and produce a structured deal prep brief:

- Company: [COMPANY NAME]
- Contact: [CONTACT NAME], [JOB TITLE]
- My product/solution: [BRIEF DESCRIPTION OF YOUR PRODUCT]
- Meeting type: [discovery call / demo / EBC / re-engagement]

Please provide:

## Company Overview
A 3–4 sentence summary of what the company does, their business model, size, and market position.

## Recent News & Triggers
Any recent press, funding, leadership changes, product launches, or strategic announcements that are relevant.

## Likely Pain Points
Based on their industry, size, and the contact's role — what problems are they probably trying to solve? What keeps someone in this role up at night?

## Competitive Landscape
Who are their main competitors? Are there any known tech vendors or tools they might already use?

## Suggested Discovery Questions
5–7 sharp, open-ended questions tailored to this contact's role that will uncover budget, authority, need, and timeline.

## Talk Track Suggestion
A 2–3 sentence opening that acknowledges something specific about their business and positions my product naturally.

Keep the tone sharp and actionable. This is for an experienced rep who wants insight, not padding.`,
  },
  {
    id: '2',
    slug: 'business-case-builder',
    title: 'Business Case Builder',
    description: 'Turn your call notes into a structured business case your champion can share upward — in minutes, not hours.',
    body: 'The biggest deals stall because champions can\'t articulate the value internally. This prompt takes your discovery notes and builds a clean, executive-ready business case with ROI framing, strategic rationale, and risk mitigation. Designed to help your champion sell when you\'re not in the room.',
    useCases: [
      'Arming a champion with internal justification material',
      'Preparing a business case ahead of an executive sign-off meeting',
      'Structuring a commercial proposal narrative',
    ],
    howToUse: [
      'After your discovery or demo call, paste your notes into the prompt',
      'Fill in the metrics and context from your conversation',
      'Run it through ChatGPT or Claude',
      'Edit the output to match your champion\'s internal language',
    ],
    personas: ['ae', 'se'],
    format: 'prompt',
    tags: ['business-case', 'roi', 'champion', 'enterprise'],
    free: true,
    featured: true,
    publishedAt: '2025-03-01',
    content: `You are a strategic business consultant helping a B2B sales rep build a compelling internal business case for their champion to share with leadership.

Using the information below, write a structured business case document:

**Company:** [COMPANY NAME]
**Champion:** [CHAMPION NAME & TITLE]
**Their key pain points:** [LIST 2–3 MAIN PROBLEMS FROM DISCOVERY]
**Current situation / cost of doing nothing:** [WHAT HAPPENS IF THEY DON'T CHANGE]
**Expected outcomes with our solution:** [METRICS, EFFICIENCY GAINS, REVENUE IMPACT]
**Investment level (if known):** [ROUGH COST OR LEAVE BLANK]
**Timeline:** [WHEN THEY WANT TO SEE RESULTS]

Produce the following sections:

## Executive Summary
2–3 sentences for a C-suite reader. Problem, solution, expected outcome.

## Current State & Business Impact
Describe the current situation and quantify the cost — in time, revenue, risk, or efficiency.

## Proposed Solution
What we're recommending and why it fits their specific context.

## Expected Return on Investment
Frame the ROI clearly. Use conservative estimates. Show the maths if numbers were provided.

## Strategic Fit
Why this initiative aligns with their likely business priorities (growth, efficiency, risk reduction, competitive positioning).

## Risk of Inaction
What they're leaving on the table by delaying.

## Recommended Next Steps
3 clear actions with owners and a timeline.

Write in clear, professional language suitable for a VP or C-suite audience. Avoid jargon. Be specific where numbers exist; use ranges where they don't.`,
  },
  {
    id: '3',
    slug: 'rfp-response-pro',
    title: 'RFP Response Pro',
    description: 'Respond to any RFP section in a fraction of the time. Structured, professional, and tailored to your solution.',
    body: 'RFPs are time-consuming and repetitive. This prompt helps you respond to any question or section quickly — with responses that are structured, confident, and position your solution clearly. Works best when you paste the RFP question directly into the prompt alongside your product context.',
    useCases: [
      'Responding to a specific RFP question or section',
      'Drafting an executive summary for a formal proposal',
      'Turning bullet-point product capabilities into narrative prose',
    ],
    howToUse: [
      'Copy the prompt',
      'Paste it into your AI tool of choice',
      'Replace the placeholders with the actual RFP question and your product details',
      'Review and refine — the AI gives you a strong first draft, you add the nuance',
    ],
    personas: ['se', 'ae'],
    format: 'prompt',
    tags: ['rfp', 'proposal', 'writing', 'enterprise'],
    free: true,
    featured: false,
    publishedAt: '2025-03-05',
    content: `You are an experienced enterprise solutions consultant writing a formal RFP response on behalf of a B2B technology company.

**RFP Question / Section:**
[PASTE THE EXACT RFP QUESTION OR SECTION HEADER HERE]

**Our product / solution:**
[BRIEF DESCRIPTION — WHAT IT DOES, WHO IT'S FOR, KEY CAPABILITIES]

**Key differentiators to weave in:**
[2–3 THINGS THAT SET YOUR SOLUTION APART]

**Tone:** Professional, confident, and specific. This is a formal procurement process.

Write a response that:
1. Directly addresses the question without fluff
2. Positions our solution clearly and confidently
3. Uses specific language (avoid vague terms like "best-in-class" without evidence)
4. Is structured with clear paragraphs or bullet points where appropriate
5. Ends with a sentence that ties back to their business outcome

Target length: 150–300 words unless the question warrants more detail.

After the response, add a brief [EDITOR NOTE] flagging any assumptions made or areas where more specific information would strengthen the answer.`,
  },
  {
    id: '4',
    slug: 'cold-email-generator',
    title: 'Cold Email Generator',
    description: 'Write cold outreach emails that get replies — personalised to the prospect\'s role, company, and likely pain points.',
    body: 'Generic cold emails get ignored. This prompt generates personalised cold outreach for any prospect — with a relevant hook, a clear value proposition, and a low-friction CTA. Designed for high-volume prospecting where quality still matters.',
    useCases: [
      'Net-new outreach to a target account list',
      'Re-engaging a cold prospect with a fresh angle',
      'Writing a sequence of follow-up emails after initial contact',
    ],
    howToUse: [
      'Copy the prompt',
      'Fill in the prospect details and your product context',
      'Run it through ChatGPT or Claude',
      'Personalise further with any specific intel you have on the prospect',
    ],
    personas: ['bdr'],
    format: 'prompt',
    tags: ['cold-outreach', 'email', 'prospecting', 'sequencing'],
    free: true,
    featured: true,
    publishedAt: '2025-03-05',
    content: `You are an elite B2B sales development rep writing a cold outreach email.

**Prospect details:**
- Name: [FIRST NAME]
- Title: [JOB TITLE]
- Company: [COMPANY NAME]
- Industry: [INDUSTRY]
- Company size: [APPROX HEADCOUNT OR REVENUE]

**My company / product:**
[WHAT YOU SELL — ONE SENTENCE]

**Key value proposition for this persona:**
[WHAT PROBLEM YOU SOLVE FOR SOMEONE IN THIS ROLE]

**Any specific trigger or personalisation angle (optional):**
[E.G. RECENT FUNDING, JOB POST, LINKEDIN ACTIVITY, MUTUAL CONNECTION]

Write a cold email that:
1. Opens with a personalised, relevant hook (not "I came across your profile")
2. Gets to the point in 2–3 sentences — what you do and why it matters to them
3. Includes one specific outcome or metric if possible
4. Ends with a single, low-friction CTA (not "let's get 30 minutes in the diary")
5. Is under 100 words total

After the email, suggest 2 alternative subject lines and a brief note on what makes this angle work for this persona.`,
  },
  {
    id: '5',
    slug: 'post-call-summary',
    title: 'Post-Call Summary',
    description: 'Turn messy call notes into a clean, shareable summary with next steps — ready to send to your prospect in minutes.',
    body: 'The 10 minutes after a call are the most valuable in the sales process. This prompt turns raw notes or transcripts into a structured follow-up email: what was discussed, what was agreed, and what happens next. Keeps deals moving and builds credibility with prospects.',
    useCases: [
      'Post-discovery follow-up email',
      'Internal deal update for your manager or CRM',
      'Champion-ready summary of a demo or EBC',
    ],
    howToUse: [
      'Immediately after your call, paste your notes or a transcript excerpt into the prompt',
      'Include the prospect\'s name, company, and meeting type',
      'Run it through your AI tool',
      'Send the output (lightly edited) to the prospect within the hour',
    ],
    personas: ['ae', 'bdr'],
    format: 'prompt',
    tags: ['follow-up', 'email', 'crm', 'next-steps'],
    free: true,
    featured: false,
    publishedAt: '2025-03-08',
    content: `You are an experienced B2B account executive writing a post-call follow-up.

**Meeting details:**
- Prospect name: [NAME]
- Company: [COMPANY]
- Meeting type: [discovery / demo / EBC / follow-up]
- Date: [DATE]

**My raw notes from the call:**
[PASTE YOUR NOTES OR TRANSCRIPT EXCERPT HERE]

**My product / solution:**
[ONE LINE DESCRIPTION]

Write two things:

## 1. External Follow-Up Email (to send to the prospect)
- Warm but professional tone
- Thank them for their time (briefly)
- Summarise the 3–4 key things discussed
- Confirm any actions agreed on both sides
- State the clear next step with a date or timeframe
- Keep it under 200 words

## 2. Internal CRM Note (for your own records)
- Bullet format
- Key pain points uncovered
- Budget / authority / timeline signals
- Objections raised
- Next step and owner
- Deal risk (if any)

Be specific. Use the prospect's own language where it appears in the notes.`,
  },
  {
    id: '6',
    slug: 'demo-customiser',
    title: 'Demo Customiser',
    description: 'Build a tailored demo narrative for any prospect — so every demo feels built for them, not pulled off the shelf.',
    body: 'A generic demo is a deal killer. This prompt takes your prospect\'s context and builds a personalised demo script — with the right opening narrative, which features to lead with, which to skip, and how to tie everything back to their specific pain. Built for SEs who do high-stakes demos.',
    useCases: [
      'Preparing a customised demo script for a key account',
      'Planning which features to highlight for a specific persona',
      'Building a "day in the life" narrative around the prospect\'s workflow',
    ],
    howToUse: [
      'Run deal prep first (use the Deal Prep Brief prompt) to get prospect context',
      'Copy this prompt and fill in the discovery findings',
      'Let the AI build a demo structure tailored to their pain',
      'Adapt the flow in your actual demo tool',
    ],
    personas: ['se', 'ae'],
    format: 'prompt',
    tags: ['demo', 'customisation', 'discovery', 'narrative'],
    free: true,
    featured: false,
    publishedAt: '2025-03-10',
    content: `You are a world-class Sales Engineer preparing a tailored product demo for a key prospect.

**Prospect context:**
- Company: [COMPANY NAME]
- Key contact: [NAME & TITLE]
- Industry: [INDUSTRY]
- Company size: [SIZE]
- Key pain points uncovered in discovery: [LIST 2–3]
- Current solution / status quo: [WHAT THEY'RE DOING TODAY]
- Desired outcome: [WHAT THEY WANT TO ACHIEVE]

**Our product:** [BRIEF DESCRIPTION]
**Demo duration:** [30 / 45 / 60 minutes]

Build a tailored demo plan with:

## Opening Narrative (2–3 minutes)
A "day in the life" story from the perspective of someone at their company experiencing the pain. Make it feel like you've been in their building.

## Demo Flow
A sequenced list of what to show and in what order — prioritised by what matters most to this prospect. For each section: what to show, why it matters to them, and what to say.

## Features to Avoid or Deprioritise
Based on their context, what's likely irrelevant or distracting for this audience.

## Proof Points to Weave In
Relevant customer stories, metrics, or case studies that will resonate with this prospect.

## Closing / Call to Action
How to end the demo and what next step to propose.

Tone: practical and specific. This is a working script, not a presentation deck.`,
  },
  {
    id: '7',
    slug: 'objection-handler',
    title: 'Objection Handler',
    description: 'Get sharp, confident responses to any sales objection — with the psychology and the words to use.',
    body: 'Objections are buying signals — but only if you handle them well. This prompt generates tailored responses to any objection, with the reasoning behind each approach and the exact language to use. Works across price, timing, competition, and internal resistance.',
    useCases: [
      'Preparing responses before a key negotiation or renewal',
      'Coaching a junior rep on how to handle a recurring objection',
      'Getting unstuck when a deal goes quiet after a specific concern',
    ],
    howToUse: [
      'Type the exact objection the prospect gave you (use their words)',
      'Add context about where you are in the deal',
      'Run the prompt',
      'Choose the approach that fits your relationship with the prospect',
    ],
    personas: ['ae', 'bdr'],
    format: 'prompt',
    tags: ['objection-handling', 'negotiation', 'closing', 'mindset'],
    free: true,
    featured: true,
    publishedAt: '2025-03-12',
    content: `You are a senior B2B sales coach helping a rep handle a prospect objection effectively.

**The objection (use the prospect's exact words if possible):**
[PASTE THE OBJECTION HERE]

**Deal context:**
- Stage: [early / mid / late / renewal]
- Relationship with prospect: [new contact / existing relationship]
- Any previous context on why this objection might be coming up:
[ANY RELEVANT BACKGROUND]

**My product:** [ONE LINE]

Provide:

## Why This Objection Is Happening
The real underlying concern beneath the surface objection. What is the prospect actually worried about?

## Three Response Approaches
For each one: the strategic angle, the exact words to use, and when to use this approach.

1. **Empathise and reframe** — acknowledge the concern and shift the perspective
2. **Probe deeper** — use a question to uncover the real issue
3. **Direct and confident** — address it head-on with evidence

## What Not to Do
Common mistakes reps make with this specific objection and why they backfire.

## Follow-Up Action
If the call ends without resolution, what's the best next step to keep the deal alive?

Be direct and practical. Give me words I can actually say, not theory.`,
  },
  {
    id: '8',
    slug: 'linkedin-outreach',
    title: 'LinkedIn Outreach',
    description: 'Write connection requests and follow-up messages that actually get accepted and replied to.',
    body: 'LinkedIn outreach fails because it\'s too salesy too fast. This prompt generates warm, relevant connection requests and follow-up messages that lead with value and build a relationship before pitching. Built for BDRs doing high-volume outreach without sounding like a bot.',
    useCases: [
      'Sending connection requests to cold prospects at target accounts',
      'Following up after a connection accepts',
      'Re-engaging a prospect who went quiet after a LinkedIn exchange',
    ],
    howToUse: [
      'Find the prospect\'s profile and note their role, company, and any recent activity',
      'Fill in the prompt with their details',
      'Run it through your AI tool',
      'Personalise further based on anything specific you see on their profile',
    ],
    personas: ['bdr'],
    format: 'prompt',
    tags: ['linkedin', 'social-selling', 'prospecting', 'connection'],
    free: true,
    featured: false,
    publishedAt: '2025-03-12',
    content: `You are an expert in B2B social selling and LinkedIn outreach.

**Prospect:**
- Name: [FIRST NAME]
- Title: [JOB TITLE]
- Company: [COMPANY]
- Something relevant from their profile or recent activity: [E.G. RECENT POST, JOB CHANGE, SHARED CONNECTION, MUTUAL INTEREST]

**My role:** [YOUR TITLE]
**My company / what I sell:** [ONE LINE]
**Why I'm reaching out to this persona specifically:** [WHAT PROBLEM YOU SOLVE FOR THEM]

Write three things:

## 1. Connection Request Note (300 character limit)
Short, warm, and specific. Reference something real. No pitch. Just a genuine reason to connect.

## 2. First Follow-Up Message (after they accept)
Sent 1–2 days after connection. Lead with value or a relevant insight. Soft mention of what you do. No hard ask.

## 3. Second Follow-Up Message (if no reply after 5–7 days)
Light touch. Different angle. One clear, low-friction CTA.

For each message: include the message itself and a brief note on why this approach works for this persona.`,
  },
  {
    id: '9',
    slug: 'champion-enablement-brief',
    title: 'Champion Enablement Brief',
    description: 'Give your champion everything they need to sell internally — a one-page brief they can use without you in the room.',
    body: 'Most deals are won or lost in the internal meetings you\'re never invited to. This prompt creates a champion enablement brief — a clear, concise document your champion can use to justify the decision to their leadership. Covers the problem, the solution, the ROI, and how to handle pushback.',
    useCases: [
      'Arming a champion before an internal stakeholder meeting',
      'Providing justification material ahead of a budget committee',
      'Supporting a champion who is new to their role and needs internal credibility',
    ],
    howToUse: [
      'Fill in what you know from discovery about the business case',
      'Run the prompt to generate the brief',
      'Share the output as a clean PDF or doc with your champion',
      'Walk through it together on a call before their internal meeting',
    ],
    personas: ['ae'],
    format: 'prompt',
    tags: ['champion', 'internal-selling', 'enterprise', 'stakeholder'],
    free: true,
    featured: false,
    publishedAt: '2025-03-15',
    content: `You are a strategic sales consultant creating a champion enablement brief — a one-page document a buyer can use to sell internally on behalf of your solution.

**Deal context:**
- Champion name & title: [NAME, TITLE]
- Company: [COMPANY]
- The problem they're solving: [2–3 SENTENCE DESCRIPTION]
- Current state / cost of inaction: [WHAT'S HAPPENING NOW AND WHAT IT'S COSTING THEM]
- Proposed solution: [WHAT YOU'RE RECOMMENDING]
- Expected outcomes / ROI: [METRICS OR ESTIMATED IMPACT]
- Key stakeholders who will scrutinise this: [E.G. CFO, CTO, LEGAL]
- Likely internal objections: [1–2 OBJECTIONS THE CHAMPION MIGHT FACE]

Write a champion enablement brief with:

## The Problem (2–3 sentences)
Written in plain language that resonates with a senior leadership audience.

## Why Now
The urgency case — why this isn't a "we'll look at it next year" situation.

## The Proposed Solution
What's being recommended, in non-technical language.

## Expected Return
Clear ROI framing. Use conservative numbers. Show the logic.

## Handling the Hard Questions
For each likely objection: the concern, and how to address it confidently.

## Recommended Decision
A clear, confident recommendation with proposed next steps.

Format this as a clean, professional brief — not a sales document. The champion should be able to share this with their CFO without embarrassment.`,
  },
  {
    id: '10',
    slug: 'discovery-question-bank',
    title: 'Discovery Question Bank',
    description: 'A library of sharp, open-ended discovery questions organised by persona, pain category, and deal stage.',
    body: 'Great discovery is the difference between a deal that closes and one that stalls. This question bank gives you a structured library of discovery questions for any situation — organised by who you\'re talking to, what you\'re trying to uncover, and where you are in the sales cycle.',
    useCases: [
      'Prepping for a first discovery call with a new persona',
      'Getting unstuck when a discovery call isn\'t going deep enough',
      'Training a new AE or SE on discovery fundamentals',
    ],
    howToUse: [
      'Use the prompt to generate a tailored question bank for a specific deal',
      'Or browse the categories below for ready-to-use questions',
      'Pick 5–7 questions to guide your call — don\'t use them all',
      'Listen more than you talk',
    ],
    personas: ['ae', 'se'],
    format: 'prompt',
    tags: ['discovery', 'questions', 'qualification', 'meddic'],
    free: true,
    featured: false,
    publishedAt: '2025-03-15',
    content: `You are a B2B sales coach helping a rep prepare for a discovery call.

**Prospect context:**
- Contact title / persona: [JOB TITLE]
- Company: [COMPANY NAME]
- Industry: [INDUSTRY]
- Likely pain area: [E.G. PIPELINE GENERATION / FORECAST ACCURACY / ONBOARDING / EFFICIENCY]
- Deal stage: [FIRST CALL / FOLLOW-UP DISCOVERY / TECHNICAL DISCOVERY]
- My product category: [E.G. CRM / SALES ENABLEMENT / HR TECH / DATA PLATFORM]

Generate a tailored discovery question bank with the following sections:

## Situation Questions (3–5)
Understand the current state — what they're doing today, their team structure, and processes.

## Problem Questions (4–6)
Uncover the pain — what's not working, what's costing them, what's frustrating the team.

## Implication Questions (3–5)
Explore the downstream impact — what happens because of this problem, who else is affected, what's the cost.

## Vision Questions (2–3)
Understand what success looks like — what they'd love to have, how they'd measure improvement.

## Qualification Questions (2–3)
Budget, authority, timeline, and decision process — phrased naturally, not like a checklist.

For each question: provide the question and a brief note on what you're trying to uncover with it.

Prioritise questions that will generate insight, not just confirm what you already know.`,
  },
];

export function getToolBySlug(slug: string): Tool | undefined {
  return tools.find((t) => t.slug === slug);
}

export function getFeaturedTools(): Tool[] {
  return tools.filter((t) => t.featured);
}

export function getRelatedTools(tool: Tool, limit = 3): Tool[] {
  return tools
    .filter(
      (t) =>
        t.id !== tool.id &&
        t.personas.some((p) => tool.personas.includes(p))
    )
    .slice(0, limit);
}
