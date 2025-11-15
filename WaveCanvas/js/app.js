// Classe principal da aplicação
class App {
    constructor() {
        this.audioProcessor = new AudioProcessor();
        this.visualizationEngine = new VisualizationEngine('audioCanvas');
        this.uiManager = new UIManager(this);
        this.exportManager = new ExportManager(this.visualizationEngine);

        this.states= {
            INITIALIZING: 'initializing',
            READY: 'ready',
            LOADING_AUDIO: 'loading_audio',
            PLAYING: 'playing',
            ERROR: 'error'
        };
        this.currentState = this.states.INITIALIZING;
        
        // Inicialização
        this.init();
    }

    setState(newState) {
        console.log(`Estado: ${this.currentState} -> ${newState}`);
        this.currentState = newState;
        this.updateUIForState();
    }
    
    init() {
        // TODO: inicializar a aplicação
        this.setState(this.states.READY);
        console.log('App inicializada');
    }
    
    async startMicrophone() {
        // TODO: iniciar captura do microfone
        try {
            this.setState(this.states.LOADING_AUDIO);
            await this.audioProcessor.startMicrophone();
            this.visualizationEngine.start(this.audioProcessor);
            this.uiManager.setButtonStates(true);
            this.setState(this.states.PLAYING);
        } catch (error) {
            console.error('Erro ao iniciar microfone: ', error);
            this.setState(this.states.ERROR);
            this.uiManager.showError(`Erro no microfone: ${error.message}`);
        }
    }
    
    async loadAudioFile(file) {
        // TODO: carregar ficheiro de áudio
        try {
            this.setState(this.states.LOADING_AUDIO);
            await this.audioProcessor.loadAudioFile(file);
            this.visualizationEngine.start(this.audioProcessor);
            this.uiManager.updateAudioInfo(`A tocar: ${file.name}`);
            this.uiManager.setButtonStates(true);
            this.setState(this.states.PLAYING);
        } catch (error) {
            console.error('Erro ao carregar áudio: ', error);
            this.setState(this.states.ERROR);
            this.uiManager.showError(error.message);
        }
    }
    
    stopAudio() {
        // TODO: parar áudio
        this.audioProcessor.stop();
        this.visualizationEngine.stop();
        this.uiManager.setButtonStates(false);
        this.uiManager.updateAudioInfo('Áudio parado');
        this.setState(this.states.READY);
    }
    
    setVisualization(type) {
        // TODO: definir tipo de visualização
        if (this.visualizationEngine.setVisualization(type)) {
            console.log(`Definindo visualização: ${type}`);
        }
        return this.visualizationEngine.setVisualization(type);
    }
    
    exportFrame() {
        // TODO: exportar frame atual
        this.exportManager.exportAsPNG();
    }
    
    destroy() {
        // TODO: limpar recursos
        this.stopAudio();
        this.visualizationEngine.stop();
        console.log('Aplicação destruída');
    }

    updateUIForState() {
        const statusElement = document.getElementById('audioStatus');
        if (statusElement) {
            statusElement.textContent = `Estado: ${this.currentState}`;
        }
    }
    
}

// Inicialização da aplicação quando o DOM estiver carregado
document.addEventListener('DOMContentLoaded', () => {
    const app = new App();
    
    // Expor app globalmente para debugging (remover em produção)
    window.app = app;
});