import React, { Component } from 'react';
import "./App.css";
import AudioAnalyser from './audioAnalyzer';

const processorUrl = "./InferenceNode.js";

class App extends Component {
    constructor(props) {
        super(props);
        this.state = {
            audio: null
        };
        this.toggleMicrophone = this.toggleMicrophone.bind(this);
        this.audioContext = null;
        this.model = props.model;
    }

    async getMicrophone() {
        const audio = await navigator.mediaDevices.getUserMedia({
            audio: true,
            video: false
        });
        this.setState({ audio });
    }

    stopMicrophone() {
        this.state.audio.getTracks().forEach(track => track.stop());
        this.setState({ audio: null });
    }

    async toggleMicrophone() {
        if (this.audioContext == null) {
            this.audioContext = new (window.AudioContext || window.webkitAudioContext)({
                "sampleRate": 16000
            })

            try {
                fetch(processorUrl)
                    .then((response) => response.text())
                    .then((text) => {
                        const blob = new Blob([text], { type: 'application/javascript; charset=utf-8' });
                        const objectUrl = URL.createObjectURL(blob);

                        return this.audioContext.audioWorklet.addModule(objectUrl)
                            .finally(() => URL.revokeObjectURL(objectUrl));
                    });
            } catch (e) {
                throw new Error(
                    `Failed to load audio analyzer worklet at url: ${processorUrl}. Further info: ${e.message}`
                );
            }

        }

        if (this.state.audio) {
            this.stopMicrophone();
        } else {
            await this.getMicrophone();
        }
    }

    render() {
        return (
            <div className="App">
                <div className="controls">
                    <button onClick={this.toggleMicrophone}>
                        {this.state.audio ? 'Stop microphone' : 'Get microphone input'}
                    </button>
                </div>
                {this.state.audio ? <AudioAnalyser audio={this.state.audio} audioContext={this.audioContext} model={this.model}/> : ''}
            </div>
        );
    }
}


export default App;
