import React, { useState, useEffect } from 'react';
import PropTypes from 'prop-types';
import ReactMarkdown from 'react-markdown';

import css from './style.css';

function MarkdownEditor({ file, write }) {
  // console.log(file, write);
  const [content, setContent] = useState("some text");
  useEffect(() => {
    (async () => {
      setContent(await file.text());
    })();
  }, [file]);
  
  return (
    <div className={css.editor}>
      <ReactMarkdown>
        {content}
      </ReactMarkdown>
    </div>
  );
}

MarkdownEditor.propTypes = {
  file: PropTypes.object,
  write: PropTypes.func
};

export default MarkdownEditor;
