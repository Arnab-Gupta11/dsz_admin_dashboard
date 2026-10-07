"use client";

import DetailsSkeleton from "@/components/Loader/Skeletons/DetailsSkeleton";
import DynamicBackButton from "@/components/dashboard/DynamicBackButton/DynamicBackButton";
import DynamicBadge from "@/components/dashboard/DynamicBadge/DynamicBadge";
import {
  useGetJobApplicationByIdQuery,
  useUpdateJobApplicationMutation,
  useDeleteJobApplicationMutation,
} from "@/redux/features/jobApplications/jobApplications.api";
import { useParams, useRouter } from "next/navigation";
import { toast } from "sonner";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Label } from "@/components/ui/label";
import {
  Download,
  Trash2,
  Mail,
  Phone,
  Globe,
  Briefcase,
  Clock,
  CalendarDays,
  ExternalLink,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { useModal } from "@/context/ModalContext";
import { format } from "date-fns";

export default function JobApplicationDetails() {
  const { id } = useParams();
  const router = useRouter();
  const { data, isLoading } = useGetJobApplicationByIdQuery(id as string);
  const [updateStatus] = useUpdateJobApplicationMutation();
  const [deleteApplication, { isLoading: isDeleting }] =
    useDeleteJobApplicationMutation();
  const { openModal, closeModal } = useModal();

  const application = data?.data;

  const handleStatusChange = async (value: string) => {
    try {
      await updateStatus({
        id: id as string,
        data: { status: value as any },
      }).unwrap();
      toast.success("Status updated successfully");
    } catch (e: any) {
      toast.error(e?.data?.message || e?.message || "Failed to update status");
    }
  };

  const handleDelete = () => {
    openModal({
      view: "DELETE_CONFIRM",
      data: {
        deleteItem: application?.name,
        onConfirm: async () => {
          try {
            await deleteApplication(id as string).unwrap();
            toast.success("Application deleted successfully");
            closeModal();
            if ((application?.jobId as any)?._id) {
              router.push(
                `/dashboard/jobs/${(application?.jobId as any)?._id}/applications`,
              );
            } else {
              router.push("/dashboard/jobs");
            }
          } catch (error: any) {
            toast.error(
              error?.data?.message ||
                error?.message ||
                "Failed to delete application",
            );
          }
        },
        isLoading: isDeleting,
      },
    });
  };

  if (isLoading) return <DetailsSkeleton />;
  if (!application)
    return (
      <div className="p-8 text-center text-sm text-danger">
        Application not found.
      </div>
    );

  return (
    <div className="space-y-6">
      <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-center">
        <div className="flex items-center gap-4">
          <DynamicBackButton
            href={`/dashboard/jobs/${(application.jobId as any)?._id}/applications`}
          />
          <div>
            <h1 className="text-primary-text text-2xl font-bold">
              Application Details
            </h1>
            <p className="text-secondary-text mt-1 text-sm">
              Review candidate information
            </p>
          </div>
        </div>

        <div className="flex items-center gap-3">
          <Button
            variant="outline"
            className="border-border hover:bg-primary/10 hover:text-primary text-primary"
            onClick={() =>
              (window.location.href = `mailto:${application.email}`)
            }
          >
            <Mail className="mr-2 h-4 w-4" /> Email
          </Button>
          <Button
            variant="outline"
            className="border-border hover:bg-danger/10 hover:text-danger text-danger"
            onClick={handleDelete}
          >
            <Trash2 className="mr-2 h-4 w-4" /> Delete
          </Button>
        </div>
      </div>

      <div className="grid gap-6 md:grid-cols-3">
        <div className="md:col-span-2 space-y-6">
          <div className="border-border bg-card rounded-md border p-6 shadow-sm">
            <div className="flex items-start justify-between">
              <div>
                <h2 className="text-xl font-bold text-primary-text">
                  {application.name}
                </h2>
                <p className="text-primary font-medium mt-1">
                  Applying for:{" "}
                  {(application.jobId as any)?.title || "Unknown Job"}
                </p>
              </div>
              <DynamicBadge text={application.status} color="#34796f" />
            </div>

            <div className="mt-8 grid gap-4 sm:grid-cols-2">
              <div className="flex items-center gap-3 text-secondary-text">
                <Mail className="h-4 w-4 text-primary" />
                <a
                  href={`mailto:${application.email}`}
                  className="hover:text-primary transition-colors"
                >
                  {application.email}
                </a>
              </div>
              <div className="flex items-center gap-3 text-secondary-text">
                <Phone className="h-4 w-4 text-primary" />
                <a
                  href={`tel:${application.phone}`}
                  className="hover:text-primary transition-colors"
                >
                  {application.phone}
                </a>
              </div>
              {application.portfolio && (
                <div className="flex items-center gap-3 text-secondary-text">
                  <Globe className="h-4 w-4 text-primary" />
                  <a
                    href={application.portfolio}
                    target="_blank"
                    rel="noreferrer"
                    className="hover:text-primary transition-colors flex items-center gap-1"
                  >
                    Portfolio <ExternalLink className="h-3 w-3" />
                  </a>
                </div>
              )}
              <div className="flex items-center gap-3 text-secondary-text">
                <Briefcase className="h-4 w-4 text-primary" />
                <span>
                  Expected Salary: {application.salary || "Not specified"}
                </span>
              </div>
              <div className="flex items-center gap-3 text-secondary-text">
                <Clock className="h-4 w-4 text-primary" />
                <span>Notice Period: {application.notice}</span>
              </div>
              <div className="flex items-center gap-3 text-secondary-text">
                <CalendarDays className="h-4 w-4 text-primary" />
                <span>
                  Applied:{" "}
                  {format(new Date(application.createdAt), "MMM dd, yyyy")}
                </span>
              </div>
            </div>
          </div>

          <div className="border-border bg-card rounded-md border p-6 shadow-sm">
            <h3 className="text-lg font-semibold text-primary-text mb-4">
              Cover Letter / Message
            </h3>
            {application.cover ? (
              <p className="whitespace-pre-wrap text-secondary-text leading-relaxed bg-muted/30 p-4 rounded-md border border-border/50">
                {application.cover}
              </p>
            ) : (
              <p className="text-muted-foreground italic">
                No cover letter provided.
              </p>
            )}
          </div>
        </div>

        <div className="space-y-6">
          <div className="border-border bg-card rounded-md border p-6 shadow-sm space-y-4">
            <h3 className="text-lg font-semibold text-primary-text mb-2">
              Application Status
            </h3>
            <div className="space-y-2">
              <Label>Update Status</Label>
              <Select
                value={application.status}
                onValueChange={handleStatusChange}
              >
                <SelectTrigger className="w-full border-border">
                  <SelectValue placeholder="Select status" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="NEW">New</SelectItem>
                  <SelectItem value="REVIEWING">Reviewing</SelectItem>
                  <SelectItem value="SHORTLISTED">Shortlisted</SelectItem>
                  <SelectItem value="REJECTED">Rejected</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          <div className="border-border bg-card rounded-md border p-6 shadow-sm space-y-4">
            <h3 className="text-lg font-semibold text-primary-text mb-2">
              Resume / CV
            </h3>
            <p className="text-sm text-secondary-text mb-4">
              Download or view the candidate's uploaded CV document.
            </p>
            <Button asChild className="w-full text-primary-foreground">
              <a href={application.cvUrl} target="_blank" rel="noreferrer">
                <Download className="mr-2 h-4 w-4" /> View / Download CV
              </a>
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}
