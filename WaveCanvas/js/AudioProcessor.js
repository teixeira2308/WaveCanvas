// Processamento de Áudio
class AudioProcessor {
    constructor() {
        try {
            this.audioContext = new (window.AudioContext || window.webkitAudioContext)();
            console.log(this.audioContext.state);
        } catch (error) {
            console.error('Web Audio API não suportada:', error);
            throw new Error('Navegador não suporta Web Audio API');
        }
        this.analyser = this.audioContext.createAnalyser();
        this.analyser.smoothingTimeConstant = 0.8;
        this.mediaStream = null;
        this.frequencyData = new Uint8Array();
        this.waveformData = new Uint8Array();
        this.isPlaying = false;
        this.isInitializing = false;
        this.getFrequencyData() --> SpectrumVisualization;
        this.getWaveformData() --> WaveformVisualization;
        this.calculateAudioLevel() --> ParticleVisualization;
    }

    setupAnalyser() {
        this.analyser = this.audioContext.createAnalyser();

        this.analyser.fftSize = 2048;
        this.analyser.smoothingTimeConstant = 0.8;
        this.analyser.minDecibels = -90;
        this.analyser.maxDecibels = -10;

        const bufferLength = this.analyser.frequencyBinCount;
        this.frequencyData = new Uint8Array(bufferLength);
        this.waveformData = new Uint8Array(bufferLength);
    }
    
    async startMicrophone() {

        try {

        
            // TODO: iniciar captura do microfone
            if (this.isInitializing) {
                console.log('Iniciando captura do microfone...');
                return;
            }

            this.isInitializing = true;
            try {

                this.uiManager.updateAudioInfo('A iniciar microfone...');

                this.stop();

                await this.ensureRunning();

                stream = await navigator.mediaDevices.getUserMedia({audio: true});

                this.connectSource(stream);

                this.uiManager.setButtonStates(true);
                this.uiManager.updateAudioInfo('Microfone ativo!');

                stream = await navigator.mediaDevices.getUserMedia({
                    audio: {
                        echoCancellation: true,
                        noiseSuppression: true,
                        autoGainControl: true,
                        channelCount: 1,
                    }
                });
                const audioBuffer = await this.audioContext.decodeAudioData(arrayBuffer);

                await this.audioContext.resume();
                await this.audioContext.suspend();
                // Devolver Promise
                const mediaSource = this.audioContext.createMediaStreamSource(stream);
                return mediaSource;
            } finally {
                this.isInitializing = false;
            } 
            
        } catch (error) {
            console.error('Erro no microfone:', error);
            this.uiManager.showError(`Microfone falhou: ${error.message}`);
            this.uiManager.setButtonStates(false);
        }
    }

    async ensureRunning() {
        if (this.audioContext.state === 'suspended') {
            await this.audioContext.resume();
        }
    }
    
    async loadAudioFile(file) {
        // TODO: carregar ficheiro de áudio
        console.log('Carregando ficheiro de áudio...');
        const reader = new FileReader();
        reader.onload = async (e) => {
            const audioData = e.target.result;
            const audioBuffer = await this.audioContext.decodeAudioData(audioData);
            const source = this.audioContext.createBufferSource();
            source.buffer = audioBuffer;
            return source;
        };
        // Devolver Promise
        reader.readAsArrayBuffer(file);
    }
    
    stop() {
        // TODO: parar processamento de áudio
        console.log('Parando processamento de áudio...');
        if (this.mediaStream) {
            this.mediaStream.getTracks().forEach(track => track.stop());
        }

        if (this.source && this.source.stop) {
            this.source.stop();
        }

        if (this.audioContext) {
            this.audioContext.suspend();
        }
    }
    
    update() {
        // TODO: atualizar dados de áudio
        this.analyser.getByteFrequencyData(this.frequencyData);
        this.analyser.getByteTimeDomainData(this.waveformData);
    }
    
    getFrequencyData() {
        // TODO: obter dados de frequência
        const rawData = this.AudioProcessor.getFrequencyData();
        return this.normalizeData(rawData);
    }
    
    getWaveformData() {
        // TODO: obter dados de forma de onda
        const rawData = this.AudioProcessor.getWaveformData();
        return Array.from(rawData).map(value => {
            return (value - 128) / 128;
        });
    }
    
    calculateAudioLevel() {
        // TODO: calcular nível de áudio
        return 0;
    }

    connectSource(source) {
        if (this.source) {
            this.source.disconnect();
        }

        if (source instanceof MediaStream) {
            const mediaSource = this.audioContext.createMediaStreamSource(source);
            mediaSource.connect(this.analyser);
            this.source = mediaSource;
        } else {
            source.connect(this.analyser);
            this.source = source;
        }
        this.analyser.connect(this.audioContext.destination);
    }

    

}