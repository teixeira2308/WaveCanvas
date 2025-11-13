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
        console.log('App inicializada');
    }
    
    startMicrophone() {
        // TODO: iniciar captura do microfone

    }
    
    async loadAudioFile(file) {
        // TODO: carregar ficheiro de áudio
        console.log('Carregando ficheiro de áudio...');
        try {
            await this.loadAudioWithTimeout(file, 10000);
            this.uiManager.updateAudioInfo(`A tocar: ${file.name}`);
        } catch (error) {
            if (error.message.includes('Timeout')) {
                this.uiManager.showError('Ficheiro demorou muito a carregar');
            } else {
                this.uiManager.showError(error.message);
            }
        }
    }
    
    stopAudio() {
        // TODO: parar áudio
        console.log('Parando áudio...');
    }
    
    setVisualization(type) {
        // TODO: definir tipo de visualização
        console.log(`Definindo visualização: ${type}`);
    }
    
    exportFrame() {
        // TODO: exportar frame atual
        console.log('Exportando frame...');
    }
    
    destroy() {
        // TODO: limpar recursos
        console.log('Destruindo aplicação...');
    }
}

// Inicialização da aplicação quando o DOM estiver carregado
document.addEventListener('DOMContentLoaded', () => {
    const app = new App();
    
    // Expor app globalmente para debugging (remover em produção)
    window.app = app;
});