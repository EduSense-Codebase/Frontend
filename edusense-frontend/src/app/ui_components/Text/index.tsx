import React from 'react';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import './Text.scss';

interface TextProps {
    content: string;
}

const Text: React.FC<TextProps> = ({ content }) => {
    return (
        <div className="text">
            <ReactMarkdown remarkPlugins={[remarkGfm]}>{content}</ReactMarkdown>
        </div>
    );
};

export default Text;
