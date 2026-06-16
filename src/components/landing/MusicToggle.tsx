'use client';

import { useEffect, useState, useRef } from 'react';
import { motion } from 'framer-motion';
import { HiMiniSpeakerWave, HiMiniSpeakerXMark } from 'react-icons/hi2';

export default function MusicToggle() {
  const [muted, setMuted] = useState(true);
  const audioCtxRef = useRef<AudioContext | null>(null);
  const gainNodeRef = useRef<GainNode | null>(null);
  const osc1Ref = useRef<OscillatorNode | null>(null);
  const osc2Ref = useRef<OscillatorNode | null>(null);
  const filterRef = useRef<BiquadFilterNode | null>(null);

  // Sync preference with localStorage on mount
  useEffect(() => {
    const saved = localStorage.getItem('orian-muted');
    if (saved !== null) {
      Promise.resolve().then(() => {
        setMuted(saved === 'true');
      });
    }
  }, []);

  // Initialize and run Web Audio API synthesizer for procedural cosmic drone
  const startDrone = () => {
    try {
      const AudioContextClass = window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
      const ctx = new AudioContextClass();
      audioCtxRef.current = ctx;

      // Master gain node
      const masterGain = ctx.createGain();
      masterGain.gain.setValueAtTime(0.08, ctx.currentTime); // keep it soft and ambient
      masterGain.connect(ctx.destination);
      gainNodeRef.current = masterGain;

      // Lowpass filter for deep space hum
      const filter = ctx.createBiquadFilter();
      filter.type = 'lowpass';
      filter.frequency.setValueAtTime(100, ctx.currentTime);
      filter.connect(masterGain);
      filterRef.current = filter;

      // Oscillator 1 - Deep base hum (sine wave, 55Hz - A1 note)
      const osc1 = ctx.createOscillator();
      osc1.type = 'sine';
      osc1.frequency.setValueAtTime(55, ctx.currentTime);
      osc1.connect(filter);
      osc1.start();
      osc1Ref.current = osc1;

      // Oscillator 2 - Subtle metallic drone (sawtooth wave, 110Hz - A2 note)
      const osc2 = ctx.createOscillator();
      osc2.type = 'triangle';
      osc2.frequency.setValueAtTime(110, ctx.currentTime);
      
      // Separate gain for secondary oscillator to keep it quiet
      const osc2Gain = ctx.createGain();
      osc2Gain.gain.setValueAtTime(0.02, ctx.currentTime);
      
      osc2.connect(osc2Gain);
      osc2Gain.connect(filter);
      osc2.start();
      osc2Ref.current = osc2;

      // Modulator - LFO to slowly sweep filter frequency (creating breathing space cabin sound)
      const lfo = ctx.createOscillator();
      lfo.type = 'sine';
      lfo.frequency.setValueAtTime(0.1, ctx.currentTime); // 10 second cycle

      const lfoGain = ctx.createGain();
      lfoGain.gain.setValueAtTime(30, ctx.currentTime); // oscillate by 30Hz

      lfo.connect(lfoGain);
      lfoGain.connect(filter.frequency);
      lfo.start();
    } catch (e) {
      console.error('Failed to initialize audio context:', e);
    }
  };

  const stopDrone = () => {
    try {
      if (osc1Ref.current) osc1Ref.current.stop();
      if (osc2Ref.current) osc2Ref.current.stop();
      if (audioCtxRef.current) audioCtxRef.current.close();

      osc1Ref.current = null;
      osc2Ref.current = null;
      audioCtxRef.current = null;
      gainNodeRef.current = null;
    } catch (e) {
      console.error('Failed to stop audio context:', e);
    }
  };

  const toggleSound = () => {
    const nextMuted = !muted;
    setMuted(nextMuted);
    localStorage.setItem('orian-muted', String(nextMuted));

    if (!nextMuted) {
      // Start drone
      if (!audioCtxRef.current) {
        startDrone();
      }
    } else {
      // Stop drone
      stopDrone();
    }
  };

  // Cleanup audio nodes on unmount
  useEffect(() => {
    return () => {
      stopDrone();
    };
  }, []);

  return (
    <motion.button
      whileHover={{ scale: 1.1 }}
      whileTap={{ scale: 0.9 }}
      onClick={toggleSound}
      className="fixed bottom-6 right-6 z-50 w-12 h-12 rounded-full glass border border-neon-cyan/30 flex items-center justify-center text-neon-cyan hover:text-star-white hover:border-neon-cyan transition-all duration-300 shadow-[0_0_15px_rgba(0,245,255,0.25)] cursor-pointer"
      title={muted ? 'Unmute space ambient hum' : 'Mute space ambient hum'}
    >
      {muted ? (
        <HiMiniSpeakerXMark className="w-5 h-5 text-moon-silver/60" />
      ) : (
        <HiMiniSpeakerWave className="w-5 h-5 animate-pulse" />
      )}
    </motion.button>
  );
}
