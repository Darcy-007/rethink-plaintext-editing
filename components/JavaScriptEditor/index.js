import SyntaxHighlighter from 'react-syntax-highlighter';
// import { dark } from 'react-syntax-highlighter/dist/esm/styles/prism';
import css from './style.css';
import React, { useState, useEffect } from 'react';
import PlaintextEditor from '../PlaintextEditor';

const JavaScriptEditor = ({ file, write }) => {
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
