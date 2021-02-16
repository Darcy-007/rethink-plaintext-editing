import React, { useState, useMemo, useEffect, useCallback } from 'react';
import PropTypes from 'prop-types';
import {
  Editor,
  Transforms,
  createEditor,
  Node,
  Element as SlateElement
} from 'slate';
import { Slate, Editable, withReact, useSlate } from 'slate-react';
import { cx, css } from '@emotion/css';
import { withHistory } from 'slate-history';

import editorCss from './style.css';

const LIST_TYPES = ['numbered-list', 'bulleted-list'];

function PlaintextEditor({ file, write }) {
  // console.log(file, write);
  const editor = useMemo(() => withReact(createEditor()), []);

  const [text, setText] = useState([
    {
      type: 'paragraph',
      children: [{ text: '' }]
    }
  ]);
  const renderElement = useCallback(props => <Element {...props} />, []);
  const renderLeaf = useCallback(props => <Leaf {...props} />, []);

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

  return (
    <div className={editorCss.editor}>
      {/* <Icon>{"format_bold"}</Icon> */}
      <Slate
        editor={editor}
        value={text}
        onChange={newText => setText(newText)}
      >
        <Toolbar>
          <MarkButton format="bold" icon="Bold" />
          <MarkButton format="italic" icon="Italic" />
          <MarkButton format="underline" icon="Underline" />
          <MarkButton format="code" icon="Code" />
          <BlockButton format="heading-one" icon="H1" />
          <BlockButton format="heading-two" icon="H2" />
          <BlockButton format="block-quote" icon="Quote" />
          <BlockButton format="numbered-list" icon="Numbered" />
          <BlockButton format="bulleted-list" icon="Bulleted" />
        </Toolbar>
        <Editable
          spellCheck
          autoFocus
          renderElement={renderElement}
          renderLeaf={renderLeaf}
        />
      </Slate>
      <div className={editorCss.save} onClick={() => {write(new File([text[0].children[0].text], file.name, {type: file.type, lastModified:new Date()}))}}>Save</div>
    </div>
  );
}

PlaintextEditor.propTypes = {
  file: PropTypes.object,
  write: PropTypes.func
};

const MarkButton = ({ format, icon }) => {
  const editor = useSlate();
  return (
    <div>
      <Button
        active={isMarkActive(editor, format)}
        onMouseDown={event => {
          event.preventDefault();
          toggleMark(editor, format);
        }}
      >
        <Icon>{icon}</Icon>
      </Button>
    </div>
  );
};

const BlockButton = ({ format, icon }) => {
  const editor = useSlate();
  return (
    <Button
      active={isBlockActive(editor, format)}
      onMouseDown={event => {
        event.preventDefault();
        toggleBlock(editor, format);
      }}
    >
      <Icon>{icon}</Icon>
    </Button>
  );
};

const Element = ({ attributes, children, element }) => {
  switch (element.type) {
    case 'block-quote':
      return <blockquote {...attributes}>{children}</blockquote>;
    case 'bulleted-list':
      return <ul {...attributes}>{children}</ul>;
    case 'heading-one':
      return <h1 {...attributes}>{children}</h1>;
    case 'heading-two':
      return <h2 {...attributes}>{children}</h2>;
    case 'list-item':
      return <li {...attributes}>{children}</li>;
    case 'numbered-list':
      return <ol {...attributes}>{children}</ol>;
    default:
      return <p {...attributes}>{children}</p>;
  }
};

const Leaf = ({ attributes, children, leaf }) => {
  if (leaf.bold) {
    children = <strong>{children}</strong>;
  }

  if (leaf.code) {
    children = <code>{children}</code>;
  }

  if (leaf.italic) {
    children = <em>{children}</em>;
  }

  if (leaf.underline) {
    children = <u>{children}</u>;
  }

  return <span {...attributes}>{children}</span>;
};

const toggleMark = (editor, format) => {
  const isActive = isMarkActive(editor, format);

  if (isActive) {
    Editor.removeMark(editor, format);
  } else {
    Editor.addMark(editor, format, true);
  }
};

const isBlockActive = (editor, format) => {
  const [match] = Editor.nodes(editor, {
    match: n =>
      !Editor.isEditor(n) && SlateElement.isElement(n) && n.type === format
  });

  return !!match;
};

const isMarkActive = (editor, format) => {
  const marks = Editor.marks(editor);
  return marks ? marks[format] === true : false;
};

const toggleBlock = (editor, format) => {
  const isActive = isBlockActive(editor, format);
  const isList = LIST_TYPES.includes(format);

  Transforms.unwrapNodes(editor, {
    match: n =>
      LIST_TYPES.includes(
        !Editor.isEditor(n) && SlateElement.isElement(n) && n.type
      ),
    split: true
  });
  const newProperties = {
    type: isActive ? 'paragraph' : isList ? 'list-item' : format
  };
  Transforms.setNodes(editor, newProperties);

  if (!isActive && isList) {
    const block = { type: format, children: [] };
    Transforms.wrapNodes(editor, block);
  }
};

const Menu = React.forwardRef(({ className, ...props }, ref) => (
  <div
    {...props}
    ref={ref}
    className={cx(
      className,
      css`
        & > * {
          display: inline-block;
        }
        & > * + * {
          margin-left: 15px;
        }
      `
    )}
  />
));

const Toolbar = React.forwardRef(({ className, ...props }, ref) => (
  <Menu
    {...props}
    ref={ref}
    className={cx(
      className,
      css`
        position: relative;
        padding: 1px 18px 17px;
        margin: 0 -20px;
        border-bottom: 2px solid #eee;
        margin-bottom: 20px;
      `
    )}
  />
));

export const Button = React.forwardRef(
  ({ className, active, reversed, ...props }, ref) => (
    <span
      {...props}
      ref={ref}
      className={cx(
        className,
        css`
          cursor: pointer;
          color: ${reversed
            ? active
              ? 'white'
              : '#aaa'
            : active
            ? 'black'
            : '#ccc'};
        `
      )}
    />
  )
);

export const Icon = React.forwardRef(({ className, ...props }, ref) => (
  <span
    {...props}
    ref={ref}
    className={cx(
      css`
        font-size: 18px;
        vertical-align: text-bottom;
      `
    )}
  />
));

export default PlaintextEditor;
