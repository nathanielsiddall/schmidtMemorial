import React, { useState, useEffect } from 'react';
import './css/GalleryPage.css';

console.log('env:', {
    env: process.env,
    CLOUD_NAME: process.env.REACT_APP_CLOUDINARY_CLOUD_NAME,
    FOLDER:    process.env.REACT_APP_CLOUDINARY_FOLDER
});

const CLOUD_NAME = process.env.REACT_APP_CLOUDINARY_CLOUD_NAME;
const FOLDER     = process.env.REACT_APP_CLOUDINARY_FOLDER;
// This endpoint returns a JSON listing of everything in that folder/tag:
const LIST_URL   =
    `https://res.cloudinary.com/${CLOUD_NAME}/image/list/${FOLDER}.json`;

export default function GalleryPage() {
    const [images, setImages] = useState([]);

    useEffect(() => {
        fetch(LIST_URL)
            .then(res => {
                if (!res.ok) throw new Error('Failed to fetch Cloudinary list');
                return res.json();
            })
            .then(json => setImages(json.resources || []))
            .catch(console.error);
    }, []);

    return (
        <div className="gallery-container">
            {images.map(img => (
                <div className="gallery-item" key={img.public_id}>
                    <img
                        className="gallery-image"
                        src={`https://res.cloudinary.com/${CLOUD_NAME}/image/upload/${img.public_id}.${img.format}`}
                        alt={img.public_id}
                    />
                </div>
            ))}
        </div>
    );
}
