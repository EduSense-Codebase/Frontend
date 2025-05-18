// components/LatexRenderer.js
'use client';
import { AI_ENDPOINT, API_PREFIX } from '@/app/global';
import { httpGet } from '@/app/utils';
import { useEffect, useRef, useState } from 'react';

//import { parse, HtmlGenerator } from 'latex.js'
interface ILatexProps {
    latexString: string
}

interface ILatexToSvgResponse {
    svg: string
}

function LatexRenderer({ latexSource }: { latexSource: string }) {
    const [html, setHtml] = useState<string>('');

    useEffect(() => {
        const API_URL = API_PREFIX + AI_ENDPOINT;

        let queryParams = {
            section: "latex_to_svg",
            latex_source: latexSource
        }

        const requestResponse = httpGet<ILatexToSvgResponse>(API_URL, queryParams);
        requestResponse.then((response) => {
            setHtml(response.data.svg);
        })
    }, [latexSource])

    return <div className="prose max-w-none text-black" dangerouslySetInnerHTML={{ __html: html }} />;
}

export default function TestLatex() {
    const tikzTriangle = `
\\documentclass{standalone}
\\usepackage{tikz}

\\begin{document}

\\begin{tikzpicture}
  % Draw a circle with center at (0,0) and radius 2
  \\draw[thick, blue] (0,0) circle (2cm);

  % Draw center point
  \\filldraw[red] (0,0) circle (2pt);
  \\node[below left] at (0,0) {O};

  % Label radius
  \\draw[dashed] (0,0) -- (2,0);
  \\node[below] at (1,0) {r};
\\end{tikzpicture}

\\end{document}
`;
    return (
        <div className="w-full h-full flex flex-wrap justify-start gap-6 mb-10">
            <LatexRenderer latexSource={tikzTriangle} />
        </div>
    )
}