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
    linkDialogPlugin,
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
                        <div className="edit-btns">
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
                                toolbarPlugin({
                                    toolbarContents: () => (
                                        <>
                                            <UndoRedo />
                                            <BoldItalicUnderlineToggles />
                                            <ListsToggle />
                                            <BlockTypeSelect />
                                            <InsertTable />
                                            <CreateLink />
                                        </>
                                    ),
                                }),
                                markdownShortcutPlugin(),
                                codeBlockPlugin(),
                                linkPlugin(),
                                linkDialogPlugin(),
                                listsPlugin(),
                                headingsPlugin(),
                                quotePlugin(),
                                tablePlugin(),
                                imagePlugin(),
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
                            ></Button>
                        </div>
                    )}
                    <div className="text">
                        <ReactMarkdown remarkPlugins={[remarkGfm]}>{savedContent}</ReactMarkdown>
                    </div>
                </div>
            )}
        </>
    );
};

export default Text;
