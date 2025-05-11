'use client';
import { useState, useEffect } from 'react';
import { AI_ENDPOINT, API_PREFIX } from "../../../../global";
import { IArticle, IArticleResponse  } from '../../../../typedef';
import { httpGet, httpPost } from '../../../../utils';
import { useParams } from 'next/navigation';
import { useCustomProp } from '@/app/portal/layout';

import ReactMarkdown from "react-markdown"
import rehypeRaw from "rehype-raw"; 

const MarkdownViewer = ({ content }: { content: string }) => {
  return (
    <div className="prose max-w-none">
      <ReactMarkdown
        rehypePlugins={[rehypeRaw]}  // Allow raw HTML (SVG)
        components={{
          code({ node, className, children, ...props }) {
            // Check if it's an SVG block
            if (className && className.includes('language-svg')) {
              // Render the SVG content directly
              const svgContent = children?.toString();
              return <div dangerouslySetInnerHTML={{ __html: svgContent || "" }} />;
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

    const layoutProps = useCustomProp();
    const pageContexts = "This page is an article designed to teach the student about a particular topic"

    const getArticleStr = (article: IArticle) => {
        let return_string = "";

        return_string += `Heading: ${article.article_title}\n`

        article.sections.map((currSection, index) => {
            return_string += `Section: ${currSection}\n`
            return_string += `${article.section_content[index]}\n`
        })

        return return_string;
    }

    useEffect(() => {
        let queryParams = {
            section: "generate_ai_content"
        }

        console.log(articleTitle);

        let prompt_parameters = {
            "title": articleTitle
        }

        let formData = {
            enrollment_id: enrollmentId,
            prompt_type: "article",
            prompt_parameters: JSON.stringify(prompt_parameters)
        }
        
        const API_URL = API_PREFIX + AI_ENDPOINT;

        const requestResponse = httpPost<IArticleResponse>(API_URL, formData, queryParams)

        requestResponse.then((response) => {
            console.log(response.data);
            setArticle(response.data.data);

            layoutProps.setEnrollmentId(parseInt(enrollmentId))
            layoutProps.setContext(prev => ({
                ...prev,
                pageContext: pageContexts,
                article: getArticleStr(response.data.data),
            }));
        })
    }, [])

    useEffect(() => {
        const handleSection = () => {
            const selection = window.getSelection();
            const text = selection?.toString();
            if (text) {
                layoutProps.setUserSelection(text);
                console.log("User Selected: ", text);
            }
        }

        document.addEventListener("selectionchange", handleSection);
        document.addEventListener("mouseup", handleSection);
        document.addEventListener("touchend", handleSection);

        return () => {
            document.removeEventListener("selectionchange", handleSection);
            document.removeEventListener("mouseup", handleSection);
            document.removeEventListener("touchend", handleSection);
        }
    }, [])

    const renderArticle = () => {
    if (article != undefined) {
        return (
            <div className="flex min-h-screen bg-white text-gray-900">
            <aside className="hidden lg:block w-64 p-6 sticky top-0 h-screen border-r overflow-y-auto">
                <h2 className="text-lg font-semibold mb-4">Table of Contents</h2>
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

            <main className="flex-1 px-6 py-10 max-w-3xl mx-auto">
                <h1 className="text-4xl font-bold mb-6">{article.article_title}</h1>
                {article.sections.map((title, idx) => (
                <section key={idx} id={`section-${idx}`} className="mb-12 scroll-mt-24">
                    <h2 className="text-2xl font-semibold mb-3">{title}</h2>
                    <div className="prose prose-lg max-w-none">
                    <MarkdownViewer content={article.section_content[idx]} />
                    </div>
                </section>
                ))}
            </main>
            </div>
        )
    }
    
    }

    return (
        <>
            <div className="w-full h-full flex flex-wrap justify-start gap-6 mb-10">
                {renderArticle()}
            </div>
        </>
    );
}