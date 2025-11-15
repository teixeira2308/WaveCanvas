class ParticleVisualization extends AudioVisualization {
    constructor(canvas, audioProcessor) {
        super(canvas, audioProcessor);
        this.name = 'Partículas';
        this.particles = [];
        this.lastTime = 0;
        
        // Inicializar partículas
        this.initParticles();
    }
    
    draw() {
        // TODO: desenhar partículas
        this.clearCanvas();
        this.drawParticles();
        this.drawConnections();
    }
    
    update() {
        // TODO: atualizar partículas
        super.update();
        this.updateParticles();
    }
    
    getProperties() {
        // TODO: obter propriedades específicas
        return super.getProperties();
    }
    
    initParticles() {
        // TODO: inicializar partículas
        for (let i = 0; i < 50; i++) {
            this.particles.push({
                x: Math.random() * this.canvas.width,
                y: Math.random() * this.canvas.height,
                vx: (Math.random() - 0.5) * 2,
                vy: (Math.random() - 0.5) * 2,
                radius: Math.random() * 3 + 1,
                color: `hsl(${Math.random() * 360}, 100%, 50%)`
            });
        }
    }
    
    updateParticles() {
        // TODO: atualizar estado das partículas
        const data = this.audioProcessor.getFrequencyData();
        const audioLevel = this.audioProcessor.calculateAudioLevel();
        
        for (let i = 0; i < this.particles.length; i++) {
            const p = this.particles[i];
            const freqIndex = Math.floor((i / this.particles.length) * data-length);
            const intensity = data[freqIndex] / 255;
            
            // Mover partícula
            p.vx += (Math.random() - 0.5) * intensity * 0.5;
            p.vy += (Math.random() - 0.5) * intensity * 0.5;
            
            const centerX = this.canvas.width / 2;
            const centerY = this.canvas.height / 2;
            const dx = p.x - centerX;
            const dy = p.y - centerY;
            const distance = Math.sqrt(dx * dx + dy * dy);

            if (distance > 50) {
                const force = intensity * 0.1;
                p.vx -= (dx / distance) * force;
                p.vy -= (dy / distance) * force;
            }

            p.x += p.vx;
            p.y += p.vy;

            if (p.x < 0 || p.x > this.canvas.width) p.vx *= -0.8;
            if (p.y < 0 || p.y > this.canvas.height) p.vy *= -0.8;

            p.vx *= 0.98;
            p.vy *= 0.98;
        }          
    }
    
    drawParticles() {
        // TODO: desenhar partículas
        for (const p of this.particles) {
            this.ctx.beginPath();
            this.ctx.arc(p.x, p.y, p.radius, 0, Math.PI * 2);
            this.ctx.fillStyle = p.color;
            this.ctx.fill();
        }
    }
    
    drawConnections() {
        // TODO: desenhar conexões entre partículas
        const maxDistance = 100;
        
        for (let i = 0; i < this.particles.length; i++) {
            for (let j = i + 1; j < this.particles.length; j++) {
                const p1 = this.particles[i];
                const p2 = this.particles[j];
                
                const dx = p1.x - p2.x;
                const dy = p1.y - p2.y;
                const distance = Math.sqrt(dx * dx + dy * dy);
                
                if (distance < maxDistance) {
                    const opacity = 1 - distance / maxDistance;
                    this.ctx.beginPath();
                    this.ctx.moveTo(p1.x, p1.y);
                    this.ctx.lineTo(p2.x, p2.y);
                    this.ctx.strokeStyle = `rgba(76, 201, 240, ${opacity * 0.5})`;
                    this.ctx.lineWidth = 1;
                    this.ctx.stroke();
                }
            }
        }
    }

    get testData() {
        const data = new Uint8Array(256);
        const time = this.frameCount * 0.05;

        for (let i = 0; i < data.length; i++) {
            const baseFreq = (i / data.length) * 10;
            data[i] = Math.floor((Math.sin(time +  baseFreq) * 0.5 + 0.5) * 255);
        }
        return data;
    }
}