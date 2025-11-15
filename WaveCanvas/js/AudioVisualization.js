// Classe Abstrata Base para Visualizações
class AudioVisualization {
    constructor(canvas, audioProcessor) {
        if (this.constructor === AudioVisualization) {
            throw new Error('AudioVisualization é uma classe abstrata e não pode ser instanciada diretamente.');
        }
        
        this.canvas = canvas;
        this.ctx = null;

        if (canvas) {
            try {
                this.ctx = canvas.getContext('2d');
                if (!this.ctx) {
                    console.error('Falha ao obter contexto 2d do canvas');
                }
            } catch (error) {
                console.error('Erro ao obter contexto: ', error);
            }
        }
        this.audioProcessor = audioProcessor;
        this.name = 'Visualização';
        this.properties = {};
        this.frameCount = 0;
    }
    
    draw() {
        throw new Error('Método draw() deve ser implementado pela subclasse.');
    }
    
    update() {
        // TODO: atualizar estado da visualização
        this.frameCount++;
    }
    
    resize(width, height) {
        // TODO: redimensionar visualização
        if (this.canvas) {
            this.canvas.width = width;
            this.canvas.height = height;
        }
    }
    
    getProperties() {
        // TODO: obter propriedades da visualização
        return this.properties;
    }
    
    updateProperty(property, value) {
        // TODO: atualizar propriedade
        if (this.properties.hasOwnProperty(property)) {
            this.properties[property] = value;
        }
    }
    
    clearCanvas() {
        // TODO: limpar canvas
        if (this.ctx && this.canvas) {
            this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
        }
    }
    
    drawGrid() {
        // TODO: desenhar grelha de fundo
        if (!this.ctx || !this.canvas) return;

        this.ctx.strokeStyle = 'rgba(255, 255, 255, 0.1)';
        this.ctx.lineWidth = 1;

        const steps = 10;
        for (let i = 0; i <= steps; i++) {
            const y = (this.canvas.height / steps) * i;
            this.ctx.beginPath();
            this.ctx.moveTo(0, y);
            this.ctx.lineTo(this.canvas.width, y);
            this.ctx.stroke();
        }

        for (let i = 0; i <= steps; i++) {
            const x = (this.canvas.width / steps) * i;
            this.ctx.beginPath();
            this.ctx.moveTo(x, 0);
            this.ctx.lineTo(x, this.canvas.height);
            this.ctx.stroke();
        }
    }
    
    createGradient() {
        // TODO: criar gradiente de cores
        if (!this.ctx || !this.canvas) return null;
        return this.ctx.createLinearGradient(0, 0, this.canvas.width, this.canvas.height);
    }
    
    normalizeData(data, min = 0, max = 255) {
        // TODO: normalizar dados de áudio
        return Array.from(data).map(value => (value - min) / (max - min));
    }

    applySensitivity(normalizedData, sensitivity) {
        return normalizedData.map(value => value * sensitivity);
    }

    mapToCanvas(normalizedValue, canvasDimension, reverse = false) {
        if (reverse) {
            return (1 - normalizedValue) * canvasDimension;
        }
        return normalizedValue * canvasDimension;
    }
    
}