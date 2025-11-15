// Processamento de Áudio
class AudioProcessor {
    constructor() {
        try {
            this.audioContext = new (window.AudioContext || window.webkitAudioContext)();
            this.setupAnalyser();
        } catch (error) {
            console.error('Web Audio API não suportada:', error);
            throw new Error('Navegador não suporta Web Audio API');
        }
        //this.analyser = this.audioContext.createAnalyser();
       //this.analyser.smoothingTimeConstant = 0.8;
        this.mediaStream = null;
        this.source = null;
        //this.frequencyData = new Uint8Array();
        //this.waveformData = new Uint8Array();
        this.isPlaying = false;
        this.isInitializing = false;
        /*this.getFrequencyData() --> SpectrumVisualization;
        this.getWaveformData() --> WaveformVisualization;
        this.calculateAudioLevel() --> ParticleVisualization;
        */
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
        // TODO: iniciar captura do microfone
        if (this.isInitializing) {
            console.log('Iniciando captura do microfone...');
        }

        this.isInitializing = true;
        try {
            this.stop();
            await this.ensureRunning();

            const stream = await navigator.mediaDevices.getUserMedia({
                audio: {
                    echoCancellation: true,
                    noiseSuppression: true,
                    autoGainControl: true,
                    channelCount: 1,
                }
            });

            this.connectSource(stream);
            this.mediaStream = stream;
            this.isPlaying = true;

            /*this.uiManager.setButtonStates(true);
            this.uiManager.updateAudioInfo('Microfone ativo!');

            
            const audioBuffer = await this.audioContext.decodeAudioData(arrayBuffer);

            await this.audioContext.resume();
            await this.audioContext.suspend();
            // Devolver Promise
            const mediaSource = this.audioContext.createMediaStreamSource(stream);
            return mediaSource;
            */
        } catch (error) {
            console.error('Erro no microfone:', error);
        } finally {
            this.isInitializing = false;
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
        return new Promise((resolve, reject) => {
            const reader = new FileReader();

            reader.onload = async (e) => {
                try {
                    const audioData = e.target.result;
                    const audioBuffer = await this.audioContext.decodeAudioData(audioData);
                    const source = this.audioContext.createBufferSource();
                    source.buffer = audioBuffer;

                    this.connectSource(source);
                    source.start(0);
                    this.isPlaying = true;

                    resolve('Audio carregado com sucesso!');
                } catch (error) {
                    reject(new Error(`Erro ao processar áudio: ${error.message}`));
                }
            };
            reader.onerror = () => {
                reject(new Error('Erro ao ler ficheiro'));
            };
            reader.readAsArrayBuffer(file);
        });
    }
    
    stop() {
        // TODO: parar processamento de áudio
        console.log('Parando processamento de áudio...');
        if (this.mediaStream) {
            this.mediaStream.getTracks().forEach(track => track.stop());
            this.mediaStream = null;
        }

        if (this.source && this.source.stop) {
            this.source.stop();
            this.source.disconnect();
            this.source = null;
        }

        if (this.audioContext) {
            this.audioContext.suspend();
        }
        this.isPlaying = false;
    }
    
    update() {
        // TODO: atualizar dados de áudio
        if (this.analyser && this.isPlaying) {
            this.analyser.getByteFrequencyData(this.frequencyData);
            this.analyser.getByteTimeDomainData(this.waveformData);
            return true;
        }
        return false;
    }
    
    getFrequencyData() {
        // TODO: obter dados de frequência
        if (this.frequencyData) {
            return new Uint8Array(this.frequencyData);
        } else {
            return new Uint8Array();
        }
    }
    
    getWaveformData() {
        // TODO: obter dados de forma de onda
        if (!this.waveformData) return new Uint8Array();

        return Array.from(this.waveformData).map(value => {
            return (value - 128) / 128;
        });
    }
    
    calculateAudioLevel() {
        // TODO: calcular nível de áudio
        if (!this.frequencyData || this.frequencyData.length === 0) return 0;

        let sum = 0;
        for (let i = 0; i < this.frequencyData.length; i++) {
            sum += this.frequencyData[i];
        }
        return sum / (this.frequencyData.length * 255);
    }

    connectSource(source) {
        if (this.source) {
            this.source.disconnect();
        }

        if (source instanceof MediaStream) {
            const mediaSource = this.audioContext.createMediaStreamSource(source);
            //mediaSource.connect(this.analyser);
            this.source = mediaSource;
        } else {
            //source.connect(this.analyser);
            this.source = source;
        }
        this.source.connect(this.analyser);
        this.analyser.connect(this.audioContext.destination);
    }

    isRunning() {
        return this.isPlaying;
    }


}