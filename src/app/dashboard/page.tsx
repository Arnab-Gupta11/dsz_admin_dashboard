"use client";

import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Briefcase, FileText, Users, MessageSquare, BriefcaseBusiness, ShieldAlert } from 'lucide-react';
import Link from 'next/link';
import { useGetWorksQuery } from "@/redux/features/works/works.api";
import { useGetArticlesQuery } from "@/redux/features/articles/articles.api";
import { useGetContactsQuery } from "@/redux/features/contacts/contacts.api";
import { useGetJobsQuery } from "@/redux/features/jobs/jobs.api";
import { useGetJobApplicationsQuery } from "@/redux/features/jobApplications/jobApplications.api";
import { useGetAdminsQuery } from "@/redux/features/adminManagement/adminManagement.api";
import { useAppSelector } from "@/redux/hooks";
import { format } from "date-fns";
import { Skeleton } from "@/components/ui/skeleton";

export default function DashboardOverview() {
  const [mounted, setMounted] = useState(false);
  const user = useAppSelector((state) => state.auth.user);
  const isSuperAdmin = user?.role === 'SUPER_ADMIN';

  useEffect(() => {
    setMounted(true);
  }, []);

  // Stats queries (limit 1 just for meta)
  const { data: worksRes, isLoading: worksLoading } = useGetWorksQuery({ limit: 1 });
  const { data: articlesRes, isLoading: articlesLoading } = useGetArticlesQuery({ limit: 1, status: 'PUBLISHED' });
  const { data: jobsRes, isLoading: jobsLoading } = useGetJobsQuery({ limit: 1, status: 'OPEN' });
  const { data: contactsRes, isLoading: contactsLoading } = useGetContactsQuery({ limit: 1, status: 'NEW' });
  const { data: appsRes, isLoading: appsLoading } = useGetJobApplicationsQuery({ limit: 1, status: 'NEW' });
  
  // Admin query only if super admin
  const { data: adminsRes, isLoading: adminsLoading } = useGetAdminsQuery({ limit: 1 }, { skip: !mounted || !isSuperAdmin });

  // Recent data for tables
  const { data: recentContactsRes, isLoading: recentContactsLoading } = useGetContactsQuery({ limit: 4, sort: '-createdAt' });
  const { data: recentAppsRes, isLoading: recentAppsLoading } = useGetJobApplicationsQuery({ limit: 4, sort: '-createdAt' });

  // Don't render until mounted to avoid hydration mismatch
  if (!mounted) {
    return <div className="space-y-6 flex items-center justify-center h-[50vh]"><Skeleton className="h-32 w-full" /></div>;
  }

  const stats = [
    { title: 'Total Works', value: worksRes?.meta?.total || 0, icon: Briefcase, color: 'text-blue-500', loading: worksLoading },
    { title: 'Published Articles', value: articlesRes?.meta?.total || 0, icon: FileText, color: 'text-green-500', loading: articlesLoading },
    { title: 'Active Jobs', value: jobsRes?.meta?.total || 0, icon: BriefcaseBusiness, color: 'text-yellow-500', loading: jobsLoading },
    { title: 'New Inquiries', value: contactsRes?.meta?.total || 0, icon: MessageSquare, color: 'text-purple-500', loading: contactsLoading },
    { title: 'New Applications', value: appsRes?.meta?.total || 0, icon: Users, color: 'text-pink-500', loading: appsLoading },
  ];

  if (isSuperAdmin) {
    stats.push({ title: 'Total Admins', value: adminsRes?.meta?.total || 0, icon: ShieldAlert, color: 'text-red-500', loading: adminsLoading });
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-primary-text text-2xl font-bold">Dashboard Overview</h1>
        <p className="text-secondary-text mt-1 text-sm">Welcome back! Here's a summary of your website.</p>
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4 xl:grid-cols-5">
        {stats.map((stat, i) => (
          <Card key={i} className="border-border bg-card shadow-sm">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">{stat.title}</CardTitle>
              <stat.icon className={`h-4 w-4 ${stat.color}`} />
            </CardHeader>
            <CardContent>
              {stat.loading ? (
                <Skeleton className="h-8 w-16" />
              ) : (
                <div className="text-2xl font-bold">{stat.value}</div>
              )}
            </CardContent>
          </Card>
        ))}
      </div>

      <div className="grid gap-4 md:grid-cols-2">
        {/* Recent Inquiries */}
        <div className="border-border bg-card rounded-md border p-6 shadow-sm flex flex-col">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-primary-text text-lg font-semibold">Recent Inquiries</h2>
            <Link href="/dashboard/contacts" className="text-xs text-primary hover:underline">View All</Link>
          </div>
          
          <div className="space-y-4 flex-1">
            {recentContactsLoading ? (
              Array.from({ length: 4 }).map((_, i) => <Skeleton key={i} className="h-12 w-full" />)
            ) : recentContactsRes?.data && recentContactsRes.data.length > 0 ? (
              recentContactsRes.data.map((contact: any) => (
                <Link key={contact._id} href={`/dashboard/contacts`} className="flex items-center justify-between p-3 border border-border rounded-md hover:bg-muted/50 transition-colors">
                  <div>
                    <p className="text-sm font-medium">{contact.name}</p>
                    <p className="text-xs text-secondary-text truncate max-w-[200px]">{contact.need}</p>
                  </div>
                  <div className="flex flex-col items-end gap-1">
                    <span className={`text-[10px] px-2 py-0.5 rounded-full ${contact.status === 'NEW' ? 'bg-purple-100 text-purple-700 dark:bg-purple-900/30 dark:text-purple-400' : 'bg-gray-100 text-gray-700 dark:bg-gray-800 dark:text-gray-400'}`}>
                      {contact.status}
                    </span>
                    <span className="text-[10px] text-secondary-text">
                      {format(new Date(contact.createdAt), 'MMM dd')}
                    </span>
                  </div>
                </Link>
              ))
            ) : (
              <p className="text-sm text-secondary-text text-center py-4">No recent inquiries.</p>
            )}
          </div>
        </div>

        {/* Quick Actions & Recent Jobs */}
        <div className="flex flex-col gap-4">
          <div className="border-border bg-card rounded-md border p-6 shadow-sm">
            <h2 className="text-primary-text mb-4 text-lg font-semibold">Quick Actions</h2>
            <div className="grid grid-cols-2 gap-2">
              <Link href="/dashboard/works/create" className="text-sm text-primary hover:underline bg-muted/30 p-2 rounded text-center border border-transparent hover:border-primary/20 transition-all">Add Portfolio Work</Link>
              <Link href="/dashboard/articles/create" className="text-sm text-primary hover:underline bg-muted/30 p-2 rounded text-center border border-transparent hover:border-primary/20 transition-all">Write Article</Link>
              <Link href="/dashboard/jobs/create" className="text-sm text-primary hover:underline bg-muted/30 p-2 rounded text-center border border-transparent hover:border-primary/20 transition-all">Post Job</Link>
              {isSuperAdmin && (
                <Link href="/dashboard/admins" className="text-sm text-primary hover:underline bg-muted/30 p-2 rounded text-center border border-transparent hover:border-primary/20 transition-all">Manage Admins</Link>
              )}
            </div>
          </div>

          <div className="border-border bg-card rounded-md border p-6 shadow-sm flex-1">
             <div className="flex justify-between items-center mb-4">
              <h2 className="text-primary-text text-lg font-semibold">Recent Applications</h2>
              <Link href="/dashboard/job-applications" className="text-xs text-primary hover:underline">View All</Link>
            </div>
            <div className="space-y-4">
              {recentAppsLoading ? (
                Array.from({ length: 2 }).map((_, i) => <Skeleton key={i} className="h-12 w-full" />)
              ) : recentAppsRes?.data && recentAppsRes.data.length > 0 ? (
                recentAppsRes.data.slice(0, 2).map((app: any) => (
                  <Link key={app._id} href={`/dashboard/job-applications`} className="flex items-center justify-between p-3 border border-border rounded-md hover:bg-muted/50 transition-colors">
                    <div>
                      <p className="text-sm font-medium">{app.name}</p>
                      <p className="text-xs text-secondary-text">{typeof app.job === 'object' ? app.job?.title : 'Job Application'}</p>
                    </div>
                    <div className="flex flex-col items-end gap-1">
                      <span className={`text-[10px] px-2 py-0.5 rounded-full ${app.status === 'NEW' ? 'bg-pink-100 text-pink-700 dark:bg-pink-900/30 dark:text-pink-400' : 'bg-gray-100 text-gray-700 dark:bg-gray-800 dark:text-gray-400'}`}>
                        {app.status}
                      </span>
                    </div>
                  </Link>
                ))
              ) : (
                <p className="text-sm text-secondary-text text-center py-4">No recent applications.</p>
              )}
            </div>
          </div>
        </div>

      </div>
    </div>
  );
}
