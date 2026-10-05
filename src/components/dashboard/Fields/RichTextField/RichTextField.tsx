'use client';

import { useEditor, EditorContent } from '@tiptap/react';
import StarterKit from '@tiptap/starter-kit';
import Link from '@tiptap/extension-link';
import Image from '@tiptap/extension-image';
import { Control, FieldValues, Path, useController } from 'react-hook-form';
import { Label } from '@/components/ui/label';
import { cn } from '@/lib/utils';
import { Toolbar } from './Toolbar';
import { useEffect } from 'react';

interface RichTextFieldProps<T extends FieldValues> {
  label: string;
  name: Path<T>;
  control: Control<T>;
  error?: string;
  required?: boolean;
}

const RichTextField = <T extends FieldValues>({
  label,
  name,
  control,
  error,
  required = false,
}: RichTextFieldProps<T>) => {
  const {
    field: { onChange, value },
  } = useController({
    name,
    control,
  });

  const editor = useEditor({
    extensions: [
      StarterKit,
      Link.configure({
        openOnClick: false,
      }),
      Image,
    ],
    content: value || '',
    editorProps: {
      attributes: {
        class:
          'min-h-[250px] w-full resize-none rounded-b-md p-4 text-sm focus-visible:outline-none focus-visible:ring-0 text-primary dark:text-primary-text',
      },
    },
    onUpdate: ({ editor }) => {
      onChange(editor.getHTML());
    },
  });

  // Update editor content when form value resets
  useEffect(() => {
    if (editor && value !== editor.getHTML()) {
      editor.commands.setContent(value || '');
    }
  }, [value, editor]);

  return (
    <div className="space-y-2">
      <Label className="block font-medium">
        {label} {required && <span className="text-danger">*</span>}
      </Label>
      
      <div
        className={cn(
          'border-border overflow-hidden rounded-md border shadow-none transition-all',
          'focus-within:border-primary focus-within:ring-2 focus-within:ring-primary/20',
          {
            'border-danger/50 focus-within:border-danger focus-within:ring-danger/10': error,
          }
        )}
      >
        <Toolbar editor={editor} />
        <EditorContent editor={editor} />
      </div>

      {error && <p className="text-danger mt-1 text-xs font-medium">{error}</p>}
    </div>
  );
};

export default RichTextField;
