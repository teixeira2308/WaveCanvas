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

        const propertiesContainer = document.getElementById('properties-container');
        propertiesContainer.innerHTML = ' ';

        const properties  = this.visualizationEngine.getVisualizationProperties();
        
        Object.keys(properties).forEach(propertyName => {
            const property = properties[propertyName];
            console.log (property);
            // Ignorar propriedades que não são objetos com type (como 'name')
            if (property && typeof property === 'object' && property.type) {
                const control = this.createPropertyControl(
                    propertyName, 
                    property.value, 
                    property.min, 
                    property.max, 
                    property.step
                );
                if (control) {
                    propertiesContainer.appendChild(control);
                }
            }
        });
    }

    createPropertyControl(property, value, min, max, step) {
        // TODO: criar controlo de propriedade
        const container = document.createElement('div');
        container.className = 'property-control';
        
        const label = document.createElement('label');
        label.textContent = property;
        label.htmlFor = `prop-${property}`;
        
        const properties = this.visualizationEngine.getVisualizationProperties();
        const propertyConfig = properties[property];
        
        let input;
        
        if (propertyConfig && propertyConfig.type === 'select') {
            input = document.createElement('select');
            input.id = `prop-${property}`;
            
            propertyConfig.options.forEach(option => {
                const optionElement = document.createElement('option');
                optionElement.value = option;
                optionElement.textContent = option;
                if (option === propertyConfig.value) {
                    optionElement.selected = true;
                }
                input.appendChild(optionElement);
            });
            
            input.addEventListener('change', (e) => {
                this.visualizationEngine.updateVisualizationProperty(property, e.target.value);
            });
        }
            else if (propertyConfig && propertyConfig.type === 'boolean') {
            input = document.createElement('input');
            input.type = 'checkbox';
            input.id = `prop-${property}`;
            input.checked = propertyConfig.value;
            
            input.addEventListener('change', (e) => {
                this.visualizationEngine.updateVisualizationProperty(property, e.target.checked);
            });
            
        } else if (propertyConfig && propertyConfig.type === 'color') {
            input = document.createElement('input');
            input.type = 'color';
            input.id = `prop-${property}`;
            input.value = propertyConfig.value;
            
            input.addEventListener('input', (e) => {
                this.visualizationEngine.updateVisualizationProperty(property, e.target.value);
            });
            
        } else {
            input = document.createElement('input');
            input.type = 'range';
            input.id = `prop-${property}`;
            input.min = min || 0;
            input.max = max || 100;
            input.step = step || 1;
            input.value = value;
            
            const valueDisplay = document.createElement('span');
            valueDisplay.className = 'property-value';
            valueDisplay.textContent = value;
            
            input.addEventListener('input', (e) => {
                const newValue = parseFloat(e.target.value);
                this.visualizationEngine.updateVisualizationProperty(property, newValue);
                valueDisplay.textContent = newValue.toFixed(step < 1 ? 2 : 0);
            });
            
            container.appendChild(label);
            container.appendChild(input);
            container.appendChild(valueDisplay);
            return container;
        }
        
        container.appendChild(label);
        container.appendChild(input);
        
        return container;
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
        const errorModal = document.getElementById('errorModal');
        const errorMessage = document.getElementById('errorMessage');
        
        errorMessage.textContent = message;
        errorModal.classList.remove('hidden');
        
        document.querySelector('.close').onclick = () => {
            errorModal.classList.add('hidden');
        };
        
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

        document.addEventListener('fullscreenchange', () => {
            this.onFullscreenChange();
        });

        document.addEventListener('webkitfullscreenchange', () => {
            this.onFullscreenChange();
        });

        document.addEventListener('msfullscreenchange', () => {
            this.onFullscreenChange();
        });
        
       this.updatePropertiesPanel();
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

    updateLevelBars(level) {
        const levelBar = document.getElementById('audioLevelBar');
        if (levelBar) {
            levelBar.style.width = `${level * 100}%`;
        }
    }
}
