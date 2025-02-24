import React, { useState, useEffect } from 'react';
import {
    Editor,
    EditorState,
    RichUtils,
    convertToRaw,
    convertFromRaw,
} from 'draft-js';
import 'draft-js/dist/Draft.css';
import { FaBold, FaItalic, FaUnderline, FaStrikethrough, FaUndo, FaRedo, FaListOl, FaListUl } from 'react-icons/fa';

interface RichTextEditorProps {
    initialContent?: string;
    onContentChange: (content: string) => void;
}

const RichTextEditor: React.FC<RichTextEditorProps> = ({ initialContent, onContentChange }) => {
    // Funkcja do parsowania wstępnej zawartości
    const parseContent = (content: string | undefined): EditorState => {
        if (!content) return EditorState.createEmpty();

        try {
            const parsed = JSON.parse(content);
            if (!parsed.blocks || !parsed.entityMap) {
                console.error("Invalid content format, missing 'blocks' or 'entityMap'");
                return EditorState.createEmpty();
            }
            return EditorState.createWithContent(convertFromRaw(parsed));
        } catch (error) {
            console.error("Error parsing content:", error);
            return EditorState.createEmpty();
        }
    };

    const [editorState, setEditorState] = useState<EditorState>(EditorState.createEmpty());
    const [isHydrated, setIsHydrated] = useState(false);

    const [activeStyles, setActiveStyles] = useState<Set<string>>(new Set());

    useEffect(() => {
        if (initialContent) {
            setEditorState(parseContent(initialContent));
        }
        setIsHydrated(true);
    }, [initialContent]);

    const handleEditorChange = (newState: EditorState) => {
        setEditorState(newState);
        const contentState = newState.getCurrentContent();
        const rawContent = JSON.stringify(convertToRaw(contentState));
        onContentChange(rawContent);
    };

    const handleUndo = () => setEditorState(EditorState.undo(editorState));
    const handleRedo = () => setEditorState(EditorState.redo(editorState));

    const toggleInlineStyle = (style: string) => {
        const newState = RichUtils.toggleInlineStyle(editorState, style);
        setEditorState(newState);
        handleEditorChange(newState);

        // Uaktualniamy aktywne style
        const updatedStyles = new Set(activeStyles);
        if (updatedStyles.has(style)) {
            updatedStyles.delete(style);
        } else {
            updatedStyles.add(style);
        }
        setActiveStyles(updatedStyles);
    };

    const toggleBlockType = (blockType: string) => {
        const newState = RichUtils.toggleBlockType(editorState, blockType);
        setEditorState(newState);
        handleEditorChange(newState);
    };

    const isActive = (style: string) => activeStyles.has(style);

    const buttonStyle = (active: boolean) => ({
        padding: '4px 8px',
        backgroundColor: active ? '#1d4ed8' : '#2563eb',
        color: 'white',
        border: 'none',
        borderRadius: '4px',
        cursor: 'pointer',
        fontWeight: 'bold',
        fontSize: '14px',
        transition: 'background-color 0.2s',
    });

    if (!isHydrated) {
        return null;
    }

    return (
        <div style={{ maxWidth: '600px', margin: 'auto' }}>
            {/* 🔳 Pasek narzędzi */}
            <div style={{ marginBottom: '10px', display: 'flex', gap: '5px', flexWrap: 'wrap' }}>
                <button
                    type="button"
                    style={buttonStyle(isActive('BOLD'))}
                    onClick={() => toggleInlineStyle('BOLD')}
                >
                    <FaBold />
                </button>
                <button
                    type="button"
                    style={buttonStyle(isActive('ITALIC'))}
                    onClick={() => toggleInlineStyle('ITALIC')}
                >
                    <FaItalic />
                </button>
                <button
                    type="button"
                    style={buttonStyle(isActive('UNDERLINE'))}
                    onClick={() => toggleInlineStyle('UNDERLINE')}
                >
                    <FaUnderline />
                </button>
                <button
                    type="button"
                    style={buttonStyle(isActive('STRIKETHROUGH'))}
                    onClick={() => toggleInlineStyle('STRIKETHROUGH')}
                >
                    <FaStrikethrough />
                </button>
                <button
                    type="button"
                    style={buttonStyle(isActive('ordered-list-item'))}
                    onClick={() => toggleBlockType('ordered-list-item')}
                >
                    <FaListOl />
                </button>
                <button
                    type="button"
                    style={buttonStyle(isActive('unordered-list-item'))}
                    onClick={() => toggleBlockType('unordered-list-item')}
                >
                    <FaListUl />
                </button>
                <button
                    type="button"
                    style={buttonStyle(false)}
                    onClick={handleUndo}
                >
                    <FaUndo />
                </button>
                <button
                    type="button"
                    style={buttonStyle(false)}
                    onClick={handleRedo}
                >
                    <FaRedo />
                </button>
            </div>

            {/* Edytor */}
            <div className="w-full mt-1 p-3 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 text-gray-600">
                <Editor editorState={editorState} onChange={handleEditorChange} placeholder="Wprowadź opis..." />
            </div>
        </div>
    );
};

export default RichTextEditor;
