const IntelliTextInput = ({ value, onChange, placeholder = "" }) => {
  const textareaStyle = {
    width: "100%",
    minHeight: "180px",
    backgroundColor: "#000",
    border: "1px solid white",
    borderRadius: "8px",
    padding: "12px",
    color: "white",
    fontSize: "16px",
    lineHeight: "1.5",
    resize: "vertical",
    outline: "none",
    fontFamily: "inherit",
  };

  return (
    <textarea
      style={textareaStyle}
      value={value}
      onChange={(e) => onChange(e.target.value)}
      placeholder={placeholder}
      spellCheck="false"
    />
  );
};

export default IntelliTextInput;
