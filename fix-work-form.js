const fs = require('fs');
let content = fs.readFileSync('src/app/dashboard/works/_components/WorkForm.tsx', 'utf8');

// Add Controller import
content = content.replace("import { useForm, useFieldArray } from 'react-hook-form';", "import { useForm, useFieldArray, Controller } from 'react-hook-form';");

// Fix InputField labels
content = content.replace(/<InputField control=\{control\} name=\{\`services\.\$\{index\}\.value\`\} placeholder="e\.g\. Brand Identity" \/>/g, '<InputField control={control} name={`services.${index}.value`} label="Service" placeholder="e.g. Brand Identity" />');
content = content.replace(/<InputField control=\{control\} name=\{\`executionPoints\.\$\{index\}\.value\`\} placeholder="e\.g\. Identity system" \/>/g, '<InputField control={control} name={`executionPoints.${index}.value`} label="Point" placeholder="e.g. Identity system" />');

// Fix FileUploadField heroImages
const heroReplacement = `
<Controller
  control={control}
  name={\`heroImages.\${index}.src\`}
  render={({ field }) => (
    <FileUploadField
      label="Image Upload"
      value={field.value}
      onChange={(url) => field.onChange(url)}
    />
  )}
/>
`;
content = content.replace(/<FileUploadField control=\{control\} name=\{\`heroImages\.\$\{index\}\.src\`\} label="Image Upload" \/>/g, heroReplacement);

// Fix FileUploadField gallery
const galleryReplacement = `
<Controller
  control={control}
  name={\`gallery.\${index}.src\`}
  render={({ field }) => (
    <FileUploadField
      label="Image Upload"
      value={field.value}
      onChange={(url) => field.onChange(url)}
    />
  )}
/>
`;
content = content.replace(/<FileUploadField control=\{control\} name=\{\`gallery\.\$\{index\}\.src\`\} label="Image Upload" \/>/g, galleryReplacement);

fs.writeFileSync('src/app/dashboard/works/_components/WorkForm.tsx', content);
