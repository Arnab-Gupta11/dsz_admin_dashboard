import { type Editor } from '@tiptap/react';
import {
  Bold,
  Italic,
  Strikethrough,
  List,
  ListOrdered,
  Heading1,
  Heading2,
  Heading3,
  Undo,
  Redo,
  Link as LinkIcon,
  Image as ImageIcon,
} from 'lucide-react';
import { Separator } from '@/components/ui/separator';
import { Button } from '@/components/ui/button';
import { useCallback } from 'react';

type Props = {
  editor: Editor | null;
};

export function Toolbar({ editor }: Props) {
  if (!editor) {
    return null;
  }

  const setLink = useCallback(() => {
    const previousUrl = editor.getAttributes('link').href;
    const url = window.prompt('URL', previousUrl);

    if (url === null) {
      return;
    }

    if (url === '') {
      editor.chain().focus().extendMarkRange('link').unsetLink().run();
      return;
    }

    editor.chain().focus().extendMarkRange('link').setLink({ href: url }).run();
  }, [editor]);

  const addImage = useCallback(() => {
    const url = window.prompt('Image URL');

    if (url) {
      editor.chain().focus().setImage({ src: url }).run();
    }
  }, [editor]);

  return (
    <div className="border-border bg-muted/50 flex flex-wrap items-center gap-1 rounded-t-md border-b p-1">
      <Button variant={editor.isActive('heading', { level: 1 }) ? "secondary" : "ghost"} size="sm" onClick={() => editor.chain().focus().toggleHeading({ level: 1 }).run()} aria-label="Heading 1" type="button" className="h-8 p-2">
        <Heading1 className="h-4 w-4" />
      </Button>
      <Button variant={editor.isActive('heading', { level: 2 }) ? "secondary" : "ghost"} size="sm" onClick={() => editor.chain().focus().toggleHeading({ level: 2 }).run()} aria-label="Heading 2" type="button" className="h-8 p-2">
        <Heading2 className="h-4 w-4" />
      </Button>
      <Button variant={editor.isActive('heading', { level: 3 }) ? "secondary" : "ghost"} size="sm" onClick={() => editor.chain().focus().toggleHeading({ level: 3 }).run()} aria-label="Heading 3" type="button" className="h-8 p-2">
        <Heading3 className="h-4 w-4" />
      </Button>
      
      <Separator orientation="vertical" className="mx-1 h-6" />

      <Button variant={editor.isActive('bold') ? "secondary" : "ghost"} size="sm" onClick={() => editor.chain().focus().toggleBold().run()} aria-label="Toggle bold" type="button" className="h-8 p-2">
        <Bold className="h-4 w-4" />
      </Button>
      <Button variant={editor.isActive('italic') ? "secondary" : "ghost"} size="sm" onClick={() => editor.chain().focus().toggleItalic().run()} aria-label="Toggle italic" type="button" className="h-8 p-2">
        <Italic className="h-4 w-4" />
      </Button>
      <Button variant={editor.isActive('strike') ? "secondary" : "ghost"} size="sm" onClick={() => editor.chain().focus().toggleStrike().run()} aria-label="Toggle strikethrough" type="button" className="h-8 p-2">
        <Strikethrough className="h-4 w-4" />
      </Button>

      <Separator orientation="vertical" className="mx-1 h-6" />

      <Button variant={editor.isActive('bulletList') ? "secondary" : "ghost"} size="sm" onClick={() => editor.chain().focus().toggleBulletList().run()} aria-label="Toggle bullet list" type="button" className="h-8 p-2">
        <List className="h-4 w-4" />
      </Button>
      <Button variant={editor.isActive('orderedList') ? "secondary" : "ghost"} size="sm" onClick={() => editor.chain().focus().toggleOrderedList().run()} aria-label="Toggle ordered list" type="button" className="h-8 p-2">
        <ListOrdered className="h-4 w-4" />
      </Button>

      <Separator orientation="vertical" className="mx-1 h-6" />

      <Button variant={editor.isActive('link') ? "secondary" : "ghost"} size="sm" onClick={setLink} aria-label="Set link" type="button" className="h-8 p-2">
        <LinkIcon className="h-4 w-4" />
      </Button>
      <Button
        variant="ghost"
        size="sm"
        onClick={addImage}
        aria-label="Add image"
        className="h-8 w-8 p-0"
        type="button"
      >
        <ImageIcon className="h-4 w-4" />
      </Button>

      <div className="ml-auto flex items-center gap-1">
        <Button
          variant="ghost"
          size="sm"
          onClick={() => editor.chain().focus().undo().run()}
          disabled={!editor.can().undo()}
          className="h-8 w-8 p-0"
          type="button"
        >
          <Undo className="h-4 w-4" />
        </Button>
        <Button
          variant="ghost"
          size="sm"
          onClick={() => editor.chain().focus().redo().run()}
          disabled={!editor.can().redo()}
          className="h-8 w-8 p-0"
          type="button"
        >
          <Redo className="h-4 w-4" />
        </Button>
      </div>
    </div>
  );
}
