// src/components/LeftDrawer.js
import React from 'react';
import DesignOptions from './DesignOptions';
import TextFields    from './TextFields';
import PDFExport     from './PDFExport';
import ImageManager  from './ImageManager';

export default function LeftDrawer({
                                       designOptions,
                                       selectedDesign,
                                       handleDesignSelect,
                                       handleGraniteSelect,
                                       handleTileScaleChange,

                                       texts,
                                       addTextField,
                                       handleTextFieldChange,
                                       handleRemoveText,

                                       handleExport,

                                       images,
                                       cropping,
                                       handleImageUpload,
                                       handleRemoveImage,
                                       handleStartCrop,
                                       handleApplyCrop,
                                       handleCancelCrop,
                                       handleImageScaleChange
                                   }) {
    return (
        <div style={{
            position: 'absolute',
            top: 0,
            left: 0,
            width: 300,
            height: '100vh',
            background: '#f0f0f0',
            padding: 10,
            overflowY: 'auto',
            zIndex: 10
        }}>
            <DesignOptions
                designOptions={designOptions}
                selectedDesign={selectedDesign}
                onDesignChange={handleDesignSelect}
                onGraniteChange={handleGraniteSelect}
                onTileScaleChange={handleTileScaleChange}
            />

            <TextFields
                texts={texts}
                addTextField={addTextField}
                onTextChange={handleTextFieldChange}
                onTextRemove={handleRemoveText}
            />

            <PDFExport onExport={handleExport} />

            <ImageManager
                images={images}
                cropping={cropping}
                onUpload={handleImageUpload}
                onRemoveImage={handleRemoveImage}
                onStartCrop={handleStartCrop}
                onApplyCrop={handleApplyCrop}
                onCancelCrop={handleCancelCrop}
                onScaleChange={handleImageScaleChange}
            />
        </div>
    );
}
