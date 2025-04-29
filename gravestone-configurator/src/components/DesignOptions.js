// src/components/DesignOptions.js
import React from 'react';

export default function DesignOptions({
                                          designOptions,
                                          selectedDesign,
                                          onDesignChange,
                                          onGraniteChange,
                                          onTileScaleChange
                                      }) {
    if (!designOptions) return null;
    return (
        <div style={{ marginBottom: 20 }}>
            <h3>Design Options</h3>
            <div>
                <label>Design: </label>
                <select onChange={onDesignChange} value={selectedDesign?.id || ''}>
                    {designOptions.designs.map(d => (
                        <option key={d.id} value={d.id}>{d.id}</option>
                    ))}
                </select>
            </div>
            {selectedDesign.graniteOptions && (
                <div>
                    <label>Granite: </label>
                    <select onChange={onGraniteChange} value={selectedDesign.selectedGranite}>
                        {selectedDesign.graniteOptions.map(g => (
                            <option key={g} value={g}>{g}</option>
                        ))}
                    </select>
                </div>
            )}
            <div>
                <label>Tile Scale: </label>
                <input
                    type="range"
                    min="0.1"
                    max="3"
                    step="0.1"
                    value={selectedDesign.tileScale}
                    onChange={onTileScaleChange}
                />
                <span>{selectedDesign.tileScale}</span>
            </div>
        </div>
    );
}
