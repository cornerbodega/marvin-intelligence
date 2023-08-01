import { useEffect } from "react";
import { sanitize, isSupported } from "isomorphic-dompurify";

const MyComponent = ({ title, content }) => {
  // const sanitizer = dompurify.sanitize;

  return (
    <div>
      {/* <h1>{title}</h1> */}
      {/* {} */}
      <div dangerouslySetInnerHTML={{ __html: sanitize(content) }} />;
      {/* <div>const clean = DOMPurify.sanitize(dirty);</div> */}
    </div>
  );
};

export default MyComponent;
