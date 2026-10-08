/* =====================================================================
   ✏️  ALL YOUR CONTENT LIVES HERE  (ព័ត៌មានទាំងអស់នៅទីនេះ)
   Change the text in this file — you never need to touch the components.
   ===================================================================== */

export const profile = {
  // Hero name (one or two lines)
  nameLines: ['SAMATH PANNHAROTH'],
  shortName: 'ROTH',
  role: 'Software Developer',
  location: 'Phnom Penh, Cambodia',
  study: 'Software Development @ Norton University',
  focus: 'Full-stack · UI/UX · AI tools',
  email: 'sath72880@gmail.com',           // ✏️ change to your email
  github: 'https://github.com/ROTH007',
  telegram: 'https://t.me/OnyourLeft27',  // ✏️ or remove
  linkedin: '',                            // ✏️ optional
  cv: '',                                             // ✏️ optional: '/cv.pdf' (put the file in /public)

  // Images in /public
  photo: '/image1.png',  // normal photo
  suit: '/image2.png',   // suit image (nano transform)

  bio: [
    'I am a software development student from Cambodia who loves turning ideas into things people can click, play and use.',
    'I build full-stack web apps, desktop tools and small games — and I care a lot about making them look and feel great.',
    'Right now I am a software intern at TODAY Communication, building real products with Laravel, Vue and React.',
  ],

  stats: [
    { label: 'Projects built', value: 25, suffix: '+' },
    { label: 'Technologies', value: 15, suffix: '+' },
    { label: 'Year of study', value: 2, suffix: '' },
    { label: 'Cups of coffee', value: 999, suffix: '+' },
  ],

  status: [
    { label: 'Currently', title: 'Software Intern', sub: 'TODAY Communication Co., Ltd' },
    { label: 'Studying', title: 'Software Development', sub: 'Norton University' },
  ],
};

/* The AI assistant that greets visitors and answers commands */
export const assistant = {
  name: 'JAVIS',                 // ✏️ give your assistant any name
  fullName: 'Neural Operations & Virtual Assistant',
  voice: true,                  // speaks out loud after the visitor presses "Enter"
  greeting: 'Welcome. All systems are online. I will be your guide through this portfolio.',
};

/* ---------------- Skills ---------------- */
export const skillGroups = [
  {
    id: 'frontend',
    label: 'Frontend',
    skills: [
      { name: 'HTML / CSS', level: 90 },
      { name: 'JavaScript', level: 82 },
      { name: 'React', level: 75 },
      { name: 'Vue.js', level: 65 },
      { name: 'Tailwind CSS', level: 72 },
      { name: 'Blazor', level: 70 },
    ],
  },
  {
    id: 'backend',
    label: 'Backend',
    skills: [
      { name: 'Laravel / PHP', level: 70 },
      { name: 'C# / .NET', level: 78 },
      { name: 'Python / Flask', level: 80 },
      { name: 'Node.js / Express', level: 65 },
      { name: 'Java', level: 72 },
      { name: 'REST APIs', level: 75 },
    ],
  },
  {
    id: 'data',
    label: 'Databases',
    skills: [
      { name: 'PostgreSQL', level: 75 },
      { name: 'MySQL', level: 72 },
      { name: 'Oracle SQL', level: 70 },
      { name: 'MS Access / VBA', level: 78 },
    ],
  },
  {
    id: 'tools',
    label: 'Tools & More',
    skills: [
      { name: 'Git / GitHub', level: 75 },
      { name: 'Figma', level: 55 },
      { name: 'PyQt6', level: 78 },
      { name: 'Networking (IPv4/VLSM)', level: 65 },
    ],
  },
];

/* Tech chips shown in the hex cloud */
export const techCloud = [
  'React', 'Vue', 'Laravel', 'Blazor', 'C#', 'Python', 'Java', 'PHP', 'JavaScript',
  'PostgreSQL', 'MySQL', 'Oracle', 'Flask', 'Node.js', 'PyQt6', 'Tailwind', 'Git', 'Figma',
  'TypeScript', 'Phaser', 'Colyseus',
];

/* ---------------- Projects ---------------- */
/* ✏️ Projects
   live:     link to the deployed site → shows a LIVE preview + "Visit site" button
   image:    optional screenshot in /public (e.g. '/projects/today.png') — used instead of the live preview
   featured: true → shown big in "Live deployments" at the top
   cta:      text of the main button (default "Visit site ↗")
   note:     small warning under the buttons (optional) */
export const projects = [
  {
    id: 'pixel-brawl',
    title: 'Pixel Brawl',
    tag: 'Game',
    year: '2026',
    featured: true,
    live: 'https://pixel-brawl-kw7b.onrender.com/',
    image: '',
    cta: 'Play now ↗',
    note: 'Free server — the first load can take ~30–50 seconds to wake up.',
    stack: ['TypeScript', 'Phaser 3', 'Colyseus', 'Node.js', 'Render'],
    summary: 'Online multiplayer pixel fighting game — knock your friends off the map.',
    details: 'Create your own pixel fighter, open a room, share the 5-letter code and battle up to 10 friends in real time. Smash-style knockback means the lower your HP, the further you fly. The server is authoritative, so nobody can cheat, and wins, matches and KOs are saved to your account.',
    features: [
      'Real-time multiplayer rooms (2–10 players)',
      'Register / login with bcrypt + JWT',
      'Character creator with live animated preview',
      'Public room list + private rooms by code',
      'Smash-style knockback, 3 lives, last one standing wins',
      'Server-authoritative netcode (no cheating)',
      'Touch controls on phones + auto-reconnect',
      'Stats saved: wins, matches, KOs',
    ],
    link: 'https://pixel-brawl-kw7b.onrender.com/', repo: 'https://github.com/ROTH007/pixel-brawl',
  },
  {
    id: 'today-web',
    title: 'TODAY Internet Website',
    tag: 'Web',
    year: '2026',
    featured: true,
    live: 'https://today-website.vercel.app/',
    image: '',
    stack: ['React', 'Tailwind CSS', 'Vercel'],   // ✏️ check the stack
    summary: 'Company website for TODAY Internet — "Get connected to the world".',
    details: 'A responsive company website for TODAY Internet, an internet service provider in Cambodia. It presents the company, its internet services and how customers can get connected, and it is deployed live on Vercel.',
    features: ['Responsive on mobile & desktop', 'Internet service showcase', 'Company & contact information', 'Live on Vercel'],
    link: 'https://today-website.vercel.app/', repo: '',
  },
  {
    id: 'lotus-cinema',
    title: 'Lotus Cinema',
    tag: 'Web',
    year: '2026',
    featured: true,
    live: 'https://lotus-cinema-frontend-6xo4.vercel.app/',
    image: '',
    stack: ['React', 'Vercel'],                     // ✏️ check the stack
    summary: 'Cinema website for browsing movies and showtimes.',
    details: 'The frontend of Lotus Cinema, a movie theater website where visitors can explore movies and what is showing. Built as a responsive single-page app and deployed live on Vercel.',
    features: ['Movie listings', 'Showtimes & movie details', 'Responsive single-page app', 'Live on Vercel'],
    link: 'https://lotus-cinema-frontend-6xo4.vercel.app/', repo: '',
  },
  {
    id: 'fooddesk',
    title: 'FoodDesk',
    tag: 'Full-stack',
    year: '2026',
    stack: ['Blazor Server', 'C#', 'PostgreSQL'],
    summary: 'Food ordering system with KHQR / ABA QR payment.',
    details: 'A complete food ordering platform: menu browsing, cart, coupons and a KHQR-styled payment modal. Designed with Use Case diagrams and an ERD before coding.',
    features: ['ABA QR payment flow', 'Coupon claim system', 'Admin menu management', 'ERD + Use Case design'],
    link: '', repo: '',
  },
  {
    id: 'inventory',
    title: 'Product Inventory System',
    tag: 'Full-stack',
    year: '2026',
    stack: ['React', 'Tailwind', 'Laravel 11', 'PostgreSQL'],
    summary: 'Internship project — inventory management with a REST API.',
    details: 'Built with a teammate at TODAY Communication. I own the frontend: a React + Tailwind dashboard on top of a Laravel REST API with filtering, search and pagination.',
    features: ['Filtering, search & pagination', 'REST API integration', 'Team workflow on GitHub', 'Responsive dashboard UI'],
    link: '', repo: '',
  },
  {
    id: 'towerdefense',
    title: 'AI Tower Defense',
    tag: 'Game / AI',
    year: '2026',
    stack: ['Python', 'PyQt6', 'A* Algorithm'],
    summary: 'Tower defense game where enemies find their path with A*.',
    details: 'Built for my Introduction to AI course. Enemies use A* pathfinding to react to the towers you place.',
    features: ['A* pathfinding', 'Map selection & difficulty modes', 'Save / load with JSON', 'Menus, sounds & per-map enemies'],
    link: '', repo: '',
  },
  {
    id: 'assistant-bot',
    title: 'AI Assistant Bot',
    tag: 'AI',
    year: '2026',
    stack: ['Python', 'Telegram API', 'edge-tts'],
    summary: 'Personal AI assistant on Telegram that talks back.',
    details: 'A personal assistant bot with a British neural voice, weather reports and speech recognition.',
    features: ['Voice replies (edge-tts)', 'Speech recognition', 'Weather reports', 'Telegram commands'],
    link: '', repo: '',
  },
  {
    id: 'khqr',
    title: 'KHQR Shop Demo',
    tag: 'Full-stack',
    year: '2026',
    stack: ['React', 'Vite', 'Flask', 'Bakong API'],
    summary: 'E-commerce demo with real KHQR checkout testing.',
    details: 'A small online shop that generates KHQR payment codes through the Bakong Open API and checks the payment status.',
    features: ['KHQR code generation', 'Payment status check', 'React + Vite frontend', 'Flask backend'],
    link: '', repo: '',
  },
  {
    id: 'staffsync',
    title: 'StaffSync',
    tag: 'Full-stack',
    year: '2026',
    stack: ['Blazor', '.NET', 'EF Core', 'PostgreSQL'],
    summary: 'Employee management with timesheets.',
    details: 'A multi-project .NET solution for managing employees, with a redesigned UI and a timesheet feature.',
    features: ['Employee records', 'Timesheet tracking', 'EF Core + PostgreSQL', 'Multi-project architecture'],
    link: '', repo: '',
  },
  {
    id: 'water',
    title: 'Water Billing System',
    tag: 'Database',
    year: '2025',
    stack: ['MS Access', 'VBA', 'Oracle'],
    summary: '22-table billing system with role-based login.',
    details: 'A desktop database application for water billing, with VBA modules, forms and login by role.',
    features: ['22 related tables', 'Role-based login', 'VBA automation', 'Billing reports'],
    link: '', repo: '',
  },
  {
    id: 'calculator',
    title: 'Scientific Calculator',
    tag: 'Desktop',
    year: '2025',
    stack: ['Java', 'Swing'],
    summary: 'Scientific calculator with integration and matrix mode.',
    details: 'A Java Swing calculator inspired by real scientific calculators — numerical integration, differentiation and a matrix mode.',
    features: ['Numerical integration', 'Differentiation', 'Matrix mode', 'Custom Swing UI'],
    link: '', repo: '',
  },
  {
    id: 'portfolio',
    title: 'This Portfolio',
    tag: 'Frontend',
    year: '2026',
    stack: ['React', 'Framer Motion', 'Canvas'],
    summary: 'The site you are on — nano-suit transform and an AI guide.',
    details: 'A sci-fi portfolio with a boot sequence, canvas paint-reveal, a nano-tech transform animation and a voice assistant.',
    features: ['Canvas nano transform', 'Voice assistant', 'Achievements system', 'Animated HUD'],
    link: '', repo: 'https://github.com/ROTH007/Sokchea',
  },
];

/* ---------------- What I learned (timeline) ---------------- */
export const timeline = [
  {
    when: 'Year 1',
    title: 'Foundations',
    text: 'Programming logic, C# OOP fundamentals, digital design (Boolean algebra, K-maps) and computer networking (IPv4, VLSM).',
    tags: ['C#', 'OOP', 'Networking', 'Digital Design'],
  },
  {
    when: 'Year 2',
    title: 'Databases & Desktop Apps',
    text: 'Oracle and MS Access systems with triggers, views and VBA. Java Swing GUIs, Python PyQt6 apps and my first AI course.',
    tags: ['Oracle', 'MS Access', 'Java', 'PyQt6', 'AI'],
  },
  {
    when: 'Year 2',
    title: 'Web & Full-stack',
    text: 'Blazor + PostgreSQL, Flask APIs, React + Vite, and real payment integration with KHQR.',
    tags: ['Blazor', 'Flask', 'React', 'PostgreSQL'],
  },
  {
    when: '2026',
    title: 'Internship',
    text: 'Software intern at TODAY Communication — Laravel, Vue, React, teamwork on GitHub and learning Figma.',
    tags: ['Laravel', 'Vue', 'React', 'Figma', 'Teamwork'],
  },
  {
    when: 'Next',
    title: 'Coming soon',
    text: 'Three.js, cloud deployment and building AI features into real products.',
    tags: ['Three.js', 'Cloud', 'AI'],
  },
];

/* ---------------- Achievements ---------------- */
/* ---------------- Achievements ----------------
   image: picture in /public (shown at the top of the card)
   fit:   'cover' = fill the box (photos) · 'contain' = show the whole image (logos)
   icon:  used only if there is no image */
export const achievements = [
  { image: '/intern.png',         icon: '🏢', title: 'Software Internship', text: 'Selected as a software intern at TODAY Communication Co., Ltd.', year: '2026' },
  { image: '/project.png',        icon: '🚀', title: '25+ Projects', text: 'Built more than 25 apps, systems and games across 6+ languages.', year: '2026' },
  { image: '/khqr.png',           icon: '💳', title: 'Real Payment Integration', text: 'Integrated KHQR / Bakong payments into my own projects.', year: '2026' },
  { image: '/aigame.png',         icon: '🤖', title: 'AI Game', text: 'Built a tower defense game with A* pathfinding for my AI course.', year: '2026' },
  { image: '/system.png',         icon: '🧠', title: 'Expert System', text: 'Built a PyQt6 expert system that troubleshoots computer problems.', year: '2026' },
  { image: '/multilaguage.jpg',   icon: '🌐', title: 'Multilingual', text: 'Khmer native, English, plus Japanese and Korean basics.', year: '—' },
];

/* ---------------- Hobbies ---------------- */
export const hobbies = [
  { icon: '💻', name: 'Creative Coding', text: 'Games, generative art and fun visual experiments.' },
  { icon: '🏋️', name: 'Gym', text: 'Training keeps my mind sharp for long coding sessions.' },
  { icon: '🎬', name: 'Content Creation', text: 'Making TikTok videos about coding, gym and style.' },
  { icon: '👕', name: 'Fashion', text: 'Putting outfits together is design too.' },
  { icon: '🎮', name: 'Gaming', text: 'Games inspire the way I build interactive UIs.' },
  { icon: '🗣️', name: 'Languages', text: 'Learning Japanese and Korean for fun.' },
];