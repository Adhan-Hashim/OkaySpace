// Ambient Soundscape Generators using Web Audio API

let ambientCtx: AudioContext | null = null;
let currentAmbientNode: AudioNode | null = null;
let masterGain: GainNode | null = null;

export function getAudioContext() {
  if (!ambientCtx) {
    ambientCtx = new (window.AudioContext || (window as any).webkitAudioContext)();
  }
  return ambientCtx;
}

export function setAmbientVolume(volume: number) {
  if (masterGain) {
    masterGain.gain.setTargetAtTime(volume, getAudioContext().currentTime, 0.1);
  }
}

export function stopAmbient() {
  if (currentAmbientNode) {
    try {
      (currentAmbientNode as any).stop();
    } catch (e) {
      currentAmbientNode.disconnect();
    }
    currentAmbientNode = null;
  }
}

export function playAmbient(type: 'space' | 'ocean' | 'binaural', volume: number) {
  stopAmbient();
  const ctx = getAudioContext();
  if (ctx.state === 'suspended') {
    ctx.resume().catch(() => {});
  }
  
  if (!masterGain) {
    masterGain = ctx.createGain();
    masterGain.connect(ctx.destination);
  }
  masterGain.gain.value = volume;

  if (type === 'space') {
    currentAmbientNode = createBrownNoise(ctx, masterGain);
  } else if (type === 'ocean') {
    currentAmbientNode = createOceanWaves(ctx, masterGain);
  } else if (type === 'binaural') {
    currentAmbientNode = createBinauralBeats(ctx, masterGain);
  }
}

function createBrownNoise(ctx: AudioContext, destination: AudioNode) {
  const bufferSize = 2 * ctx.sampleRate;
  const noiseBuffer = ctx.createBuffer(1, bufferSize, ctx.sampleRate);
  const output = noiseBuffer.getChannelData(0);
  let lastOut = 0;
  for (let i = 0; i < bufferSize; i++) {
    const white = Math.random() * 2 - 1;
    output[i] = (lastOut + (0.02 * white)) / 1.02;
    lastOut = output[i];
    output[i] *= 3.5; // Compensate for gain
  }

  const whiteNoise = ctx.createBufferSource();
  whiteNoise.buffer = noiseBuffer;
  whiteNoise.loop = true;

  const lowpass = ctx.createBiquadFilter();
  lowpass.type = 'lowpass';
  lowpass.frequency.value = 400; // Deep rumble

  whiteNoise.connect(lowpass);
  lowpass.connect(destination);
  whiteNoise.start();

  return whiteNoise;
}

function createOceanWaves(ctx: AudioContext, destination: AudioNode) {
  // Pink noise approximation
  const bufferSize = 2 * ctx.sampleRate;
  const noiseBuffer = ctx.createBuffer(1, bufferSize, ctx.sampleRate);
  const output = noiseBuffer.getChannelData(0);
  let b0 = 0, b1 = 0, b2 = 0, b3 = 0, b4 = 0, b5 = 0, b6 = 0;
  for (let i = 0; i < bufferSize; i++) {
    const white = Math.random() * 2 - 1;
    b0 = 0.99886 * b0 + white * 0.0555179;
    b1 = 0.99332 * b1 + white * 0.0750759;
    b2 = 0.96900 * b2 + white * 0.1538520;
    b3 = 0.86650 * b3 + white * 0.3104856;
    b4 = 0.55000 * b4 + white * 0.5329522;
    b5 = -0.7616 * b5 - white * 0.0168980;
    output[i] = b0 + b1 + b2 + b3 + b4 + b5 + b6 + white * 0.5362;
    output[i] *= 0.11; // compensation
    b6 = white * 0.115926;
  }

  const noiseNode = ctx.createBufferSource();
  noiseNode.buffer = noiseBuffer;
  noiseNode.loop = true;

  // Bandpass filter to shape the wave sound
  const filter = ctx.createBiquadFilter();
  filter.type = 'bandpass';
  filter.frequency.value = 400;
  filter.Q.value = 0.5;

  // LFO to modulate filter frequency (creates the wave crashing sound)
  const lfo = ctx.createOscillator();
  lfo.type = 'sine';
  lfo.frequency.value = 0.1; // 10 second waves

  const lfoGain = ctx.createGain();
  lfoGain.gain.value = 800; // Frequency variation amount

  lfo.connect(lfoGain);
  lfoGain.connect(filter.frequency);

  // Volume modulation
  const volLfo = ctx.createOscillator();
  volLfo.type = 'sine';
  volLfo.frequency.value = 0.1;

  const volGain = ctx.createGain();
  volGain.gain.value = 0.5;
  const masterVol = ctx.createGain();
  masterVol.gain.value = 0.5;
  
  volLfo.connect(volGain.gain);

  noiseNode.connect(filter);
  filter.connect(masterVol);
  masterVol.connect(destination);

  noiseNode.start();
  lfo.start();
  volLfo.start();

  // Return a dummy node that stops everything when disconnect is called
  const controlNode = ctx.createGain();
  controlNode.disconnect = () => {
    noiseNode.stop();
    lfo.stop();
    volLfo.stop();
  };
  return controlNode as any;
}

function createBinauralBeats(ctx: AudioContext, destination: AudioNode) {
  const merger = ctx.createChannelMerger(2);
  
  // Left ear - 432 Hz
  const leftOsc = ctx.createOscillator();
  leftOsc.type = 'sine';
  leftOsc.frequency.value = 432;
  
  // Right ear - 436 Hz (4 Hz difference = Theta waves)
  const rightOsc = ctx.createOscillator();
  rightOsc.type = 'sine';
  rightOsc.frequency.value = 436;

  leftOsc.connect(merger, 0, 0);
  rightOsc.connect(merger, 0, 1);
  merger.connect(destination);

  leftOsc.start();
  rightOsc.start();

  const controlNode = ctx.createGain();
  controlNode.disconnect = () => {
    leftOsc.stop();
    rightOsc.stop();
  };
  return controlNode as any;
}
