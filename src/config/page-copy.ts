/*
 * Framing copy for section pages: the one-line introduction under each
 * page title, reused by that page's Open Graph image and description.
 * (Personal facts live in content/; this is site copy, written to be
 * factual and neutral, pending the owner's review.)
 */
export const pageCopy = {
  work: {
    lede: "Engineering I've done professionally: backend systems for fintech, cloud infrastructure, and software for unmanned aerial vehicles (UAVs).",
    description: "Engineering work by Timmy Omolana: backend systems for fintech, cloud infrastructure, and software for unmanned aerial vehicles.",
  },
  research: {
    lede: "Research I'm working on now, and research I've completed.",
    description: "Research by Timmy Omolana: stability of a hybrid aerial–underwater vehicle, and source separation for African music.",
  },
  projects: {
    lede: "Personal projects and technical explorations.",
    description: "Personal projects and technical explorations by Timmy Omolana.",
  },
  ventures: {
    lede: "Products I'm building for real problems.",
    description: "Products Timmy Omolana is building, including Xealtha, healthcare triage over WhatsApp for Nigeria.",
  },
  speaking: {
    lede: "Talks and posters, most recent first.",
    description: "Talks and posters by Timmy Omolana, including GopherCon Africa 2026 and DevFest Lagos 2024.",
  },
  writing: {
    lede: "Notes and essays.",
    description: "Notes and essays by Timmy Omolana.",
  },
  contact: {
    lede: null,
    description: "How to contact Timmy Omolana.",
  },
} as const;
