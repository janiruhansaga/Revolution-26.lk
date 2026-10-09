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
    title: "BUSINESS PITCH",
    tagline: "TURN IDEAS INTO OPPORTUNITIES.",
    description: "Present an original business concept and demonstrate how your idea can solve a real problem, create value and become a viable opportunity.",
    focus: ["Business Thinking", "Innovation", "Communication", "Strategy"],
    details: {
      about: "Participants present an original business concept in a concise, high-impact pitch. The challenge moves from problem identification to value proposition, revenue logic and execution — ending in a live presentation before the judging panel.",
      who: "Open to registered participants representing recognized school Entrepreneur Societies.",
      need: "A team of 2–4 participants, a prepared pitch deck (maximum 10 slides), and one representative to present. Submit your deck on a pen drive at the briefing desk 30 minutes before your round.",
      format: "5-minute pitch + 3-minute judge questions. Each team presents once; the top teams advance to a final round on the same day.",
      judging: "Originality (25%) · Problem–solution fit (25%) · Business viability (25%) · Presentation (25%)"
    }
  },
  {
    id: "entrepreneurshipQuiz",
    formKey: "entrepreneurshipQuiz",
    number: "02",
    title: "ENTREPRENEURSHIP QUIZ",
    tagline: "THINK FAST. KNOW BUSINESS.",
    description: "Test your knowledge of entrepreneurship, business, marketing, finance, innovation and current enterprise trends in a fast-paced competitive environment.",
    focus: ["Business Knowledge", "Quick Thinking", "Accuracy", "Decision Making"],
    details: {
      about: "A fast-paced written quiz covering entrepreneurship, business, marketing, finance, innovation and current enterprise trends — rewarding both knowledge and speed under pressure.",
      who: "Open to registered participants representing recognized school Entrepreneur Societies.",
      need: "Teams of 2 participants per school. One connected device is permitted for the tie-break round only. No external references during the quiz rounds.",
      format: "Three rounds — Qualifier (written), Rapid Fire (buzzer) and Tie-break. Elimination format with a live scoreboard.",
      judging: "Highest combined score across rounds. A speed bonus applies in the Rapid Fire round. Decisions of the judging panel are final."
    }
  },
  {
    id: "aiProductInnovation",
    formKey: "aiProductInnovation",
    number: "03",
    title: "AI PRODUCT INNOVATION",
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
  { label: "REGISTRATION OPENS", date: "01 OCTOBER 2026", placeholder: true },
  { label: "REGISTRATION CLOSES", date: "20 OCTOBER 2026", placeholder: true },
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
