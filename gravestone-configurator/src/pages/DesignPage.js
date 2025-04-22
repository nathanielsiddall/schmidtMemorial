// src/pages/DesignPage.js
import React from 'react';
import ConfigLoader from '../utils/ConfigLoader';
import ImageLoader from '../utils/ImageLoader';
import LeftDrawer from '../components/LeftDrawer';
import DesignCanvas from '../components/DesignCanvas';

const PX_PER_INCH = 96;
let textIdCounter = 0;

class DesignPage extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            designOptions: null,
            selectedDesign: null,
            graniteImg: null,
            svgScale: null,
            svgX: 0,
            svgY: 0,

            // text fields
            texts: [],

            // images & cropping
            images: [],
            cropping: { id: null, shape: null },
            cropRect: null,
        };

        // refs
        this.svgRef             = React.createRef();
        this.stageRef           = React.createRef();
        this.textTransformerRef = React.createRef();
        this.cropTransformerRef = React.createRef();
        this.cropRectRef        = React.createRef();
        this.selectedTextNode   = null;
    }

    componentDidMount() {
        ConfigLoader.load('/designOptions.json').then(options => {
            this.setState({ designOptions: options });
            if (options.designs?.length) {
                this.selectDesign(options.designs[0].id, options);
            }
        });
    }

    componentDidUpdate() {
        const { selectedDesign, svgScale, cropping } = this.state;

        // auto-scale & center SVG
        if (selectedDesign && this.svgRef.current && svgScale === null) {
            const stageW = window.innerWidth;
            const stageH = window.innerHeight * 0.99;
            const memorialH = stageH * 0.95;
            const rect = this.svgRef.current.getClientRect({ skipTransform: true });
            const scale = memorialH / rect.height;
            const memorialW = rect.width * scale;
            const svgX = (stageW - memorialW) / 2 - rect.x * scale;
            const svgY = (stageH - memorialH) / 2 - rect.y * scale;
            this.setState({ svgScale: scale, svgX, svgY });
        }

        // re-attach text transformer if active
        if (this.selectedTextNode && this.textTransformerRef.current) {
            this.textTransformerRef.current.nodes([this.selectedTextNode]);
            this.textTransformerRef.current.getLayer().batchDraw();
        }

        // re-attach crop transformer if active
        if (cropping.id && this.cropTransformerRef.current && this.cropRectRef.current) {
            this.cropTransformerRef.current.nodes([this.cropRectRef.current]);
            this.cropTransformerRef.current.getLayer().batchDraw();
        }
    }

    // ——— Original design/text handlers restored ———

    selectDesign = (id, options) => {
        const opts = options || this.state.designOptions;
        const design = opts.designs.find(d => d.id === id);
        if (!design) return;
        this.setState({ selectedDesign: design, svgScale: null, texts: [] });
        if (design.selectedGranite) {
            ImageLoader.load(`/${design.selectedGranite}`).then(img =>
                this.setState({ graniteImg: img })
            );
        }
    }

    handleDesignSelect = e => {
        this.selectDesign(e.target.value);
    }

    handleGraniteSelect = e => {
        const selectedGranite = e.target.value;
        const { selectedDesign, designOptions } = this.state;
        const updatedDesign = { ...selectedDesign, selectedGranite };
        const updatedDesigns = designOptions.designs.map(d =>
            d.id === updatedDesign.id ? updatedDesign : d
        );
        this.setState({
            selectedDesign: updatedDesign,
            designOptions: { ...designOptions, designs: updatedDesigns },
            svgScale: null
        });
        ImageLoader.load(`/${selectedGranite}`).then(img =>
            this.setState({ graniteImg: img })
        );
    }

    handleTileScaleChange = e => {
        const tileScale = Number(e.target.value);
        const { selectedDesign, designOptions } = this.state;
        const updatedDesign = { ...selectedDesign, tileScale };
        const updatedDesigns = designOptions.designs.map(d =>
            d.id === updatedDesign.id ? updatedDesign : d
        );
        this.setState({
            selectedDesign: updatedDesign,
            designOptions: { ...designOptions, designs: updatedDesigns }
        });
    }

    addTextField = () => {
        let newX = 50, newY = 50;
        if (this.svgRef.current && this.state.svgScale !== null) {
            const rect = this.svgRef.current.getClientRect({ skipTransform: true });
            newX = this.state.svgX + rect.width * this.state.svgScale / 2;
            newY = this.state.svgY + rect.height * this.state.svgScale / 2;
        }
        const newText = {
            id: textIdCounter++,
            text: 'New Text',
            x: newX,
            y: newY,
            fontSize: 24,
            width: 150
        };
        this.setState(ps => ({ texts: [...ps.texts, newText] }));
    }

    handleTextFieldChange = (id, field, value) => {
        this.setState(ps => ({
            texts: ps.texts.map(txt =>
                txt.id === id ? { ...txt, [field]: value } : txt
            )
        }));
    }

    handleTextDragEnd = (e, id) => {
        const { x, y } = e.target.position();
        this.handleTextFieldChange(id, 'x', x);
        this.handleTextFieldChange(id, 'y', y);
    }

    handleTextTransformEnd = (e, id) => {
        const node = e.target;
        const scaleX = node.scaleX();
        const newWidth = Math.max(30, node.width() * scaleX);
        node.scaleX(1);
        this.handleTextFieldChange(id, 'width', newWidth);
    }

    handleTextDblClick = (id, node) => {
        this.selectedTextNode = node;
    }

    handleRemoveText = id => {
        this.setState(ps => ({
            texts: ps.texts.filter(txt => txt.id !== id)
        }));
    }

    handleExport = () => {
        const stage = this.stageRef.current;
        if (!stage) return;
        // detach transformer
        if (this.textTransformerRef.current) {
            this.textTransformerRef.current.detach();
            this.textTransformerRef.current.getLayer().batchDraw();
        }
        const dataURL = stage.toDataURL({ pixelRatio: 2 });
        const w = stage.width(), h = stage.height();
        const pdf = new window.jsPDF('l', 'pt', [w, h]);
        pdf.addImage(dataURL, 'PNG', 0, 0, w, h);
        pdf.save('canvas.pdf');
        // reattach
        if (this.selectedTextNode && this.textTransformerRef.current) {
            this.textTransformerRef.current.nodes([this.selectedTextNode]);
            this.textTransformerRef.current.getLayer().batchDraw();
        }
    }

    // ——— New image/crop/scale handlers below ———

    handleImageUpload = e => {
        const file = e.target.files[0];
        if (!file) return;
        const reader = new FileReader();
        reader.onload = () => {
            const img = new window.Image();
            img.src = reader.result;
            img.onload = () => {
                const x = window.innerWidth / 2 - img.width / 2;
                const y = (window.innerHeight * 0.99) / 2 - img.height / 2;
                this.setState(ps => ({
                    images: [
                        ...ps.images,
                        {
                            id: Date.now(),
                            name: file.name,
                            img,
                            x, y,
                            width: img.width,
                            height: img.height,
                            scale: 1
                        }
                    ]
                }));
            };
        };
        reader.readAsDataURL(file);
    }

    handleImageDragEnd = (e, id) => {
        const { x, y } = e.target.position();
        this.setState(ps => ({
            images: ps.images.map(im =>
                im.id === id ? { ...im, x, y } : im
            )
        }));
    }

    handleRemoveImage = id => {
        this.setState(ps => ({
            images: ps.images.filter(im => im.id !== id)
        }));
    }

    handleImageScaleChange = (id, scale) => {
        this.setState(ps => ({
            images: ps.images.map(im =>
                im.id === id ? { ...im, scale } : im
            )
        }));
    }

    handleStartCrop = (id, shape) => {
        const img = this.state.images.find(i => i.id === id);
        if (!img) return;
        const defaultW = Math.min(img.width, PX_PER_INCH * 4);
        const defaultH = Math.min(img.height, PX_PER_INCH * 4);
        this.setState({
            cropping: { id, shape },
            cropRect: { x: img.x, y: img.y, width: defaultW, height: defaultH }
        });
    }

    handleCropRectChange = rect => {
        const minW = PX_PER_INCH * 2, maxW = PX_PER_INCH * 8;
        const minH = PX_PER_INCH * 2, maxH = PX_PER_INCH * 10;
        const w = Math.max(minW, Math.min(rect.width, maxW));
        const h = Math.max(minH, Math.min(rect.height, maxH));
        this.setState({ cropRect: { x: rect.x, y: rect.y, width: w, height: h } });
    }

    handleApplyCrop = () => {
        const { id, shape } = this.state.cropping;
        const { cropRect } = this.state;
        this.setState(ps => ({
            images: ps.images.map(im => {
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
            }),
            cropping: { id: null, shape: null },
            cropRect: null
        }));
    }

    handleCancelCrop = () => {
        this.setState({ cropping: { id: null, shape: null }, cropRect: null });
    }

    render() {
        const {
            designOptions,
            selectedDesign,
            graniteImg,
            svgScale,
            svgX,
            svgY,
            texts,
            images,
            cropping,
            cropRect
        } = this.state;

        return (
            <div>
                <LeftDrawer
                    designOptions={designOptions}
                    selectedDesign={selectedDesign}
                    handleDesignSelect={this.handleDesignSelect}
                    handleGraniteSelect={this.handleGraniteSelect}
                    handleTileScaleChange={this.handleTileScaleChange}
                    addTextField={this.addTextField}
                    texts={texts}
                    handleTextFieldChange={this.handleTextFieldChange}
                    handleRemoveText={this.handleRemoveText}
                    handleExport={this.handleExport}

                    handleImageUpload={this.handleImageUpload}
                    images={images}
                    handleRemoveImage={this.handleRemoveImage}
                    handleImageScaleChange={this.handleImageScaleChange}

                    cropping={cropping}
                    handleStartCrop={this.handleStartCrop}
                    handleApplyCrop={this.handleApplyCrop}
                    handleCancelCrop={this.handleCancelCrop}
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
                    onCropChange={this.handleCropRectChange}
                    cropTransformerRef={this.cropTransformerRef}
                    cropRectRef={this.cropRectRef}
                    handleTextDragEnd={this.handleTextDragEnd}
                    handleTextTransformEnd={this.handleTextTransformEnd}
                    handleTextDblClick={this.handleTextDblClick}
                    handleImageDragEnd={this.handleImageDragEnd}
                    selectedTextNode={this.selectedTextNode}
                    textTransformerRef={this.textTransformerRef}
                    stageRef={this.stageRef}
                    svgRef={this.svgRef}
                />
            </div>
        );
    }
}

export default DesignPage;
