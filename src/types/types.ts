export interface TypePost {
  title: {
    rendered: string;
  };
  date: string;
  excerpt: {
    rendered: string;
  };
  featured_image: string;
  slug: string;
  categories?: number[];
  content?: {
    rendered: string;
  };
  id?: number;
}
