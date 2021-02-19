import SyntaxHighlighter from 'react-syntax-highlighter';
import css from './style.css';
import React, { useState, useEffect } from 'react';

const JavaScriptEditor = ({ file }) => {
  const [text, setText] = useState('');

  useEffect(() => {
    (async () => {
      setText(await file.text());
    })();
  }, [file]);
  return (
    <div class={css.editor}>
      <SyntaxHighlighter language="javascript" wrapLongLines={true} showLineNumbers={true}>
        {text}
      </SyntaxHighlighter>
    </div>
  );
};

export default JavaScriptEditor;
