import { useEditor, EditorContent } from '@tiptap/react'
import StarterKit from '@tiptap/starter-kit'
import Underline from '@tiptap/extension-underline'
import { Color } from '@tiptap/extension-color'
import { TextStyle } from '@tiptap/extension-text-style'
import Highlight from '@tiptap/extension-highlight'
import { Bold, Italic, Underline as UnderlineIcon } from 'lucide-react'

// Text colors are the dark counterparts of the highlight colors, so they always match visually
const TEXT_COLORS = [
  { color: '#111a14', label: 'Schwarz',    highlight: null },
  { color: '#1b4332', label: 'Dunkelgrün', highlight: null },
  { color: '#d97706', label: 'Amber',      highlight: '#fef08a' },
  { color: '#16a34a', label: 'Grün',       highlight: '#bbf7d0' },
  { color: '#db2777', label: 'Pink',       highlight: '#fbcfe8' },
  { color: '#1d4ed8', label: 'Blau',       highlight: '#bfdbfe' },
]

const HIGHLIGHT_COLORS = [
  { color: '#fef08a', label: 'Gelb',  text: '#d97706' },
  { color: '#bbf7d0', label: 'Grün',  text: '#16a34a' },
  { color: '#fbcfe8', label: 'Pink',  text: '#db2777' },
  { color: '#bfdbfe', label: 'Blau',  text: '#1d4ed8' },
]

export default function RichEditor({ content, onChange, placeholder = 'Schreibe hier…' }) {
  const editor = useEditor({
    extensions: [
      StarterKit,
      Underline,
      TextStyle,
      Color,
      Highlight.configure({ multicolor: true }),
    ],
    content: content || '',
    onUpdate: ({ editor }) => onChange(editor.getHTML()),
    editorProps: {
      attributes: {
        class: 'rich-editor-content',
        spellcheck: 'true',
      },
    },
  })

  if (!editor) return null

  const activeTextColor = TEXT_COLORS.find(c =>
    editor.isActive('textStyle', { color: c.color })
  )?.color || null

  const activeHighlight = HIGHLIGHT_COLORS.find(c =>
    editor.isActive('highlight', { color: c.color })
  )?.color || null

  return (
    <div className="rich-editor">
      <div className="rich-toolbar">
        <div className="rich-toolbar-group">
          <button
            type="button"
            title="Fett"
            className={'rich-btn' + (editor.isActive('bold') ? ' active' : '')}
            onMouseDown={e => { e.preventDefault(); editor.chain().focus().toggleBold().run() }}
          >
            <Bold size={15} />
          </button>
          <button
            type="button"
            title="Kursiv"
            className={'rich-btn' + (editor.isActive('italic') ? ' active' : '')}
            onMouseDown={e => { e.preventDefault(); editor.chain().focus().toggleItalic().run() }}
          >
            <Italic size={15} />
          </button>
          <button
            type="button"
            title="Unterstrichen"
            className={'rich-btn' + (editor.isActive('underline') ? ' active' : '')}
            onMouseDown={e => { e.preventDefault(); editor.chain().focus().toggleUnderline().run() }}
          >
            <UnderlineIcon size={15} />
          </button>
        </div>

        <div className="rich-toolbar-divider" />

        <div className="rich-toolbar-group" style={{ gap: 6 }}>
          {TEXT_COLORS.map(({ color, label }) => (
            <button
              key={color}
              type="button"
              title={`Textfarbe: ${label}`}
              className={'color-dot' + (activeTextColor === color ? ' active' : '')}
              style={{ background: color }}
              onMouseDown={e => {
                e.preventDefault()
                if (activeTextColor === color) {
                  editor.chain().focus().unsetColor().run()
                } else {
                  editor.chain().focus().setColor(color).run()
                }
              }}
            />
          ))}
        </div>

        <div className="rich-toolbar-divider" />

        <div className="rich-toolbar-group" style={{ gap: 6 }}>
          <span className="rich-toolbar-label">Marker</span>
          {HIGHLIGHT_COLORS.map(({ color, label }) => (
            <button
              key={color}
              type="button"
              title={`Markieren: ${label}`}
              className={'color-dot highlight-dot' + (activeHighlight === color ? ' active' : '')}
              style={{ background: color }}
              onMouseDown={e => {
                e.preventDefault()
                if (activeHighlight === color) {
                  editor.chain().focus().unsetHighlight().run()
                } else {
                  editor.chain().focus().setHighlight({ color }).run()
                }
              }}
            />
          ))}
        </div>
      </div>

      <EditorContent editor={editor} />

      {!editor.getText() && (
        <div className="rich-placeholder" aria-hidden>{placeholder}</div>
      )}
    </div>
  )
}
