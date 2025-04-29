// src/pages/DesignPage.js
import React from 'react';
import DesignCanvas   from '../components/DesignCanvas';
import LeftDrawer     from '../components/LeftDrawer';
import useDesignOptions from '../hooks/useDesignOptions';
import useTextFields    from '../hooks/useTextFields';
import useImageManager  from '../hooks/useImageManager';
import usePDFExport     from '../hooks/usePDFExport';

export default function DesignPage() {
    // design + svg
    const {
        designOptions,
        selectedDesign,
        graniteImg,
        svgScale, svgX, svgY,
        handleDesignSelect,
        handleGraniteSelect,
        handleTileScaleChange,
        setSvgScale, setSvgX, setSvgY
    } = useDesignOptions();

    // text fields
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
    } = useTextFields(/* pass */ React.useRef(), svgScale, svgX, svgY);

    // images + crop
    const {
        images, cropping, cropRect,
        onUpload, onDragEnd, onRemove, onScaleChange,
        onStartCrop, onCropChange, onApplyCrop, onCancelCrop,
        cropTransformerRef, cropRectRef
    } = useImageManager();

    // PDF export
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

                images={images}
                cropping={cropping}
                handleImageUpload={onUpload}
                handleRemoveImage={onRemove}
                handleStartCrop={onStartCrop}
                handleApplyCrop={onApplyCrop}
                handleCancelCrop={onCancelCrop}
                handleImageScaleChange={onScaleChange}

                handleExport={onExport}
            />

            <DesignCanvas
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
                stageRef={stageRef}
            />
        </>
    );
}
