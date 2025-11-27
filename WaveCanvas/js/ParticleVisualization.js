class ParticleVisualization extends AudioVisualization {
    constructor(canvas, audioProcessor) {
        super(canvas, audioProcessor);
        this.name = 'Partículas';
        this.particles = [];
        this.lastTime = 0;
        this.properties = {
            particleCount: 50,
            maxDistance: this.canvas.width / 1.5,
            audioReactivity: 1.5,
            minVelocity: 0.1,
            colorScheme: "rainbow"
        };
        
        // Inicializar partículas
        this.initParticles();
    }
    
    draw() {
        // TODO: desenhar partículas
        this.clearCanvas();
        
        this.ctx.fillStyle = 'rgba(0, 0, 0, 0.1)';
        this.ctx.fillRect(0, 0, this.canvas.width, this.canvas.height);

        this.drawConnections();
        this.drawParticles();
    }
    
    update() {
        // TODO: atualizar partículas
        super.update();
        this.updateParticles();
    }
    
    getProperties() {
        return {
            name: this.name,
            particleCount: {
                value: this.properties.particleCount,
                min: 10,
                max: 200,
                step: 5,
                type: 'range'
            },
            audioReactivity: {
                value: this.properties.audioReactivity,
                min: 0.1,
                max: 5.0,
                step: 0.1,
                type: 'range'
            },
            maxDistance: {
                value: this.properties.maxDistance,
                min: 50,
                max: 1000,
                step: 10,
                type: 'range'
            },
            colorScheme: {
                value: this.properties.colorScheme,
                options: ['rainbow', 'blue', 'red', 'green', 'monochrome'],
                type: 'select'    
            }
        };
    }
    
    initParticles() {
        this.particles = [];
        const count = this.properties.particleCount;
        // TODO: inicializar partículas
        for (let i = 0; i < count; i++) {
            this.particles.push({
                x: Math.random() * this.canvas.width,
                y: Math.random() * this.canvas.height,
                vx: (Math.random() - 0.5) * 2,
                vy: (Math.random() - 0.5) * 2,
                radius: Math.random() * 3 + 1,
                baseRadius: Math.random() * 3 + 1,
                hue: Math.random() * 360,
                saturation: 80 + Math.random() * 20,
                lightness: 50 + Math.random() * 20,
                movementFactor: 0.5 + Math.random() * 1.5
            });
        }
    }
    
    updateParticles() {
    const data = this.audioProcessor ? this.audioProcessor.getFrequencyData() : this.testData;
    const audioLevel = this.audioProcessor ? this.audioProcessor.calculateAudioLevel() : 0.5;

    if (!data || data.length === 0) {
        return;
    }

    const centerX = this.canvas.width / 2;
    const centerY = this.canvas.height / 2;
    
    for (let i = 0; i < this.particles.length; i++) {
        const p = this.particles[i];
        const freqIndex = Math.floor((i / this.particles.length) * data.length);
        const intensity = data[freqIndex] / 255;
        
      
        const reactivity = this.properties.audioReactivity * (p.movementFactor || 1.0);
        

        p.vx += (Math.random() - 0.5) * intensity * reactivity ;
        p.vy += (Math.random() - 0.5) * intensity * reactivity;
        

        const dx = p.x - centerX;
        const dy = p.y - centerY;
        const distance = Math.sqrt(dx * dx + dy * dy);
        

        if (audioLevel > 0.1 && distance < 150) {
            const repulsiveForce = (audioLevel * 0.3) / (distance + 1);
            p.vx += (dx / distance) * repulsiveForce;
            p.vy += (dy / distance) * repulsiveForce;
        }

        p.x += p.vx;
        p.y += p.vy;

        let bounced = false;
        
        if (p.x < p.radius) {
            p.x = p.radius;
            p.vx = Math.abs(p.vx) * 0.8;
            bounced = true;
        } else if (p.x > this.canvas.width - p.radius) {
            p.x = this.canvas.width - p.radius;
            p.vx = -Math.abs(p.vx) * 0.8;
            bounced = true;
        }

        if (p.y < p.radius) {
            p.y = p.radius;
            p.vy = Math.abs(p.vy) * 0.8;
            bounced = true;
        } else if (p.y > this.canvas.height - p.radius) {
            p.y = this.canvas.height - p.radius;
            p.vy = -Math.abs(p.vy) * 0.8;
            bounced = true;
        }


        p.vx *= 0.98;
        p.vy *= 0.98;

        const currentSpeed = Math.sqrt(p.vx * p.vx + p.vy * p.vy);
        const minVelocity = 0.05;
        if (currentSpeed < minVelocity && !bounced) {
            const angle = Math.random() * Math.PI * 2;
            p.vx += Math.cos(angle) * minVelocity;
            p.vy += Math.sin(angle) * minVelocity;

        }

        p.radius = p.baseRadius * (1 + intensity * 1.5);
        p.hue = (p.hue + intensity) % 360;

    }          
}

    drawParticles() {
        // TODO: desenhar partículas
        for (const p of this.particles) {
            this.ctx.beginPath();
            this.ctx.arc(p.x, p.y, p.radius, 0, Math.PI * 2);

            const gradient = this.ctx.createRadialGradient(p.x, p.y, 0, p.x, p.y, p.radius);

            switch (this.properties.colorScheme){
                case "rainbow":
                    gradient.addColorStop(0, `hsla(${p.hue}, ${p.saturation}%, ${p.lightness + 20}%, 1)`);
                    gradient.addColorStop(1, `hsla(${p.hue}, ${p.saturation}%, ${p.lightness}%, 0.6)`);

                    this.ctx.fillStyle = gradient;
                    break;
                case "blue":
                    this.ctx.fillStyle = `hsl(${235}, ${97}%, ${60}%)`;
                    break;
                case "red":
                    this.ctx.fillStyle = `hsl(${0}, ${97}%, ${60}%)`;
                    break;
                case "green":
                    this.ctx.fillStyle = `hsl(${101}, ${97}%, ${60}%)`;
                    break;
                case "monochrome":
                    this.ctx.fillStyle = `hsl(${0}, ${0}%, ${60}%)`;
                    break;
            }
           
            this.ctx.fill();

            this.ctx.shadowBlur = 10;
            this.ctx.shadowColor = `hsl(${p.hue}, ${p.saturation}%, ${p.lightness}%)`;
            this.ctx.fill();
            this.ctx.shadowBlur = 0;
        }
    }
    
    drawConnections() {
        // TODO: desenhar conexões entre partículas
        const maxDistance = this.properties.maxDistance;
        
        for (let i = 0; i < this.particles.length; i++) {
            for (let j = i + 1; j < this.particles.length; j++) {
                const p1 = this.particles[i];
                const p2 = this.particles[j];
                
                const dx = p1.x - p2.x;
                const dy = p1.y - p2.y;
                const distance = Math.sqrt(dx * dx + dy * dy);
                
                if (distance < maxDistance) {
                    const opacity = (1 - distance / maxDistance) * 0.4;

                    this.ctx.beginPath();
                    this.ctx.moveTo(p1.x, p1.y);
                    this.ctx.lineTo(p2.x, p2.y);
                    
                    switch (this.properties.colorScheme){
                        case "rainbow":
                            const avgHue = (p1.hue + p2.hue) / 2;
                            this.ctx.strokeStyle = `hsla(${avgHue}, 70%, 60%, ${opacity})`;
                            break;
                        case "blue":
                            this.ctx.strokeStyle = `hsl(${235}, ${97}%, ${60}%, ${opacity})`;
                            break;
                        case "red":
                            this.ctx.strokeStyle = `hsl(${0}, ${97}%, ${60}%, ${opacity})`;
                            break;
                        case "green":
                            this.ctx.strokeStyle = `hsl(${101}, ${97}%, ${60}%, ${opacity})`;
                            break;
                        case "monochrome":
                            this.ctx.strokeStyle = `hsl(${0}, ${0}%, ${60}%, ${opacity})`;
                            break;
                    }
                    
                    
                    this.ctx.lineWidth = 1;
                    this.ctx.stroke();
                }
            }
        }
    }

    resize(width, height) {
        super.resize(width, height);

        this.initParticles();
    }

    get testData() {
        const data = new Uint8Array(256);
        const time = this.frameCount * 0.05;

        for (let i = 0; i < data.length; i++) {
            const baseFreq = (i / data.length) * 10;
            const wave1 = Math.sin(time + baseFreq) * 0.5 + 0.5;
            const wave2 = Math.sin(time * 0.5 + baseFreq * 2) * 0.3 + 0.3;
            data[i] = Math.floor((wave1 * 0.7 + wave2 * 0.3) * 255);
        }
        return data;
    }
}