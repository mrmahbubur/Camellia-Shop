export interface ThoughtQuote {
  id: string;
  quote: string;
  author: string;
  category: 'Clarity & Focus' | 'Online Hustle' | 'Perseverance' | 'Growth Mindset';
  takeaway: string;
}

export const THOUGHTS: ThoughtQuote[] = [
  {
    id: 'thought-1',
    quote: 'Action breeds clarity far quicker than contemplation ever can. Do not wait for the perfect blueprint; build the foundation with today\'s stone.',
    author: 'Camellia Shop',
    category: 'Clarity & Focus',
    takeaway: 'Overthinking is just sophisticated procrastination. Ship something small today.'
  },
  {
    id: 'thought-2',
    quote: 'Sustainable wealth online is not built on gimmicks or overnight viral shortcuts. It is built by systematically solving specific problems for real people over a sustained horizon.',
    author: 'Camellia Shop',
    category: 'Online Hustle',
    takeaway: 'Focus on high utility and trust. When your free value is remarkable, your paid products sell themselves.'
  },
  {
    id: 'thought-3',
    quote: 'Your environment either drains your willpower or shields your focus. Upgrade your workspace, eliminate digital clutter, and protect your uninterrupted hours.',
    author: 'Camellia Shop Philosophy',
    category: 'Clarity & Focus',
    takeaway: 'A clean physical and digital workspace reduces cognitive fatigue by over 40%.'
  },
  {
    id: 'thought-4',
    quote: 'The gap between where you are and financial autonomy is measured solely in skills learned, systems implemented, and iterations survived.',
    author: 'Camellia Shop',
    category: 'Growth Mindset',
    takeaway: 'Failures are not dead ends; they are simply telemetry data telling you what to optimize next.'
  },
  {
    id: 'thought-5',
    quote: 'Never compete on price when you can compete on speed, empathy, and obsessive attention to detail.',
    author: 'Camellia Shop Commerce',
    category: 'Online Hustle',
    takeaway: 'High-ticket buyers gladly pay premiums for guaranteed outcomes and zero friction.'
  }
];
