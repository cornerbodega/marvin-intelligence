import React, { useState, useEffect } from "react";
import dynamic from "next/dynamic";
import "react-quill/dist/quill.snow.css"; // Ensure styles are imported if not globally available

const QuillNoSSRWrapper = dynamic(() => import("react-quill"), {
  ssr: false,
  loading: () => <p>Loading...</p>,
});

export default function IntelliEditor({ reportContent, onContentChange }) {
  const [content, setContent] = useState(reportContent);

  // Update the local content state when external report content changes
  useEffect(() => {
    setContent(reportContent);
  }, [reportContent]);

  const handleQuillChange = (content, delta, source, editor) => {
    setContent(content); // Update the local state
    onContentChange(editor.getHTML()); // Pass the HTML content up to the parent
  };

  return (
    <QuillNoSSRWrapper
      theme="snow"
      value={content}
      onChange={handleQuillChange} // Correctly handle change events
      modules={{
        toolbar: [
          [{ header: "1" }, { header: "2" }, { font: [] }],
          [{ size: [] }],
          ["bold", "italic", "underline", "strike", "blockquote"],
          [{ list: "ordered" }, { list: "bullet" }],
          ["link", "image", "video"],
          ["clean"],
          ["code-block"],
        ],
      }}
      formats={[
        "header",
        "font",
        "size",
        "bold",
        "italic",
        "underline",
        "strike",
        "blockquote",
        "list",
        "bullet",
        "link",
        "image",
        "video",
        "code-block",
      ]}
    />
  );
}
