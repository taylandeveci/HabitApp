import { HabitTemplate } from '../types';

export const habitTemplates: HabitTemplate[] = [
  {
    id: 'sports-fitness',
    name: 'Sports & Fitness',
    category: 'sports',
    description: 'Build a strong and healthy body',
    icon: 'fitness-sharp',
    color: '#10b981',
    habits: [
      {
        name: 'Morning Workout',
        category: 'sports',
        target: 1,
        icon: 'barbell',
        color: '#10b981'
      },
      {
        name: 'Daily Walk',
        category: 'sports',
        target: 10000, // steps
        icon: 'walk',
        color: '#059669'
      },
      {
        name: 'Drink Water',
        category: 'health',
        target: 8, // glasses
        icon: 'water',
        color: '#06b6d4'
      },
      {
        name: 'Stretching',
        category: 'sports',
        target: 1,
        icon: 'accessibility',
        color: '#34d399'
      }
    ]
  },
  {
    id: 'education-learning',
    name: 'Education & Learning',
    category: 'study',
    description: 'Expand your knowledge and skills',
    icon: 'school-sharp',
    color: '#8b5cf6',
    habits: [
      {
        name: 'Read Books',
        category: 'study',
        target: 30, // minutes
        icon: 'book',
        color: '#8b5cf6'
      },
      {
        name: 'Study New Language',
        category: 'study',
        target: 20, // minutes
        icon: 'language',
        color: '#a78bfa'
      },
      {
        name: 'Online Course',
        category: 'study',
        target: 1, // lesson
        icon: 'laptop',
        color: '#c084fc'
      },
      {
        name: 'Practice Skills',
        category: 'study',
        target: 45, // minutes
        icon: 'construct',
        color: '#7c3aed'
      }
    ]
  },
  {
    id: 'finance-money',
    name: 'Finance & Money',
    category: 'finance',
    description: 'Build financial discipline and wealth',
    icon: 'card-sharp',
    color: '#f59e0b',
    habits: [
      {
        name: 'Track Expenses',
        category: 'finance',
        target: 1,
        icon: 'receipt',
        color: '#f59e0b'
      },
      {
        name: 'Save Money',
        category: 'finance',
        target: 1,
        icon: 'cash',
        color: '#d97706'
      },
      {
        name: 'Investment Research',
        category: 'finance',
        target: 15, // minutes
        icon: 'trending-up',
        color: '#amber'
      },
      {
        name: 'Budget Review',
        category: 'finance',
        target: 1,
        icon: 'calculator',
        color: '#f59e0b'
      }
    ]
  },
  {
    id: 'work-productivity',
    name: 'Work & Productivity',
    category: 'work',
    description: 'Enhance your professional performance',
    icon: 'briefcase-sharp',
    color: '#3b82f6',
    habits: [
      {
        name: 'Deep Work Session',
        category: 'work',
        target: 2, // hours
        icon: 'timer',
        color: '#3b82f6'
      },
      {
        name: 'Plan Tomorrow',
        category: 'work',
        target: 1,
        icon: 'calendar',
        color: '#2563eb'
      },
      {
        name: 'Learn New Skill',
        category: 'work',
        target: 30, // minutes
        icon: 'bulb',
        color: '#1d4ed8'
      },
      {
        name: 'Network Building',
        category: 'work',
        target: 1,
        icon: 'people',
        color: '#1e40af'
      }
    ]
  },
  {
    id: 'health-wellness',
    name: 'Health & Wellness',
    category: 'health',
    description: 'Nurture your physical and mental health',
    icon: 'heart-sharp',
    color: '#ef4444',
    habits: [
      {
        name: 'Meditation',
        category: 'health',
        target: 10, // minutes
        icon: 'leaf',
        color: '#10b981'
      },
      {
        name: 'Sleep 8 Hours',
        category: 'health',
        target: 8,
        icon: 'bed',
        color: '#6366f1'
      },
      {
        name: 'Healthy Meal',
        category: 'health',
        target: 3,
        icon: 'nutrition',
        color: '#059669'
      },
      {
        name: 'Vitamins',
        category: 'health',
        target: 1,
        icon: 'medical',
        color: '#dc2626'
      }
    ]
  },
  {
    id: 'personal-development',
    name: 'Personal Development',
    category: 'personal',
    description: 'Grow as a person and build character',
    icon: 'person-sharp',
    color: '#6366f1',
    habits: [
      {
        name: 'Journaling',
        category: 'personal',
        target: 1,
        icon: 'journal',
        color: '#8b5cf6'
      },
      {
        name: 'Gratitude Practice',
        category: 'personal',
        target: 3, // things
        icon: 'happy',
        color: '#f59e0b'
      },
      {
        name: 'Digital Detox',
        category: 'personal',
        target: 1, // hour
        icon: 'phone-portrait-outline',
        color: '#64748b'
      },
      {
        name: 'Connect with Family',
        category: 'personal',
        target: 1,
        icon: 'home',
        color: '#ec4899'
      }
    ]
  }
];

export const getCategoryIcon = (category: string): string => {
  const iconMap = {
    sports: 'fitness-sharp',
    study: 'school-sharp',
    finance: 'card-sharp',
    work: 'briefcase-sharp',
    health: 'heart-sharp',
    personal: 'person-sharp'
  };
  return iconMap[category as keyof typeof iconMap] || 'ellipse';
};

export const getCategoryColor = (category: string): string => {
  const colorMap = {
    sports: '#10b981',
    study: '#8b5cf6',
    finance: '#f59e0b',
    work: '#3b82f6',
    health: '#ef4444',
    personal: '#6366f1'
  };
  return colorMap[category as keyof typeof colorMap] || '#6b7280';
};
