class BallVisualization extends AudioVisualization {
    constructor(canvas, audioProcessor) {
        super(canvas, audioProcessor);
        this.name = "Espetro Circular";
        this.smoothedData = new Array(1024).fill(0);
        this.properties = {
            barWidth: 2,
            colorScheme: 'rainbow',
            showGrid: false,
            sensitivity: 1.0,
            smoothing: 0.8,
            radius: 100,
            color: '#4cc9f0'
        };
    }

    draw() { 
        this.clearCanvas();

        const data = this.audioProcessor ? this.audioProcessor.getFrequencyData() : this.testData;
        if (!data || data.length === 0) return;

        const centerX = this.canvas.width / 2;
        const centerY = this.canvas.height / 2;
        const maxRadius = Math.min(centerX, centerY) * 0.8;

        const barCount = 120;
        const dataStep = Math.floor(data.length / barCount);

        const angleStep = (2 * Math.PI) / barCount;
        const baseRadius = Math.min(this.properties.radius, maxRadius);

        for (let i = 0; i < barCount; i++) {
            const dataIndex = Math.floor(i * dataStep);
            //const value = data[dataIndex] / 255;

            const smoothedValue = this.smoothedData[dataIndex] / 255;
            const amplifiedValue = Math.pow(smoothedValue, 0.7) * this.properties.sensitivity;

            const angle = (i * angleStep);
            const barLength = amplifiedValue * baseRadius * 0.8;

            const startX = centerX + Math.cos(angle) * baseRadius;
            const startY = centerY + Math.sin(angle) * (baseRadius);

            const endX = centerX + Math.cos(angle) * (baseRadius + barLength);
            const endY = centerY + Math.sin(angle) * (baseRadius + barLength);

            const hue = (i / barCount) * 360;
            const brightness = 50 + (amplifiedValue * 40);
            this.ctx.strokeStyle = `hsl(${hue}, 100%, ${brightness}%)`;
            this.ctx.lineWidth = this.properties.barWidth;

            this.ctx.beginPath();
            this.ctx.moveTo(startX, startY);
            this.ctx.lineTo(endX, endY);
            this.ctx.stroke();

            if (amplifiedValue > 0.3) {
                this.ctx.beginPath();
                this.ctx.arc(endX, endY, this.properties.barWidth * 0.8, 0, 2 * Math.PI);
                this.ctx.fillStyle = `hsl(${hue}, 100%, ${brightness + 20}%)`;
                this.ctx.fill();
            }
        }

        this.ctx.strokeStyle = this.properties.color;
        this.ctx.lineWidth = 1;
        this.ctx.beginPath();
        this.ctx.arc(centerX, centerY, baseRadius, 0, 2 * Math.PI);
        this.ctx.fillStyle = '#4cc9f020';
        this.ctx.fill();
        this.ctx.stroke();
        
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


    update() {
        super.update();

        if (this.audioProcessor) {
            const rawData = this.audioProcessor.getFrequencyData();
            this.smoothedData = this.smoothData(this.smoothedData, rawData, this.properties.smoothing);
        }

    }

    getProperties() {
        return {
            ...super.getProperties(),
            name: this.name,
            radius: {
                value: this.properties.radius,
                min: 50,
                max: 200,
                step: 5,
                type: 'range'
            },
            barWidth: {
                value: this.properties.barWidth,
                min: 1,
                max: 10, 
                step: 1,
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
            colorScheme: {
                value: this.properties.colorScheme,
                options: ['rainbow', 'blue', 'red', 'green', 'monochrome'],
                type: 'select'
            }
        };
    }

    updateProperty(property, value) {
        if (this.properties.hasOwnProperty(property)) {
            if (typeof this.properties[property] === 'number') {
                this.properties[property] = parseFloat(value);
            } else {
                this.properties[property] = value;
            }
        }
    }

    get testData() {
        const data = new Uint8Array(256);
        const time = this.frameCount * 0.05;

        for (let i = 0; i < data.length; i++) {
            const frequency = i / data.length;
            const wave = Math.sin(time + frequency * 15) * 0.4 + 0.4;
            const wave2 = Math.sin(time * 2 + frequency * 8) * 0.3 + 0.3;
            data[i] = Math.floor((wave + wave2) * 255);
        }
        return data;
    }

    smoothData(oldData, newData, smoothingFactor) {
        if (!oldData || oldData.length !== newData.length) {
            return [...newData];
        }
        return oldData.map((oldValue, index) => {
            return oldValue * smoothingFactor + newData[index] * (1 - smoothingFactor);
        });
    }
}