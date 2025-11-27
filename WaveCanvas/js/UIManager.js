// Gestão de UI
class UIManager {
    constructor(app) {
        this.app = app;
        this.visualizationEngine = app.visualizationEngine;
        this.audioProcessor = app.audioProcessor;
        
        // Inicializar interface
        this.setupEventListeners();
        this.setupAudioLevels();
    }
    
    updatePropertiesPanel() {
        // TODO: atualizar painel de propriedades
        console.log('Atualizando painel de propriedades...');
    }
    
    updateAudioInfo(info, isError = false) {
        // TODO: atualizar informações de áudio
        const audioStatus = document.getElementById('audioStatus');
        const audioLevel = document.getElementById('audioLevel');
        
        if (isError) {
            audioStatus.textContent = `Erro: ${info}`;
            audioStatus.style.color = '#f72585';
        } else {
            audioStatus.textContent = `Áudio: ${info.status || 'Ativo'}`;
            audioStatus.style.color = '#e6e6e6';
            audioLevel.textContent = `Nível: ${info.level || 0}%`;
        }
    }
    
    setButtonStates(playing) {
        // TODO: atualizar estados dos botões
        const startMicBtn = document.getElementById('startMic');
        const stopAudioBtn = document.getElementById('stopAudio');
        
        startMicBtn.disabled = playing;
        stopAudioBtn.disabled = !playing;
    }
    
    showError(message) {
        // TODO: mostrar mensagem de erro
        const errorModal = document.getElementById('errorModal');
        const errorMessage = document.getElementById('errorMessage');
        
        errorMessage.textContent = message;
        errorModal.classList.remove('hidden');
        
        // Fechar modal ao clicar no X
        document.querySelector('.close').onclick = () => {
            errorModal.classList.add('hidden');
        };
        
        // Fechar modal ao clicar fora
        window.onclick = (event) => {
            if (event.target === errorModal) {
                errorModal.classList.add('hidden');
            }
        };
    }
    
    setupEventListeners() {
        // TODO: configurar event listeners
        document.getElementById('startMic').addEventListener('click', () => {
            this.app.startMicrophone();
        });
        
        document.getElementById('stopAudio').addEventListener('click', () => {
            this.app.stopAudio();
        });
        
        document.getElementById('audioFile').addEventListener('change', (e) => {
            if (e.target.files.length > 0) {
                this.app.loadAudioFile(e.target.files[0]);
            }
        });
        
        document.getElementById('visualizationType').addEventListener('change', (e) => {
            this.app.setVisualization(e.target.value);
        });
        
        document.getElementById('exportPNG').addEventListener('click', () => {
            this.app.exportManager.exportAsPNG();
        });
        
        document.getElementById('exportJPEG').addEventListener('click', () => {
            this.app.exportManager.exportAsJPEG(0.9);
        });

        document.getElementById('resetViewBtn').style.display = "none";

        document.getElementById('fullscreenBtn').addEventListener('click', () => {
            this.enterFullscreen();
        });

        document.getElementById('resetViewBtn').addEventListener('click', () => {
            this.exitFullscreen();
        });


        document.addEventListener("DOMContentLoaded", () => {
            const colorPicker = document.getElementById('colorPicker');
            const backgroundPicker = document.getElementById('backgroundColorPicker');

            colorPicker.addEventListener('input', () => {
                console.log("Cor selecionada:", colorPicker.value);
            });

            backgroundPicker.addEventListener('input', () => {
                console.log("Cor de fundo selecionada:", backgroundPicker.value);
            });
        });

        document.addEventListener('fullscreenchange', () => {
            this.onFullscreenChange();
        });

        document.addEventListener('webkitfullscreenchange', () => {
            this.onFullscreenChange();
        });

        document.addEventListener('msfullscreenchange', () => {
            this.onFullscreenChange();
        });
        

    }

    receiveColor() {
        const value = document.getElementById('colorPicker').value;
        console.log(value);
    }

    enterFullscreen() {
        const visualizationArea = document.getElementById('visualization-area');
        if (visualizationArea.requestFullscreen) {
            visualizationArea.requestFullscreen();
        } else if (visualizationArea.webkitRequestFullscreen) { 
            visualizationArea.webkitRequestFullscreen();
        } else if (visualizationArea.msRequestFullscreen) {
            visualizationArea.msRequestFullscreen();
        }

        document.getElementById('fullscreenBtn').style.display = "none";
        document.getElementById('resetViewBtn').style.display = "block";
    }

    exitFullscreen() {
        if (document.existFullscreen) {
            document.exitFullscreen();
        } else if (document.webkitExitFullscreen) {
            document.webkitExitFullscreen();
        } else if (document.msRequestFullscreen) {
            document.msExitFullscreen();
        }
    }

    onFullscreenChange() {
        const isFullscreen = !!document.fullscreenElement || !!document.webkitFullscreenElement || !!document.msFullscreenElement;

        if (!isFullscreen) {
            document.getElementById('resetViewBtn').style.display = "none";
            document.getElementById('fullscreenBtn').style.display = "block";
            this.app.visualizationEngine.resizeNormal();
        } else {
            document.getElementById('fullscreenBtn').style.display = "none";
            document.getElementById('resetViewBtn').style.display = "block";
        }
    }


    toggleFullscreenButtons() {
        const fullscreenBtn = document.getElementById('fullscreenBtn');
        const resetViewBtn = document.getElementById('resetViewBtn');
        const canvas = document.getElementById('audioCanvas');

        fullscreenBtn.addEventListener('click', () => {
            if (canvas.requestFullscreen) canvas.requestFullscreen();
            else if (canvas.webkitRequestFullscreen) canvas.webkitRequestFullscreen();

            resetViewBtn.style.display = "block";
        });
    }
    
    setupAudioLevels() {
        // TODO: configurar monitorização de níveis de áudio
        setInterval(() => {
            if (this.audioProcessor.isRunning()) {
                const level = this.audioProcessor.calculateAudioLevel();
                this.updateLevelBars(level);
                
                const audioLevel = document.getElementById('audioLevel');
                if (audioLevel) {
                    audioLevel.textContent = `Nível: ${Math.round(level * 100)}%`;
                }
            }
        }, 100);
    }
    
    createPropertyControl(property, value, min, max, step) {
        // TODO: criar controlo de propriedade
        const container = document.createElement('div');
        container.className = 'property-control';
        
        const label = document.createElement('label');
        label.textContent = property;
        label.htmlFor = `prop-${property}`;
        
        const input = document.createElement('input');
        input.type = 'range';
        input.id = `prop-${property}`;
        input.min = min;
        input.max = max;
        input.step = step;
        input.value = value;
        
        input.addEventListener('input', (e) => {
            this.visualizationEngine.updateVisualizationProperty(property, parseFloat(e.target.value));
        });
        
        container.appendChild(label);
        container.appendChild(input);
        
        return container;
    }
    updateLevelBars(level) {
        const levelBar = document.getElementById('audioLevelBar');
        if (levelBar) {
            levelBar.style.width = `${level * 100}%`;
        }
    }
}
