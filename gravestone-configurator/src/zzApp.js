import React, { createRef } from 'react';
import { Stage, Layer, Text, Path, Transformer } from 'react-konva';
import { jsPDF } from 'jspdf';

let textIdCounter = 0;

class ConfigLoader {
  static load(url) {
    return fetch(url).then(res => res.json());
  }
}

class ImageLoader {
  static load(url) {
    return new Promise((resolve, reject) => {
      const img = new window.Image();
      img.src = url;
      img.onload = () => resolve(img);
      img.onerror = err => reject(err);
    });
  }
}

class App extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      designOptions: null,
      selectedDesign: null,
      graniteImg: null,
      svgScale: null,
      svgX: 0,
      svgY: 0,
      texts: []
    };
    this.svgRef = createRef();
    this.stageRef = createRef();
    this.textTransformerRef = createRef();
    this.selectedTextNode = null;
  }
  componentDidMount() {
    ConfigLoader.load('/designOptions.json').then(options => {
      this.setState({ designOptions: options });
      if (options.designs && options.designs.length > 0) {
        this.selectDesign(options.designs[0].id, options);
      }
    });
  }
  componentDidUpdate(prevProps, prevState) {
    if (
      this.state.selectedDesign &&
      this.svgRef.current &&
      this.state.svgScale === null
    ) {
      const stageWidth = window.innerWidth; // use full window width
      const stageHeight = window.innerHeight * 0.99;
      const memorialHeight = stageHeight * 0.95;
      const rect = this.svgRef.current.getClientRect({ skipTransform: true });
      const scaleFactor = memorialHeight / rect.height;
      const memorialWidth = rect.width * scaleFactor;
      const svgX = (stageWidth - memorialWidth) / 2 - rect.x * scaleFactor;
      const svgY = (stageHeight - memorialHeight) / 2 - rect.y * scaleFactor;
      this.setState({ svgScale: scaleFactor, svgX, svgY });
    }
    if (this.selectedTextNode && this.textTransformerRef.current) {
      this.textTransformerRef.current.nodes([this.selectedTextNode]);
      this.textTransformerRef.current.getLayer().batchDraw();
    }
  }
  selectDesign = (id, options) => {
    const opts = options || this.state.designOptions;
    const design = opts.designs.find(d => d.id === id);
    if (design) {
      this.setState({
        selectedDesign: design,
        svgScale: null,
        texts: []
      });
      if (design.selectedGranite) {
        ImageLoader.load(`/${design.selectedGranite}`).then(img => {
          this.setState({ graniteImg: img });
        });
      }
    }
  }
  handleDesignSelect = (e) => {
    this.selectDesign(e.target.value);
  }
  handleGraniteSelect = (e) => {
    const selectedGranite = e.target.value;
    const { selectedDesign, designOptions } = this.state;
    const updatedDesign = { ...selectedDesign, selectedGranite };
    const updatedDesigns = designOptions.designs.map(design =>
      design.id === updatedDesign.id ? updatedDesign : design
    );
    this.setState({
      selectedDesign: updatedDesign,
      designOptions: { ...designOptions, designs: updatedDesigns },
      svgScale: null
    });
    ImageLoader.load(`/${selectedGranite}`).then(img => {
      this.setState({ graniteImg: img });
    });
  }
  handleTileScaleChange = (e) => {
    const tileScale = Number(e.target.value);
    const { selectedDesign, designOptions } = this.state;
    const updatedDesign = { ...selectedDesign, tileScale };
    const updatedDesigns = designOptions.designs.map(design =>
      design.id === updatedDesign.id ? updatedDesign : design
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
      const memorialWidth = rect.width * this.state.svgScale;
      const memorialHeight = rect.height * this.state.svgScale;
      // Position new text at the center of the memorial (absolute stage coordinates)
      newX = this.state.svgX + memorialWidth / 2;
      newY = this.state.svgY + memorialHeight / 2;
    }
    const newText = {
      id: textIdCounter++,
      text: "New Text",
      x: newX,
      y: newY,
      fontSize: 24,
      width: 150
    };
    this.setState(prevState => ({
      texts: [...prevState.texts, newText]
    }));
  }
  handleTextFieldChange = (id, field, value) => {
    this.setState(prevState => ({
      texts: prevState.texts.map(txt =>
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
  handleRemoveText = (id) => {
    this.setState(prevState => ({
      texts: prevState.texts.filter(txt => txt.id !== id)
    }));
  }
  handleExport = () => {
    const stage = this.stageRef.current;
    if (stage) {
      // Temporarily detach transformer
      if (this.textTransformerRef.current) {
        this.textTransformerRef.current.detach();
        this.textTransformerRef.current.getLayer().batchDraw();
      }
      const dataURL = stage.toDataURL({ pixelRatio: 2 });
      const stageWidth = stage.width();
      const stageHeight = stage.height();
      const pdf = new jsPDF('l', 'pt', [stageWidth, stageHeight]);
      pdf.addImage(dataURL, 'PNG', 0, 0, stageWidth, stageHeight);
      pdf.save('canvas.pdf');
      // Reattach transformer if needed
      if (this.selectedTextNode && this.textTransformerRef.current) {
        this.textTransformerRef.current.nodes([this.selectedTextNode]);
        this.textTransformerRef.current.getLayer().batchDraw();
      }
    } else {
      alert('Stage is not available.');
    }
  }
  render() {
    const { designOptions, selectedDesign, graniteImg, svgScale, svgX, svgY, texts } = this.state;
    const stageWidth = window.innerWidth; // full width stage
    const stageHeight = window.innerHeight * 0.99;
    return (
      <div>
        {/* Left Drawer as an absolutely positioned element */}
        <div style={{
          position: 'absolute',
          top: 0,
          left: 0,
          width: 300,
          height: '100vh',
          background: '#f0f0f0',
          padding: '10px',
          overflowY: 'auto',
          zIndex: 10
        }}>
          <h3>Design Options</h3>
          {designOptions && (
            <div>
              <label>Design: </label>
              <select onChange={this.handleDesignSelect} value={selectedDesign ? selectedDesign.id : ''}>
                {designOptions.designs.map(design => (
                  <option key={design.id} value={design.id}>{design.id}</option>
                ))}
              </select>
            </div>
          )}
          {selectedDesign && selectedDesign.graniteOptions && (
            <div>
              <label>Granite: </label>
              <select onChange={this.handleGraniteSelect} value={selectedDesign.selectedGranite}>
                {selectedDesign.graniteOptions.map(option => (
                  <option key={option} value={option}>{option}</option>
                ))}
              </select>
            </div>
          )}
          {selectedDesign && typeof selectedDesign.tileScale !== 'undefined' && (
            <div>
              <label>Tile Scale: </label>
              <input
                type="range"
                min="0.1"
                max="3"
                step="0.1"
                value={selectedDesign.tileScale}
                onChange={this.handleTileScaleChange}
              />
              <span>{selectedDesign.tileScale}</span>
            </div>
          )}
          <h3>Text Fields</h3>
          <button onClick={this.addTextField}>Add Text Field</button>
          {texts.map(txt => (
            <div key={txt.id} style={{
              border: '1px solid #ccc',
              margin: '5px 0',
              padding: '5px'
            }}>
              <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                <label>Content: </label>
                <button onClick={() => this.handleRemoveText(txt.id)}>X</button>
              </div>
              <input
                type="text"
                value={txt.text}
                onChange={e => this.handleTextFieldChange(txt.id, 'text', e.target.value)}
              />
              <div>
                <label>Font Size: </label>
                <input
                  type="range"
                  min="10"
                  max="100"
                  value={txt.fontSize}
                  onChange={e => this.handleTextFieldChange(txt.id, 'fontSize', Number(e.target.value))}
                />
                <span>{txt.fontSize}</span>
              </div>
            </div>
          ))}
          <button onClick={this.handleExport}>Save as PDF</button>
        </div>
        {/* Canvas */}
        <div>
          <Stage width={stageWidth} height={stageHeight} ref={this.stageRef}>
            <Layer>
              {selectedDesign && (
                <Path
                  ref={this.svgRef}
                  data={selectedDesign.svgPath}
                  x={svgX}
                  y={svgY}
                  scaleX={svgScale || 1}
                  scaleY={svgScale || 1}
                  fillPatternImage={graniteImg}
                  fillPatternRepeat="repeat"
                  fillPatternScale={{ x: selectedDesign.tileScale || 1, y: selectedDesign.tileScale || 1 }}
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
                  width={txt.width}
                  fill="black"
                  draggable
                  onDragEnd={e => this.handleTextDragEnd(e, txt.id)}
                  onTransformEnd={e => this.handleTextTransformEnd(e, txt.id)}
                  onDblClick={e => this.handleTextDblClick(txt.id, e.target)}
                  onDblTap={e => this.handleTextDblClick(txt.id, e.target)}
                  shadowColor="black"
                  shadowBlur={5}
                  shadowOffsetX={3}
                  shadowOffsetY={3}
                  shadowOpacity={0.5}
                />
              ))}
              {this.selectedTextNode && (
                <Transformer
                  ref={this.textTransformerRef}
                  boundBoxFunc={(oldBox, newBox) => ({
                    ...newBox,
                    width: Math.max(30, newBox.width)
                  })}
                />
              )}
            </Layer>
          </Stage>
        </div>
      </div>
    );
  }
}

export default App;
