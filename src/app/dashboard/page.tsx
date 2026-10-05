import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Briefcase, FileText, Settings, Users } from 'lucide-react';
import Link from 'next/link';

export default function DashboardOverview() {
  const stats = [
    { title: 'Total Works', value: '12', icon: Briefcase, color: 'text-blue-500' },
    { title: 'Published Articles', value: '24', icon: FileText, color: 'text-green-500' },
    { title: 'New Inquiries', value: '5', icon: Users, color: 'text-purple-500' },
    { title: 'Services Active', value: '6', icon: Settings, color: 'text-orange-500' },
  ];

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-primary-text text-2xl font-bold">Dashboard Overview</h1>
        <p className="text-secondary-text mt-1 text-sm">Welcome back! Here's a summary of your website.</p>
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        {stats.map((stat, i) => (
          <Card key={i} className="border-border bg-card shadow-sm">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">{stat.title}</CardTitle>
              <stat.icon className={`h-4 w-4 ${stat.color}`} />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stat.value}</div>
            </CardContent>
          </Card>
        ))}
      </div>

      <div className="grid gap-4 md:grid-cols-2">
        <div className="border-border bg-card rounded-md border p-6 shadow-sm">
          <h2 className="text-primary-text mb-4 text-lg font-semibold">Quick Actions</h2>
          <div className="flex flex-col gap-2">
            <Link href="/dashboard/works/create" className="text-primary hover:underline">Add New Portfolio Work →</Link>
            <Link href="/dashboard/articles/create" className="text-primary hover:underline">Write a New Article →</Link>
            <Link href="/dashboard/contacts" className="text-primary hover:underline">Check Pending Inquiries →</Link>
            <Link href="/dashboard/job-applications" className="text-primary hover:underline">Review Candidate CVs →</Link>
          </div>
        </div>

        <div className="border-border bg-card rounded-md border p-6 shadow-sm">
          <h2 className="text-primary-text mb-4 text-lg font-semibold">System Info</h2>
          <div className="space-y-2 text-sm">
            <p><span className="font-semibold">Backend Status:</span> <span className="text-green-500">Online</span></p>
            <p><span className="font-semibold">Version:</span> 1.0.0</p>
            <p><span className="font-semibold">Theme:</span> Shadcn Dark/Light Sync</p>
          </div>
        </div>
      </div>
    </div>
  );
}
