"use client";

import InputField from "@/components/dashboard/Fields/InputField/InputField";
import TextAreaField from "@/components/dashboard/Fields/TextAreaField/TextAreaField";
import SelectField from "@/components/dashboard/Fields/SelectField/SelectField";
import FileUploadField from "@/components/dashboard/Fields/FileUploadField/FileUploadField";
import DynamicActionButton from "@/components/dashboard/DynamicActionButton/DynamicActionButton";
import DynamicBackButton from "@/components/dashboard/DynamicBackButton/DynamicBackButton";
import { useForm, useFieldArray, Controller } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { Save, Plus, Trash2 } from "lucide-react";
import { IWork } from "@/types/models.types";
import { Button } from "@/components/ui/button";
import { useGetServicesQuery } from "@/redux/features/services/services.api";

const imageSchema = z.object({
  src: z.string().url("Image is required (must be a valid URL)"),
  alt: z.string().min(1, "Alt text is required"),
});

const resultSchema = z.object({
  value: z.string().min(1, "Value is required"),
  label: z.string().min(1, "Label is required"),
});

const workSchema = z.object({
  title: z.string().min(1, "Title is required"),
  client: z.string().min(1, "Client is required"),
  industry: z.string().min(1, "Industry is required"),
  year: z.string().regex(/^\d{4}$/, "Year must be a 4-digit number"),
  status: z.enum(["DRAFT", "PUBLISHED", "ARCHIVED"]),
  service: z.string().min(1, "Select a service"),
  result: z.string().min(1, "Short result string is required"),
  summary: z.string().min(10, "Summary must be at least 10 characters"),
  challenge: z.string().min(10, "Challenge must be at least 10 characters"),
  strategy: z.string().min(10, "Strategy must be at least 10 characters"),
  execution: z.string().min(10, "Execution must be at least 10 characters"),

  services: z
    .array(z.object({ value: z.string().min(1, "Cannot be empty") }))
    .min(1, "Add at least one service"),
  executionPoints: z
    .array(z.object({ value: z.string().min(1, "Cannot be empty") }))
    .min(1, "Add at least one point"),

  results: z.array(resultSchema).min(1, "Add at least one result"),
  heroImages: z.array(imageSchema).min(1, "Add at least one hero image"),
  gallery: z
    .array(imageSchema)
    .min(1, "At least 1 gallery image is required")
    .max(2, "At most 2 gallery images are allowed"),
});

type WorkFormValues = z.infer<typeof workSchema>;

export default function WorkForm({ initialData, onSubmit, isLoading }: any) {
  const { data: servicesData } = useGetServicesQuery({ limit: 100 });
  const {
    control,
    handleSubmit,
    register,
    formState: { errors, isValid },
  } = useForm<WorkFormValues>({
    resolver: zodResolver(workSchema),
    mode: "onChange",
    defaultValues: {
      title: initialData?.title || "",
      client: initialData?.client || "",
      industry: initialData?.industry || "",
      year: initialData?.year || "",
      status: initialData?.status || "PUBLISHED",
      service: initialData?.service?._id || initialData?.service || "",
      result: initialData?.result || "",
      summary: initialData?.summary || "",
      challenge: initialData?.challenge || "",
      strategy: initialData?.strategy || "",
      execution: initialData?.execution || "",
      services: initialData?.services?.length
        ? initialData.services.map((s: string) => ({ value: s }))
        : [{ value: "" }],
      executionPoints: initialData?.executionPoints?.length
        ? initialData.executionPoints.map((s: string) => ({ value: s }))
        : [{ value: "" }],
      results: initialData?.results?.length
        ? initialData.results
        : [{ value: "", label: "" }],
      heroImages: initialData?.heroImages?.length
        ? initialData.heroImages
        : [{ src: "", alt: "" }],
      gallery: initialData?.gallery?.length 
        ? initialData.gallery 
        : [{ src: "", alt: "" }],
    },
  });

  const {
    fields: serviceFields,
    append: addService,
    remove: removeService,
  } = useFieldArray({ control, name: "services" });
  const {
    fields: execFields,
    append: addExec,
    remove: removeExec,
  } = useFieldArray({ control, name: "executionPoints" });
  const {
    fields: resultFields,
    append: addResult,
    remove: removeResult,
  } = useFieldArray({ control, name: "results" });
  const {
    fields: heroFields,
    append: addHero,
    remove: removeHero,
  } = useFieldArray({ control, name: "heroImages" });
  const {
    fields: galleryFields,
    append: addGallery,
    remove: removeGallery,
  } = useFieldArray({ control, name: "gallery" });

  const processSubmit = (data: WorkFormValues) => {
    // Transform arrays back to primitive strings where needed
    const payload = {
      ...data,
      services: data.services.map((s) => s.value),
      executionPoints: data.executionPoints.map((e) => e.value),
    };
    onSubmit(payload);
  };

  return (
    <form onSubmit={handleSubmit(processSubmit)} className="space-y-8">
      {/* Basic Info */}
      <div className="space-y-6 rounded-md border border-border bg-card p-6 shadow-sm">
        <h2 className="text-lg font-semibold text-primary-text border-b border-border pb-2">
          Basic Info
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <InputField
            control={control}
            name="title"
            label="Project Title *"
            placeholder="e.g. Fragrance Launch"
            error={errors.title?.message}
          />
          <InputField
            control={control}
            name="client"
            label="Client Name *"
            placeholder="e.g. BrandCo"
            error={errors.client?.message}
          />
          <InputField
            control={control}
            name="industry"
            label="Industry *"
            placeholder="e.g. Perfume & Fragrance"
            error={errors.industry?.message}
          />
          <InputField
            control={control}
            name="year"
            label="Year *"
            placeholder="e.g. 2024"
            error={errors.year?.message}
          />
          <InputField
            control={control}
            name="result"
            label="Short Result Highlight *"
            placeholder="e.g. [+XX% engagement]"
            error={errors.result?.message}
          />
          <SelectField
            control={control}
            name="status"
            label="Status *"
            options={[
              { label: "Published", value: "PUBLISHED" },
              { label: "Draft", value: "DRAFT" },
              { label: "Archived", value: "ARCHIVED" },
            ]}
            error={errors.status?.message}
          />
          <div className="md:col-span-2">
            <SelectField
              control={control}
              name="service"
              label="Related Service *"
              options={
                servicesData?.data?.map((s: any) => ({
                  label: s.title,
                  value: s._id,
                })) || []
              }
              error={errors.service?.message}
            />
          </div>
        </div>
      </div>

      {/* Writeup */}
      <div className="space-y-6 rounded-md border border-border bg-card p-6 shadow-sm">
        <h2 className="text-lg font-semibold text-primary-text border-b border-border pb-2">
          Case Study Writeup
        </h2>
        <TextAreaField
          control={control}
          name="summary"
          label="Summary *"
          rows={2}
          error={errors.summary?.message}
        />
        <TextAreaField
          control={control}
          name="challenge"
          label="Challenge *"
          rows={3}
          error={errors.challenge?.message}
        />
        <TextAreaField
          control={control}
          name="strategy"
          label="Strategy *"
          rows={3}
          error={errors.strategy?.message}
        />
        <TextAreaField
          control={control}
          name="execution"
          label="Execution (Text) *"
          rows={3}
          error={errors.execution?.message}
        />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Services */}
        <div className="space-y-4 rounded-md border border-border bg-card p-6 shadow-sm">
          <div className="flex items-center justify-between border-b border-border pb-2">
            <h2 className="text-lg font-semibold text-primary-text">
              Services Performed
            </h2>
            <button
              type="button"
              onClick={() => addService({ value: "" })}
              className="flex items-center gap-1 text-sm text-primary hover:text-primary/80"
            >
              <Plus size={16} /> Add
            </button>
          </div>
          {serviceFields.map((field, index) => (
            <div key={field.id} className="flex items-start gap-2">
              <div className="flex-1">
                <InputField
                  control={control}
                  name={`services.${index}.value`}
                  label="Service"
                  placeholder="e.g. Brand Identity"
                  error={errors.services?.[index]?.value?.message}
                />
              </div>
              {serviceFields.length > 1 && (
                <button
                  type="button"
                  onClick={() => removeService(index)}
                  className="text-danger mt-8 hover:text-danger/80"
                >
                  <Trash2 size={20} />
                </button>
              )}
            </div>
          ))}
          {errors.services && (
            <span className="text-danger text-xs">
              {errors.services.message}
            </span>
          )}
        </div>

        {/* Execution Points */}
        <div className="space-y-4 rounded-md border border-border bg-card p-6 shadow-sm">
          <div className="flex items-center justify-between border-b border-border pb-2">
            <h2 className="text-lg font-semibold text-primary-text">
              Execution Points
            </h2>
            <button
              type="button"
              onClick={() => addExec({ value: "" })}
              className="flex items-center gap-1 text-sm text-primary hover:text-primary/80"
            >
              <Plus size={16} /> Add
            </button>
          </div>
          {execFields.map((field, index) => (
            <div key={field.id} className="flex items-start gap-2">
              <div className="flex-1">
                <InputField
                  control={control}
                  name={`executionPoints.${index}.value`}
                  label="Point"
                  placeholder="e.g. Identity system"
                  error={errors.executionPoints?.[index]?.value?.message}
                />
              </div>
              {execFields.length > 1 && (
                <button
                  type="button"
                  onClick={() => removeExec(index)}
                  className="text-danger mt-8 hover:text-danger/80"
                >
                  <Trash2 size={20} />
                </button>
              )}
            </div>
          ))}
          {errors.executionPoints && (
            <span className="text-danger text-xs">
              {errors.executionPoints.message}
            </span>
          )}
        </div>
      </div>

      {/* Results */}
      <div className="space-y-4 rounded-md border border-border bg-card p-6 shadow-sm">
        <div className="flex items-center justify-between border-b border-border pb-2">
          <h2 className="text-lg font-semibold text-primary-text">
            Project Results
          </h2>
          <button
            type="button"
            onClick={() => addResult({ value: "", label: "" })}
            className="flex items-center gap-1 text-sm text-primary hover:text-primary/80"
          >
            <Plus size={16} /> Add Result
          </button>
        </div>
        {resultFields.map((field, index) => (
          <div
            key={field.id}
            className="flex items-start gap-4 p-4 border border-border rounded-md bg-background"
          >
            <div className="flex-1 space-y-4">
              <InputField
                control={control}
                name={`results.${index}.value`}
                label="Value"
                placeholder="e.g. +45%"
                error={errors.results?.[index]?.value?.message}
              />
              <InputField
                control={control}
                name={`results.${index}.label`}
                label="Label"
                placeholder="e.g. Sales Uplift"
                error={errors.results?.[index]?.label?.message}
              />
            </div>
            {resultFields.length > 1 && (
              <button
                type="button"
                onClick={() => removeResult(index)}
                className="text-danger mt-8 hover:text-danger/80"
              >
                <Trash2 size={20} />
              </button>
            )}
          </div>
        ))}
        {errors.results && (
          <span className="text-danger text-xs">{errors.results.message}</span>
        )}
      </div>

      {/* Hero Images */}
      <div className="space-y-4 rounded-md border border-border bg-card p-6 shadow-sm">
        <div className="flex items-center justify-between border-b border-border pb-2">
          <div>
            <h2 className="text-lg font-semibold text-primary-text">
              Hero Images *
            </h2>
            <p className="text-xs text-secondary-text">
              Displayed at the top of the case study details page as a slider.
            </p>
          </div>
          <button
            type="button"
            onClick={() => addHero({ src: "", alt: "" })}
            className="flex items-center gap-1 text-sm text-primary hover:text-primary/80"
          >
            <Plus size={16} /> Add Image
          </button>
        </div>
        {heroFields.map((field, index) => (
          <div
            key={field.id}
            className="flex flex-col md:flex-row gap-4 p-4 border border-border rounded-md bg-background"
          >
            <div className="flex-1">
              <Controller
                control={control}
                name={`heroImages.${index}.src`}
                render={({ field }) => (
                  <FileUploadField
                    label="Image Upload"
                    value={field.value}
                    onChange={(url) => field.onChange(url)}
                    error={errors.heroImages?.[index]?.src?.message}
                  />
                )}
              />
            </div>
            <div className="flex-1 flex flex-col justify-between">
              <InputField
                control={control}
                name={`heroImages.${index}.alt`}
                label="Image Alt Text"
                placeholder="e.g. Perfume bottle on slate"
                error={errors.heroImages?.[index]?.alt?.message}
              />
              {heroFields.length > 1 && (
                <div className="flex justify-end mt-4">
                  <Button
                    type="button"
                    variant="destructive"
                    size="sm"
                    onClick={() => removeHero(index)}
                    className="flex items-center gap-2"
                  >
                    <Trash2 size={16} /> Remove
                  </Button>
                </div>
              )}
            </div>
          </div>
        ))}
        {errors.heroImages && (
          <span className="text-danger text-xs">
            {errors.heroImages.message}
          </span>
        )}
      </div>

      {/* Gallery Images */}
      <div className="space-y-4 rounded-md border border-border bg-card p-6 shadow-sm">
        <div className="flex items-center justify-between border-b border-border pb-2">
          <div>
            <h2 className="text-lg font-semibold text-primary-text">
              Gallery Images
            </h2>
            <p className="text-xs text-secondary-text">
              Add minimum 1 and maximum 2 images for the case study gallery.
            </p>
          </div>
          {galleryFields.length < 2 && (
            <button
              type="button"
              onClick={() => addGallery({ src: "", alt: "" })}
              className="flex items-center gap-1 text-sm text-primary hover:text-primary/80"
            >
              <Plus size={16} /> Add Image
            </button>
          )}
        </div>
        {galleryFields.map((field, index) => (
          <div
            key={field.id}
            className="flex flex-col md:flex-row gap-4 p-4 border border-border rounded-md bg-background"
          >
            <div className="flex-1">
              <Controller
                control={control}
                name={`gallery.${index}.src`}
                render={({ field }) => (
                  <FileUploadField
                    label="Image Upload"
                    value={field.value}
                    onChange={(url) => field.onChange(url)}
                    error={errors.gallery?.[index]?.src?.message}
                  />
                )}
              />
            </div>
            <div className="flex-1 flex flex-col justify-between">
              <InputField
                control={control}
                name={`gallery.${index}.alt`}
                label="Image Alt Text"
                placeholder="e.g. Behind the scenes shoot"
                error={errors.gallery?.[index]?.alt?.message}
              />
              <div className="flex justify-end mt-4">
                <Button
                  type="button"
                  variant="destructive"
                  size="sm"
                  onClick={() => removeGallery(index)}
                  className="flex items-center gap-2"
                >
                  <Trash2 size={16} /> Remove
                </Button>
              </div>
            </div>
          </div>
        ))}
        {errors.gallery && (
          <span className="text-danger text-xs">
            {errors.gallery.message}
          </span>
        )}
      </div>

      <div className="flex items-center gap-4 border-t border-border pt-6">
        <DynamicBackButton />
        <DynamicActionButton
          type="submit"
          icon={Save}
          label="Save Work"
          isLoading={isLoading}
          disabled={isLoading}
        />
      </div>
    </form>
  );
}
