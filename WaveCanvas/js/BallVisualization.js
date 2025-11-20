class BallVisualization extends AudioVisualization {
    constructor(canvas, audioProcessor) {
        super(canvas, audioProcessor);
        this.name = "Bola de Frequência";
        this.properties = {
            baseRadius: 60
        };
    }

    draw() {
        if (!this.ctx || !this.canvas) return;
        
        this.clearCanvas();

        const centerX = this.canvas.width / 2;
        const centerY = this.canvas.height / 2;

        this.ctx.beginPath();
        this.ctx.arc(centerX, centerY, this.properties.radius, 0, Math.PI * 2);

        const red = Math.min(255, this.audioLevel * 400); 
        const blue = Math.max(0, 200 - (this.audioLevel * 300)); 
        
        this.ctx.fillStyle = `rgb(${red}, 50, ${blue})`;
        this.ctx.fill();

        this.ctx.shadowBlur = 10 + (this.audioLevel * 40);
        this.ctx.shadowColor = `rgb(${red}, 50, ${blue})`;
        this.ctx.fill();
        this.ctx.shadowBlur = 0;
    }

    update() {
        super.update();
        
        if (!this.audioProcessor) return;

        const audioLevel = this.audioProcessor.calculateAudioLevel();
        
        const boostedLevel = Math.pow(audioLevel, 0.5); 
        
        this.audioLevel = boostedLevel;
        
        this.properties.radius = this.properties.baseRadius * (1 + boostedLevel * 2);
    }

    getProperties() {
        return {
            ...super.getProperties(),
            baseRadius: this.properties.baseRadius
        };
    }
}