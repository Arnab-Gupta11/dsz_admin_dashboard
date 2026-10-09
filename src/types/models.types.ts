export type ArticleBlock =
  | { type: 'p'; text: string }
  | { type: 'h2'; text: string }
  | { type: 'quote'; text: string }
  | { type: 'list'; items: string[] } | { type: 'html'; text: string };

export interface IArticle {
  _id: string;
  slug: string;
  title: string;
  category: string | any;
  excerpt: string;
  image: string;
  imageAlt: string;
  imagePublicId?: string;
  author: string;
  body: ArticleBlock[];
  readTime: string;
  status: 'DRAFT' | 'PUBLISHED' | 'ARCHIVED';
  isFeatured?: boolean;
  order: number;
  seo: {
    metaTitle?: string;
    metaDescription?: string;
    ogImage?: string;
    canonicalUrl?: string;
    noIndex: boolean;
  };
  publishedAt?: Date | string;
  createdAt: Date | string;
  updatedAt: Date | string;
}

export interface IAdmin {
  _id: string;
  name: string;
  email: string;
  passwordHash: string;
  role: 'ADMIN';
  isActive: boolean;
  lastLoginAt?: Date | string;
  createdAt: Date | string;
  updatedAt: Date | string;
}

export interface IContact {
  _id: string;
  name: string;
  email: string;
  phone: string;
  need: string;
  message: string;
  status: 'NEW' | 'READ' | 'REPLIED' | 'ARCHIVED';
  ipAddress?: string;
  createdAt: Date | string;
  updatedAt: Date | string;
}

export type TJobApplicationStatus = 'NEW' | 'REVIEWING' | 'SHORTLISTED' | 'REJECTED';

export interface IJobApplication {
  _id: string;
  jobId: string; // Reference to Job
  name: string;
  email: string;
  phone: string;
  portfolio?: string;
  salary?: string;
  notice: string;
  cvUrl: string; // Cloudinary secure URL
  cvPublicId: string;
  cover?: string;
  status: TJobApplicationStatus;
  createdAt: Date | string;
  updatedAt: Date | string;
}

export type TJobDepartment = 'Development' | 'Design' | 'Marketing' | 'Video' | 'Operations';
export type TJobType = 'Full-time' | 'Part-time' | 'Internship' | 'Contract';
export type TJobLocation = 'On-site' | 'Remote' | 'Hybrid';
export type TJobStatus = 'DRAFT' | 'PUBLISHED' | 'ARCHIVED';

export interface IJob {
  _id: string;
  slug: string;
  title: string;
  department: TJobDepartment;
  type: TJobType;
  location: TJobLocation;
  city: string;
  experience: string;
  salary?: string;
  postedAt: Date | string;
  deadline: Date | string;
  short: string;
  overview: string;
  responsibilities: string[];
  requirements: string[];
  niceToHave: string[];
  tools: string[];
  benefits: string[];
  status: TJobStatus;
  seo?: {
    metaTitle?: string;
    metaDescription?: string;
    noIndex?: boolean;
  };
  createdAt: Date | string;
  updatedAt: Date | string;
}

export interface IMedia {
  _id: string;
  publicId: string;
  secureUrl: string;
  resourceType: 'image' | 'video' | 'raw';
  format: string;
  width?: number;
  height?: number;
  bytes: number;
  folder: string;
  uploadedBy: string;
  createdAt: Date | string;
}

export interface IService {
  _id: string;
  slug: string;
  title: string;
  tag: string;
  short: string;
  description: string;
  whatWeDo: string[];
  deliverables: string[];
  whoFor: string;
  image: string;
  imageAlt?: string;
  imagePublicId?: string;
  status: 'DRAFT' | 'PUBLISHED' | 'ARCHIVED';
  isFeatured?: boolean;
  order: number;
  seo: { metaTitle?: string; metaDescription?: string; noIndex: boolean; };
  createdAt: Date | string;
  updatedAt: Date | string;
}

export interface ISettings {
  _id: string;
  siteName: string;
  tagline: string;
  email: string;
  phone: string;
  whatsappNumber: string;
  whatsappUrl: string;
  addressLine: string;
  city: string;
  logoUrl?: string;
  ogImage?: string;
  socialLinks: { key: 'instagram' | 'facebook' | 'linkedin' | 'x' | 'youtube'; label: string; href: string; }[];
  seo: { defaultTitle: string; defaultDescription: string; defaultOgImage?: string; };
  createdAt: Date | string;
  updatedAt: Date | string;
}

export interface ITestimonial {
  _id: string;
  quote: string;
  name: string;
  company: string;
  role: string;
  initials: string;
  isActive: boolean;
  order: number;
  createdAt: Date | string;
  updatedAt: Date | string;
}

export interface IProjectResult { value: string; label: string; }
export interface IProjectImage { src: string; alt: string; publicId: string; }

export interface IWork {
  _id: string;
  slug: string;
  title: string;
  client: string;
  industry: string;
  services: string[];
  service: string | any;
  result: string;
  year: string;
  heroImages: IProjectImage[];
  summary: string;
  challenge: string;
  strategy: string;
  execution: string;
  executionPoints: string[];
  results: IProjectResult[];
  gallery: IProjectImage[];
  status: 'DRAFT' | 'PUBLISHED' | 'ARCHIVED';
  isFeatured?: boolean;
  order: number;
  seo: {
    metaTitle?: string;
    metaDescription?: string;
    ogImage?: string;
    canonicalUrl?: string;
    noIndex: boolean;
  };
  publishedAt?: Date | string;
  createdAt: Date | string;
  updatedAt: Date | string;
}
