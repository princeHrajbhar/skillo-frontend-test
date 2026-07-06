export interface Course {
  id: number;
  title: string;
  image: string;
  price: string;
  oldPrice: string;
  rating: string;
  popular?: boolean;
  skills: string[];
  // New enhanced fields
  subtitle: string;
  description: string;
  longDescription: string;
  curriculum: CurriculumItem[];
  instructor: Instructor;
  studentsEnrolled: number;
  lastUpdated: string;
  language: string;
  certificate: boolean;
  level: 'Beginner' | 'Intermediate' | 'Advanced' | 'All Levels';
  duration: string;
  lectures: number;
  projects: number;
  includes: string[];
  learningOutcomes: string[];
  reviews: Review[];
  faqs: FAQ[];
}

export interface CurriculumItem {
  week: number;
  title: string;
  topics: string[];
}

export interface Instructor {
  name: string;
  title: string;
  avatar: string;
  bio: string;
  experience: string;
  students: number;
  rating: number;
}

export interface Review {
  id: number;
  user: string;
  avatar: string;
  rating: number;
  date: string;
  comment: string;
}

export interface FAQ {
  question: string;
  answer: string;
}