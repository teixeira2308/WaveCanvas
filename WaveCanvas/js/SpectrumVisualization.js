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
        const data = this.audioProcessor.getFrequencyData();
        const barWidth = (this.canvas.width / data.length) * 2.5;
        
        for (let i = 0; i < data.length; i++) {
            const barHeight = (data[i] / 255) * this.canvas.height;
            const x = i * barWidth;
            const y = this.canvas.height - barHeight;
            
            this.ctx.fillStyle = `hsl(${i / data.length * 360}, 100%, 50%)`;
            this.ctx.fillRect(x, y, barWidth - 1, barHeight);
        }
    }
    
    getProperties() {
        // TODO: obter propriedades específicas
        return {
            ...super.getProperties(),
            barWidth: this.properties.barWidth, 
            colorScheme: this.properties.colorScheme,
            showGrid: this.properties.showGrid,
            sensitivity: this.properties.sensitivity,
            smoothing: this.properties.smoothing
        };
    }

    update() {
        if (this.audioProcessor) {
            const rawData = this.audioProcessor.getFrequencyData();
            this.smoothedData = this.smoothData(this.smoothedData, rawData, 0.1);
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