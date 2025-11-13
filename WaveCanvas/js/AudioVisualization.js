// Classe Abstrata Base para Visualizações
class AudioVisualization {
    constructor(canvas, audioProcessor) {
        if (this.constructor === AudioVisualization) {
            throw new Error('AudioVisualization é uma classe abstrata e não pode ser instanciada diretamente.');
        }
        
        this.canvas = canvas;
        this.ctx = canvas.getContext('2d');
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
        this.canvas.width = width;
        this.canvas.height = height;
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
        this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
    }
    
    drawGrid() {
        // TODO: desenhar grelha de fundo
    }
    
    createGradient() {
        // TODO: criar gradiente de cores
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