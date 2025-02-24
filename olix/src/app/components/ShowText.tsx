"use client"
import React from "react";
import { convertFromRaw, ContentState, ContentBlock } from "draft-js";

type ReadOnlyRichTextProps = {
    rawContent: string | ContentState;
};

const ReadOnlyRichText: React.FC<ReadOnlyRichTextProps> = ({ rawContent }) => {
    // Parsowanie rawContent
    const parsedContent =
        typeof rawContent === "string" ? convertFromRaw(JSON.parse(rawContent)) : rawContent;

    // Funkcja pomocnicza do renderowania stylów inline
    const renderInlineStyles = (text: string, block: ContentBlock) => {
        let styledText = "";
       // let lastIndex = 0;

        // Iterowanie przez każdy znak w bloku i sprawdzanie stylów
        for (let i = 0; i < text.length; i++) {
            const inlineStyles = block.getInlineStyleAt(i);
            let styledPart = text[i];

            // Zastosowanie pogrubienia
            if (inlineStyles.has("BOLD")) {
                styledPart = `<b>${styledPart}</b>`;
            }
            // Zastosowanie kursywy
            if (inlineStyles.has("ITALIC")) {
                styledPart = `<i>${styledPart}</i>`;
            }
            // Zastosowanie podkreślenia
            if (inlineStyles.has("UNDERLINE")) {
                styledPart = `<u>${styledPart}</u>`;
            }
            // Zastosowanie przekreślenia
            if (inlineStyles.has("STRIKETHROUGH")) {
                styledPart = `<s>${styledPart}</s>`;
            }

            // Dodajemy przetworzony fragment tekstu do wyniku
            styledText += styledPart;
        }

        return styledText;
    };

    // Funkcja renderująca blok
    const renderBlock = (block: ContentBlock) => {
        const blockText = block.getText();
        const blockKey = block.getKey();

        // Renderowanie stylów inline w bloku
        const styledText = renderInlineStyles(blockText, block);

        // Renderowanie listy numerowanej
        if (block.getType() === "ordered-list-item") {
            return (
                <li key={blockKey} style={{ listStyleType: "decimal", marginLeft: "20px" }}>
                    <span dangerouslySetInnerHTML={{ __html: styledText }} />
                </li>
            );
        }

        // Renderowanie listy od kropek
        if (block.getType() === "unordered-list-item") {
            return (
                <li key={blockKey} style={{ listStyleType: "disc", marginLeft: "20px" }}>
                    <span dangerouslySetInnerHTML={{ __html: styledText }} />
                </li>
            );
        }

        // Renderowanie zwykłego paragrafu
        return (
            <p key={blockKey}>
                <span dangerouslySetInnerHTML={{ __html: styledText }} />
            </p>
        );
    };

    return (
        <div className="mt-1 text-gray-700">
            <div>
                {parsedContent.getBlocksAsArray().map((block: ContentBlock) => renderBlock(block))}
            </div>
        </div>
    );
};

export default ReadOnlyRichText;
