import { createElement } from "react";
import { act, render } from "@testing-library/react";
import { describe, expect, it, vi } from "vitest";
import { RichTextEditor } from "@/components/admin/rich-text-editor";

const tiptap = vi.hoisted(() => ({
  options: null as null | {
    onUpdate: (payload: { editor: { getJSON: () => unknown } }) => void;
  },
}));

vi.mock("@tiptap/react", () => ({
  EditorContent: () => createElement("div", { "data-testid": "editor" }),
  useEditor: (options: typeof tiptap.options) => {
    tiptap.options = options;
    return {};
  },
  useEditorState: () => ({
    block: "paragraph",
    words: 0,
    characters: 0,
    canUndo: false,
    canRedo: false,
  }),
}));

describe("RichTextEditor", () => {
  it("submits the latest editor document instead of the initial content", () => {
    const initialContent = { type: "doc", content: [{ type: "paragraph" }] };
    const changedContent = {
      type: "doc",
      content: [
        {
          type: "paragraph",
          content: [{ type: "text", text: "Yenilənmiş məzmun" }],
        },
      ],
    };
    const { container } = render(
      createElement(RichTextEditor, { initialContent }),
    );
    const formControl = container.querySelector<HTMLInputElement>(
      'input[name="contentJson"]',
    );

    expect(formControl?.value).toBe(JSON.stringify(initialContent));

    act(() => {
      tiptap.options?.onUpdate({
        editor: { getJSON: () => changedContent },
      });
    });

    expect(formControl?.value).toBe(JSON.stringify(changedContent));
  });
});
