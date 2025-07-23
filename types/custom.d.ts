// Project and Blog types for frontend components

export interface ProjectTag {
  name: string;
}

export interface Project {
  title: string;
  slug: string;
  description: string;
  keywords: string;
  tags?: ProjectTag[];
  categories?: { name: string }[];
  services?: { name: string }[];
  client?: string;
  duration?: string;
  projectLink?: { title: string; url: string };
  content?: string;
  mainImage?: string;
  wideImage?: string;
  imagesLightbox?: { image: string; alt: string };
  video?: { thumbnail: string; url: string };
  trending?: boolean;
  imageUrl?: string;
  title?: string;
}

export interface BlogTag {
  name: string;
}

export interface BlogPost {
  title: string;
  slug: string;
  description: string;
  keywords: string;
  category: string | { name: string };
  date?: string;
  postedBy?: string;
  content?: string;
  mainImage?: string;
  wideImage?: string;
  imagesLightbox?: { image: string; alt: string };
  video?: { thumbnail: string; url: string };
  tags?: BlogTag[];
  imageUrl?: string;
}

export interface Testimonial {
  name: string;
  avatar: string;
  jobTitle: string;
  description: string;
}
