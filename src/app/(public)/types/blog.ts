export interface BlogPost {
  id: number;
  title: string;
  description: string;
  content: string;
  author: string;
  date: string;
  category: string;
  imageUrl: string;
  duration: string;
  level: 'Beginner' | 'Intermediate' | 'Advanced';
  rating: number;
}

export interface BlogApiResponse {
  posts: BlogPost[];
  total: number;
}