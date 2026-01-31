export interface Blog {
  title: string;
  author: string;
  date: string;
  content: string;
  tags: string[];
  slug: string;
  excerpt: string;
  featured_image: string;
  status: string;
}

export interface Question {
  title: string;
  difficulty: string;
  tags: string[];
  description: string;
  examples: {
    input: string;
    output: string;
    explanation: string;
  }[];
  constraints: string;
  hints: string[];
  solution: {
    language: string;
    code: string;
  };
  acceptance_rate: number;
  submissions: number;
  slug: string;
}

export interface StudyNode {
  id: string;
  title: string;
  slug: string;
  excerpt?: string;
  content?: string;
  tags?: string[];
  children?: StudyNode[];
}

export interface Course {
  title: string;
  instructor: string;
  description: string;
  modules: {
    title: string;
    description: string;
    lessons: {
      title: string;
      content: string;
      duration: number;
    }[];
  }[];
  duration: number;
  level: string;
  price: number;
  enrollment_count: number;
  rating: number;
  prerequisites: string[];
  slug: string;
}