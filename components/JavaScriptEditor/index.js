import SyntaxHighlighter from 'react-syntax-highlighter';
import { docco } from 'react-syntax-highlighter/dist/esm/styles/hljs';
import css from './style.css';
const JavaScriptEditor = file => {
  const [text, setText] = useState([
    {
      type: 'paragraph',
      children: [{ text: '' }]
    }
  ]);

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
    <div className={css.editor}>
      <SyntaxHighlighter language="javascript" style={docco}>
        {text}
      </SyntaxHighlighter>
    </div>
  );
};

export default JavaScriptEditor;
