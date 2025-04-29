// src/components/DesignCanvas.js
import React from 'react';
import {
    Stage,
    Layer,
    Path,
    Text,
    Transformer,
    Group,
    Image as KonvaImage,
    Rect,
    Ellipse
} from 'react-konva';

export default class DesignCanvas extends React.Component {
    render() {
        const {
            selectedDesign,
            graniteImg,
            svgScale,
            svgX,
            svgY,
            texts,
            images,
            cropping,
            cropRect,
            onCropChange,
            cropTransformerRef,
            cropRectRef,
            handleTextDragEnd,
            handleTextTransformEnd,
            handleTextDblClick,
            handleImageDragEnd,
            selectedTextNode,
            textTransformerRef,
            stageRef,
            svgRef
        } = this.props;

        const stageWidth = window.innerWidth;
        const stageHeight = window.innerHeight * 0.99;

        return (
            <Stage width={stageWidth} height={stageHeight} ref={stageRef}>
                <Layer>
                    {selectedDesign && (
                        <Path
                            ref={svgRef}
                            data={selectedDesign.svgPath}
                            x={svgX}
                            y={svgY}
                            scaleX={svgScale || 1}
                            scaleY={svgScale || 1}
                            fillPatternImage={graniteImg}
                            fillPatternRepeat="repeat"
                            fillPatternScale={{
                                x: selectedDesign.tileScale || 1,
                                y: selectedDesign.tileScale || 1
                            }}
                            shadowColor="black"
                            shadowBlur={10}
                            shadowOffsetX={5}
                            shadowOffsetY={5}
                            shadowOpacity={0.6}
                            listening={false}
                        />
                    )}

                    {texts.map(txt => (
                        <Text
                            key={txt.id}
                            text={txt.text}
                            x={txt.x}
                            y={txt.y}
                            fontSize={txt.fontSize}
                            fill="black"
                            wrap="none"
                            draggable
                            onDragEnd={e => handleTextDragEnd(e, txt.id)}
                            onTransformEnd={e => handleTextTransformEnd(e, txt.id)}
                            onDblClick={e => handleTextDblClick(txt.id, e.target)}
                            shadowColor="black"
                            shadowBlur={5}
                            shadowOffsetX={3}
                            shadowOffsetY={3}
                            shadowOpacity={0.5}
                        />
                    ))}
                    {selectedTextNode && (
                        <Transformer
                            ref={textTransformerRef}
                            boundBoxFunc={(oldBox, newBox) => ({
                                ...newBox,
                                width: Math.max(30, newBox.width)
                            })}
                        />
                    )}

                    {images.map(img => {
                        const baseW = img.clipWidth  || img.width;
                        const baseH = img.clipHeight || img.height;
                        const scale = img.scale || 1;
                        const w = baseW * scale;
                        const h = baseH * scale;
                        const sx = img.clipX || 0;
                        const sy = img.clipY || 0;

                        return (
                            <Group
                                key={img.id}
                                x={img.x}
                                y={img.y}
                                draggable
                                onDragEnd={e => handleImageDragEnd(e, img.id)}
                                clipFunc={ctx => {
                                    ctx.beginPath();
                                    if (img.clipShape === 'oval') {
                                        ctx.ellipse(w/2, h/2, w/2, h/2, 0, 0, Math.PI * 2);
                                    } else {
                                        const r = 20;
                                        ctx.moveTo(r, 0);
                                        ctx.lineTo(w - r, 0);
                                        ctx.quadraticCurveTo(w, 0, w, r);
                                        ctx.lineTo(w, h - r);
                                        ctx.quadraticCurveTo(w, h, w - r, h);
                                        ctx.lineTo(r, h);
                                        ctx.quadraticCurveTo(0, h, 0, h - r);
                                        ctx.lineTo(0, r);
                                        ctx.quadraticCurveTo(0, 0, r, 0);
                                    }
                                    ctx.closePath();
                                    ctx.clip();
                                }}
                            >
                                <KonvaImage
                                    image={img.img}
                                    x={-sx}
                                    y={-sy}
                                    width={w}
                                    height={h}
                                />
                            </Group>
                        );
                    })}

                    {cropping.id && cropRect && (
                        <>
                            {cropping.shape === 'oval' ? (
                                <Ellipse
                                    ref={cropRectRef}
                                    x={cropRect.x + cropRect.width/2}
                                    y={cropRect.y + cropRect.height/2}
                                    radiusX={cropRect.width/2}
                                    radiusY={cropRect.height/2}
                                    stroke="blue"
                                    dash={[4,4]}
                                    draggable
                                    onDragEnd={e => {
                                        const x = e.target.x() - cropRect.width/2;
                                        const y = e.target.y() - cropRect.height/2;
                                        onCropChange({ ...cropRect, x, y });
                                    }}
                                    onTransformEnd={e => {
                                        const node = e.target;
                                        const scaleX = node.scaleX();
                                        const scaleY = node.scaleY();
                                        node.scaleX(1);
                                        node.scaleY(1);
                                        let w = Math.max(96*2, Math.min(node.radiusX()*2*scaleX, 96*8));
                                        let h = Math.max(96*2, Math.min(node.radiusY()*2*scaleY, 96*10));
                                        const cx = node.x(), cy = node.y();
                                        onCropChange({
                                            x: cx - w/2,
                                            y: cy - h/2,
                                            width: w,
                                            height: h
                                        });
                                    }}
                                />
                            ) : (
                                <Rect
                                    ref={cropRectRef}
                                    x={cropRect.x}
                                    y={cropRect.y}
                                    width={cropRect.width}
                                    height={cropRect.height}
                                    cornerRadius={20}
                                    stroke="blue"
                                    dash={[4,4]}
                                    draggable
                                    onDragEnd={e => {
                                        const x = e.target.x(), y = e.target.y();
                                        onCropChange({ ...cropRect, x, y });
                                    }}
                                    onTransformEnd={e => {
                                        const node = e.target;
                                        const scaleX = node.scaleX();
                                        const scaleY = node.scaleY();
                                        node.scaleX(1);
                                        node.scaleY(1);
                                        let w = Math.max(96*2, Math.min(node.width()*scaleX, 96*8));
                                        let h = Math.max(96*2, Math.min(node.height()*scaleY, 96*10));
                                        onCropChange({
                                            x: node.x(),
                                            y: node.y(),
                                            width: w,
                                            height: h
                                        });
                                    }}
                                />
                            )}
                            <Transformer
                                ref={cropTransformerRef}
                                rotateEnabled={false}
                                anchorSize={8}
                                boundBoxFunc={(oldBox,newBox) => {
                                    let w = Math.max(96*2, Math.min(newBox.width,96*8));
                                    let h = Math.max(96*2, Math.min(newBox.height,96*10));
                                    return { ...newBox, width: w, height: h };
                                }}
                            />
                        </>
                    )}
                </Layer>
            </Stage>
        );
    }
}
