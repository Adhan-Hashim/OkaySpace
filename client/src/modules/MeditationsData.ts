export interface Meditation {
  id: string;
  title: string;
  duration: string;
  bestFor: string;
  steps: string[];
  benefits: string[];
}

export const GUIDED_MEDITATIONS: Meditation[] = [
  {
    id: 'body-scan',
    title: 'Body Scan Meditation',
    duration: '10–20 minutes',
    bestFor: 'Physical tension, insomnia, burnout',
    steps: [
      'Close your eyes.',
      'Start noticing your toes.',
      'Slowly move your attention upward: Feet, Legs, Hips, Stomach, Chest, Arms, Neck, Face.',
      'Relax each body part as you notice it.'
    ],
    benefits: [
      'Releases muscle tension',
      'Improves sleep',
      'Increases body awareness'
    ]
  },
  {
    id: 'loving-kindness',
    title: 'Loving-Kindness Meditation',
    duration: '10 minutes',
    bestFor: 'Anger, loneliness, self-criticism',
    steps: [
      'Silently repeat: May I be happy.',
      'May I be healthy.',
      'May I be safe.',
      'May I live peacefully.',
      'Then repeat the same wishes for: Someone you love.',
      'Someone neutral.',
      'Someone you find difficult.',
      'Everyone.'
    ],
    benefits: [
      'Builds compassion',
      'Reduces negative emotions',
      'Improves relationships'
    ]
  },
  {
    id: 'guided-visualization',
    title: 'Guided Visualization',
    duration: '10 minutes',
    bestFor: 'Relaxation, stress relief',
    steps: [
      'Imagine yourself in a peaceful place: A quiet beach, a forest, mountains, or a lakeside.',
      'Visualize the sounds.',
      'Visualize the smells.',
      'Visualize the temperature.',
      'Visualize the colors.',
      'Stay there for 10 minutes.'
    ],
    benefits: [
      'Calms the nervous system',
      'Reduces anxiety',
      'Improves mood'
    ]
  },
  {
    id: 'walking',
    title: 'Walking Meditation',
    duration: '15 minutes',
    bestFor: 'Restlessness, ADHD-like symptoms',
    steps: [
      'Walk slowly.',
      'Notice each step.',
      'Notice your breathing.',
      'Notice the feeling of your feet touching the ground.',
      'No phone. No music.'
    ],
    benefits: [
      'Combines exercise with mindfulness',
      'Improves concentration',
      'Reduces stress'
    ]
  },
  {
    id: 'gratitude',
    title: 'Gratitude Meditation',
    duration: '5 minutes',
    bestFor: 'Low mood, negative thinking',
    steps: [
      'Think of three things you are grateful for.',
      'Examples: Family, Good health, A meal, Nature, Friends.',
      'Spend a minute appreciating each one.'
    ],
    benefits: [
      'Increases optimism',
      'Reduces stress',
      'Supports emotional resilience'
    ]
  },
  {
    id: 'five-senses',
    title: 'Five Senses Meditation (5-4-3-2-1)',
    duration: '5 minutes',
    bestFor: 'Anxiety and grounding',
    steps: [
      'Notice 5 things you can see.',
      'Notice 4 things you can feel.',
      'Notice 3 things you can hear.',
      'Notice 2 things you can smell.',
      'Notice 1 thing you can taste.'
    ],
    benefits: [
      'Grounds you in the present',
      'Helps interrupt spiraling thoughts'
    ]
  },
  {
    id: 'mantra',
    title: 'Mantra Meditation',
    duration: '10 minutes',
    bestFor: 'Improving focus',
    steps: [
      'Choose a calming word or phrase, such as: Peace, Calm, Relax, Om, or I am enough.',
      'Repeat it slowly while breathing naturally.'
    ],
    benefits: [
      'Improves concentration',
      'Reduces mental chatter'
    ]
  },
  {
    id: 'progressive-muscle',
    title: 'Progressive Muscle Relaxation',
    duration: '15 minutes',
    bestFor: 'Stress held in the body',
    steps: [
      'Starting from your feet: Tighten a muscle group for 5 seconds.',
      'Release for 10 seconds.',
      'Move upward through the body.'
    ],
    benefits: [
      'Relieves muscle tension',
      'Helps with stress and sleep'
    ]
  },
  {
    id: 'mindful-journaling',
    title: 'Mindful Journaling Meditation',
    duration: '10 minutes',
    bestFor: 'Overthinking and emotional clarity',
    steps: [
      'After a few minutes of quiet breathing, write freely for 5–10 minutes about:',
      'What you are feeling.',
      'What is on your mind.',
      'What you can let go of.',
      'One positive intention for the day.'
    ],
    benefits: [
      'Organizes thoughts',
      'Reduces rumination',
      'Encourages self-reflection'
    ]
  }
];
