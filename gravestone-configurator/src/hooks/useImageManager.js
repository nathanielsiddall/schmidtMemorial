// src/hooks/useImageManager.js
import { useState, useRef } from 'react';

const PX_PER_INCH = 96;

export default function useImageManager() {
    const [images, setImages] = useState([]);
    const [cropping, setCropping] = useState({ id: null, shape: null });
    const [cropRect, setCropRect] = useState(null);
    const cropTransformerRef = useRef();
    const cropRectRef        = useRef();

    const handleImageUpload = e => {
        const file = e.target.files[0];
        if (!file) return;
        const reader = new FileReader();
        reader.onload = () => {
            const img = new window.Image();
            img.src = reader.result;
            img.onload = () => {
                const x = window.innerWidth/2 - img.width/2;
                const y = (window.innerHeight*0.99)/2 - img.height/2;
                setImages(arr => [
                    ...arr,
                    {
                        id: Date.now(),
                        name: file.name,
                        img,
                        x, y,
                        width: img.width,
                        height: img.height,
                        scale: 1
                    }
                ]);
            };
        };
        reader.readAsDataURL(file);
    };

    const handleImageDragEnd = (e, id) => {
        const { x, y } = e.target.position();
        setImages(arr =>
            arr.map(im => (im.id === id ? { ...im, x, y } : im))
        );
    };

    const handleRemoveImage = id =>
        setImages(arr => arr.filter(im => im.id !== id));

    const handleImageScaleChange = (id, scale) =>
        setImages(arr =>
            arr.map(im => (im.id === id ? { ...im, scale } : im))
        );

    const handleStartCrop = (id, shape) => {
        const img = images.find(i => i.id === id);
        if (!img) return;
        const defaultW = Math.min(img.width, PX_PER_INCH * 4);
        const defaultH = Math.min(img.height, PX_PER_INCH * 4);
        setCropping({ id, shape });
        setCropRect({ x: img.x, y: img.y, width: defaultW, height: defaultH });
    };

    const handleCropChange = rect => {
        const minW = PX_PER_INCH*2, maxW = PX_PER_INCH*8;
        const minH = PX_PER_INCH*2, maxH = PX_PER_INCH*10;
        const w = Math.max(minW, Math.min(rect.width, maxW));
        const h = Math.max(minH, Math.min(rect.height, maxH));
        setCropRect({ x: rect.x, y: rect.y, width: w, height: h });
    };

    const handleApplyCrop = () => {
        const { id, shape } = cropping;
        setImages(arr =>
            arr.map(im => {
                if (im.id !== id) return im;
                return {
                    ...im,
                    clipX:      cropRect.x - im.x,
                    clipY:      cropRect.y - im.y,
                    clipWidth:  cropRect.width,
                    clipHeight: cropRect.height,
                    clipShape:  shape,
                    scale:      im.scale
                };
            })
        );
        setCropping({ id: null, shape: null });
        setCropRect(null);
    };

    const handleCancelCrop = () => {
        setCropping({ id: null, shape: null });
        setCropRect(null);
    };

    return {
        images,
        cropping,
        cropRect,
        onUpload:      handleImageUpload,
        onDragEnd:     handleImageDragEnd,
        onRemove:      handleRemoveImage,
        onScaleChange: handleImageScaleChange,
        onStartCrop:   handleStartCrop,
        onCropChange:  handleCropChange,
        onApplyCrop:   handleApplyCrop,
        onCancelCrop:  handleCancelCrop,
        cropTransformerRef,
        cropRectRef
    };
}
