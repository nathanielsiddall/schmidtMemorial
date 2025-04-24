// src/hooks/useDesignOptions.js
import { useState, useEffect } from 'react';
import ConfigLoader from '../utils/ConfigLoader';
import ImageLoader from '../utils/ImageLoader';

export default function useDesignOptions() {
    const [designOptions, setDesignOptions] = useState(null);
    const [selectedDesign, setSelectedDesign] = useState(null);
    const [graniteImg, setGraniteImg] = useState(null);
    const [svgScale, setSvgScale] = useState(null);
    const [svgX, setSvgX] = useState(0);
    const [svgY, setSvgY] = useState(0);

    // load configs on mount
    useEffect(() => {
        ConfigLoader.load('/designOptions.json').then(options => {
            setDesignOptions(options);
            if (options.designs?.length) {
                selectDesign(options.designs[0].id, options);
            }
        });
    }, []);

    function selectDesign(id, optionsArg) {
        const opts = optionsArg || designOptions;
        const design = opts?.designs.find(d => d.id === id);
        if (!design) return;
        setSelectedDesign(design);
        setSvgScale(null);
        if (design.selectedGranite) {
            ImageLoader.load(`/${design.selectedGranite}`).then(img =>
                setGraniteImg(img)
            );
        } else {
            setGraniteImg(null);
        }
    }

    const handleDesignSelect = e => selectDesign(e.target.value);
    const handleGraniteSelect = e => {
        const newGranite = e.target.value;
        const updated = { ...selectedDesign, selectedGranite: newGranite };
        setSelectedDesign(updated);
        setDesignOptions(opts => ({
            ...opts,
            designs: opts.designs.map(d =>
                d.id === updated.id ? updated : d
            )
        }));
        setSvgScale(null);
        ImageLoader.load(`/${newGranite}`).then(img => setGraniteImg(img));
    };
    const handleTileScaleChange = e => {
        const s = Number(e.target.value);
        const updated = { ...selectedDesign, tileScale: s };
        setSelectedDesign(updated);
        setDesignOptions(opts => ({
            ...opts,
            designs: opts.designs.map(d =>
                d.id === updated.id ? updated : d
            )
        }));
    };

    return {
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
    };
}
