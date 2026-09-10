'use client';

import { useRef, useState } from 'react';
import Highlight from '@tiptap/extension-highlight';
import Image from '@tiptap/extension-image';
import TextAlign from '@tiptap/extension-text-align';
import {
  EditorContent,
  useEditor,
  useEditorState,
  type JSONContent,
} from '@tiptap/react';
import StarterKit from '@tiptap/starter-kit';
import {
  AlignCenter,
  AlignLeft,
  AlignRight,
  Bold,
  Code2,
  Highlighter,
  ImageIcon,
  Italic,
  Link2,
  List,
  ListOrdered,
  Minus,
  Quote,
  Redo2,
  RemoveFormatting,
  Strikethrough,
  Underline,
  Undo2,
  Unlink,
  X,
} from 'lucide-react';

const MAX_INLINE_IMAGE_SIZE = 1024 * 1024;

function normaliseUrl(value: string, allowRelative = false) {
  const trimmed = value.trim();
  if (allowRelative && trimmed.startsWith('/')) return trimmed;
  const withProtocol = /^[a-z][a-z\d+.-]*:/i.test(trimmed)
    ? trimmed
    : `https://${trimmed}`;
  const url = new URL(withProtocol);
  if (!['http:', 'https:', 'mailto:'].includes(url.protocol)) {
    throw new Error('unsupported protocol');
  }
  return url.toString();
}

function ToolbarButton({
  active = false,
  disabled = false,
  label,
  onClick,
  children,
}: {
  active?: boolean;
  disabled?: boolean;
  label: string;
  onClick: () => void;
  children: React.ReactNode;
}) {
  return (
    <button
      aria-label={label}
      aria-pressed={active}
      className={`inline-flex h-9 min-w-9 items-center justify-center rounded border px-2 text-sm transition-colors disabled:cursor-not-allowed disabled:opacity-35 ${
        active
          ? 'border-ink bg-ink text-paper'
          : 'border-transparent bg-transparent text-ink hover:border-border hover:bg-white'
      }`}
      disabled={disabled}
      onClick={onClick}
      title={label}
      type='button'
    >
      {children}
    </button>
  );
}

function ToolbarDivider() {
  return <span aria-hidden className='mx-1 h-6 border-l' />;
}

export function RichTextEditor({
  initialContent,
}: {
  initialContent: JSONContent;
}) {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [serializedContent, setSerializedContent] = useState(() =>
    JSON.stringify(initialContent),
  );
  const [imagePanelOpen, setImagePanelOpen] = useState(false);
  const [imageUrl, setImageUrl] = useState('');
  const [imageAlt, setImageAlt] = useState('');
  const [imageError, setImageError] = useState<string | null>(null);

  const editor = useEditor({
    extensions: [
      StarterKit.configure({
        heading: { levels: [2, 3] },
        link: {
          openOnClick: false,
          HTMLAttributes: {
            rel: 'noopener noreferrer nofollow',
            class: 'rich-text-link',
          },
        },
      }),
      Highlight,
      TextAlign.configure({ types: ['heading', 'paragraph'] }),
      Image.configure({
        allowBase64: true,
        resize: {
          enabled: true,
          directions: ['left', 'right'],
          minWidth: 160,
          minHeight: 90,
          alwaysPreserveAspectRatio: true,
        },
        HTMLAttributes: { loading: 'lazy' },
      }),
    ],
    content: initialContent,
    immediatelyRender: false,
    editorProps: {
      attributes: {
        'aria-label': 'Məzmun redaktoru',
        class: 'focus:outline-none',
      },
    },
    onUpdate: ({ editor: currentEditor }) => {
      console.log(currentEditor.getJSON());
      setSerializedContent(JSON.stringify(currentEditor.getJSON()));
    },
  });

  const editorState = useEditorState({
    editor,
    selector: ({ editor: currentEditor }) => {
      if (!currentEditor) return null;
      const contentText = currentEditor.getText();
      const trimmedText = contentText.trim();
      return {
        bold: currentEditor.isActive('bold'),
        italic: currentEditor.isActive('italic'),
        underline: currentEditor.isActive('underline'),
        strike: currentEditor.isActive('strike'),
        code: currentEditor.isActive('code'),
        highlight: currentEditor.isActive('highlight'),
        bulletList: currentEditor.isActive('bulletList'),
        orderedList: currentEditor.isActive('orderedList'),
        blockquote: currentEditor.isActive('blockquote'),
        codeBlock: currentEditor.isActive('codeBlock'),
        link: currentEditor.isActive('link'),
        image: currentEditor.isActive('image'),
        alignLeft: currentEditor.isActive({ textAlign: 'left' }),
        alignCenter: currentEditor.isActive({ textAlign: 'center' }),
        alignRight: currentEditor.isActive({ textAlign: 'right' }),
        block: currentEditor.isActive('heading', { level: 2 })
          ? 'h2'
          : currentEditor.isActive('heading', { level: 3 })
            ? 'h3'
            : 'paragraph',
        words: trimmedText ? trimmedText.split(/\s+/u).length : 0,
        characters: contentText.length,
        canUndo: currentEditor.can().undo(),
        canRedo: currentEditor.can().redo(),
      };
    },
  });

  const addLink = () => {
    if (!editor) return;
    const previousUrl = editor.getAttributes('link').href as string | undefined;
    const value = window.prompt('Keçidin ünvanı', previousUrl ?? 'https://');
    if (value === null) return;
    if (!value.trim()) {
      editor.chain().focus().extendMarkRange('link').unsetLink().run();
      return;
    }
    try {
      editor
        .chain()
        .focus()
        .extendMarkRange('link')
        .setLink({ href: normaliseUrl(value, true) })
        .run();
    } catch {
      window.alert('Düzgün keçid ünvanı daxil edin.');
    }
  };

  const insertImage = (src: string, alt: string) => {
    if (!editor) return;
    editor.chain().focus().setImage({ src, alt: alt.trim() }).run();
    setImagePanelOpen(false);
    setImageUrl('');
    setImageAlt('');
    setImageError(null);
  };

  const addImageFromUrl = () => {
    try {
      insertImage(normaliseUrl(imageUrl), imageAlt);
    } catch {
      setImageError('Düzgün şəkil ünvanı daxil edin.');
    }
  };

  const addImageFromFile = (file: File | undefined) => {
    if (!file) return;
    setImageError(null);
    if (!file.type.startsWith('image/')) {
      setImageError('Yalnız şəkil faylı seçə bilərsiniz.');
      return;
    }
    if (file.size > MAX_INLINE_IMAGE_SIZE) {
      setImageError('Şəkil 1 MB-dan kiçik olmalıdır.');
      return;
    }
    const reader = new FileReader();
    reader.onload = () => {
      if (typeof reader.result === 'string')
        insertImage(reader.result, imageAlt);
    };
    reader.onerror = () => setImageError('Şəkli oxumaq mümkün olmadı.');
    reader.readAsDataURL(file);
  };

  const setBlock = (value: string) => {
    if (!editor) return;
    if (value === 'h2') editor.chain().focus().setHeading({ level: 2 }).run();
    else if (value === 'h3')
      editor.chain().focus().setHeading({ level: 3 }).run();
    else editor.chain().focus().setParagraph().run();
  };

  return (
    <div className='overflow-hidden rounded-md border bg-white shadow-sm'>
      <div
        aria-label='Mətn formatlama alətləri'
        className='sticky top-0 z-10 flex flex-wrap items-center gap-0.5 border-b bg-paper-dim/95 p-2 backdrop-blur'
        role='toolbar'
      >
        <select
          aria-label='Mətn üslubu'
          className='mr-1 h-9 rounded border bg-white px-2 text-sm'
          disabled={!editor}
          onChange={(event) => setBlock(event.target.value)}
          value={editorState?.block ?? 'paragraph'}
        >
          <option value='paragraph'>Adi mətn</option>
          <option value='h2'>Başlıq 2</option>
          <option value='h3'>Başlıq 3</option>
        </select>

        <ToolbarButton
          active={editorState?.bold}
          disabled={!editor}
          label='Qalın'
          onClick={() => editor?.chain().focus().toggleBold().run()}
        >
          <Bold size={17} />
        </ToolbarButton>
        <ToolbarButton
          active={editorState?.italic}
          disabled={!editor}
          label='Kursiv'
          onClick={() => editor?.chain().focus().toggleItalic().run()}
        >
          <Italic size={17} />
        </ToolbarButton>
        <ToolbarButton
          active={editorState?.underline}
          disabled={!editor}
          label='Altıxətli'
          onClick={() => editor?.chain().focus().toggleUnderline().run()}
        >
          <Underline size={17} />
        </ToolbarButton>
        <ToolbarButton
          active={editorState?.strike}
          disabled={!editor}
          label='Üstündən xətt'
          onClick={() => editor?.chain().focus().toggleStrike().run()}
        >
          <Strikethrough size={17} />
        </ToolbarButton>
        <ToolbarButton
          active={editorState?.highlight}
          disabled={!editor}
          label='Vurğula'
          onClick={() => editor?.chain().focus().toggleHighlight().run()}
        >
          <Highlighter size={17} />
        </ToolbarButton>
        <ToolbarButton
          active={editorState?.code}
          disabled={!editor}
          label='Sətirdaxili kod'
          onClick={() => editor?.chain().focus().toggleCode().run()}
        >
          <Code2 size={17} />
        </ToolbarButton>

        <ToolbarDivider />

        <ToolbarButton
          active={editorState?.bulletList}
          disabled={!editor}
          label='Markerli siyahı'
          onClick={() => editor?.chain().focus().toggleBulletList().run()}
        >
          <List size={18} />
        </ToolbarButton>
        <ToolbarButton
          active={editorState?.orderedList}
          disabled={!editor}
          label='Nömrəli siyahı'
          onClick={() => editor?.chain().focus().toggleOrderedList().run()}
        >
          <ListOrdered size={18} />
        </ToolbarButton>
        <ToolbarButton
          active={editorState?.blockquote}
          disabled={!editor}
          label='Sitat'
          onClick={() => editor?.chain().focus().toggleBlockquote().run()}
        >
          <Quote size={17} />
        </ToolbarButton>
        <ToolbarButton
          active={editorState?.codeBlock}
          disabled={!editor}
          label='Kod bloku'
          onClick={() => editor?.chain().focus().toggleCodeBlock().run()}
        >
          <span className='font-mono text-xs'>{'</>'}</span>
        </ToolbarButton>
        <ToolbarButton
          disabled={!editor}
          label='Ayırıcı xətt'
          onClick={() => editor?.chain().focus().setHorizontalRule().run()}
        >
          <Minus size={18} />
        </ToolbarButton>

        <ToolbarDivider />

        <ToolbarButton
          active={editorState?.alignLeft}
          disabled={!editor}
          label='Sola düzlə'
          onClick={() => editor?.chain().focus().setTextAlign('left').run()}
        >
          <AlignLeft size={17} />
        </ToolbarButton>
        <ToolbarButton
          active={editorState?.alignCenter}
          disabled={!editor}
          label='Mərkəzə düzlə'
          onClick={() => editor?.chain().focus().setTextAlign('center').run()}
        >
          <AlignCenter size={17} />
        </ToolbarButton>
        <ToolbarButton
          active={editorState?.alignRight}
          disabled={!editor}
          label='Sağa düzlə'
          onClick={() => editor?.chain().focus().setTextAlign('right').run()}
        >
          <AlignRight size={17} />
        </ToolbarButton>

        <ToolbarDivider />

        <ToolbarButton
          active={editorState?.link}
          disabled={!editor}
          label='Keçid əlavə et və ya dəyiş'
          onClick={addLink}
        >
          <Link2 size={17} />
        </ToolbarButton>
        {editorState?.link ? (
          <ToolbarButton
            disabled={!editor}
            label='Keçidi sil'
            onClick={() => editor?.chain().focus().unsetLink().run()}
          >
            <Unlink size={17} />
          </ToolbarButton>
        ) : null}
        <ToolbarButton
          active={imagePanelOpen || editorState?.image}
          disabled={!editor}
          label='Şəkil əlavə et'
          onClick={() => {
            setImagePanelOpen((open) => !open);
            setImageError(null);
          }}
        >
          <ImageIcon size={17} />
        </ToolbarButton>
        {editorState?.image ? (
          <ToolbarButton
            label='Seçilmiş şəkli sil'
            onClick={() => editor?.chain().focus().deleteSelection().run()}
          >
            <X size={17} />
          </ToolbarButton>
        ) : null}

        <ToolbarDivider />

        <ToolbarButton
          disabled={!editor}
          label='Formatlamanı təmizlə'
          onClick={() =>
            editor?.chain().focus().clearNodes().unsetAllMarks().run()
          }
        >
          <RemoveFormatting size={17} />
        </ToolbarButton>
        <ToolbarButton
          disabled={!editorState?.canUndo}
          label='Geri al'
          onClick={() => editor?.chain().focus().undo().run()}
        >
          <Undo2 size={17} />
        </ToolbarButton>
        <ToolbarButton
          disabled={!editorState?.canRedo}
          label='Təkrarla'
          onClick={() => editor?.chain().focus().redo().run()}
        >
          <Redo2 size={17} />
        </ToolbarButton>
      </div>

      {imagePanelOpen ? (
        <div className='grid gap-3 border-b bg-paper-dim/60 p-4 md:grid-cols-[1fr_1fr_auto] md:items-end'>
          <label className='text-sm font-semibold'>
            Şəkil ünvanı
            <input
              className='mt-1.5 h-10 w-full rounded border bg-white px-3 font-normal'
              onChange={(event) => setImageUrl(event.target.value)}
              placeholder='https://...'
              type='url'
              value={imageUrl}
            />
          </label>
          <label className='text-sm font-semibold'>
            Alternativ mətn
            <input
              className='mt-1.5 h-10 w-full rounded border bg-white px-3 font-normal'
              onChange={(event) => setImageAlt(event.target.value)}
              placeholder='Şəkildə nə görünür?'
              value={imageAlt}
            />
          </label>
          <div className='flex gap-2'>
            <button
              className='h-10 rounded bg-ink px-4 text-sm font-semibold text-paper disabled:opacity-40'
              disabled={!imageUrl.trim()}
              onClick={addImageFromUrl}
              type='button'
            >
              Əlavə et
            </button>
            <button
              className='h-10 rounded border bg-white px-4 text-sm font-semibold hover:bg-paper'
              onClick={() => fileInputRef.current?.click()}
              type='button'
            >
              Fayl seç
            </button>
            <input
              accept='image/jpeg,image/png,image/gif,image/webp'
              className='sr-only'
              onChange={(event) => {
                addImageFromFile(event.target.files?.[0]);
                event.target.value = '';
              }}
              ref={fileInputRef}
              type='file'
            />
          </div>
          {imageError ? (
            <p className='text-sm text-copper md:col-span-3' role='alert'>
              {imageError}
            </p>
          ) : (
            <p className='text-xs text-muted-foreground md:col-span-3'>
              Linkdən istifadə edin və ya 1 MB-a qədər JPG, PNG, GIF, WEBP faylı
              seçin. Şəkli seçərək enini dəyişə bilərsiniz.
            </p>
          )}
        </div>
      ) : null}

      <EditorContent editor={editor} />
      <div className='flex items-center justify-between border-t bg-paper-dim/60 px-3 py-2 text-xs text-muted-foreground'>
        <span>Dəyişikliklər “Saxla” düyməsi ilə yadda qalır</span>
        <span>
          {editorState?.words ?? 0} söz · {editorState?.characters ?? 0} simvol
        </span>
      </div>
      <input
        name='contentJson'
        readOnly
        type='hidden'
        value={serializedContent}
      />
    </div>
  );
}
