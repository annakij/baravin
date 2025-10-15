import React, { useState, useRef } from "react";
import { useEditor, EditorContent } from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";
import TextAlign from "@tiptap/extension-text-align";
import Image from "@tiptap/extension-image";
import { GlobalToolbar } from "./GlobalToolbar";
import { useDrag, useDrop } from "react-dnd";
import { BLOCK_TYPE } from "../../../utils/constants";
import "./Newsletter.css";
import { Trash2 } from "lucide-react";

import BlockEditor from "./BlockEditor";

function EditorTab({ blocks, setBlocks, subject,
    setSubject, loadedTemplate, setLoadedTemplate }) {
    const [activeBlock, setActiveBlock] = useState(null);
    const [activeEditor, setActiveEditor] = useState(null);
    const [templateName, setTemplateName] = useState("");
    const [loadedTemplateName, setLoadedTemplateName] = useState(null);
  
    React.useEffect(() => {
        if (loadedTemplate) {
          setBlocks(loadedTemplate.blocks || []);
          setTemplateName(loadedTemplate.name);
          setLoadedTemplateName(loadedTemplate.name);
        }
      }, [loadedTemplate, setBlocks]);

    // --- Helpers ---
    const addBlock = (type) => {
        const newBlock = {
          id: Date.now(),
          type,
          content: type === "text" ? "<p>Skriv in din text...</p>" : "",
        };
      
        setBlocks((prev) => {
          if (activeBlock) {
            const index = prev.findIndex((b) => b.id === activeBlock.id);
            const updated = [...prev];
            updated.splice(index + 1, 0, newBlock);
            return updated;
          }
          return [...prev, newBlock];
        });
      
        setActiveBlock(newBlock);
      };
      
  
    const removeBlock = (id) => {
      setBlocks((prev) => prev.filter((b) => b.id !== id));
      if (activeBlock?.id === id) {
        setActiveBlock(null);
        setActiveEditor(null);
      }
    };
  
    const moveBlock = (from, to) => {
      const updated = [...blocks];
      const [moved] = updated.splice(from, 1);
      updated.splice(to, 0, moved);
      setBlocks(updated);
    };
  
    const updateBlock = (newBlock) => {
      setBlocks((prev) =>
        prev.map((b) => (b.id === newBlock.id ? newBlock : b))
      );
      setActiveBlock(newBlock);
    };
  
    const saveTemplate = () => {
      if (!templateName.trim()) return alert("Skriv in ett namn på mallen!");
      const saved = JSON.parse(localStorage.getItem("newsletterTemplates") || "[]");
  
      if (templateName === loadedTemplateName) {
        // Update existing template
        const updated = saved.map((t) =>
          t.name === templateName ? { ...t, blocks } : t
        );
        localStorage.setItem("newsletterTemplates", JSON.stringify(updated));
        alert("Ändringar sparade!");
      } else {
        // Create new template
        const newTemplate = { name: templateName, blocks };
        const updated = [...saved, newTemplate];
        localStorage.setItem("newsletterTemplates", JSON.stringify(updated));
        alert("Ny mall sparad!");
        setLoadedTemplateName(templateName);
      }
    };
  
    return (
      <div className="editor-grid">
        {/* Left columns*/}
        <div className="editor-sidebar">
          <h3 className="sidebar-title">Lägg till block</h3>
          <button onClick={() => addBlock("text")} className="block-btn">
            Text
          </button>
          <button onClick={() => addBlock("image")} className="block-btn">
            Bild
          </button>
          <button onClick={() => addBlock("productGrid")} className="block-btn">
            Produkter (2 boxar)
          </button>
          <button onClick={() => addBlock("button")} className="block-btn">
            Knapp
          </button>
          <button onClick={() => addBlock("link")} className="block-btn">
            Länk
          </button>
          <button onClick={() => addBlock("divider")} className="block-btn">
            Linje
          </button>
          <button onClick={() => addBlock("spacer")} className="block-btn">
            Mellanrum
          </button>
  
          <div className="save-template-box">
            <input
            type="text"
            placeholder="Mall namn..."
            value={templateName}
            onChange={(e) => setTemplateName(e.target.value)}
            className="input"
            />
            <button
            onClick={saveTemplate}
            className="btn btn-secondary"
            style={{ marginTop: "8px" }}
            >
            {templateName === loadedTemplateName
                ? "Spara ändringar"
                : "Spara mall"}
            </button>
        </div>
        </div>
  
        {/* Middle columns*/}
        <div className="editor-preview">
          <h3 className="preview-title">Förhandsgranskning</h3>

            <div className="subject-input">
            <label>Ämne:</label>
            <input
                type="text"
                className="input"
                value={subject}
                onChange={(e) => setSubject(e.target.value)}
                placeholder="Skriv ämnet för ditt utskick..."
            />
            </div>
  
          {/* Global toolbar */}
        <GlobalToolbar editor={activeEditor} />
  
          <div className="preview-box">
            {blocks.length === 0 ? (
              <p className="preview-placeholder">
                Börja bygg ditt nyhetsbrev genom att lägga till block från vänster
                panel.
              </p>
            ) : (
              blocks.map((block, i) => (
                <DraggableBlock
                  key={block.id}
                  block={block}
                  index={i}
                  moveBlock={moveBlock}
                  setActiveBlock={setActiveBlock}
                  setActiveEditor={setActiveEditor}
                  activeBlock={activeBlock}
                  updateBlock={updateBlock}
                  removeBlock={removeBlock}
                />
              ))
            )}
          </div>
        </div>
  
        {/* Right columns*/}
        <div className="editor-properties">
          <h3 className="properties-title">Blockegenskaper</h3>
          {activeBlock ? (
            <BlockEditor block={activeBlock} updateBlock={updateBlock} />
          ) : (
            <p>Välj ett block för att redigera..</p>
          )}
        </div>
      </div>
    );
  }
  
  function DraggableBlock({
    block,
    index,
    moveBlock,
    setActiveBlock,
    setActiveEditor,
    activeBlock,
    updateBlock,
    removeBlock,
  }) {
    const ref = useRef(null);
  
    const [, drop] = useDrop({
      accept: BLOCK_TYPE,
      hover(item) {
        if (!ref.current || item.index === index) return;
        moveBlock(item.index, index);
        item.index = index;
      },
    });
  
    const [, drag] = useDrag({
      type: BLOCK_TYPE,
      item: { index },
    });
  
    drag(drop(ref));
  
    // Textblock: inline editor
    const editor = useEditor({
      extensions: [
        StarterKit,
        TextAlign.configure({ types: ["heading", "paragraph"] }),
        Image,
      ],
      content: block.content,
      onUpdate: ({ editor }) => {
        updateBlock({ ...block, content: editor.getHTML() });
      },
    });
  
    return (
      <div
        ref={ref}
        className={`preview-block ${activeBlock?.id === block.id ? "active" : ""}`}
        onClick={() => {
          setActiveBlock(block);
          if (block.type === "text") {
            setActiveEditor(editor);
          } else {
            setActiveEditor(null);
          }
        }}
      >
        <a
          className="block-trash"
          onClick={(e) => {
            e.stopPropagation();
            removeBlock(block.id);
          }}
        >
          <Trash2 size={16} />
        </a>
        {block.type === "text" && <EditorContent editor={editor} />}
  
        {block.type === "image" && (
          <div style={{ padding: "8px" }}>
            {block.url ? (
              <img
                src={block.url}
                alt=""
                style={{ width: `${block.width || 100}%` }}
              />
            ) : (
              <em>[Bild]</em>
            )}
          </div>
        )}

        {block.type === "productGrid" && (
        <div className="product-grid">
            {[block.product1, block.product2].map((p, idx) =>
            p ? (
                <div key={idx} className="product-item">
                <a href={p.url} target="_blank" rel="noopener noreferrer">
                    <img src={p.image} alt={p.name} />
                </a>
                <p className="product-name">{p.name}</p>
                </div>
            ) : (
                <div key={idx} className="product-item placeholder">
                <em>Välj produkt {idx + 1}</em>
                </div>
            )
            )}
        </div>
        )}
  
        {block.type === "link" && (
          <a href={block.url || "#"} className="newsletter-link">
            {block.text || "Länk"}
          </a>
        )}
  
        {block.type === "button" && (
          <a href={block.url || "#"} className="btn btn-primary">
            {block.text || "Klicka här"}
          </a>
        )}
  
        {block.type === "divider" && <hr />}
        {block.type === "spacer" && (
          <div style={{ height: `${block.height || 20}px` }} />
        )}
      </div>
    );
  }

  export default EditorTab;