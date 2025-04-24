import React from 'react';

export default function PDFExport({ onExport }) {
    return (
        <div style={{ marginBottom: 20 }}>
            <h3>Export</h3>
            <button onClick={onExport}>Save as PDF</button>
        </div>
    );
}
