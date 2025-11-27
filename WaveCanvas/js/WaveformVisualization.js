class WaveformVisualization extends AudioVisualization {
    constructor(canvas, audioProcessor) {
        super(canvas, audioProcessor);
        this.name = 'Forma de Onda';
        // Inicializar propriedades específicas
        this.properties = {
            lineWidth: 2,
            lineColor: '#4cc9f0',
            showCenterLine: true,
            amplitude: 1.0
        };
    }
    
    draw() {
        // TODO: desenhar forma de onda
        this.clearCanvas();

        if (this.properties.showCenterLine) {
            this.ctx.strokeStyle = 'rgba(255, 255, 255, 0.3)';
            this.ctx.lineWidth = 1;
            this.ctx.beginPath();
            this.ctx.moveTo(0, this.canvas.height/2);
            this.ctx.lineTo(this.canvas.width, this.canvas.height / 2);
            this.ctx.stroke();
        }
        
        // Implementação básica para teste
        const data = this.audioProcessor ? this.audioProcessor.getWaveformData() : this.getTestWaveform();

        if (!data || data.length === 0) {
            return;
        }

        const sliceWidth = this.canvas.width / data.length;
        const centerY = this.canvas.height / 2;
        const amplitudeScale = (this.canvas.height / 2) * 0.8 * this.properties.amplitude;

        this.ctx.beginPath();
        this.ctx.lineWidth = this.properties.lineWidth;
        this.ctx.strokeStyle = this.properties.lineColor;

        for (let i = 0; i < data.length; i++) {
            const v = data[i];
            const y = centerY + (v * amplitudeScale);
            const x = i * sliceWidth;

            if (i === 0) this.ctx.moveTo(x, y);
            else this.ctx.lineTo(x, y);
        }
        this.ctx.stroke();
    }
    
    getProperties() {
        return {
            name: this.name,
            lineWidth: {
                value: this.properties.lineWidth,
                min: 1,
                max: 10,
                step: 0.5,
                type: 'range'
            },
            amplitude: {
                value: this.properties.amplitude,
                min: 0.1,
                max: 3.0,
                step: 0.1,
                type: 'range'
            },
            showCenterLine: {
                value: this.properties.showCenterLine,
                type: 'boolean'
            },
            lineColor: {
                value: this.properties.lineColor,
                type: 'color'
            }
        };
    }

    get testData() {
        return this.getTestWaveform();
    }

    getTestWaveform() {
        const data = [];
        const time = this.frameCount * 0.1;
        const samples = 256;

        for (let i = 0; i < samples; i++) {
            const position = i / samples;
            const wave = Math.sin(time + position * Math.PI * 4);
            data.push(wave);
        }
        return data;
    }

   
}
