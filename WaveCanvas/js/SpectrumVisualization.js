// Visualizações Concretas
class SpectrumVisualization extends AudioVisualization {
    constructor(canvas, audioProcessor) {
        super(canvas, audioProcessor);
        this.name = 'Espectro de Frequências';
        this.smoothedData = new Array(1024).fill(0);
        this.properties = {
            barWidth: 2,
            colorScheme: "rainbow",
            showGrid: true,
            sensitivity: 1.0,
            smoothing: 0.8
        };
        // Inicializar propriedades específicas
    }
    
    draw() {
        // TODO: desenhar espectro de frequências

        this.clearCanvas();

        if (this.properties.showGrid) {
            this.drawGrid();
        }
        
        // Implementação básica para teste
        const data = this.audioProcessor ? this.audioProcessor.getFrequencyData() : this.testData;
        if (!data || data.length === 0) return;

        const barWidth = Math.max(2, (this.canvas.width / data.length) * 2.5);
        
        for (let i = 0; i < data.length; i++) {
            const value = data[i] / 255;
            const barHeight = value * this.canvas.height * this.properties.sensitivity;
            const x = i * barWidth;
            const y = this.canvas.height - barHeight;

            const hue = (i / data.length) * 300;
            const saturation = 100;
            const lightness = 50 + (value * 20);
            
            this.ctx.fillStyle = `hsl(${hue}, ${saturation}%, ${lightness}%)`;
            this.ctx.fillRect(x, y, barWidth - 1, barHeight);
        }
    }

    drawGrid() {
        this.ctx.strokeStyle = 'rgba(255, 255, 255, 0.1)';
        this.ctx.lineWidth = 1;

        for (let i = 0; i <= 4; i++) {
            const y = (this.canvas.height / 4) * i;
            this.ctx.beginPath();
            this.ctx.moveTo(0, y);
            this.ctx.lineTo(this.canvas.width, y);
            this.ctx.stroke();
        }
    }
    
    getProperties() {
        return {
            name: this.name,
            barWidth: {
                value: this.properties.barWidth,
                min: 1,
                max: 10,
                step: 0.5,
                type: 'range'
            },
            sensitivity: {
                value: this.properties.sensitivity,
                min: 0.1,
                max: 3.0,
                step: 0.1,
                type: 'range'
            },
            smoothing: {
                value: this.properties.smoothing,
                min: 0.1,
                max: 0.9,
                step: 0.05,
                type: 'range'
            },
            showGrid: {
                value: this.properties.showGrid,
                type: 'boolean'
            },
            colorScheme: {
                value: this.properties.colorScheme,
                options: ['rainbow', 'blue', 'red', 'green', 'monochrome'],
                type: 'select'
            }
        };
    }

    update() {
        this.frameCount++;
        if (this.audioProcessor) {
            const rawData = this.audioProcessor.getFrequencyData();
            this.smoothedData = this.smoothData(this.smoothedData, rawData, this.properties.smoothing);
        }
    }

    get testData() {
        const data = new Uint8Array(256);
        const time = this.frameCount * 0.05;

        for (let i = 0; i < data.length; i++) {
            const frequency = i / data.length;
            const wave = Math.sin(time + frequency * 10) * 0.5 + 0.5;
            data[i] = Math.floor(wave * 255);
        }

        return data;
    }

    smoothData(oldData, newData, smoothingFactor) {
        if (oldData.length !== newData.length) {
            return [...newData];
        }
        return oldData.map((oldValue, index) => {
            return oldValue * smoothingFactor + newData[index] * (1 - smoothingFactor);
        });
    }
}