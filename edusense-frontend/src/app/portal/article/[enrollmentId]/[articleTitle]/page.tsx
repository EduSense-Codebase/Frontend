'use client';
import { useState, useEffect } from 'react';
import { AI_ENDPOINT, API_PREFIX } from "../../../../global";
import { IArticleResponse  } from '../../../../typedef';
import { httpGet, httpPost } from '../../../../utils';
import { useParams } from 'next/navigation';
import { useCustomProp } from '@/app/portal/layout';

import ReactMarkdown from "react-markdown"
import rehypeRaw from "rehype-raw"; 

interface ILatexToSvgResponse {
    svg: string
}


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
    const enrollmentId = params.enrollmentId as string;
    const articleTitle = params.articleTitle as string;

    const [article, setArticle] = useState<string>("");

    const layoutProps = useCustomProp();
    const pageContexts = "This page is an article designed to teach the student about a particular topic"

    useEffect(() => {
        let queryParams = {
            section: "generate_ai_content"
        }

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
            const tikzBlocks = [...response.data.data.article.matchAll(/\\begin\{tikzpicture\}[\s\S]*?\\end\{tikzpicture\}/g)];

            const svgPromises = tikzBlocks.map((block, i) => {
                let latex = block[0];
                const fullLatexDocument = `
                    \\documentclass{standalone}
                    \\usepackage{tikz}
                    \\begin{document}
                    ${latex} 
                    \\end{document}
                    `;
                const API_URL = API_PREFIX + AI_ENDPOINT;

                let queryParams = {
                    section: "latex_to_svg",
                    latex_source: fullLatexDocument 
                }

                const requestResponse = httpGet<ILatexToSvgResponse>(API_URL, queryParams);
                return requestResponse;
            })
            let articleProcessed = response.data.data.article;
            Promise.all(svgPromises).then((svgResponses) => {

                tikzBlocks.forEach((block, i) => {
                    const svgString = svgResponses[i].data.svg;

                    const imgTag = `<div>${svgString}</div>`

                    console.log(imgTag);

                    articleProcessed = articleProcessed.replace(block[0], imgTag);
                })
            })

            setArticle(articleProcessed);

            // layoutProps.setContext.setPageContext(response.data.data.article);
            // layoutProps.setEnrollmentId(parseInt(enrollmentId));
            layoutProps.setEnrollmentId(parseInt(enrollmentId))
            layoutProps.setContext(prev => ({
                ...prev,
                pageContext: pageContexts,
                article: response.data.data.article,
            }));
        })
    }, [])

    const renderArticle = () => {
        return (
            <div className="relative w-full flex flex-col px-4 text-black">
                <MarkdownViewer content={article} />
            </div>
        )
    }

    return (
        <>
            <div className="w-full h-full flex flex-wrap justify-start gap-6 mb-10">
                {renderArticle()}
            </div>
        </>
    );
}