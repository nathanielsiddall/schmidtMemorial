// src/pages/DesignPage.js
import React, { useRef } from 'react';
import DesignCanvas from '../components/DesignCanvas';
import LeftDrawer from '../components/LeftDrawer';
import useDesignOptions from '../hooks/useDesignOptions';
import useTextFields from '../hooks/useTextFields';
import useImageManager from '../hooks/useImageManager';
import usePDFExport from '../hooks/usePDFExport';

export default function DesignPage() {
    // ref for the SVG path node
    const svgRef = useRef();
    // get design + svg state & setters
    const {
        designOptions,
        selectedDesign,
        graniteImg,
        svgScale,
        svgX,
        svgY,
        setSvgScale,
        setSvgX,
        setSvgY,
        handleDesignSelect,
        handleGraniteSelect,
        handleTileScaleChange
    } = useDesignOptions();

    // text fields (pass svgRef + transforms so new text centers correctly)
    const {
        texts,
        addTextField,
        handleTextFieldChange,
        handleRemoveText,
        handleTextDragEnd,
        handleTextTransformEnd,
        handleTextDblClick,
        selectedTextNode,
        textTransformerRef
    } = useTextFields(svgRef, svgScale, svgX, svgY);

    // image manager
    const {
        images,
        cropping,
        cropRect,
        onUpload,
        onDragEnd,
        onRemove,
        onScaleChange,
        onStartCrop,
        onCropChange,
        onApplyCrop,
        onCancelCrop,
        cropTransformerRef,
        cropRectRef
    } = useImageManager();

    // PDF export (gets stageRef)
    const { stageRef, onExport } = usePDFExport(textTransformerRef, React.useRef());

    return (
        <>
            <LeftDrawer
                designOptions={designOptions}
                selectedDesign={selectedDesign}
                handleDesignSelect={handleDesignSelect}
                handleGraniteSelect={handleGraniteSelect}
                handleTileScaleChange={handleTileScaleChange}

                texts={texts}
                addTextField={addTextField}
                handleTextFieldChange={handleTextFieldChange}
                handleRemoveText={handleRemoveText}

                handleExport={onExport}

                images={images}
                cropping={cropping}
                handleImageUpload={onUpload}
                handleRemoveImage={onRemove}
                handleStartCrop={onStartCrop}
                handleApplyCrop={onApplyCrop}
                handleCancelCrop={onCancelCrop}
                handleImageScaleChange={onScaleChange}
            />

            <DesignCanvas
                svgRef={svgRef}
                stageRef={stageRef}
                setSvgScale={setSvgScale}
                setSvgX={setSvgX}
                setSvgY={setSvgY}

                selectedDesign={selectedDesign}
                graniteImg={graniteImg}
                svgScale={svgScale}
                svgX={svgX}
                svgY={svgY}

                texts={texts}
                images={images}
                cropping={cropping}
                cropRect={cropRect}

                handleTextDragEnd={handleTextDragEnd}
                handleTextTransformEnd={handleTextTransformEnd}
                handleTextDblClick={handleTextDblClick}

                handleImageDragEnd={onDragEnd}

                onCropChange={onCropChange}
                cropTransformerRef={cropTransformerRef}
                cropRectRef={cropRectRef}

                selectedTextNode={selectedTextNode}
                textTransformerRef={textTransformerRef}
            />
        </>
    );
}
