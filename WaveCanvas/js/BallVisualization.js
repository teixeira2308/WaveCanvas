class BallVisualization extends AudioVisualization {
    constructor(canvas, audioProcessor) {
        super(canvas, audioProcessor);
        this.name = "Visualização Circular";
        this.properties = {
            radius: 20,
            baseRadius: 10,
            x: this.canvas.width / 2,
            y: this.canvas.height / 2,
            saturation: 80 + Math.random() * 20,
            lightness: 50 + Math.random() * 20
        };
        this.update();
        this.draw();
    }

    draw() {
        this.clearCanvas();

        this.ctx.beginPath();
        this.ctx.arc(this.properties.x, this.properties.y, this.properties.radius, 0, Math.Pi * 2);

        const gradient = this.ctx.createRadialGradient(this.properties.x, this.properties.y, 0, this.properties.x, this.properties.y, this.properties.radius);
        gradient.addColorStop(0, `hsla(${240}, ${this.properties.saturation}%, ${this.properties.lightness}%, 1)`);
        gradient.addColorStop(1, `hsla(${0}, ${this.properties.saturation}%, ${this.properties.lightness}%, 0.6)`);

        this.ctx.fillStyle = gradient;
        this.ctx.fill();

        this.ctx.shadowBlur = 10;
        this.ctx.shadowColor = `hsl(${240}, ${this.properties.saturation}%, ${this.properties.lightness}%)`;
        this.ctx.fill();
        this.ctx.shadowBlur = 0;
        this.ctx.stroke();
    }

    update() {
        const centerX = this.canvas.width / 2;
        const centerY = this.canvas.height / 2;

        const data = this.audioProcessor ? this.audioProcessor.getFrequencyData() : this.testData;
        const audioLevel = this.audioProcessor ? this.audioProcessor.calculateAudioLevel() : 0.5;

        if (!data || data.length === 0) {
            return;
        }

        if (audioLevel > 0.05) {
            const intensity = data / 255;
                
            this.properties.radius = this.properties.baseRadius * (1 + intensity * 1.5);
            this.properties.hue = (this.properties.hue + intensity * 0.5) % 360;
        }
    }
}