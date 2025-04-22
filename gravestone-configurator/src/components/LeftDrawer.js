// src/components/LeftDrawer.js
import React from 'react';

class LeftDrawer extends React.Component {
    render() {
        const {
            designOptions,
            selectedDesign,
            handleDesignSelect,
            handleGraniteSelect,
            handleTileScaleChange,
            addTextField,
            texts,
            handleTextFieldChange,
            handleRemoveText,
            handleExport,
            handleImageUpload,
            images,
            handleRemoveImage,
            cropping,
            handleStartCrop,
            handleApplyCrop,
            handleCancelCrop,
            handleImageScaleChange
        } = this.props;

        return (
            <div style={{
                position: 'absolute', top: 0, left: 0,
                width: 300, height: '100vh',
                background: '#f0f0f0', padding: 10,
                overflowY: 'auto', zIndex: 10
            }}>
                <h3>Design Options</h3>
                {designOptions && (
                    <div>
                        <label>Design: </label>
                        <select onChange={handleDesignSelect} value={selectedDesign?.id || ''}>
                            {designOptions.designs.map(d => (
                                <option key={d.id} value={d.id}>{d.id}</option>
                            ))}
                        </select>
                    </div>
                )}
                {selectedDesign?.graniteOptions && (
                    <div>
                        <label>Granite: </label>
                        <select onChange={handleGraniteSelect} value={selectedDesign.selectedGranite}>
                            {selectedDesign.graniteOptions.map(g => (
                                <option key={g} value={g}>{g}</option>
                            ))}
                        </select>
                    </div>
                )}
                {selectedDesign && typeof selectedDesign.tileScale !== 'undefined' && (
                    <div>
                        <label>Tile Scale: </label>
                        <input
                            type="range" min="0.1" max="3" step="0.1"
                            value={selectedDesign.tileScale}
                            onChange={handleTileScaleChange}
                        />
                        <span>{selectedDesign.tileScale}</span>
                    </div>
                )}

                <h3>Text Fields</h3>
                <button onClick={addTextField}>Add Text Field</button>
                {texts.map(txt => (
                    <div key={txt.id} style={{
                        border: '1px solid #ccc',
                        margin: '5px 0', padding: 5
                    }}>
                        <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                            <label>Content: </label>
                            <button onClick={() => handleRemoveText(txt.id)}>X</button>
                        </div>
                        <input
                            type="text"
                            value={txt.text}
                            onChange={e => handleTextFieldChange(txt.id, 'text', e.target.value)}
                        />
                        <div>
                            <label>Font Size: </label>
                            <input
                                type="range" min="10" max="100"
                                value={txt.fontSize}
                                onChange={e => handleTextFieldChange(txt.id, 'fontSize', Number(e.target.value))}
                            />
                            <span>{txt.fontSize}</span>
                        </div>
                    </div>
                ))}

                <h3>Images</h3>
                <input type="file" accept="image/*" onChange={handleImageUpload} />
                {images.map(img => (
                    <div key={img.id} style={{
                        border: '1px solid #ddd',
                        padding: 5,
                        margin: '5px 0'
                    }}>
                        <div style={{ display: 'flex', alignItems: 'center' }}>
              <span style={{
                  flex: 1, overflow: 'hidden', textOverflow: 'ellipsis'
              }}>{img.name}</span>
                            <button onClick={() => handleRemoveImage(img.id)}>×</button>
                        </div>

                        <div style={{ marginTop: 5, display: 'flex', gap: 4 }}>
                            <button onClick={() => handleStartCrop(img.id, 'oval')}>Crop Oval</button>
                            <button onClick={() => handleStartCrop(img.id, 'roundrect')}>Crop Rect</button>
                            {cropping.id === img.id && (
                                <>
                                    <button onClick={handleApplyCrop}>Apply</button>
                                    <button onClick={handleCancelCrop}>Cancel</button>
                                </>
                            )}
                        </div>

                        {img.clipWidth && (
                            <div style={{
                                display: 'flex',
                                alignItems: 'center',
                                marginTop: 6
                            }}>
                                <label style={{ marginRight: 6 }}>Size:</label>
                                <input
                                    type="range"
                                    min="0.5"
                                    max="3"
                                    step="0.01"
                                    value={img.scale}
                                    onChange={e => handleImageScaleChange(img.id, Number(e.target.value))}
                                />
                                <span style={{ marginLeft: 6 }}>
                  {(img.scale * 100).toFixed(0)}%
                </span>
                            </div>
                        )}
                    </div>
                ))}

                <button style={{ marginTop: 10 }} onClick={handleExport}>Save as PDF</button>
            </div>
        );
    }
}

export default LeftDrawer;
