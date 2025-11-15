// Motor de Visualização
class VisualizationEngine {
    constructor(canvasId) {
        this.canvas = document.getElementById(canvasId);
        if (!this.canvas) {
            throw new Error(`Canvas com ID  '${canvasId}' não encontrado`);
        }
        this.ctx = this.canvas.getContext('2d');
        this.visualizations = new Map();
        this.currentVisualization = null;
        this.animationId = null;
        this.isRunning = false;
        this.audioProcessor = null;

        this.resize();
        
        // Inicializar visualizações
        this.initVisualizations();

        window.addEventListener('resize', () => this.resize());
    }
    
    initVisualizations() {
        // TODO: inicializar tipos de visualização
        this.visualizations.set('spectrum', new SpectrumVisualization(this.canvas, null));
        this.visualizations.set('waveform', new WaveformVisualization(this.canvas, null));
        this.visualizations.set('particles', new ParticleVisualization(this.canvas, null));

        this.setVisualization('spectrum');
    }
    
    setVisualization(type) {
        // TODO: definir visualização atual
        if (!this.visualizations.has(type)) {
            console.error(`Visualização '${type}' não encontrada`);
            return false;
        }

        this.currentVisualization = this.visualizations.get(type);

        this.currentVisualization.canvas = this.canvas;
        this.currentVisualization.ctx = this.canvas.getContext('2d');

        if (this.audioProcessor) {
            this.currentVisualization.audioProcessor = this.audioProcessor;
        }

        this.currentVisualization.resize(this.canvas.width, this.canvas.height);

        console.log(`Visualização definida: ${type}`);
        return true;
    }
    
    start(audioProcessor) {
        // TODO: iniciar animação
        this.audioProcessor = audioProcessor;

        for (const [key, viz] of this.visualizations) {
            viz.audioProcessor = audioProcessor;
            viz.canvas = this.canvas;
            viz.ctx = this.canvas.getContext('2d');
        }

        if (this.currentVisualization) {
            this.currentVisualization.audioProcessor = audioProcessor;
            this.currentVisualization.canvas = this.canvas;
            this.currentVisualization.ctx = this.canvas.getContext('2d');
        }

        if(this.isRunning) {
            this.stop();
        }

        this.isRunning = true;
        this.animate();

        console.log('Motor de visualização iniciado');
    }
    
    stop() {
        // TODO: parar animação
        this.isRunning = false;
        if (this.animationId) {
            cancelAnimationFrame(this.animationId);
            this.animationId = null;
        }
        console.log('Motor de visualização parado');
    }

    animate() {
        if (!this.isRunning) return;

        if (this.audioProcessor) {
            this.audioProcessor.update();
        }

        if (this.currentVisualization) {
            if (!this.currentVisualization.ctx && typeof this.currentVisualization.ctx.fillRect !== 'function') {
                console.error('Contexto inválido, reestabelecendo...');
                this.currentVisualization.canvas = this.canvas;
                this.currentVisualization.ctx = this.canvas.getContext('2d');
            } 

            try {
                this.currentVisualization.update();
                this.currentVisualization.draw();
            } catch (error) {
                console.error('Erro ao desenhar visualização: ', error);
            }
        }

        this.animationId = requestAnimationFrame(() => this.animate());
    }
    
    resize() {
        // TODO: redimensionar canvas
        const container = this.canvas.parentElement;
        if (container) {
            this.canvas.width = container.clientWidth;
            this.canvas.height = container.clientHeight;

            for (const [key, viz] of this.visualizations) {
                viz.canvas = this.canvas;
                viz.ctx = this.canvas.getContext('2d');
                viz.resize(this.canvas.width, this.canvas.height);
            }

            if(this.currentVisualization) {
                this.currentVisualization.canvas = this.canvas;
                this.currentVisualization.ctx = this.canvas.getContext('2d');
                this.currentVisualization.resize(this.canvas.width, this.canvas.height);
            }
        }
    }
    
    getVisualizationProperties() {
        // TODO: obter propriedades da visualização atual
        return this.currentVisualization ? this.currentVisualization.getProperties() : {};
    }
    
    updateVisualizationProperty(property, value) {
        // TODO: atualizar propriedade da visualização
        if (this.currentVisualization) {
            this.currentVisualization.updateProperty(property, value);
            console.log(`Atualizando propriedade: ${property} = ${value}`);
        }
    }
}