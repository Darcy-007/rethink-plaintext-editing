import React, { useState, useMemo, useEffect } from 'react';
import PropTypes from 'prop-types';
import { createEditor } from 'slate';
import { Slate, Editable, withReact} from 'slate-react';

import css from './style.css';

function PlaintextEditor({ file, write }) {
  const editor = useMemo(() => withReact(createEditor()), []);

  const [text, setText] = useState([
    {
      type: 'paragraph',
      children: [{ text: '' }]
    }
  ]);

  const [tip, setTip] = useState('');

  useEffect(() => {
    (async () => {
      setText([
        {
          type: 'paragraph',
          children: [{ text: await file.text() }]
        }
      ]);
    })();
  }, [file]);

  useEffect(()=>{
    setTip('Please Save after you made any changes.');
  }, [text])

  const onClickHandler = () => {
    setTip('Saved!');
    var mergedText = '';

    text.forEach(paragraph => {
      mergedText = mergedText.concat(paragraph.children[0].text + '\n');
    });
    mergedText = mergedText.substring(0, mergedText.length - 1);

    write(
      new File([mergedText], file.name, {
        type: file.type,
        lastModified: new Date()
      })
    );
  };

  return (
    <div className={css.editor}>
      {/* <div>{path.basename(file.name)}</div> */}
      <Slate
        editor={editor}
        value={text}
        onChange={newText => setText(newText)}
      >
        <Editable spellCheck autoFocus />
      </Slate>
      <div className={css.save} onClick={() => onClickHandler()}>
        Save
      </div>
      <div>{tip}</div>
    </div>
  );
}

PlaintextEditor.propTypes = {
  file: PropTypes.object,
  write: PropTypes.func
};

export default PlaintextEditor;
