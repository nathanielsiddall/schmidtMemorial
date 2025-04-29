// src/components/TextFields.js
import React from 'react';

export default function TextFields({
                                       texts,
                                       addTextField,
                                       onTextChange,
                                       onTextRemove
                                   }) {
    return (
        <div style={{ marginBottom: 20 }}>
            <h3>Text Fields</h3>
            <button onClick={addTextField}>Add Text Field</button>
            {texts.map(txt => (
                <div key={txt.id} style={{ border: '1px solid #ccc', margin: '8px 0', padding: 8 }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                        <label>Content:</label>
                        <button onClick={() => onTextRemove(txt.id)}>×</button>
                    </div>
                    <input
                        type="text"
                        value={txt.text}
                        onChange={e => onTextChange(txt.id, 'text', e.target.value)}
                        style={{ width: '100%', marginBottom: 8 }}
                    />
                    <div>
                        <label>Font Size:</label>
                        <input
                            type="range"
                            min="10"
                            max="100"
                            value={txt.fontSize}
                            onChange={e => onTextChange(txt.id, 'fontSize', Number(e.target.value))}
                        />
                        <span>{txt.fontSize}</span>
                    </div>
                </div>
            ))}
        </div>
    );
}
