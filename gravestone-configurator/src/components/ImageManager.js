// src/components/ImageManager.js
import React from 'react';

export default function ImageManager({
                                         images,
                                         cropping,
                                         onUpload,
                                         onRemoveImage,
                                         onStartCrop,
                                         onApplyCrop,
                                         onCancelCrop,
                                         onScaleChange
                                     }) {
    return (
        <div style={{ marginBottom: 20 }}>
            <h3>Images</h3>
            <input type="file" accept="image/*" onChange={onUpload} />
            {images.map(img => (
                <div key={img.id} style={{ border: '1px solid #ddd', padding: 5, margin: '8px 0' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                        <span style={{ flex: 1, overflow: 'hidden', textOverflow: 'ellipsis' }}>
                            {img.name}
                        </span>
                        <button onClick={() => onRemoveImage(img.id)}>×</button>
                    </div>
                    <div style={{ marginTop: 6, display: 'flex', gap: 4 }}>
                        <button onClick={() => onStartCrop(img.id, 'oval')}>Crop Oval</button>
                        <button onClick={() => onStartCrop(img.id, 'roundrect')}>Crop Rect</button>
                        {cropping.id === img.id && (
                            <>
                                <button onClick={onApplyCrop}>Apply</button>
                                <button onClick={onCancelCrop}>Cancel</button>
                            </>
                        )}
                    </div>
                    {img.clipWidth && (
                        <div style={{ marginTop: 6 }}>
                            <label>Size:</label>
                            <input
                                type="range"
                                min="0.5"
                                max="3"
                                step="0.01"
                                value={img.scale}
                                onChange={e => onScaleChange(img.id, Number(e.target.value))}
                            />
                            <span>{Math.round(img.scale * 100)}%</span>
                        </div>
                    )}
                </div>
            ))}
        </div>
    );
}
