import {
  Bold,
  Italic,
  List,
  ListOrdered,
  Minus,
  Undo2,
  Redo2,
} from 'lucide-react';

const MenuBar = ({ editor }) => {
  if (!editor) return null;

  const buttonClass = (active) =>
    `px-3 py-2 rounded-xl transition-all ${
      active
        ? 'bg-[var(--festival-purple)] text-white'
        : 'bg-white text-gray-500 hover:bg-gray-100 border border-gray-200'
    }`;

  return (
    <div className="flex flex-wrap items-center gap-2 p-4 bg-gray-50 border-b border-gray-200">
      <button type="button" onClick={() => editor.chain().focus().toggleBold().run()} className={buttonClass(editor.isActive('bold'))}>
        <Bold size={18} />
      </button>

      <button type="button" onClick={() => editor.chain().focus().toggleItalic().run()} className={buttonClass(editor.isActive('italic'))}>
        <Italic size={18} />
      </button>

      <div className="w-px h-6 bg-gray-300 mx-1" />

      <button type="button" onClick={() => editor.chain().focus().toggleBulletList().run()} className={buttonClass(editor.isActive('bulletList'))}>
        <List size={18} />
      </button>

      <button type="button" onClick={() => editor.chain().focus().toggleOrderedList().run()} className={buttonClass(editor.isActive('orderedList'))}>
        <ListOrdered size={18} />
      </button>

      <button type="button" onClick={() => editor.chain().focus().setHorizontalRule().run()} className={buttonClass(false)}>
        <Minus size={18} />
      </button>

      <div className="w-px h-6 bg-gray-300 mx-1" />

      <button type="button" onClick={() => editor.chain().focus().undo().run()} className={buttonClass(false)}>
        <Undo2 size={18} />
      </button>

      <button type="button" onClick={() => editor.chain().focus().redo().run()} className={buttonClass(false)}>
        <Redo2 size={18} />
      </button>
    </div>
  );
};

export default MenuBar;