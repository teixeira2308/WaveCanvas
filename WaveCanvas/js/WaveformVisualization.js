class WaveformVisualization extends AudioVisualization {
    constructor(canvas, audioProcessor) {
        super(canvas, audioProcessor);
        this.name = 'Forma de Onda';
        // Inicializar propriedades específicas
    }
    
    draw() {
        // TODO: desenhar forma de onda
        this.clearCanvas();
        
        // Implementação básica para teste
        const data = this.audioProcessor.getWaveformData();
        const sliceWidth = this.canvas.width / data.length;

        this.ctx.beginPath();

        for (let i = 0; i < data.length; i++) {
            const v = data[i];
            const clampedV = Math.max(-1, Math.min(1, v));

            const y = (clampedV * this.canvas.height / 2) + (this.canvas.height / 2);
            const x = i * sliceWidth;

            if (i === 0) this.ctx.moveTo(x, y);
            else this.ctx.lineTo(x, y);
        }
        this.ctx.strokeStyle = 'rgba(255,255,255,0.3';
        this.ctx.lineWidth = 1;
        this.ctx.beginPath();
        this.ctx.moveTo(0, this.canvas.height / 2);
        this.lineTo(this.canvas.width, this.canvas.height / 2);
        this.ctx.stroke();
    }
    
    getProperties() {
        // TODO: obter propriedades específicas
        return super.getProperties();
    }

    get testData() {
        const data = new Uint8Array(256);
        const time = this.frameCount * 0.1;

        for (let i = 0; i < data.length; i++) {
            const position = i / data.length;
            const wave = Math.sin(time + position * Math.PI * 2);
            data[i] = Math.floor((wave * 0.5 + 0.5) * 255);
        }
        return data;
    }
}
