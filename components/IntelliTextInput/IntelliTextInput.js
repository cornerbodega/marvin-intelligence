import { useEffect, useRef } from "react";
import "./IntelliTextInput.css";

const IntelliTextInput = ({ value, onChange, placeholder = "" }) => {
  const editorRef = useRef(null);
  const caretRef = useRef(null);

  // Sync text content only when value changes from outside
  useEffect(() => {
    const el = editorRef.current;
    if (el && el.innerText !== value) {
      el.innerText = value;
    }
  }, [value]);

  const updateCaretPosition = () => {
    const selection = window.getSelection();
    if (!selection || selection.rangeCount === 0) return;

    const range = selection.getRangeAt(0).cloneRange();

    // Insert temporary marker
    const marker = document.createElement("span");
    marker.id = "caret-marker";
    marker.appendChild(document.createTextNode("\u200B")); // Zero-width space

    range.insertNode(marker);

    const markerRect = marker.getBoundingClientRect();
    const wrapperRect = editorRef.current.getBoundingClientRect();

    const topOffset =
      markerRect.top - wrapperRect.top + editorRef.current.scrollTop;
    const leftOffset =
      markerRect.left - wrapperRect.left + editorRef.current.scrollLeft;

    caretRef.current.style.top = `${topOffset}px`;
    caretRef.current.style.left = `${leftOffset}px`;
    caretRef.current.style.display = "block";

    // Clean up marker and restore selection
    marker.remove();
    selection.removeAllRanges();
    selection.addRange(range);
  };

  const handleInput = (e) => {
    const newText = e.currentTarget.innerText;
    onChange(newText);
    updateCaretPosition();
  };

  return (
    <div className="intelli-caret-wrapper">
      <div
        ref={editorRef}
        className="intelli-editor"
        contentEditable
        onInput={handleInput}
        onClick={updateCaretPosition}
        onKeyUp={updateCaretPosition}
        suppressContentEditableWarning
        data-placeholder={placeholder}
        spellCheck="false"
      />
      <div ref={caretRef} className="intelli-caret" />
    </div>
  );
};

export default IntelliTextInput;
