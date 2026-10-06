const fs = require('fs');
let content = fs.readFileSync('src/app/dashboard/works/_components/WorkForm.tsx', 'utf8');

// Add useGetServicesQuery import
content = content.replace("import { Button } from '@/components/ui/button';", "import { Button } from '@/components/ui/button';\nimport { useGetServicesQuery } from '@/redux/features/services/services.api';");

// Update schema
content = content.replace("categories: z.array(z.string()).min(1, 'Select at least one category'),", "service: z.string().min(1, 'Select a service'),");

// Remove CATEGORIES_OPTIONS
content = content.replace("const CATEGORIES_OPTIONS = ['Branding', 'Marketing', 'Design', 'Video', 'Web/App', 'Automation'];", "");

// Update defaultValues
content = content.replace("categories: initialData?.categories || [],", "service: initialData?.service?._id || initialData?.service || '',");

// Remove categories checkbox block and add service SelectField
const newServiceBlock = `
          <SelectField control={control} name="service" label="Related Service *" options={
            servicesData?.data?.map((s: any) => ({ label: s.title, value: s._id })) || []
          } />
`;

// Find where categories is in the JSX
content = content.replace(/<div>\s*<label className="mb-2 block text-sm font-medium text-primary-text">Categories \*<\/label>[\s\S]*?<\/div>/, newServiceBlock);

// Fetch services
content = content.replace("export default function WorkForm({ initialData, onSubmit, isLoading }: any) {", "export default function WorkForm({ initialData, onSubmit, isLoading }: any) {\n  const { data: servicesData } = useGetServicesQuery({ limit: 100 });");

fs.writeFileSync('src/app/dashboard/works/_components/WorkForm.tsx', content);
