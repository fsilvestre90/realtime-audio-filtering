import React, { Component } from 'react';
import AudioVisualiser from './audioVisualizer';
import {Tensor} from "tractjs";

class AudioAnalyser extends Component {

    constructor(props) {
        super(props);
        this.state = { audioData: new Uint8Array(0) };
        this.tick = this.tick.bind(this);
        this.audioContext = props.audioContext;
        this.model = props.model;
    }

    componentDidMount() {
        this.processorNode = new AudioWorkletNode(this.audioContext, "InferenceProcessor", {
            processorOptions: {
                model: this.model,
            }
        });
        this.analyser = this.audioContext.createAnalyser();
        this.dataArray = new Uint8Array(this.analyser.frequencyBinCount);
        this.audioSource = this.audioContext.createMediaStreamSource(this.props.audio);
        this.audioSource.connect(this.analyser);
        this.rafId = requestAnimationFrame(this.tick);
        this.audioSource.connect(this.processorNode);
        this.processorNode.connect(this.audioContext.destination);
        // this.processorNode.port.postMessage({
        //     type: "send-tensor",
        //     Tensor,
        // });
    }

    tick() {
        this.analyser.getByteTimeDomainData(this.dataArray);
        this.setState({ audioData: this.dataArray });
        this.rafId = requestAnimationFrame(this.tick);
    }

    componentWillUnmount() {
        cancelAnimationFrame(this.rafId);
        this.analyser.disconnect();
        this.audioSource.disconnect();
        this.processorNode.disconnect();
    }

    render() {
        return <AudioVisualiser audioData={this.state.audioData} />;
    }
}

export default AudioAnalyser;
