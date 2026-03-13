import Link from 'next/link';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import rehypeRaw from 'rehype-raw';
import { autoLinkContent } from '@/lib/contentProcessor';

/**
 * Renders tool article content using ReactMarkdown (supports both Markdown and HTML).
 * Styled consistently with the blog article pages.
 */
export default function ToolArticleContent({ content, glossary = [], currentPath = '' }) {
    if (!content) return null;

    const processedContent = autoLinkContent(content, glossary, currentPath);

    return (
        <article className="prose prose-zinc max-w-none text-zinc-900">
            <div className="text-zinc-800 leading-loose">
                <ReactMarkdown
                    remarkPlugins={[remarkGfm]}
                    rehypePlugins={[rehypeRaw]}
                    components={{
                        a: ({ node, ...props }) => {
                            const isInternal = props.href?.startsWith('/') || props.href?.includes('na-coaching.com');
                            if (isInternal) {
                                return <Link href={props.href} className="text-[#FF6B00] font-bold hover:underline" {...props} />;
                            }
                            return <a target="_blank" rel="noopener noreferrer" className="text-[#FF6B00] font-bold hover:underline" {...props} />;
                        },
                        h1: ({ node, ...props }) => <h2 className="text-3xl font-black uppercase mt-12 mb-6 text-[#FF6B00] border-l-8 border-[#FF6B00] pl-6 italic" {...props} />,
                        h2: ({ node, ...props }) => <h2 className="text-2xl font-black uppercase mt-12 mb-6 text-black border-b-2 border-zinc-100 pb-2" {...props} />,
                        h3: ({ node, ...props }) => <h3 className="text-xl font-black uppercase mt-8 mb-4 text-zinc-700 tracking-wider" {...props} />,
                        h4: ({ node, ...props }) => <h4 className="text-lg font-bold mt-6 mb-3 text-black" {...props} />,
                        ul: ({ node, ...props }) => <ul className="list-disc pl-6 mb-6 space-y-2" {...props} />,
                        li: ({ node, ...props }) => <li className="pl-2" {...props} />,
                        strong: ({ node, ...props }) => <strong className="font-black text-black" {...props} />,
                        p: ({ node, ...props }) => <p className="mb-4" {...props} />,
                    }}
                >
                    {processedContent}
                </ReactMarkdown>
            </div>
        </article>
    );
}
