import React from 'react';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import './Text.scss';
import {
    MDXEditor,
    toolbarPlugin,
    markdownShortcutPlugin,
    codeBlockPlugin,
    linkPlugin,
    linkDialogPlugin,
    listsPlugin,
    headingsPlugin,
    quotePlugin,
    tablePlugin,
    imagePlugin,
    CreateLink,
    UndoRedo,
    BoldItalicUnderlineToggles,
    ListsToggle,
    BlockTypeSelect,
    InsertTable,
    thematicBreakPlugin,
    InsertImage,
    InsertCodeBlock,
    InsertThematicBreak,
    StrikeThroughSupSubToggles,
    CodeToggle,
    DiffSourceToggleWrapper,
    useCodeBlockEditorContext,
} from '@mdxeditor/editor';
import '@mdxeditor/editor/style.css';
import { useState } from 'react';
import Button from '../Button';

interface TextProps {
    content: string;
    allowEdit: boolean;
    onSave: (newContent: string) => void;
}

const Text: React.FC<TextProps> = ({ content, allowEdit, onSave: passedOnSave }) => {
    const [editMode, setEditMode] = useState(false);
    const [editedContent, setEditedContent] = useState(content);
    const [savedContent, setSavedContent] = useState(content);

    const onSave = () => {
        setSavedContent(editedContent);
        setEditMode(false);
        passedOnSave?.(editedContent);
    };

    const onEdit = () => {
        setEditedContent(savedContent);
        setEditMode(true);
    };

    return (
        <>
            {editMode ? (
                <div className="text-component">
                    {allowEdit && (
                        <div className={`edit-btns edit-btns--${editMode}`}>
                            <Button
                                onClick={onSave}
                                variant="primary"
                                displayName="Save"
                                icon="/save.svg"
                            />
                            <Button
                                onClick={() => setEditMode(false)}
                                variant="secondary"
                                displayName="Cancel"
                            />
                        </div>
                    )}
                    <div className="text" id="text-editor">
                        <MDXEditor
                            className="text-editor-content"
                            markdown={editedContent}
                            onChange={(newMarkdown: string) => setEditedContent(newMarkdown)}
                            plugins={[
                                markdownShortcutPlugin(),
                                headingsPlugin(),
                                listsPlugin(),
                                quotePlugin(),
                                thematicBreakPlugin(),
                                linkPlugin(),
                                linkDialogPlugin(),
                                imagePlugin(),
                                tablePlugin(),
                                codeBlockPlugin({
                                    codeBlockEditorDescriptors: [
                                        {
                                            match: () => true,
                                            priority: 0,
                                            Editor: (props) => {
                                                const cb = useCodeBlockEditorContext();

                                                return (
                                                    <div
                                                        onKeyDown={(e) =>
                                                            e.nativeEvent.stopImmediatePropagation()
                                                        }
                                                        className="code-block"
                                                    >
                                                        <input
                                                            type="text"
                                                            value={props.language || ''}
                                                            onChange={(e) =>
                                                                cb.setLanguage(e.target.value)
                                                            }
                                                            placeholder="Language (optional)"
                                                            className="code-language-input"
                                                        />
                                                        <textarea
                                                            value={props.code || ''}
                                                            onChange={(e) =>
                                                                cb.setCode(e.target.value)
                                                            }
                                                            placeholder="Enter your code here..."
                                                            className="code-textarea"
                                                        />
                                                    </div>
                                                );
                                            },
                                        },
                                    ],
                                }),

                                toolbarPlugin({
                                    toolbarContents: () => (
                                        <DiffSourceToggleWrapper>
                                            <UndoRedo />
                                            <BoldItalicUnderlineToggles />
                                            <StrikeThroughSupSubToggles />
                                            <CodeToggle />
                                            <BlockTypeSelect />
                                            <ListsToggle />
                                            <CreateLink />
                                            <InsertTable />
                                            <InsertImage />
                                            <InsertCodeBlock />
                                            <InsertThematicBreak />
                                        </DiffSourceToggleWrapper>
                                    ),
                                }),
                            ]}
                        />
                    </div>
                </div>
            ) : (
                <div>
                    {allowEdit && (
                        <div className="edit-btns">
                            <Button
                                onClick={onEdit}
                                variant="primary"
                                displayName="Edit"
                                icon="/edit.svg"
                            />
                        </div>
                    )}
                    <div className="text">
                        <ReactMarkdown
                            remarkPlugins={[remarkGfm]}
                            components={{
                                code: ({ node, className, children, ...props }) => {
                                    const isCodeBlock =
                                        String(children).includes('\n') || className;

                                    return isCodeBlock ? (
                                        <pre>
                                            <code className={className} {...props}>
                                                {children}
                                            </code>
                                        </pre>
                                    ) : (
                                        <code className={className} {...props}>
                                            {children}
                                        </code>
                                    );
                                },
                            }}
                        >
                            {savedContent}
                        </ReactMarkdown>
                    </div>
                </div>
            )}
        </>
    );
};

export default Text;
