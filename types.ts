
export interface Book {
  key: string;
  title: string;
  author_name?: string[];
  author_key?: string[];
  first_publish_year?: number;
  cover_i?: number;
  isbn?: string[];
  subject?: string[];
  description?: string | { value: string };
  number_of_pages_median?: number;
  languages?: { key: string }[];
}

export interface Author {
  key: string;
  name: string;
  personal_name?: string;
  birth_date?: string;
  death_date?: string;
  bio?: string | { value: string };
  photos?: number[];
  alternate_names?: string[];
  links?: { title: string; url: string }[];
  wikipedia?: string;
}

export interface SearchResult {
  docs: Book[];
  numFound: number;
  start: number;
}

export interface ChatMessage {
  role: 'user' | 'model';
  text: string;
}
