'use client';
import { useState, useEffect, useRef } from 'react';
import { AI_ENDPOINT, API_PREFIX } from '../../../../../../global';
import { IArticle, IArticleResponse } from '../../../../../../typedef';
import { httpPost, httpGet } from '../../../../../../utils';
import { useParams } from 'next/navigation';
import { useCustomProp } from '@/app/portal/layout';

import { Plugin } from 'unified';
import { visit } from 'unist-util-visit';
import { Literal, Parent } from 'unist';

import ReactMarkdown from 'react-markdown';
import rehypeRaw from 'rehype-raw';
import remarkGfm from 'remark-gfm';

export const runtime = 'edge';

const remarkHighlight: Plugin = () => {
    return (tree) => {
        visit(tree, 'text', (node: Literal, index: number, parent: Parent) => {
            const value: string = node.value as string;
            const regex = /==(.+?)==/g;
            let match;
            const newChildren = [];
            let lastIndex = 0;

            while ((match = regex.exec(value)) !== null) {
                const [fullMatch, innerText] = match;
                const start = match.index;
                const end = start + fullMatch.length;

                if (start > lastIndex) {
                    newChildren.push({
                        type: 'text',
                        value: value.slice(lastIndex, start),
                    });
                }

                newChildren.push({
                    type: 'element',
                    tagName: 'mark',
                    properties: {},
                    children: [{ type: 'text', value: innerText }],
                });

                lastIndex = end;
            }

            if (lastIndex < value.length) {
                newChildren.push({ type: 'text', value: value.slice(lastIndex) });
            }

            if (newChildren.length > 0) {
                parent.children.splice(index, 1, ...newChildren);
            }
        });
    };
};

const MarkdownViewer = ({ content }: { content: string }) => {
    return (
        <div className="prose max-w-none">
            <ReactMarkdown
                rehypePlugins={[rehypeRaw, remarkGfm, remarkHighlight]} // Allow raw HTML (SVG)
                components={{
                    code({ className, children }) {
                        // Check if it's an SVG block
                        if (className && className.includes('language-svg')) {
                            // Render the SVG content directly
                            const svgContent = children?.toString();
                            return <div dangerouslySetInnerHTML={{ __html: svgContent || '' }} />;
                        }
                        return (
                            <pre className={className}>
                                <code>{children}</code>
                            </pre>
                        );
                    },
                }}
            >
                {content}
            </ReactMarkdown>
        </div>
    );
};

export default function CourseRoadmap() {
    const params = useParams();
    const enrollmentId = decodeURIComponent(params.enrollmentId as string).trim();
    const articleTitle = decodeURIComponent(params.articleTitle as string).trim();

    const [article, setArticle] = useState<IArticle | undefined>(undefined);
    const articleRef = useRef<HTMLDivElement>(null);

    const layoutProps = useCustomProp();
    const pageContexts =
        'This page is an article designed to teach the student about a particular topic';

    const getArticleStr = (article: IArticle) => {
        let return_string = '';

        return_string += `Heading: ${article.article_title}\n`;

        article.sections.map((currSection, index) => {
            return_string += `Section: ${currSection}\n`;
            return_string += `${article.section_content[index]}\n`;
        });

        return return_string;
    };

    useEffect(() => {
        const cache_query_params = {
            section: 'retrieve_cache',
            enroll_id: enrollmentId,
            cache_request: articleTitle,
        };

        const API_URL = API_PREFIX + AI_ENDPOINT;
        httpGet<IArticleResponse>(API_URL, cache_query_params).then((response) => {
            if (response.data.data != null) {
                console.log(response.data);
                setArticle(response.data.data);

                layoutProps.setEnrollmentId(parseInt(enrollmentId));
                layoutProps.setContext((prev) => ({
                    ...prev,
                    pageContext: pageContexts,
                    article: getArticleStr(response.data.data),
                }));
            } else {
                const queryParams = {
                    section: 'generate_ai_content',
                };

                console.log(articleTitle);

                const prompt_parameters = {
                    title: articleTitle,
                };

                const formData = {
                    enrollment_id: enrollmentId,
                    prompt_type: 'article',
                    prompt_parameters: JSON.stringify(prompt_parameters),
                };

                const API_URL = API_PREFIX + AI_ENDPOINT;

                const requestResponse = httpPost<IArticleResponse>(API_URL, formData, queryParams);

                requestResponse.then((response) => {
                    console.log(response.data);
                    setArticle(response.data.data);

                    layoutProps.setEnrollmentId(parseInt(enrollmentId));
                    layoutProps.setContext((prev) => ({
                        ...prev,
                        pageContext: pageContexts,
                        article: getArticleStr(response.data.data),
                    }));

                    httpPost(
                        API_URL,
                        {
                            enroll_id: enrollmentId,
                            cache_request: articleTitle,
                            cache_content: JSON.stringify(response.data.data),
                        },
                        { section: 'set_cache_content' },
                    ).then((res) => {
                        console.log(res);
                    });
                });
            }
        });

        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    const onMouseUp = (e: React.MouseEvent<HTMLElement>, section_id: number) => {
        const selection = document.getSelection();
        if (!selection || selection.isCollapsed) return;

        const range = selection.getRangeAt(0);
        const container = articleRef.current;

        const startContainer = range.startContainer;

        const startOffset = range.startOffset;
        const endOffset = range.endOffset;

        if (startContainer.nodeType === Node.TEXT_NODE) {
            const textNode = startContainer as Text;
            const textContent = textNode.nodeValue || '';

            // Split the text at the startOffset and endOffset
            const beforeText = textContent.slice(0, startOffset);
            const selectedText = textContent.slice(startOffset, endOffset);
            console.log(`Selected Text: ${selectedText}`);
            const afterText = textContent.slice(endOffset);

            // Create a span element to highlight the selected text
            const highlightSpan = document.createElement('span');
            highlightSpan.style.backgroundColor = 'yellow'; // Highlight with yellow color
            highlightSpan.textContent = selectedText;

            // Get the parent element of the text node
            const parentElement = textNode.parentNode;
            console.log(`Parent Element: ${parentElement}`);

            if (parentElement) {
                // Replace the original text node with the beforeText, the highlighted span, and afterText
                parentElement.insertBefore(document.createTextNode(beforeText), textNode);
                parentElement.appendChild(highlightSpan);
                parentElement.appendChild(document.createTextNode(afterText));
                parentElement.removeChild(textNode); // Remove the original text node
            }

            layoutProps.setUserSelection(selectedText);
        }

        if (container && container.contains(range.commonAncestorContainer)) {
            const selectedText = selection.toString();
            console.log('Selected inside container:', selectedText);
            console.log('Section ID:', section_id);
            let new_section_text = article?.section_content[section_id];
            if (new_section_text != undefined && article != undefined) {
                new_section_text = new_section_text.replace(/==/g, '');
                const start = article.section_content[section_id].indexOf(selectedText);
                const end = start + selectedText.length;
                new_section_text =
                    new_section_text.slice(0, start) +
                    '==' +
                    new_section_text.slice(start, end) +
                    '==' +
                    new_section_text.slice(end);
            }
            /*
            setArticle((prevArticle) => {
                let newArticle = structuredClone(prevArticle);
                if (newArticle != undefined && new_section_text != undefined) {
                    newArticle.section_content[section_id] = new_section_text;
                }
                return newArticle;
            })
            */
        } else {
            console.log('Selection is outside of this component.');
        }
    };

    const renderArticle = () => {
        if (article != undefined) {
            return (
                <div className="flex min-h-screen bg-white text-gray-900">
                    <aside className="sticky top-0 hidden h-screen w-64 overflow-y-auto border-r p-6 lg:block">
                        <h2 className="mb-4 text-lg font-semibold">Table of Contents</h2>
                        <nav>
                            {article.sections.map((title, idx) => (
                                <a
                                    key={idx}
                                    href={`#section-${idx}`}
                                    className="block py-1 text-sm text-gray-700 hover:text-blue-600"
                                >
                                    {title}
                                </a>
                            ))}
                        </nav>
                    </aside>

                    <main className="mx-auto max-w-3xl flex-1 px-6 py-10">
                        <h1 className="mb-6 text-4xl font-bold">{article.article_title}</h1>
                        {article.sections.map((title, idx) => (
                            <section
                                key={idx}
                                id={`section-${idx}`}
                                className="mb-12 scroll-mt-24"
                                onMouseUp={(e) => onMouseUp(e, idx)}
                            >
                                <h2 className="mb-3 text-2xl font-semibold">{title}</h2>
                                <div className="prose prose-lg max-w-none">
                                    <MarkdownViewer content={article.section_content[idx]} />
                                </div>
                            </section>
                        ))}
                    </main>
                </div>
            );
        } else {
            return (
                <div className="flex h-screen w-full items-center justify-center">
                    <div className="h-16 w-16 animate-spin rounded-full border-7 border-gray-500 border-t-indigo-600" />
                </div>
            );
        }
    };

    return (
        <>
            <div
                className="mb-10 flex h-full w-full flex-wrap justify-start gap-6"
                ref={articleRef}
            >
                {renderArticle()}
            </div>
        </>
    );
}
