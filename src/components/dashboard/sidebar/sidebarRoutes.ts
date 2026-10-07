import {
  Briefcase,
  FileText,
  Settings,
  Users,
  LayoutGrid,
  PhoneCall,
  Star,
  BriefcaseBusiness,
  Contact,
  FileSpreadsheet
} from 'lucide-react';

export const AdminRoutes = [
  {
    title: 'Overview',
    url: '/dashboard',
    icon: LayoutGrid,
  },
  {
    title: 'Works / Portfolio',
    url: '/dashboard/works',
    icon: Briefcase,
  },
  {
    title: 'Articles / Insights',
    url: '/dashboard/articles',
    icon: FileText,
  },
  {
    title: 'Services',
    url: '/dashboard/services',
    icon: Star,
  },
  {
    title: 'Careers / Jobs',
    url: '/dashboard/jobs',
    icon: BriefcaseBusiness,
  },

  {
    title: 'Inquiries / Contacts',
    url: '/dashboard/contacts',
    icon: PhoneCall,
  },
  {
    title: 'Testimonials',
    url: '/dashboard/testimonials',
    icon: Users,
  },
  {
    title: 'Global Settings',
    url: '/dashboard/settings',
    icon: Settings,
  },
];
