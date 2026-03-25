import { Tool } from '@/lib/types';

export const tools: Tool[] = [
  {
    id: '1',
    slug: 'deal-prep-brief',
    title: 'Deal Prep Brief',
    hook: 'Walk into every meeting knowing more than they expect.',
    description: 'Generate a sharp, structured research brief for any discovery call, demo, or executive meeting — in seconds.',
    whyItMatters: "Most reps spend 5 minutes Googling and still feel underprepared. This takes 45 minutes of proper research and does it in 20 seconds. You'll have company context, their likely pain points, trigger events to reference, five sharp opening questions, and a predicted objection list — before you've had your morning coffee.",
    body: 'Before any important call — discovery, demo, or EBC — you need context. This tool turns a company name, contact, and meeting type into a structured brief covering business model, likely pain points, suggested questions, predicted objections, and a ready-made talk track opener.',
    useCases: [
      'Pre-discovery call research for net-new accounts',
      'Prepping for an enterprise demo or executive briefing',
      'Refreshing context before a re-engagement call',
    ],
    howToUse: [
      'Enter the prospect\'s company, contact name and title, and what you sell',
      'Select the meeting type',
      'Hit Generate — review the brief and add any deal-specific context you already have',
    ],
    personas: ['ae', 'se'],
    format: 'embedded',
    tags: ['research', 'discovery', 'preparation'],
    free: true,
    featured: true,
    publishedAt: '2025-03-01',
    inputs: [
      {
        id: 'company',
        label: 'Prospect company',
        type: 'text',
        placeholder: 'e.g. Salesforce, a 500-person logistics SaaS, Acme Corp',
        required: true,
      },
      {
        id: 'contact',
        label: 'Contact name and job title',
        type: 'text',
        placeholder: 'e.g. Sarah Chen, VP of Sales',
        required: true,
      },
      {
        id: 'meeting_type',
        label: 'Meeting type',
        type: 'select',
        placeholder: '',
        required: true,
        options: ['Discovery call', 'Product demo', 'Executive briefing', 'Re-engagement call'],
      },
      {
        id: 'your_product',
        label: 'What you sell',
        type: 'textarea',
        placeholder: 'e.g. A sales engagement platform that helps BDR teams personalise outreach at scale',
        required: true,
        rows: 2,
      },
    ],
    systemPrompt: `You are a senior B2B sales strategist preparing a rep for an important meeting. You are given the prospect's company, their contact and job title, the meeting type, and what the rep sells.

Produce a sharp, practical deal prep brief in the following structure:

## Company Overview
3–4 sentences: what the company does, their business model, approximate size, and market position. If the company is well-known, be specific. If not, extrapolate intelligently from the name and context.

## Likely Pain Points
Based on the industry, company size, and the contact's role — what problems are they probably trying to solve? What keeps someone in this role up at night? Be specific to their seniority and function, not generic.

## Trigger Events to Reference
3–4 types of recent developments that would be worth referencing in the meeting — things like hiring trends, funding, product launches, market shifts, competitive pressure. Be specific about what to look for even if you can't confirm real-time data.

## Suggested Opening Questions
5 sharp, open-ended discovery questions tailored to this contact's role. Not generic — specific to who this person is and what they likely care about. Questions that uncover pain, priority, and urgency.

## Predicted Objections
2–3 objections this prospect is likely to raise early in the conversation, and a one-sentence note on how to handle each.

## Talk Track Opener
A 2–3 sentence opening the rep can use verbatim — specific to this prospect's context, natural, and leading into the reason for the meeting. Should not start with "I" or sound like a sales script.

Tone: direct, experienced, practical. No padding. This rep knows their job — they just need the intel fast.`,
  },
  {
    id: '2',
    slug: 'business-case-builder',
    title: 'Business Case Builder',
    hook: 'Give your champion the ammunition to win the room without you.',
    description: 'Turn your discovery notes into an executive-ready business case your champion can share upward — in minutes.',
    whyItMatters: "Most deals die in the internal meetings you're never invited to. Your champion needs something they can forward to their CFO without it looking like it came from a vendor. This produces a clean, professional business case with ROI framing, strategic rationale, and ready-made answers to the hard questions.",
    body: 'The biggest deals stall because champions can\'t articulate the value internally. This tool takes your discovery findings and builds a clear, executive-ready business case — written in the champion\'s voice, not the vendor\'s.',
    useCases: [
      'Arming a champion before an internal stakeholder meeting',
      'Preparing justification material ahead of a budget committee',
      'Giving a champion who is new to their role the words they need',
    ],
    howToUse: [
      'Enter the company, champion details, and what you learned in discovery',
      'Add any ROI metrics or outcomes discussed',
      'Generate — then share the output with your champion and walk through it together',
    ],
    personas: ['ae', 'se'],
    format: 'embedded',
    tags: ['business-case', 'roi', 'champion', 'enterprise'],
    free: true,
    featured: true,
    publishedAt: '2025-03-01',
    inputs: [
      {
        id: 'company',
        label: 'Company name',
        type: 'text',
        placeholder: 'e.g. Acme Corp',
        required: true,
      },
      {
        id: 'champion',
        label: "Champion's name and title",
        type: 'text',
        placeholder: 'e.g. James Liu, Head of RevOps',
        required: true,
      },
      {
        id: 'pain_points',
        label: 'Key pain points from discovery',
        type: 'textarea',
        placeholder: 'e.g. Reps spend 3+ hours on manual CRM updates. Forecast accuracy is around 60%. New hires take 6 months to ramp.',
        required: true,
        rows: 3,
      },
      {
        id: 'outcomes',
        label: 'Expected outcomes and any ROI metrics discussed',
        type: 'textarea',
        placeholder: 'e.g. Targeting 80%+ forecast accuracy, reduce ramp time to 3 months, save ~4 hours/rep/week on admin',
        required: true,
        rows: 3,
      },
    ],
    systemPrompt: `You are a strategic business consultant helping a B2B sales rep create an internal business case that their champion can use to justify a purchase to leadership.

The document must be polished enough for a CFO or CEO to read. No sales language. No jargon. No buzzwords. Write in the champion's voice — this document should look like it came from inside the company, not from a vendor.

Use the provided company, champion, pain points, and expected outcomes to write the following:

## Executive Summary
2–3 sentences for a C-suite reader who will skim this first. The problem, the solution, the expected outcome. Clear, factual, no hype.

## The Problem We're Solving
Describe the current situation in plain language. Quantify the cost where possible — in time, money, risk, or missed opportunity. Use the pain points provided.

## Why Now
The urgency case. Why this isn't a "we'll revisit it next quarter" situation. Be specific to the business context provided.

## Proposed Solution
What's being recommended and why it fits their specific context. Non-technical, outcome-focused language.

## Expected Return on Investment
Clear ROI framing. Conservative estimates. Show the logic, not just the number. Use any metrics provided; where numbers aren't given, use reasonable ranges and explain the assumptions.

## Handling the Hard Questions
2–3 challenges a CFO or skeptical stakeholder might raise — and how to address each one confidently.

## Recommended Next Steps
3 clear actions with suggested owners and a proposed timeline.

Format this as a clean, professional brief. No bullet lists for the main sections — write in proper paragraphs. The champion should be able to hand this to their leadership team with confidence.`,
  },
  {
    id: '3',
    slug: 'rfp-rapid-response',
    title: 'RFP Rapid Response',
    hook: 'Turn 4 hours of RFP pain into 20 minutes.',
    description: 'Paste in any RFP question and get a polished, professional response that sounds like your best writer wrote it.',
    whyItMatters: "RFPs are soul-destroying. You answer the same questions differently every time, the deadline is always tight, and the answers never feel quite right. Paste in the question, your product context, and what makes you different — get back a polished, confident answer that actually sounds like your company wrote it, plus a shorter version for word-limited responses.",
    body: 'RFPs are time-consuming and repetitive. This tool generates structured, professional responses to any RFP question — along with an editor\'s note flagging assumptions and a short version for word-limited submissions.',
    useCases: [
      'Responding to a specific RFP question under time pressure',
      'Drafting an executive summary for a formal proposal',
      'Turning bullet-point capabilities into polished narrative prose',
    ],
    howToUse: [
      'Paste the exact RFP question or section text',
      'Describe your product and key differentiators',
      'Generate — you get a full response, a short version, and an editor\'s note',
    ],
    personas: ['se', 'ae'],
    format: 'embedded',
    tags: ['rfp', 'proposal', 'writing', 'enterprise'],
    free: true,
    featured: false,
    publishedAt: '2025-03-05',
    inputs: [
      {
        id: 'rfp_question',
        label: 'RFP question or section',
        type: 'textarea',
        placeholder: 'Paste the exact RFP question or section header here…',
        required: true,
        rows: 4,
      },
      {
        id: 'your_product',
        label: 'Your product and key capabilities',
        type: 'textarea',
        placeholder: 'e.g. A workforce management platform for staffing agencies. Key capabilities: real-time scheduling, compliance automation, mobile timesheets, payroll integration.',
        required: true,
        rows: 3,
      },
      {
        id: 'differentiators',
        label: 'Key differentiators to highlight',
        type: 'textarea',
        placeholder: 'e.g. Only platform built natively for the staffing industry. 99.9% uptime SLA. Dedicated implementation team included.',
        required: false,
        rows: 2,
      },
    ],
    systemPrompt: `You are an experienced enterprise solutions consultant writing a formal RFP response for a B2B technology company. Your job is to produce a polished, professional answer that directly addresses the question, positions the solution clearly, and reads like it was written by a confident expert — not a sales rep trying to sound impressive.

Write a response that:
1. Directly and completely addresses what the question is asking — no preamble, no "Great question!"
2. Uses specific language — no "best-in-class", "industry-leading", or empty claims without evidence
3. Structures the answer clearly with paragraphs, bullets, or numbered lists as appropriate to the question type
4. Ties the answer back to a business outcome for the buyer
5. Is between 150–350 words unless the question genuinely requires more depth

Then provide:

**Short version** (under 100 words): A condensed version for responses with strict word limits.

**[Editor Note]**:
- Any assumptions made in this response
- Specific information that would strengthen this answer if added
- One alternative framing if the buyer's priorities might be different from what was assumed`,
  },
  {
    id: '4',
    slug: 'cold-sequence-engine',
    title: 'Cold Sequence Engine',
    hook: '7 touches. Zero cringe.',
    description: 'Generate a complete, personalised 7-touch outreach sequence for any prospect — LinkedIn, email, phone, and a breakup message.',
    whyItMatters: "BDRs spend hours crafting sequences that still sound like everyone else's. This produces a complete 7-touch sequence in 30 seconds — a LinkedIn connection note, two emails, a DM, a direct ask, a phone script, and a breakup message. All consistent, all specific to your persona, and none of them starting with 'I hope this finds you well.'",
    body: 'Generic outreach gets ignored. This tool generates a full multi-channel sequence personalised to your target persona — from first LinkedIn touch to breakup email. Every message has a distinct angle and moves the conversation forward.',
    useCases: [
      'Building a sequence for a new target persona or vertical',
      'Refreshing an existing sequence that\'s stopped converting',
      'Getting a new BDR up and running with a working sequence fast',
    ],
    howToUse: [
      'Describe who you\'re targeting, what you sell, and any trigger event',
      'Generate the full 7-touch sequence',
      'Personalise each message further with specific intel on your prospects',
    ],
    personas: ['bdr'],
    format: 'embedded',
    tags: ['cold-outreach', 'sequencing', 'email', 'linkedin', 'prospecting'],
    free: true,
    featured: true,
    publishedAt: '2025-03-05',
    inputs: [
      {
        id: 'target_persona',
        label: 'Who you\'re targeting',
        type: 'textarea',
        placeholder: 'e.g. VP of Sales at a Series B SaaS company, 100–500 employees, likely using Salesforce',
        required: true,
        rows: 2,
      },
      {
        id: 'your_product',
        label: 'What you sell and the #1 value for this persona',
        type: 'textarea',
        placeholder: 'e.g. A sales coaching platform. #1 value: managers get automatic call summaries and coaching alerts so they can spend time coaching, not listening to recordings.',
        required: true,
        rows: 3,
      },
      {
        id: 'trigger_event',
        label: 'Trigger event or reason for outreach',
        type: 'text',
        placeholder: 'e.g. They just raised Series B, they\'re hiring 8 BDRs, posted about pipeline challenges on LinkedIn',
        required: false,
      },
    ],
    systemPrompt: `You are an elite B2B sales development rep who writes outreach sequences that get replies. Your sequences are warm, specific, and relevant — they never sound like a template even though they are.

Write a complete 7-touch outreach sequence for the described prospect persona. Each touch must have a distinct angle, different channel, and different level of ask. Every message should feel like it was written specifically for this type of person.

## Touch 1: LinkedIn Connection Request
Hard limit: 300 characters including spaces. Warm, specific, no pitch. A genuine reason to connect — reference something real about their role or world. Do NOT say "I'd love to learn more about your experience."

## Touch 2: First Email — The Hook
Format: Subject line + body (under 100 words). Lead with a relevant insight or observation about their world, not your product. End with a curiosity-based, low-friction CTA.

## Touch 3: Second Email — The Evidence
Format: Subject line + body (under 150 words). A relevant outcome, case study angle, or specific example. One metric if available. Easy ask.

## Touch 4: LinkedIn DM
Under 150 characters. After they've accepted the connection or been connected a while. Reference something specific — their profile, a post, something current. Not a pitch.

## Touch 5: Third Email — The Direct Ask
Format: Subject line + body (under 100 words). Clear, confident, direct. Specific CTA. Give them an easy out that still moves things forward.

## Touch 6: Phone Script
30–45 second opening or voicemail script. Sound like a human. What to say, what you want them to do, how to leave a compelling voicemail without rambling.

## Touch 7: The Breakup Email
Format: Subject line + body (under 80 words). Acknowledge the silence gracefully. Leave a positive impression. Give them an easy way back in. Not passive-aggressive.

After the sequence: write a brief paragraph on the core narrative thread connecting all 7 touches, and one note on how to adapt the sequence if the trigger event changes.`,
  },
  {
    id: '5',
    slug: 'post-call-packager',
    title: 'Post-Call Packager',
    hook: 'From messy notes to polished follow-up in 60 seconds.',
    description: 'Paste your raw call notes and get a follow-up email, a CRM update, and a next meeting agenda — ready to send.',
    whyItMatters: "The 10 minutes after a call are the most valuable in the sales process — and the most wasted. Paste in your raw notes, however rough, and get a follow-up email that references specific things said, a CRM update in MEDDIC format, and the agenda for the next meeting. The email goes out while the conversation is still fresh.",
    body: 'Post-call admin kills deal momentum. This tool turns raw call notes into three ready-to-use outputs: a professional follow-up email, an internal CRM note, and a next meeting agenda.',
    useCases: [
      'Sending a follow-up email immediately after a discovery or demo call',
      'Updating your CRM without spending 20 minutes writing notes',
      'Keeping internal stakeholders informed about deal progress',
    ],
    howToUse: [
      'Paste your raw notes straight after the call — doesn\'t matter how rough',
      'Add the prospect name, company, and meeting type',
      'Generate — send the email, paste the CRM note, save the agenda',
    ],
    personas: ['ae', 'bdr'],
    format: 'embedded',
    tags: ['follow-up', 'email', 'crm', 'next-steps', 'admin'],
    free: true,
    featured: false,
    publishedAt: '2025-03-08',
    inputs: [
      {
        id: 'call_notes',
        label: 'Your raw call notes',
        type: 'textarea',
        placeholder: 'Paste everything — bullet points, half-sentences, stream of consciousness. The messier the better.',
        required: true,
        rows: 6,
      },
      {
        id: 'prospect',
        label: 'Prospect name and company',
        type: 'text',
        placeholder: 'e.g. Mark Davies, Acme Corp',
        required: true,
      },
      {
        id: 'meeting_type',
        label: 'Meeting type',
        type: 'select',
        placeholder: '',
        required: true,
        options: ['Discovery call', 'Product demo', 'Executive briefing', 'Follow-up call', 'Negotiation'],
      },
    ],
    systemPrompt: `You are an experienced B2B account executive who is exceptionally good at turning messy call notes into clean, professional output. Speed matters — every minute between the call and the follow-up email counts. A good follow-up sent in 10 minutes beats a perfect one sent in 2 hours.

Use the provided call notes to produce three outputs:

## 1. External Follow-Up Email
To be sent to the prospect immediately after the call.
- Warm but professional tone
- Open with a genuine reference to something specific from the conversation — not "I wanted to follow up on our call today"
- Cover 2–3 key things discussed — use the prospect's language where possible, not yours
- Confirm any commitments made on both sides
- State the next step clearly with a specific action, proposed owner, and timeframe
- Under 200 words total
- Subject line included

## 2. Internal CRM Update
For pipeline hygiene and deal review. Format as clean bullet points under these headers:
- **Pain points uncovered** (use their language)
- **Budget signals** (what was said or implied)
- **Decision-making process** (who else is involved, how they buy)
- **Timeline** (when they want to be live / make a decision)
- **Objections / concerns raised**
- **Competitive landscape** (anything mentioned)
- **Risk factors**
- **Next step** (action, owner, date)

## 3. Next Meeting Agenda
If a follow-up was agreed or implied:
- Suggested agenda (3–4 bullet points)
- What you'll cover
- What you need them to bring, confirm, or prepare before the meeting

If information is missing or unclear from the notes, add a [FLAG] note rather than guessing.`,
  },
  {
    id: '6',
    slug: 'demo-director',
    title: 'Demo Director',
    hook: 'Stop giving the same demo to everyone.',
    description: 'Build a tailored demo arc for any prospect — so every demo feels like it was built for them specifically, not pulled off the shelf.',
    whyItMatters: "A generic demo is a deal killer. The prospect can feel when you're just running your standard flow. This takes what you learned in discovery and builds a tailored demo arc — which features to lead with, which to skip, and exactly how to engineer the moment where they lean forward and say 'wait, can you show me that again?'",
    body: 'A generic demo is a deal killer. This tool builds a complete, customised demo plan from your discovery findings — with a purpose-built narrative arc, a mapped \'aha moment\', and a disciplined cut list.',
    useCases: [
      'Preparing a customised demo script for a key account',
      'Deciding which features to lead with for a specific persona',
      'Engineering a "day in the life" narrative around the prospect\'s exact pain',
    ],
    howToUse: [
      'Enter the prospect context and pain points from discovery',
      'Describe who you\'re demoing to and how long you have',
      'Generate a tailored demo arc — then adapt it in your actual demo tool',
    ],
    personas: ['se', 'ae'],
    format: 'embedded',
    tags: ['demo', 'customisation', 'discovery', 'narrative', 'se'],
    free: true,
    featured: false,
    publishedAt: '2025-03-10',
    inputs: [
      {
        id: 'company_context',
        label: 'Company, industry, size, and pain points from discovery',
        type: 'textarea',
        placeholder: 'e.g. Acme Corp, staffing industry, 300 employees. Pain: manual timesheet process costing ~8 hrs/week per recruiter. Want to reduce time-to-fill by 20%.',
        required: true,
        rows: 4,
      },
      {
        id: 'persona',
        label: 'Who you\'re demoing to',
        type: 'text',
        placeholder: 'e.g. CTO and Head of Operations — technical evaluation, care about integration and data accuracy',
        required: true,
      },
      {
        id: 'your_product',
        label: 'What your product does (brief)',
        type: 'textarea',
        placeholder: 'e.g. Workforce management platform: scheduling, timesheets, compliance, payroll integration. Key modules: real-time scheduling board, mobile app, automated compliance alerts.',
        required: true,
        rows: 3,
      },
      {
        id: 'demo_length',
        label: 'Demo length',
        type: 'select',
        placeholder: '',
        required: true,
        options: ['30 minutes', '45 minutes', '60 minutes'],
      },
    ],
    systemPrompt: `You are a world-class Sales Engineer who has run thousands of enterprise demos. You understand that the worst demo is the one that covers everything — and the best demo builds to one specific moment of clarity.

Using the provided prospect context, persona, product description, and demo length, build a complete tailored demo plan:

## Opening Narrative (2–3 minutes)
A "day in the life" story from the perspective of someone at their company experiencing the exact pain they described. Make it feel like you've been in their building. This is not a product introduction — it sets up WHY the demo matters before you touch the product. Use specific details from the prospect context.

## Demo Arc
A sequenced plan of what to show, in what order, timed for the total demo length. For each section:
- **What to show** (specific feature or flow)
- **Why it matters to THIS prospect** — not generic, reference their specific pain
- **What to say as you show it** — the exact narrative thread
- **Time allocation**

## The Aha Moment
The single moment you want to engineer in this demo — the specific feature, flow, or data point that will make them lean in. How to build to it deliberately. What to say when you get there.

## What to Skip (and Why)
Features or sections that are likely irrelevant or distracting for this audience. Being disciplined about what NOT to show makes the demo sharper.

## Proof Points to Weave In
2–3 specific customer outcomes, metrics, or use cases that will resonate with this prospect's industry, size, or pain profile. How to drop them naturally into the flow.

## Close and Next Step
How to end the demo. What question to ask. What to propose as the next step. How to create momentum rather than letting the call end with "we'll be in touch."

Total planned time should match the requested demo length. Be specific and practical — this is a working plan, not a presentation outline.`,
  },
  {
    id: '7',
    slug: 'objection-flip',
    title: 'Objection Flip',
    hook: "Every 'no' has a path through it.",
    description: 'Paste the exact objection you just heard and get what it actually means, three ways to respond, and the question that unlocks the real issue.',
    whyItMatters: "Reps freeze or go defensive when they hear a hard objection. They over-explain, offer a discount too early, or give up. Paste in the exact words your prospect used — and get back what they actually mean, three different response approaches, and the one question that usually unlocks what's really going on.",
    body: 'Objections are buying signals — but only if you handle them well. This tool gives you the psychology behind any objection and the exact words to use in response. Covers price, timing, competition, and internal resistance.',
    useCases: [
      'Preparing responses before a key negotiation or renewal meeting',
      'Getting unstuck when a deal goes quiet after a specific concern is raised',
      'Coaching a junior rep on how to handle a recurring objection',
    ],
    howToUse: [
      'Paste the objection using the prospect\'s exact words',
      'Select the deal stage and add your product context',
      'Generate — pick the response approach that fits your relationship',
    ],
    personas: ['ae', 'bdr'],
    format: 'embedded',
    tags: ['objection-handling', 'negotiation', 'closing', 'mindset'],
    free: true,
    featured: true,
    publishedAt: '2025-03-12',
    inputs: [
      {
        id: 'objection',
        label: "The objection — use their exact words",
        type: 'textarea',
        placeholder: 'e.g. "We like what you\'ve built but we\'re looking to consolidate our tech stack, not add to it." or "The price is just too high for what we\'re getting."',
        required: true,
        rows: 3,
      },
      {
        id: 'deal_stage',
        label: 'Deal stage',
        type: 'select',
        placeholder: '',
        required: true,
        options: ['Early / First meeting', 'Mid / Demo & evaluation', 'Late / Negotiation', 'Renewal / Expansion'],
      },
      {
        id: 'your_product',
        label: 'What you sell — one line',
        type: 'text',
        placeholder: 'e.g. A revenue intelligence platform for enterprise sales teams',
        required: true,
      },
    ],
    systemPrompt: `You are a senior B2B sales coach helping a rep navigate a difficult prospect objection. Give them practical, specific guidance — not sales theory. Real words they can actually say.

## What This Objection Actually Means
The real underlying concern beneath the surface objection. What is the prospect actually worried about? Be specific to the deal stage — an early-stage objection often means something different from the same words said in a late-stage negotiation. What's the gap between what they said and what they likely mean?

## Response Option 1: Empathise and Reframe
**Strategic angle:** Acknowledge the concern and shift the frame — not to dismiss it but to open a new way of seeing it.
**Exact words to use:** Write the actual response the rep can say verbatim.
**When this works:** The specific situation where this approach is most effective.

## Response Option 2: The Diagnostic Question
**The question:** One specific question that opens up the real issue rather than defending against the surface objection. Phrased naturally, not like an interrogation.
**What you're trying to uncover:** The insight this question is designed to surface.
**What to do with the answer:** How to proceed depending on what they say.

## Response Option 3: Direct and Evidence-Based
**Strategic angle:** Address it head-on with a confident, specific response.
**Exact words to use:** Write the actual response verbatim. Include a specific proof point or logic — not a vague "our customers see great results."
**When this works:** The situation where directness is the right move.

## What Not to Do
The most common mistake reps make with this specific type of objection, and why it backfires.

## If You Leave the Call Without Resolving It
The best next step — specific enough to actually keep the deal alive rather than just delaying rejection.

Tone: direct, experienced, practical. Give them words, not frameworks.`,
  },
  {
    id: '8',
    slug: 'linkedin-outreach',
    title: 'LinkedIn Outreach',
    hook: 'Connection requests that actually get accepted.',
    description: 'Write a connection note, a first follow-up, and a second touch that all feel like they came from someone who actually looked at their profile.',
    whyItMatters: "LinkedIn outreach fails because it's too salesy too fast. The prospect knows in three seconds whether you're a real person or a bot with a quota. Paste in what you know about them — their recent activity, their role, anything specific — and get three messages that feel genuinely personal.",
    body: 'LinkedIn outreach fails because it\'s too salesy too fast. This tool generates warm, relevant connection requests and follow-up messages that lead with genuine interest and build a relationship before pitching.',
    useCases: [
      'Sending connection requests to cold prospects at target accounts',
      'Following up after a connection accepts with something worth reading',
      'Re-engaging a prospect who went quiet after a LinkedIn exchange',
    ],
    howToUse: [
      'Note the prospect\'s name, title, and anything specific from their profile',
      'Enter what you sell and why you\'re reaching out',
      'Generate three messages — personalise further before sending',
    ],
    personas: ['bdr'],
    format: 'embedded',
    tags: ['linkedin', 'social-selling', 'prospecting', 'connection'],
    free: true,
    featured: false,
    publishedAt: '2025-03-12',
    inputs: [
      {
        id: 'prospect',
        label: "Prospect's name, title, and company",
        type: 'text',
        placeholder: 'e.g. Emma Walsh, Head of Talent Acquisition, Acme Corp',
        required: true,
      },
      {
        id: 'profile_notes',
        label: 'What you noticed on their profile',
        type: 'textarea',
        placeholder: 'e.g. Recently posted about the challenges of hiring at pace. Just moved from in-house to agency side. Commented on a thread about AI in recruitment. University of Bristol grad.',
        required: true,
        rows: 3,
      },
      {
        id: 'your_role',
        label: 'Your name, title, and what you sell',
        type: 'text',
        placeholder: 'e.g. Tom Reed, BDR at TalentFlow — we help agencies reduce time-to-place by 30%',
        required: true,
      },
    ],
    systemPrompt: `You are an expert in B2B social selling who knows that the difference between a LinkedIn message that gets ignored and one that gets a reply is specificity. Nobody replies to something that could have been sent to 200 other people.

Write three LinkedIn messages for this specific outreach:

## Message 1: Connection Request Note
**Hard limit: 300 characters including spaces — this is non-negotiable.**
- Reference something real and specific from their profile — not their job title
- Warm and human, not formal
- No pitch. Just a genuine reason to connect.
- Does NOT start with "I came across your profile" or "I'd love to connect"
- Write the message itself, then in brackets note the character count

## Message 2: First Follow-Up (sent 1–2 days after they accept)
- Under 150 words
- Lead with a relevant insight, question, or observation about their world — not your product
- Mention what you do naturally in one sentence, embedded in context — not as a pitch
- No hard ask. Conversational, curious, not transactional.
- After the message: one sentence on why this angle works for this specific person

## Message 3: Second Follow-Up (sent 5–7 days later with no reply)
- Under 100 words
- Different angle from message 2 — don't repeat yourself
- Acknowledge the silence lightly without being weird about it
- One clear, low-friction CTA — not "let's get 30 minutes in"
- After the message: one sentence on the rationale

For all three: avoid "I hope this finds you well", "I came across your profile", "reaching out because", and any opener that starts with "I".`,
  },
  {
    id: '9',
    slug: 'champion-activator',
    title: 'Champion Activator',
    hook: 'Turn your champion into your best closer.',
    description: "Generate everything your champion needs to sell internally — a business brief, an internal email they can forward, and talking points for the exec meeting.",
    whyItMatters: "Most deals are won or lost in the internal meetings you're never invited to. Your champion is probably not a natural salesperson — they need a document they can hand to their CFO without it looking like it came from a vendor, talking points that make them sound like they own this decision, and an email they can forward that doesn't scream 'the sales rep wrote this for me.'",
    body: "Multi-threading is where most deals are won or lost. This tool gives your champion everything they need to sell internally — in their voice, not yours.",
    useCases: [
      'Arming a champion before a budget committee or executive sign-off meeting',
      'Helping a champion who is strong technically but uncomfortable with financial justification',
      'Supporting a new champion who needs to build internal credibility fast',
    ],
    howToUse: [
      "Enter your champion's context and the key decision-makers they need to convince",
      'Add the pain points and expected outcomes from your discovery',
      "Generate — then walk through the output with your champion on a call before their internal meeting",
    ],
    personas: ['ae'],
    format: 'embedded',
    tags: ['champion', 'internal-selling', 'enterprise', 'stakeholder', 'multithreading'],
    free: true,
    featured: false,
    publishedAt: '2025-03-15',
    inputs: [
      {
        id: 'champion',
        label: "Champion's name, title, and company",
        type: 'text',
        placeholder: 'e.g. Rachel Kim, Head of Sales Operations, Acme Corp',
        required: true,
      },
      {
        id: 'problem',
        label: "The problem they're solving — in their words if possible",
        type: 'textarea',
        placeholder: "e.g. Sales team spending too much time on manual reporting. Forecast accuracy is around 55%. Leadership has no visibility into deal health until it's too late.",
        required: true,
        rows: 3,
      },
      {
        id: 'roi_metrics',
        label: 'Expected outcomes and any ROI metrics discussed',
        type: 'textarea',
        placeholder: 'e.g. Target 80%+ forecast accuracy, save 5+ hrs/week per rep on reporting, reduce sales cycle by 15%',
        required: true,
        rows: 2,
      },
      {
        id: 'key_stakeholders',
        label: 'Key decision-makers your champion needs to convince',
        type: 'text',
        placeholder: 'e.g. CFO (focused on ROI), CRO (focused on pipeline visibility), IT (focused on security and integration)',
        required: false,
      },
    ],
    systemPrompt: `You are a strategic sales consultant helping a B2B rep arm their internal champion to sell on their behalf. Everything you produce must be written in the champion's voice — not the vendor's. The moment it sounds like marketing or sales copy, it loses credibility.

Produce three things:

## 1. Internal Business Brief (1–2 pages)
A document the champion can share with leadership and include in a budget request.

Structure:
- **The Problem** (2–3 sentences in plain language — the business impact, not the technical pain)
- **Why Now** (the urgency case — what changes if this waits another quarter)
- **Proposed Solution** (non-technical, outcome-focused, 1 paragraph)
- **Expected Return** (conservative ROI framing — show the logic, not just the number)
- **Recommended Next Steps** (3 clear actions with owners and suggested timeline)

Write in clean paragraphs. No bullet lists for the main narrative. This is a professional brief, not a slide deck.

## 2. Internal Forwarding Email
An email the champion can send to their leadership team to introduce the initiative.
- Subject line included
- 150 words or fewer
- Written entirely in the champion's voice — should look like it came from them, not from a vendor
- Frames the initiative as their idea, with them owning the recommendation
- Ends with a clear ask (e.g. get on the calendar for a 30-minute overview)

## 3. Talking Points for the Executive Meeting
5–6 bullet points the champion can use when presenting or fielding questions from leadership.
- Each point is 1–2 sentences max
- Covers: the problem, the why now, the ROI logic, the risk of inaction, and the recommended decision
- Written in plain language a non-technical executive can immediately understand
- For each point, add a [Coach note] in brackets with a tip on how to deliver it confidently`,
  },
  {
    id: '10',
    slug: 'icp-firing-squad',
    title: 'ICP Firing Squad',
    hook: 'Stop pursuing deals that were never going to close.',
    description: 'Paste anything about a company — a job posting, LinkedIn description, news article, or CRM note — and get an ICP score with clear reasoning and a ready-made first message.',
    whyItMatters: "The biggest thing killing your pipeline isn't your pitch — it's the leads you're spending hours on that were never a fit. Paste in anything about a prospect company and get a clear ICP score, the specific green flags and red flags, and if they ARE a fit, the exact first message to send. If they're not — what a better version of this lead would look like.",
    body: "Pipeline quality is the single biggest lever in sales performance. This tool scores any prospect against your ICP in seconds — with clear reasoning, specific signals, and a ready-made first outreach if they're a good fit.",
    useCases: [
      'Quickly qualifying a list of accounts before starting outreach',
      'Sense-checking a lead that\'s been sitting in the pipeline too long',
      'Training a new BDR on what good and bad fit looks like with live examples',
    ],
    howToUse: [
      'Paste anything about the company — the more context the better',
      'Describe your ICP so the tool can score accurately against your specific criteria',
      'Generate — get a score, the reasoning, and a first message if they qualify',
    ],
    personas: ['bdr', 'ae'],
    format: 'embedded',
    tags: ['icp', 'prospecting', 'qualification', 'pipeline-quality'],
    free: true,
    featured: false,
    publishedAt: '2025-03-15',
    inputs: [
      {
        id: 'company_info',
        label: 'Everything you know about the company',
        type: 'textarea',
        placeholder: 'Paste anything — a job posting, LinkedIn company page, news article, website snippet, CRM notes. The more context, the more accurate the score.',
        required: true,
        rows: 5,
      },
      {
        id: 'your_icp',
        label: 'Your ideal customer profile',
        type: 'textarea',
        placeholder: 'e.g. B2B SaaS companies, 100–500 employees, Series A–C funded, 20+ person sales team, currently using Salesforce, struggling with forecast accuracy or rep ramp time',
        required: true,
        rows: 3,
      },
    ],
    systemPrompt: `You are a sharp B2B sales strategist who specialises in pipeline quality. Your job is to help reps quickly decide whether a prospect is worth pursuing — and give them a clear, honest verdict backed by specific reasoning.

Analyse the provided company information against the ideal customer profile (ICP) description.

## ICP Score: [X/10]
A single number, clearly stated at the top. Follow immediately with one sentence verdict: what does this score mean in plain terms?

## Why They Score This Way
4–5 specific reasons based on the information provided. Reference actual details from the company description — not generic ICP criteria. Be direct: what matches well, what doesn't, what's unclear.

## Green Flags
Specific signals from the company description that suggest strong fit, high buying intent, or urgency. Only include what's actually in the information provided — don't invent signals.

## Red Flags
Specific signals that suggest weak fit, low urgency, likely objections, or waste of time. Same rule — only what's actually evidenced.

## If They ARE a Fit (score 7+): First Outreach Message
Write the exact first message to send — email or LinkedIn, your call based on context. Under 100 words. Specific to this company — reference something real from the description. Strong hook, clear value, low-friction CTA. Subject line included if email.

## If They're NOT a Strong Fit (score below 7): What Better Looks Like
Based on this example, describe what a stronger version of this prospect would look like — 3–4 specific characteristics that would push this from a weak lead to a strong one. Actionable criteria the rep can use to improve their prospecting list.

Be direct and honest. Reps don't need a gentle score — they need to know whether to pursue this or move on.`,
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
