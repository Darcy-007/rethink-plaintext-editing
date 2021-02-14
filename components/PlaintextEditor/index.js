import React, { useState, useMemo, useEffect } from 'react';
import PropTypes from 'prop-types';
import { createEditor } from 'slate';
import { Slate, Editable, withReact } from 'slate-react';

import css from './style.css';

function PlaintextEditor({ file, write }) {
  // console.log(file, write);
  const editor = useMemo(() => withReact(createEditor()), []);

  const [text, setText] = useState([
    {
      type: 'paragraph',
      children: [{ text: ''}],
    },
  ]);

  useEffect(() => {
    (async () => {
      setText([{
        type: 'paragraph',
        children: [{ text: await file.text() }],
      }]);
    })();
  }, []);

  return (
    <div className={css.editor}>
      <Slate
        editor={editor}
        value={text}
        onChange={newText => setText(newText)}
      >
        <Editable />
      </Slate>
    </div>
  );
}

PlaintextEditor.propTypes = {
  file: PropTypes.object,
  write: PropTypes.func
};

export default PlaintextEditor;
