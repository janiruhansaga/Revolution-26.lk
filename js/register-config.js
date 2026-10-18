/* ============================================================
   REVOLUTION ’26 — REGISTRATION PORTAL
   EDIT EVERYTHING HERE — no other file needs editing.
   ------------------------------------------------------------
   Official source: “Revolution ’26 Inter-School Competition
   Guidelines” (Nalanda College Entrepreneur Society).
   1) registrationLinks … official registration form URL(s)
   2) guidelinesPdf ……… official guidelines PDF (all challenges)
   3) competitions ……… the five competitions, copy and details
   4) eventDates ………… the important-dates timeline
   5) faqs ………………… accordion answers
   ============================================================ */

/* ------------------------------------------------------------
   1) REGISTRATION LINKS
   REVOLUTION ’26 uses a single official registration form for
   all five competitions. Each competition points at a key below
   through its `formKey` — links are never scattered in the HTML.
   Replace the value with a category-specific form if one is
   published for a competition.
   ------------------------------------------------------------ */
/* Main Event Registration - REVOLUTION '26 */
const MAIN_EVENT_REGISTRATION_URL = "YOUR_MAIN_GOOGLE_FORM_URL";

const registrationLinks = {
  entrepreneurshipQuiz: "https://docs.google.com/forms/d/e/1FAIpQLSfaUS61G7CCvWZ0dxbToU9BmpVtsCM-5_hXYaqCDEZIMF15Xg/viewform?usp=publish-editor",
  businessPitch: "https://docs.google.com/forms/d/e/1FAIpQLSe5naQZP2GT_W7mwdF3jjemodSi0-kq1k-4UI7QqSuNUF43vA/viewform?usp=publish-editor",
  problemSolving: "https://docs.google.com/forms/d/e/1FAIpQLSfg8-2xJSpXh5UHF_lub3nZ5NpMXLvABVqSDtgsjnZbfHrqhQ/viewform?usp=publish-editor",
  aiVideoCreation: "https://docs.google.com/forms/d/e/1FAIpQLScwpcYzRumVJ56UZbQobDlseHg93DvOaIdQ_4M9F3lAphdhQw/viewform?usp=header",
  posterDesigning: "https://docs.google.com/forms/d/e/1FAIpQLSdEYs29mf-6t2hBjk456hBnPieIHFW-2ghPUgaq5P5X45Zy1A/viewform?usp=publish-editor"
};

/* ------------------------------------------------------------
   2) GUIDELINES PDF
   Official competition guidelines document. The “Guidelines”
   button on every competition card points here. A single shared
   PDF is referenced by all five challenges — replace the URL to
   publish a revised document.
   ------------------------------------------------------------ */
const guidelinesPdf = "https://drive.google.com/uc?export=download&id=1Dr1VgbEtQvEgti67C9021_cEpORGQhr5";

/* ------------------------------------------------------------
   3) COMPETITIONS — the five official REVOLUTION ’26 challenges.
   Rendered as editorial panels in the order below.
   ------------------------------------------------------------ */
const competitions = [
  {
    id: "entrepreneurshipQuiz",
    formKey: "entrepreneurshipQuiz",
    number: "01",
    title: "QUIZ COMPETITION",
    short: "Quiz",
    tagline: "ENTREPRENEURSHIP KNOWLEDGE AND GENERAL KNOWLEDGE",
    description: "Demonstrate your entrepreneurial knowledge, general awareness and analytical thinking by answering 30 multiple-choice questions within 30 minutes.",
    focus: ["Entrepreneurship", "General Knowledge", "Analytical Thinking", "Decision Making"],
    details: {
      about: "The Quiz Competition evaluates participants’ knowledge of entrepreneurship, business concepts and general knowledge. It consists of 30 multiple-choice questions divided into two sections — Section 01: Entrepreneurship (20 questions) and Section 02: General Knowledge (10 questions). The quiz is conducted at Nalanda College on the official competition day.",
      who: "Open to eligible school students, subject to the official eligibility requirements established by the organizing committee. Team size: three members per team.",
      need: "A team of three members. Participants must complete the quiz within the specified time limit. The use of external resources, AI tools or assistance from other individuals is prohibited unless explicitly permitted by the organizing committee.",
      format: "Multiple-choice quiz conducted at Nalanda College. Duration: 30 minutes to complete all 30 questions across the two sections.",
      judging: "Participants are evaluated according to their performance in the quiz. The scoring system, tie-breaking procedure and any additional instructions will be communicated by the organizing committee."
    }
  },
  {
    id: "businessPitch",
    formKey: "businessPitch",
    number: "02",
    title: "BUSINESS PITCH COMPETITION",
    short: "Pitch",
    tagline: "MAKE YOUR MOVE: FROM IDEA TO ENTERPRISE",
    topics: [
      { name: "Topic 01 — Make Your Move: From Idea to Enterprise", text: "Develop an original business idea that responds to a customer need, solves an existing problem or introduces an innovative product or service to the market. Explain the proposed business, its target customers, competitive advantage, revenue model, operational requirements and potential for growth, demonstrating that the idea is both innovative and commercially feasible." },
      { name: "Topic 02 — From Waste to Wealth: Turning Problems into Business Opportunities", text: "Develop a business idea that transforms Sri Lanka’s waste into valuable products, such as reusable packaging, recycled materials or products made from agricultural waste. Explain the target market, revenue model, expected costs and opportunities for growth while addressing an existing problem and creating economic or environmental value." },
      { name: "Topic 03 — Beyond the Shopfront: Taking Local Businesses into the Digital Market", text: "Propose a practical business that helps small Sri Lankan businesses reach more customers through online platforms, digital payments, delivery partnerships or a shared online marketplace. Identify the challenges faced by small businesses, explain how the solution would operate and demonstrate its potential to attract customers and generate sustainable revenue." }
    ],
    description: "Transform innovative business ideas into practical enterprise concepts by demonstrating creativity, strategic thinking, market awareness and entrepreneurial potential.",
    focus: ["Innovation", "Business Feasibility", "Market Understanding", "Strategy", "Communication"],
    details: {
      about: "Participants develop business concepts that address real needs, demonstrate commercial potential and present realistic growth opportunities. Presentations must be submitted in PDF or PowerPoint format before the deadline specified by the organizing committee. Following preliminary evaluation, the top five teams are selected to deliver live presentations at Nalanda College on the competition day.",
      who: "Open to eligible school students. Team composition and school participation limits must comply with the requirements announced by the organizing committee.",
      need: "A business pitch presentation submitted in PDF or PowerPoint format before the announced deadline, supported by relevant research and realistic assumptions.",
      format: "Preliminary evaluation followed by a live, in-person presentation round. Live presentations last five minutes, followed by a two-minute question and answer session. Participation is restricted to the five teams selected through the preliminary evaluation.",
      judging: "Innovation and Originality · Business Feasibility · Market Understanding · Strategic Thinking · Presentation Quality · Q&A Performance"
    }
  },
  {
    id: "problemSolving",
    formKey: "problemSolving",
    number: "03",
    title: "PROBLEM-SOLVING COMPETITION",
    short: "Case Study",
    tagline: "THE KING’S GAMBIT: MAKING THE RIGHT MOVE IN A CHANGING BUSINESS WORLD",
    topics: [
      { name: "Case Study 01 — The Local Brand at a Crossroads (Food and Beverage)", text: "A Sri Lankan snack manufacturer with a loyal customer base faces rising production costs and competition from premium brands. Recommend a strategy that protects the brand’s existing customers while creating opportunities for profitable growth, covering pricing decisions, cost responses, differentiation and long-term profitability." },
      { name: "Case Study 02 — Growth or Dependence? (Apparel and Export Business)", text: "A growing Sri Lankan apparel company depends on one major international buyer, creating significant business risk. Develop a realistic growth strategy that balances revenue opportunities, investment requirements and business risk, explaining how to reduce dependence on a single buyer and support stable long-term growth." }
    ],
    description: "Analyse business situations, identify key problems and develop practical strategies that demonstrate critical thinking, adaptability and effective decision-making.",
    focus: ["Critical Analysis", "Strategic Decision-Making", "Creativity", "Feasibility", "Communication"],
    details: {
      about: "The Case Study Competition evaluates participants’ ability to understand business challenges, examine available information and recommend appropriate solutions. Participants are expected to approach problems strategically, assess possible alternatives and justify their recommendations using logical reasoning. The organizing committee will provide the specific case study, submission format and competition procedure.",
      who: "Open to eligible school students, subject to the official eligibility requirements established by the organizing committee.",
      need: "Participants analyse the business situation, identify the main problems, risks and opportunities, evaluate possible courses of action and develop practical, innovative recommendations. All submissions must comply with the instructions provided by the organizers and must be original work.",
      format: "Submission-based competition following the procedure announced by the organizing committee. Submission deadlines and formatting requirements must be followed.",
      judging: "Problem Identification · Critical Analysis · Strategic Decision-Making · Creativity and Innovation · Feasibility · Communication"
    }
  },
  {
    id: "aiVideoCreation",
    formKey: "aiVideoCreation",
    number: "04",
    title: "AI VIDEO CREATION COMPETITION",
    short: "AI Video",
    tagline: "THE MOVE THAT CHANGES EVERYTHING",
    description: "Combine artificial intelligence, creativity and storytelling to communicate an engaging idea through video.",
    focus: ["AI Tools", "Storytelling", "Creativity", "Technical Quality", "Audience Impact"],
    details: {
      about: "The AI Video Creation Competition encourages participants to explore how AI-supported creative tools can be used to communicate ideas, develop narratives and produce compelling visual content. The submitted video should present a clear, engaging central idea and connect meaningfully with the spirit of REVOLUTION ’26 and the theme “THE KING’S MOVE.”",
      who: "Open to eligible school students. Further rules regarding team size, duration and permitted tools will be issued by the organizing committee. AI tools must be used in accordance with the competition’s official policy.",
      need: "A video based on the assigned topic. The official video duration, file format, resolution, submission deadline and file-naming requirements must be confirmed by the organizing committee. Work must respect applicable copyright and content-ownership requirements.",
      format: "Submission-based competition. All submissions must be submitted before the announced deadline and must comply with the official topic and technical requirements.",
      judging: "Creative Execution · Theme Relevance · Storytelling · Use of AI Tools · Technical Quality · Audience Impact"
    }
  },
  {
    id: "posterDesigning",
    formKey: "posterDesigning",
    number: "05",
    title: "POSTER DESIGNING COMPETITION",
    short: "Poster",
    tagline: "ONE MOVE AHEAD: DESIGNING THE FUTURE OF BUSINESS",
    topics: [
      { name: "Topic 01 — The Move Before the Market", text: "Tagline: Seeing Tomorrow’s Opportunities Today. Businesses can gain an advantage by recognising changing customer needs and market trends before their competitors do. The poster may portray a chess king moving towards a future market of digital technology, innovation and emerging business opportunities, communicating the importance of foresight, adaptability and well-timed decisions." },
      { name: "Topic 02 — Smart Moves, Sustainable Futures", text: "Tagline: Building Businesses That Last. Explore how businesses can balance profitability with environmental responsibility, combining a chess piece, a growing tree and visual references to renewable energy, sustainable production and green technology. Communicate how responsible decisions create lasting value for companies, communities and the environment." }
    ],
    description: "Communicate innovative business ideas through impactful visual design, combining creativity, strategic thinking and effective visual communication.",
    focus: ["Creativity", "Design Composition", "Message Clarity", "Theme Relevance", "Technical Quality"],
    details: {
      about: "The Poster Designing Competition encourages participants to present ideas about the future of business through original and visually engaging designs. Participants use visual elements to communicate a clear message while demonstrating how creativity and forward-thinking decisions can influence business and entrepreneurship.",
      who: "Open to eligible school students. All submitted designs must be original; participants must not copy or plagiarise existing artwork.",
      need: "A poster design reflecting the assigned topic and the overall theme of REVOLUTION ’26, using typography, imagery and layout effectively. Official poster dimensions, accepted file formats, resolution, submission method and deadline must be confirmed by the organizing committee.",
      format: "Submission-based competition. Images, fonts and other design elements must be used in accordance with applicable permissions and licences. The use of AI tools must comply with the policy announced for the competition.",
      judging: "Creativity and Originality · Theme Relevance · Visual Impact · Design Composition · Message Clarity · Technical Quality"
    }
  }
];

/* ------------------------------------------------------------
   4) IMPORTANT DATES — official timeline.
   Registration and submission deadlines are announced by the
   organizing committee; the competition day is fixed below.
   ------------------------------------------------------------ */
const eventDates = [
  { label: "REGISTRATION OPENS", date: "TO BE ANNOUNCED" },
  { label: "REGISTRATION CLOSES", date: "TO BE ANNOUNCED" },
  { label: "COMPETITION DAY", date: "29 OCTOBER 2026" }
];

/* ------------------------------------------------------------
   5) FAQ
   ------------------------------------------------------------ */
const faqs = [
  {
    q: "Who can participate?",
    a: "Participation is open to eligible school students, subject to the official eligibility requirements established by the organizing committee. Schools may participate in the competitions for which they meet the relevant requirements."
  },
  {
    q: "How many competitions are there?",
    a: "REVOLUTION ’26 consists of five competitions: the Quiz Competition, Business Pitch Competition, Problem-Solving Competition (Case Study), AI Video Creation Competition and Poster Designing Competition."
  },
  {
    q: "Can one school participate in multiple competitions?",
    a: "Yes. A school may enter the competitions for which its students meet the relevant requirements, provided each entry follows the rules and regulations of its individual competition. Any restrictions relating to participation in multiple competitions will be announced by the organizing committee."
  },
  {
    q: "How do we register?",
    a: "Choose your challenge above, open the challenge details and complete the official registration form linked there. Each participating school must ensure that its students comply with the rules and regulations of the selected competitions."
  },
  {
    q: "Where will the competition take place?",
    a: "The Quiz Competition and the live presentation round of the Business Pitch Competition will take place at Nalanda College on the official REVOLUTION ’26 competition day. The Case Study, AI Video Creation and Poster Designing competitions follow the submission and evaluation procedures announced by the organizing committee."
  },
  {
    q: "When will registration close?",
    a: "Registration and submission deadlines will be announced by the organizing committee through the official REVOLUTION ’26 announcements."
  },
  {
    q: "Will participants receive awards or certificates?",
    a: "Outstanding participants and teams will be recognized according to the awards and certificates announced by the organizing committee. The award categories, prizes and recognition procedures will be communicated through the official REVOLUTION ’26 announcements."
  },
  {
    q: "How can we contact the organizers?",
    a: "For further information, contact Risith Hansaka (CEO) at +94 77 125 9027 or Isuru Umayanga (Financial Manager) at +94 75 411 3748."
  }
];
