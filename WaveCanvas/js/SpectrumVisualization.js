// Visualizações Concretas
class SpectrumVisualization extends AudioVisualization {
    constructor(canvas, audioProcessor) {
        super(canvas, audioProcessor);
        this.name = 'Espectro de Frequências';
        this.smoothedData = new Array(1024).fill(0);
        this.properties = {
            barWidth: 2,
            colorScheme: "rainbow",
            showGrid: true
        };
        // Inicializar propriedades específicas
    }
    
    draw() {
        // TODO: desenhar espectro de frequências
        this.clearCanvas();
        
        // Implementação básica para teste
        const data = this.audioProcessor ? this.audioProcessor.getFrequencyData() : this.testData;
        const barWidth = this.canvas.width / data.length;
        
        for (let i = 0; i < data.length; i++) {
            const barHeight = (data[i] / 255) * this.canvas.height;
            const x = i * barWidth;
            const y = this.canvas.height - barHeight;
            
            this.ctx.fillStyle = `hsl(${i / data.length * 360}, 100%, 50%)`;
            this.ctx.fillRect(x, y, barWidth - 1, barHeight);
        }

        const frequencyData = this.getFrequencyData();
        const normalizedData = this.normalizeData(frequencyData);
        const sensitiveData = this.applySensitivity(normalizedData, this.properties.sensitivity);

        const barCount = Math.min(256, Math.floor(width / (barWidth + barSpacing)));

        for(let i = 0; i < barCount; i++) {
            const dataIndex = Math.floor((i / barCount) * sensitiveData.length);
            const barHeight = sensitiveData[dataIndex] * this.canvas.height;

            const x = i * (barWidth + barSpacing);
            const y = this.canvas.height - barHeight;

            this.ctx.fillRect(x, y, barWidth, barHeight);
        }
    }
    
    getProperties() {
        // TODO: obter propriedades específicas
        return super.getProperties();
    }

    update() {
        const rawData = this.getFrequencyData();
        this.smoothedData = this.smoothData(this.smoothedData, rawData, 0.1);
    }

}