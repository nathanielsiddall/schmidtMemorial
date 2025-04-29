// src/hooks/usePDFExport.js
import { useRef } from 'react';

export default function usePDFExport(textTransformerRef, selectedTextNodeRef) {
    const stageRef = useRef();

    const handleExport = () => {
        const stage = stageRef.current;
        if (!stage) return;

        // detach selector
        if (textTransformerRef.current) {
            textTransformerRef.current.detach();
            textTransformerRef.current.getLayer().batchDraw();
        }

        // grab canvas
        const dataURL = stage.toDataURL({ pixelRatio: 2 });
        const w = stage.width();
        const h = stage.height();
        const pdf = new window.jsPDF('l', 'pt', [w, h]);
        pdf.addImage(dataURL, 'PNG', 0, 0, w, h);
        pdf.save('canvas.pdf');

        // re-attach selector
        if (selectedTextNodeRef.current && textTransformerRef.current) {
            textTransformerRef.current
                .nodes([selectedTextNodeRef.current])
                .getLayer()
                .batchDraw();
        }
    };

    return { stageRef, onExport: handleExport };
}
