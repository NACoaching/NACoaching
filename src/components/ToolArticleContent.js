"use client";
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';

/**
 * Renders tool article content using ReactMarkdown (supports both Markdown and HTML).
 * Styled consistently with the blog article pages.
 */
export default function ToolArticleContent({ content }) {
    if (!content) return null;

    return (
        <article className="prose prose-zinc max-w-none text-zinc-900">
            <div className="text-zinc-800 leading-loose">
                <ReactMarkdown
                    remarkPlugins={[remarkGfm]}
                    components={{
                        h1: ({ node, ...props }) => <h1 className="text-3xl font-black uppercase mt-10 mb-6 text-[#FF6B00]" {...props} />,
                        h2: ({ node, ...props }) => <h2 className="text-2xl font-black uppercase mt-8 mb-4 text-[#FF6B00]" {...props} />,
                        h3: ({ node, ...props }) => <h3 className="text-xl font-bold mt-6 mb-3 text-black" {...props} />,
                        h4: ({ node, ...props }) => <h4 className="text-lg font-bold mt-4 mb-2 text-black" {...props} />,
                        ul: ({ node, ...props }) => <ul className="list-disc pl-6 mb-6 space-y-2" {...props} />,
                        li: ({ node, ...props }) => <li className="pl-2" {...props} />,
                        strong: ({ node, ...props }) => <strong className="font-black text-black" {...props} />,
                        p: ({ node, ...props }) => <p className="mb-4" {...props} />,
                    }}
                >
                    {content}
                </ReactMarkdown>
            </div>
        </article>
    );
}
