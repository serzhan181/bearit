"use client";

import { markdownToHtml } from "@/lib/editor";
import { Button } from "./ui/button";
import { Label } from "./ui/label";
import { Switch } from "./ui/switch";
import { useRef, useState } from "react";
import { TextareaMarkdownRef } from "textarea-markdown-editor";
import TextareaAutosize, {
  TextareaAutosizeProps,
} from "react-textarea-autosize";
import { TextareaMarkdown } from "textarea-markdown-editor/dist/TextareaMarkdown";
import { BoldIcon, ItalicIcon, LinkIcon, ListIcon } from "lucide-react";
import { cn } from "@/lib/utils";

type MarkdownEditorProps = {
  label?: string;
  value: string;
  onChange: (value: string) => void;
  onTriggerSubmit?: () => void;
} & Omit<
  TextareaAutosizeProps,
  "value" | "onChange" | "onKeyDown" | "onInput" | "onPaste" | "onDrop"
>;

const TOOLBAR_ITEMS = [
  {
    commandTrigger: "bold",
    icon: <BoldIcon className="w-4 h-4" />,
    name: "Bold",
  },
  {
    commandTrigger: "italic",
    icon: <ItalicIcon className="w-4 h-4" />,
    name: "Italic",
  },
  {
    commandTrigger: "unordered-list",
    icon: <ListIcon className="w-4 h-4" />,
    name: "Unordered List",
  },
  {
    commandTrigger: "link",
    icon: <LinkIcon className="w-4 h-4" />,
    name: "Link",
  },
];

export function MarkdownEditor({
  label,
  value,
  minRows = 15,
  onChange,
  onTriggerSubmit,
  ...rest
}: MarkdownEditorProps) {
  const textareaMarkdownRef = useRef<TextareaMarkdownRef>(null);
  const [showPreview, setShowPreview] = useState(false);

  return (
    <div className="flex flex-col gap-2">
      {label && <label className="block mb-2 font-semibold">{label}</label>}
      <div className="flex items-center justify-between gap-4 px-4 py-2 border rounded">
        <div className="flex gap-2 -ml-2">
          {TOOLBAR_ITEMS.map((toolbarItem) => (
            <Button
              key={toolbarItem.commandTrigger}
              size="icon"
              className="w-8 h-8"
              type="button"
              onClick={() => {
                textareaMarkdownRef.current?.trigger(
                  toolbarItem.commandTrigger
                );
              }}
              disabled={showPreview}
              title={toolbarItem.name}
            >
              {toolbarItem.icon}
            </Button>
          ))}
        </div>

        <div className="flex items-center space-x-2">
          <Switch
            id="show-preview"
            checked={showPreview}
            onCheckedChange={(value) => {
              if (value === false) {
                textareaMarkdownRef.current?.focus();
              }
              setShowPreview(value);
            }}
          />
          <Label htmlFor="show-preview">Preview</Label>
        </div>
      </div>

      {/*  */}
      <div className={cn("relative", showPreview && "sr-only")}>
        <TextareaMarkdown.Wrapper ref={textareaMarkdownRef}>
          <TextareaAutosize
            {...rest}
            value={value}
            onChange={(e) => {
              onChange(e.target.value);
            }}
            onKeyDown={(e) => {
              const { code, metaKey } = e;
              if (code === "Enter" && metaKey) onTriggerSubmit?.();
            }}
            className="block w-full px-4 py-2 border rounded shadow-sm border-border bg-accent focus:ring-ring focus:outline-none"
            minRows={minRows}
          />
        </TextareaMarkdown.Wrapper>
      </div>

      {showPreview && <MarkdownPreview markdown={value} />}
    </div>
  );
}

function MarkdownPreview({ markdown }: { markdown: string }) {
  return (
    <div className="pb-6 mt-4 border-b">
      {markdown ? (
        <div
          className="prose max-w-none"
          dangerouslySetInnerHTML={{ __html: markdownToHtml(markdown) }}
        />
      ) : (
        <p>Nothing to preview</p>
      )}
    </div>
  );
}
