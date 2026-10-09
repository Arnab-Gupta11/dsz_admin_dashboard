import { type Editor } from "@tiptap/react";
import {
  Bold,
  Italic,
  Strikethrough,
  Underline as UnderlineIcon,
  List,
  ListOrdered,
  Heading1,
  Heading2,
  Heading3,
  Heading4,
  Heading5,
  Heading6,
  AlignLeft,
  AlignCenter,
  AlignRight,
  AlignJustify,
  Quote,
  Undo,
  Redo,
  Link as LinkIcon,
  Image as ImageIcon,
  Loader2,
} from "lucide-react";
import { Separator } from "@/components/ui/separator";
import { Button } from "@/components/ui/button";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Input } from "@/components/ui/input";
import { useCallback, useRef, useState } from "react";
import { useUploadImageMutation } from "@/redux/features/upload/upload.api";
import { toast } from "sonner";

type Props = {
  editor: Editor | null;
};

export function Toolbar({ editor }: Props) {
  const [uploadImage] = useUploadImageMutation();
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [isUploading, setIsUploading] = useState(false);

  const [linkUrl, setLinkUrl] = useState("");
  const [isLinkPopoverOpen, setIsLinkPopoverOpen] = useState(false);

  const handleLinkClick = () => {
    if (!editor) return;
    const previousUrl = editor.getAttributes("link").href;
    setLinkUrl(previousUrl || "");
  };

  const applyLink = () => {
    if (!editor) return;
    if (linkUrl === "") {
      editor.chain().focus().extendMarkRange("link").unsetLink().run();
    } else {
      editor
        .chain()
        .focus()
        .extendMarkRange("link")
        .setLink({ href: linkUrl })
        .run();
    }
    setIsLinkPopoverOpen(false);
  };

  if (!editor) {
    return null;
  }

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (!file.type.startsWith("image/")) {
      toast.error("Invalid file type. Please upload an image.");
      return;
    }

    setIsUploading(true);
    const formData = new FormData();
    formData.append("file", file);

    try {
      const res: any = await uploadImage(formData).unwrap();
      const extractedUrl =
        typeof res?.data === "string"
          ? res.data
          : res?.data?.url ||
            res?.data?.secureUrl ||
            res?.data?.data?.url ||
            res?.url ||
            (typeof res === "string" ? res : null);

      if (extractedUrl && typeof extractedUrl === "string") {
        editor.chain().focus().setImage({ src: extractedUrl }).run();
      } else {
        toast.error("Failed to retrieve image URL from response.");
      }
    } catch (err: any) {
      toast.error("Failed to upload image.");
    } finally {
      setIsUploading(false);
      if (fileInputRef.current) {
        fileInputRef.current.value = "";
      }
    }
  };

  const getBtnClass = (isActive: boolean) =>
    `h-8 w-8 p-0 ${isActive ? "bg-primary/20 text-primary hover:bg-primary/30 hover:text-primary" : "text-muted-foreground hover:text-foreground"}`;

  return (
    <div className="border-border bg-muted/50 sticky top-[60px] z-40 flex flex-wrap items-center gap-1 rounded-t-md border-b p-1 backdrop-blur-md">
      {/* Headings */}
      <Button
        variant="ghost"
        size="sm"
        onClick={() => editor.chain().focus().toggleHeading({ level: 1 }).run()}
        aria-label="Heading 1"
        type="button"
        className={getBtnClass(editor.isActive("heading", { level: 1 }))}
      >
        <Heading1 className="h-4 w-4" />
      </Button>
      <Button
        variant="ghost"
        size="sm"
        onClick={() => editor.chain().focus().toggleHeading({ level: 2 }).run()}
        aria-label="Heading 2"
        type="button"
        className={getBtnClass(editor.isActive("heading", { level: 2 }))}
      >
        <Heading2 className="h-4 w-4" />
      </Button>
      <Button
        variant="ghost"
        size="sm"
        onClick={() => editor.chain().focus().toggleHeading({ level: 3 }).run()}
        aria-label="Heading 3"
        type="button"
        className={getBtnClass(editor.isActive("heading", { level: 3 }))}
      >
        <Heading3 className="h-4 w-4" />
      </Button>
      <Button
        variant="ghost"
        size="sm"
        onClick={() => editor.chain().focus().toggleHeading({ level: 4 }).run()}
        aria-label="Heading 4"
        type="button"
        className={getBtnClass(editor.isActive("heading", { level: 4 }))}
      >
        <Heading4 className="h-4 w-4" />
      </Button>
      <Button
        variant="ghost"
        size="sm"
        onClick={() => editor.chain().focus().toggleHeading({ level: 5 }).run()}
        aria-label="Heading 5"
        type="button"
        className={getBtnClass(editor.isActive("heading", { level: 5 }))}
      >
        <Heading5 className="h-4 w-4" />
      </Button>
      <Button
        variant="ghost"
        size="sm"
        onClick={() => editor.chain().focus().toggleHeading({ level: 6 }).run()}
        aria-label="Heading 6"
        type="button"
        className={getBtnClass(editor.isActive("heading", { level: 6 }))}
      >
        <Heading6 className="h-4 w-4" />
      </Button>

      <Separator orientation="vertical" className="mx-1 h-6" />

      {/* Formatting */}
      <Button
        variant="ghost"
        size="sm"
        onClick={() => editor.chain().focus().toggleBold().run()}
        aria-label="Toggle bold"
        type="button"
        className={getBtnClass(editor.isActive("bold"))}
      >
        <Bold className="h-4 w-4" />
      </Button>
      <Button
        variant="ghost"
        size="sm"
        onClick={() => editor.chain().focus().toggleItalic().run()}
        aria-label="Toggle italic"
        type="button"
        className={getBtnClass(editor.isActive("italic"))}
      >
        <Italic className="h-4 w-4" />
      </Button>
      <Button
        variant="ghost"
        size="sm"
        onClick={() => editor.chain().focus().toggleUnderline().run()}
        aria-label="Toggle underline"
        type="button"
        className={getBtnClass(editor.isActive("underline"))}
      >
        <UnderlineIcon className="h-4 w-4" />
      </Button>
      <Button
        variant="ghost"
        size="sm"
        onClick={() => editor.chain().focus().toggleStrike().run()}
        aria-label="Toggle strikethrough"
        type="button"
        className={getBtnClass(editor.isActive("strike"))}
      >
        <Strikethrough className="h-4 w-4" />
      </Button>

      <Separator orientation="vertical" className="mx-1 h-6" />

      {/* Alignment */}
      <Button
        variant="ghost"
        size="sm"
        onClick={() => editor.chain().focus().setTextAlign("left").run()}
        aria-label="Align left"
        type="button"
        className={getBtnClass(editor.isActive({ textAlign: "left" }))}
      >
        <AlignLeft className="h-4 w-4" />
      </Button>
      <Button
        variant="ghost"
        size="sm"
        onClick={() => editor.chain().focus().setTextAlign("center").run()}
        aria-label="Align center"
        type="button"
        className={getBtnClass(editor.isActive({ textAlign: "center" }))}
      >
        <AlignCenter className="h-4 w-4" />
      </Button>
      <Button
        variant="ghost"
        size="sm"
        onClick={() => editor.chain().focus().setTextAlign("right").run()}
        aria-label="Align right"
        type="button"
        className={getBtnClass(editor.isActive({ textAlign: "right" }))}
      >
        <AlignRight className="h-4 w-4" />
      </Button>
      <Button
        variant="ghost"
        size="sm"
        onClick={() => editor.chain().focus().setTextAlign("justify").run()}
        aria-label="Align justify"
        type="button"
        className={getBtnClass(editor.isActive({ textAlign: "justify" }))}
      >
        <AlignJustify className="h-4 w-4" />
      </Button>

      <Separator orientation="vertical" className="mx-1 h-6" />

      {/* Lists & Blockquote */}
      <Button
        variant="ghost"
        size="sm"
        onClick={() => editor.chain().focus().toggleBulletList().run()}
        aria-label="Toggle bullet list"
        type="button"
        className={getBtnClass(editor.isActive("bulletList"))}
      >
        <List className="h-4 w-4" />
      </Button>
      <Button
        variant="ghost"
        size="sm"
        onClick={() => editor.chain().focus().toggleOrderedList().run()}
        aria-label="Toggle ordered list"
        type="button"
        className={getBtnClass(editor.isActive("orderedList"))}
      >
        <ListOrdered className="h-4 w-4" />
      </Button>
      <Button
        variant="ghost"
        size="sm"
        onClick={() => editor.chain().focus().toggleBlockquote().run()}
        aria-label="Toggle blockquote"
        type="button"
        className={getBtnClass(editor.isActive("blockquote"))}
      >
        <Quote className="h-4 w-4" />
      </Button>

      <Separator orientation="vertical" className="mx-1 h-6" />

      {/* Media & Links */}
      <Popover open={isLinkPopoverOpen} onOpenChange={setIsLinkPopoverOpen}>
        <PopoverTrigger asChild>
          <Button
            variant="ghost"
            size="sm"
            aria-label="Set link"
            type="button"
            className={getBtnClass(editor.isActive("link"))}
            onClick={handleLinkClick}
          >
            <LinkIcon className="h-4 w-4" />
          </Button>
        </PopoverTrigger>
        <PopoverContent className="w-80 p-3" align="start">
          <div className="flex gap-2">
            <Input
              placeholder="https://example.com"
              value={linkUrl}
              onChange={(e) => setLinkUrl(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === "Enter") {
                  e.preventDefault();
                  applyLink();
                }
              }}
              className="h-9"
            />
            <Button type="button" size="sm" onClick={applyLink} className="h-9">
              Apply
            </Button>
          </div>
        </PopoverContent>
      </Popover>

      {/* <input
        type="file"
        ref={fileInputRef}
        onChange={handleImageUpload}
        accept="image/*"
        className="hidden"
      />
      <Button
        variant="ghost"
        size="sm"
        onClick={() => fileInputRef.current?.click()}
        aria-label="Add image"
        className={getBtnClass(false)}
        type="button"
        disabled={isUploading}
      >
        {isUploading ? (
          <Loader2 className="h-4 w-4 animate-spin text-primary" />
        ) : (
          <ImageIcon className="h-4 w-4" />
        )}
      </Button> */}

      {/* History */}
      <div className="ml-auto flex items-center gap-1">
        <Button
          variant="ghost"
          size="sm"
          onClick={() => editor.chain().focus().undo().run()}
          disabled={!editor.can().undo()}
          className="h-8 w-8 p-0 text-muted-foreground hover:text-foreground"
          type="button"
        >
          <Undo className="h-4 w-4" />
        </Button>
        <Button
          variant="ghost"
          size="sm"
          onClick={() => editor.chain().focus().redo().run()}
          disabled={!editor.can().redo()}
          className="h-8 w-8 p-0 text-muted-foreground hover:text-foreground"
          type="button"
        >
          <Redo className="h-4 w-4" />
        </Button>
      </div>
    </div>
  );
}
