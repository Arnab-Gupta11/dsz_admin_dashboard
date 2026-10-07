import React, { useState } from "react";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Plus } from "lucide-react";
import { useCreateAdminMutation } from "@/redux/features/adminManagement/adminManagement.api";

interface IFormInput {
  name: string;
  email: string;
}

export default function CreateAdminDialog() {
  const [open, setOpen] = useState(false);
  const { register, handleSubmit, reset, formState: { errors } } = useForm<IFormInput>();
  const [createAdmin, { isLoading }] = useCreateAdminMutation();

  const onSubmit = async (data: IFormInput) => {
    try {
      await createAdmin(data).unwrap();
      toast.success("Admin created successfully! Credentials sent via email.");
      reset();
      setOpen(false);
    } catch (error: any) {
      toast.error(error?.data?.message || "Failed to create admin");
    }
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button className="flex items-center gap-2 px-4 py-2 bg-primary! text-white hover:bg-primary/90">
          <Plus size={16} />
          Create Admin
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Create New Admin</DialogTitle>
          <DialogDescription>
            Enter details to invite a new admin. They will receive an email with their credentials.
          </DialogDescription>
        </DialogHeader>
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4 py-4">
          <div className="space-y-2">
            <Label htmlFor="name">Full Name</Label>
            <Input
              id="name"
              placeholder="John Doe"
              {...register("name", { required: "Name is required" })}
            />
            {errors.name && (
              <span className="text-xs text-danger">{errors.name.message}</span>
            )}
          </div>
          <div className="space-y-2">
            <Label htmlFor="email">Email Address</Label>
            <Input
              id="email"
              type="email"
              placeholder="admin@example.com"
              {...register("email", { 
                required: "Email is required",
                pattern: {
                  value: /\S+@\S+\.\S+/,
                  message: "Invalid email address"
                }
              })}
            />
            {errors.email && (
              <span className="text-xs text-danger">{errors.email.message}</span>
            )}
          </div>
          <div className="flex justify-end pt-4 gap-2">
            <Button type="button" variant="outline" onClick={() => setOpen(false)}>
              Cancel
            </Button>
            <Button type="submit" disabled={isLoading} className="bg-primary! text-white hover:bg-primary/90">
              {isLoading ? "Creating..." : "Create Admin"}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}
