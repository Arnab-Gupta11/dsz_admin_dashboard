'use client';

import DynamicBackButton from '@/components/dashboard/DynamicBackButton/DynamicBackButton';
import DynamicBadge from '@/components/dashboard/DynamicBadge/DynamicBadge';
import {
  useGetContactByIdQuery,
  useUpdateContactMutation,
  useDeleteContactMutation,
} from '@/redux/features/contacts/contacts.api';
import { useParams, useRouter } from 'next/navigation';
import { toast } from 'sonner';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Label } from '@/components/ui/label';
import { Mail, Phone, CalendarDays, Trash2, HelpCircle } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useModal } from '@/context/ModalContext';
import { format } from 'date-fns';
import DetailsSkeleton from '@/components/Loader/Skeletons/DetailsSkeleton';

export default function ContactDetails() {
  const { id } = useParams();
  const router = useRouter();
  const { data, isLoading } = useGetContactByIdQuery(id as string);
  const [updateContact] = useUpdateContactMutation();
  const [deleteContact, { isLoading: isDeleting }] = useDeleteContactMutation();
  const { openModal, closeModal } = useModal();

  const contact = data?.data;

  const handleStatusChange = async (value: string) => {
    try {
      await updateContact({
        id: id as string,
        data: { status: value as any },
      }).unwrap();
      toast.success('Status updated successfully');
    } catch (e: any) {
      toast.error(e?.data?.message || e?.message || 'Failed to update status');
    }
  };

  const handleDelete = () => {
    openModal({
      view: 'DELETE_CONFIRM',
      data: {
        deleteItem: contact?.name,
        onConfirm: async () => {
          try {
            await deleteContact(id as string).unwrap();
            toast.success('Contact deleted successfully');
            closeModal();
            router.push('/dashboard/contacts');
          } catch (error: any) {
            toast.error(
              error?.data?.message ||
                error?.message ||
                'Failed to delete contact',
            );
          }
        },
        isLoading: isDeleting,
      },
    });
  };

  if (isLoading) return <DetailsSkeleton />;

  if (!contact)
    return (
      <div className="p-8 text-center text-sm text-danger">
        Message not found.
      </div>
    );

  return (
    <div className="space-y-6">
      <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-center">
        <div className="flex items-center gap-4">
          <DynamicBackButton href="/dashboard/contacts" />
          <div>
            <h1 className="text-primary-text text-2xl font-bold">
              Message Details
            </h1>
            <p className="text-secondary-text mt-1 text-sm">
              Review inquiry information
            </p>
          </div>
        </div>

        <div className="flex items-center gap-3">
          <Button
            variant="outline"
            className="border-border hover:bg-primary/10 hover:text-primary text-primary"
            onClick={() => (window.location.href = `mailto:${contact.contact}`)}
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
                  {contact.name}
                </h2>
                <p className="text-primary font-medium mt-1 flex items-center gap-2">
                  <HelpCircle className="h-4 w-4" />
                  {contact.need || 'Not specified'}
                </p>
              </div>
              <DynamicBadge text={contact.status} color="#34796f" />
            </div>

            <div className="mt-8 grid gap-4 sm:grid-cols-2">
              <div className="flex items-center gap-3 text-secondary-text">
                {contact.contact.includes('@') ? (
                  <Mail className="h-4 w-4 text-primary" />
                ) : (
                  <Phone className="h-4 w-4 text-primary" />
                )}
                <a
                  href={
                    contact.contact.includes('@')
                      ? `mailto:${contact.contact}`
                      : `tel:${contact.contact}`
                  }
                  className="hover:text-primary transition-colors"
                >
                  {contact.contact}
                </a>
              </div>
              <div className="flex items-center gap-3 text-secondary-text">
                <CalendarDays className="h-4 w-4 text-primary" />
                <span>
                  Received:{' '}
                  {format(new Date(contact.createdAt), 'MMM dd, yyyy h:mm a')}
                </span>
              </div>
            </div>
          </div>

          <div className="border-border bg-card rounded-md border p-6 shadow-sm">
            <h3 className="text-lg font-semibold text-primary-text mb-4">
              Message
            </h3>
            {contact.message ? (
              <p className="whitespace-pre-wrap text-secondary-text leading-relaxed bg-muted/30 p-4 rounded-md border border-border/50">
                {contact.message}
              </p>
            ) : (
              <p className="text-muted-foreground italic">
                No message provided.
              </p>
            )}
          </div>
        </div>

        <div className="space-y-6">
          <div className="border-border bg-card rounded-md border p-6 shadow-sm space-y-4">
            <h3 className="text-lg font-semibold text-primary-text mb-2">
              Inquiry Status
            </h3>
            <div className="space-y-2">
              <Label>Update Status</Label>
              <Select value={contact.status} onValueChange={handleStatusChange}>
                <SelectTrigger className="w-full border-border">
                  <SelectValue placeholder="Select status" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="NEW">New</SelectItem>
                  <SelectItem value="READ">Read</SelectItem>
                  <SelectItem value="REPLIED">Replied</SelectItem>
                  <SelectItem value="ARCHIVED">Archived</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

