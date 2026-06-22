import Link from 'next/link';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import rehypeRaw from 'rehype-raw';
import remarkMath from 'remark-math';
import rehypeKatex from 'rehype-katex';
import { autoLinkContent } from '@/lib/contentProcessor';

/**
 * Renders tool article content using ReactMarkdown (supports both Markdown and HTML).
 * Styled consistently with the blog article pages.
 */
export default function ToolArticleContent({ content, glossary = [], currentPath = '' }) {
    if (!content) return null;

    const processedContent = autoLinkContent(content, glossary, currentPath);

    return (
        <article className="prose prose-zinc prose-sm md:prose-base max-w-none text-zinc-900">
            <div className="text-zinc-600 leading-relaxed font-normal">
                <ReactMarkdown
                    remarkPlugins={[remarkGfm, remarkMath]}
                    rehypePlugins={[rehypeRaw, rehypeKatex]}
                    components={{
                        a: ({ node, ...props }) => {
                            const isInternal = props.href?.startsWith('/') || props.href?.includes('na-coaching.com');
                            if (isInternal) {
                                return <Link href={props.href} className="text-[#FF6B00] font-semibold hover:underline" {...props} />;
                            }
                            return <a target="_blank" rel="noopener noreferrer" className="text-[#FF6B00] font-semibold hover:underline" {...props} />;
                        },
                        h1: ({ node, ...props }) => <h2 className="text-2xl md:text-3xl font-bold mt-12 mb-6 text-zinc-950 border-l-4 border-[#FF6B00] pl-4" {...props} />,
                        h2: ({ node, ...props }) => <h2 className="text-xl md:text-2xl font-bold mt-10 mb-5 text-zinc-900 border-b border-zinc-100 pb-2" {...props} />,
                        h3: ({ node, ...props }) => <h3 className="text-lg md:text-xl font-bold mt-8 mb-4 text-zinc-800" {...props} />,
                        h4: ({ node, ...props }) => <h4 className="text-base font-bold mt-6 mb-3 text-zinc-800" {...props} />,
                        ul: ({ node, ...props }) => <ul className="list-disc pl-6 mb-6 space-y-2 text-zinc-600" {...props} />,
                        li: ({ node, ...props }) => <li className="pl-1" {...props} />,
                        strong: ({ node, ...props }) => <strong className="font-semibold text-zinc-950" {...props} />,
                        p: ({ node, ...props }) => <p className="mb-5 leading-relaxed" {...props} />,
                        table: ({ node, ...props }) => (
                            <div className="overflow-x-auto my-8 border border-zinc-100 rounded-lg shadow-sm text-sm">
                                <table className="w-full border-collapse" {...props} />
                            </div>
                        ),
                        thead: ({ node, ...props }) => <thead className="bg-zinc-50/50 border-b border-zinc-200" {...props} />,
                        th: ({ node, ...props }) => <th className="text-left py-3 px-4 font-bold text-xs text-zinc-500 tracking-wider uppercase" {...props} />,
                        td: ({ node, ...props }) => <td className="py-3 px-4 border-b border-zinc-50" {...props} />,
                    }}
                >
                    {processedContent}
                </ReactMarkdown>
            </div>
        </article>
    );
}
