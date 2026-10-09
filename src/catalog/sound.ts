let ctx: AudioContext | null = null;

/** Som sintetizado de folha de papel (ruído filtrado com varredura), sem arquivo de áudio. */
export function playPaper() {
  try {
    ctx ??= new AudioContext();
    const dur = 0.42;
    const buf = ctx.createBuffer(1, Math.floor(ctx.sampleRate * dur), ctx.sampleRate);
    const data = buf.getChannelData(0);
    for (let i = 0; i < data.length; i++) {
      const t = i / data.length;
      // envelope com dois "picos": o descolar e o assentar da folha
      const env = Math.pow(Math.sin(Math.PI * t), 1.6) * (0.55 + 0.45 * Math.sin(t * 9));
      data[i] = (Math.random() * 2 - 1) * env * (0.6 + 0.4 * Math.random());
    }
    const src = ctx.createBufferSource();
    src.buffer = buf;
    const bp = ctx.createBiquadFilter();
    bp.type = "bandpass";
    bp.Q.value = 0.7;
    bp.frequency.setValueAtTime(1800, ctx.currentTime);
    bp.frequency.exponentialRampToValueAtTime(4200, ctx.currentTime + dur);
    const gain = ctx.createGain();
    gain.gain.value = 0.22;
    src.connect(bp).connect(gain).connect(ctx.destination);
    src.start();
  } catch {}
}
