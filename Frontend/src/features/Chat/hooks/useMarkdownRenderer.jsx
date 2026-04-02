import { useMemo } from 'react';
import ReactMarkdown from 'react-markdown';
import hljs from 'highlight.js';
import 'highlight.js/styles/atom-one-dark.css';

export function useMarkdownRenderer(content) {
  return useMemo(() => {
    if (!content || typeof content !== 'string') {
      return content;
    }

    return (
  <div className="markdown-rendered">
    <ReactMarkdown 
      components={{
        code: ({ inline, className, children }) => {
          const match = /language-(\w+)/.exec(className || '');
          const language = match ? match[1] : 'text';

          if (inline) {
            return (
              <code style={{
                backgroundColor: 'var(--secondary-color)',
                color: 'var(--custom-primary-color)',
                padding: '2px 6px',
                borderRadius: '4px',
                fontSize: '0.875em',
                fontFamily: 'monospace'
              }}>
                {children}
              </code>
            );
          }

          const highlightedCode = hljs.highlight(
            String(children).replace(/\n$/, ''),
            { language, ignoreIllegals: true }
          ).value;

          return (
            <div style={{
              marginTop: '12px',
              marginBottom: '12px',
              borderRadius: '8px',
              overflow: 'hidden',
              backgroundColor: '#000',
              border: '1px solid white'
            }}>
              <div style={{
                backgroundColor: 'var(--secondary-color)',
                color: 'var(--text-primary)',
                padding: '8px 16px',
                fontSize: '0.75em',
                fontFamily: 'monospace',
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center'
              }}>
                <span>{language}</span>
              </div>
              <pre style={{
                padding: '16px',
                overflowX: 'auto',
                margin: 0
              }}>
                <code
                  dangerouslySetInnerHTML={{ __html: highlightedCode }}
                  style={{
                    fontSize: '0.875em',
                    fontFamily: 'monospace'
                  }}
                />
              </pre>
            </div>
          );
        }
      }}
    >
      {content}
    </ReactMarkdown>
  </div>
);
  }, [content]);
}
