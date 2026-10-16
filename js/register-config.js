/* ============================================================
   REVOLUTION ’26 — REGISTRATION PORTAL
   EDIT EVERYTHING HERE — no other file needs editing.
   ------------------------------------------------------------
   1) registrationLinks … the four Google Form URLs (dummy now)
   2) competitions ……… cards, copy, focus, full challenge details
   3) eventDates ………… the important-dates timeline
   4) faqs ………………… accordion answers
   ============================================================ */

/* ------------------------------------------------------------
   1) GOOGLE FORM LINKS
   Replace the four dummy URLs with the real published Google
   Forms. Each competition points at one of these keys through
   its `formKey` below — links are never scattered in the HTML.
   ------------------------------------------------------------ */
const registrationLinks = {
  businessPitch: "https://forms.google.com/dummy-business-pitch",
  entrepreneurshipQuiz: "https://forms.google.com/dummy-entrepreneurship-quiz",
  aiProductInnovation: "https://forms.google.com/dummy-ai-product",
  popularSociety: "https://forms.google.com/dummy-popular-society"
};

/* ------------------------------------------------------------
   2) COMPETITIONS — rendered as the four editorial panels.
   ------------------------------------------------------------ */
const competitions = [
  {
    id: "businessPitch",
    formKey: "businessPitch",
    number: "01",
    title: "Business Pitch Competition",
    tagline: "TURN IDEAS INTO OPPORTUNITIES.",
    description: "Participating schools must submit their business pitch presentations in PDF or PowerPoint format before the announced deadline. Following preliminary evaluation, the top five teams will be selected to deliver live presentations at Nalanda College on the competition day. ",
    focus: ["Business Thinking", "Innovation", "Communication", "Strategy"],
  },
  {
    id: "entrepreneurshipQuiz",
    formKey: "entrepreneurshipQuiz",
    number: "02",
    title: "Quiz Competition",
    tagline: "THINK FAST. KNOW BUSINESS.",
    description: "The Quiz Competition will assess participants’ knowledge of entrepreneurship, business concepts and general knowledge. It will be conducted at Nalanda College on the official competition day.",
    focus: ["Business Knowledge", "Quick Thinking", "Accuracy", "Decision Making"],
    details: {
    Competition Theme : ":Entrepreneurship Knowledge and General Knowledgeeed under pressure.This competition challenges participants to demonstrate their entrepreneurial knowledge, general awareness, analytical thinking and ability to make informed decisions within a limited time. ",
    }
  },
  {
    id: "aiProductInnovation",
    formKey: "aiProductInnovation",
    number: "03",
    title: "AI Video Competition",
    tagline: "IMAGINE IT. CREATE IT. BRING IT TO LIFE.",
    description: "Identify a real-world problem, develop an innovative product solution and use AI-powered tools to create a compelling promotional concept.",
    focus: ["AI", "Innovation", "Product Development", "Creativity", "Marketing"],
    details: {
      about: "Identify a real-world problem, design an innovative product solution, and use AI-powered tools to build a compelling promotional concept — from insight to prototype story to campaign.",
      who: "Open to registered participants representing recognized school Entrepreneur Societies.",
      need: "Teams of 2–4 participants, a written problem–solution outline and an AI-generated promotional asset (visual or video, maximum 60 seconds). All AI tool usage must be disclosed.",
      format: "Concept document + 6-minute presentation + 2-minute questions. All entries are showcased on the innovation wall during Competition Day.",
      judging: "Problem relevance (20%) · Innovation (25%) · AI integration (25%) · Promotional concept (20%) · Pitch delivery (10%)"
    }
  },
  {
    id: "popularSociety",
    formKey: "popularSociety",
    number: "04",
    title: "MOST POPULAR ENTREPRENEUR SOCIETY",
    tagline: "MAKE YOUR SOCIETY STAND OUT.",
    description: "Showcase your Entrepreneur Society's identity, creativity, achievements and entrepreneurial spirit while building the strongest connection with the audience.",
    focus: ["Creativity", "Branding", "Engagement", "Communication", "Team Spirit"],
    details: {
      about: "Showcase your Entrepreneur Society's identity, creativity, achievements and entrepreneurial spirit while building the strongest connection with the audience — a battle of branding, presence and community.",
      who: "Open to registered participants representing recognized school Entrepreneur Societies.",
      need: "A delegation of 4–8 members, a 3-minute showcase video (optional) and a live activation stall prepared for competition day.",
      format: "Live showcase (5 minutes) + audience engagement round + digital reach audit, performed in front of delegates from all participating schools.",
      judging: "Identity & branding (25%) · Creativity (25%) · Audience engagement (30%) · Team spirit (20%)"
    }
  }
];

/* ------------------------------------------------------------
   3) IMPORTANT DATES — placeholder schedule.
   EDIT THE DATES HERE once they are confirmed.
   ------------------------------------------------------------ */
const eventDates = [
  { label: "REGISTRATION OPENS", date: "16 OCTOBER 2026", placeholder: true },
  { label: "REGISTRATION CLOSES", date: "26 OCTOBER 2026", placeholder: true },
  { label: "COMPETITION DAY", date: "29 OCTOBER 2026", placeholder: false }
];

/* ------------------------------------------------------------
   4) FAQ
   ------------------------------------------------------------ */
const faqs = [
  {
    q: "Who can participate?",
    a: "The competition is open to students representing recognized school Entrepreneur Societies. Each school may register teams for any of the four challenges."
  },
  {
    q: "Can one school participate in multiple competitions?",
    a: "Yes. A school may enter teams in all four competitions, provided each team meets the participation rules of its individual challenge."
  },
  {
    q: "How do we register?",
    a: "Choose your challenge above, open the challenge details and complete the official Google Form linked there. You will receive a confirmation once your entry has been reviewed."
  },
  {
    q: "Where will the competition take place?",
    a: "Venue details will be shared with confirmed participants by email before Competition Day. (Placeholder answer — edit in register-config.js.)"
  },
  {
    q: "What should participants bring?",
    a: "Your school identification, a copy of your registration confirmation, and any materials required by your challenge format — such as a pitch deck or pen drive."
  },
  {
    q: "When will registration close?",
    a: "20 October 2026 (placeholder date — edit in register-config.js once confirmed)."
  }
];
