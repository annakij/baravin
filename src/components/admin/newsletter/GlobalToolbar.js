import { AlignCenter, AlignLeft, AlignRight, Bold, Heading1, Heading2, Heading3,
    List, Signature, Underline as UnderlineIcon } from "lucide-react";

  export function GlobalToolbar({ editor }) {
    const isDisabled = !editor;
  
    return (
      <div className="global-toolbar">
        <button
          onClick={() => editor?.chain().focus().toggleBold().run()}
          className={editor?.isActive("bold") ? "active" : ""}
        >
          <Bold />
        </button>
        <button
        disabled={isDisabled} 
          onClick={() => editor?.chain().focus().toggleUnderline().run()}
          className={editor?.isActive("underline") ? "active" : ""}
        >
          <UnderlineIcon />
        </button>
        <button
        disabled={isDisabled} 
          onClick={() => editor?.chain().focus().toggleItalic().run()}
          className={editor?.isActive("italic") ? "active" : ""}
        >
          <Signature />
        </button>
        <button disabled={isDisabled} onClick={() => editor?.chain().focus().setTextAlign("left").run()}>
          <AlignLeft />
        </button>
        <button disabled={isDisabled} onClick={() => editor?.chain().focus().setTextAlign("center").run()}>
          <AlignCenter />
        </button>
        <button disabled={isDisabled} onClick={() => editor?.chain().focus().setTextAlign("right").run()}>
          <AlignRight />
        </button>
        <button disabled={isDisabled} onClick={() => editor?.chain().focus().toggleHeading({ level: 1 }).run()}>
          <Heading1 />
        </button>
        <button disabled={isDisabled} onClick={() => editor?.chain().focus().toggleHeading({ level: 2 }).run()}>
          <Heading2 />
        </button>
        <button disabled={isDisabled} onClick={() => editor?.chain().focus().toggleHeading({ level: 3 }).run()}>
          <Heading3 />
        </button>
        <button disabled={isDisabled} onClick={() => editor?.chain().focus().toggleBulletList().run()}>
          <List />
        </button>
      </div>
    );
  }