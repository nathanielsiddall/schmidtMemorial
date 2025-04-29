// src/hooks/useTextFields.js
import { useState, useRef, useEffect } from 'react';

// counter outside hook so it persists across re-renders
let textIdCounter = 0;

export default function useTextFields(svgRef, svgScale, svgX, svgY) {
    const [texts, setTexts] = useState([]);
    const selectedTextNode = useRef(null);
    const textTransformerRef = useRef(null);

    const addTextField = () => {
        let newX = 50, newY = 50;
        if (svgRef.current && svgScale != null) {
            const rect = svgRef.current.getClientRect({ skipTransform: true });
            newX = svgX + (rect.width * svgScale) / 2;
            newY = svgY + (rect.height * svgScale) / 2;
        }
        const newTxt = {
            id: textIdCounter++,
            text: 'New Text',
            x: newX,
            y: newY,
            fontSize: 24,
            width: 150
        };
        setTexts(arr => [...arr, newTxt]);
    };

    const handleTextFieldChange = (id, field, value) => {
        setTexts(arr =>
            arr.map(t => (t.id === id ? { ...t, [field]: value } : t))
        );
    };

    const handleRemoveText = id =>
        setTexts(arr => arr.filter(t => t.id !== id));

    const handleTextDragEnd = (e, id) => {
        const { x, y } = e.target.position();
        handleTextFieldChange(id, 'x', x);
        handleTextFieldChange(id, 'y', y);
    };

    const handleTextTransformEnd = (e, id) => {
        const node = e.target;
        const scaleX = node.scaleX();
        const newW = Math.max(30, node.width() * scaleX);
        node.scaleX(1);
        handleTextFieldChange(id, 'width', newW);
    };

    const handleTextDblClick = (id, node) => {
        selectedTextNode.current = node;
    };

    // whenever selectedTextNode changes, re-attach transformer
    useEffect(() => {
        if (selectedTextNode.current && textTransformerRef.current) {
            textTransformerRef.current
                .nodes([selectedTextNode.current])
                .getLayer()
                .batchDraw();
        }
    });

    return {
        texts,
        addTextField,
        handleTextFieldChange,
        handleRemoveText,
        handleTextDragEnd,
        handleTextTransformEnd,
        handleTextDblClick,
        selectedTextNode: selectedTextNode.current,
        textTransformerRef
    };
}
