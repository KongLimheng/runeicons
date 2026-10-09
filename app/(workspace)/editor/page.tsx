import { pageMetadata } from "@/lib/seo";

export const metadata = pageMetadata({
  title: "Editor",
  description:
    "Edit any Rune Icons glyph in your browser: reshape paths, tune stroke and size, then copy the result as SVG or JSX.",
  path: "/editor",
});

// Rendered by the workspace layout, so switching from /icons only swaps the centre.
export default function EditorPage() {
  return <h1 className="sr-only">Rune Icons editor</h1>;
}
