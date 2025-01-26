/*
  Uses Web Audio API decodeAudioData() to decode
  the extracted buffer.
*/
export const createSoundWithBuffer = async (
  buffer: ArrayBuffer
): Promise<MyAudio> => {
  var context = new AudioContext();
  var audioSource = context.createBufferSource();
  audioSource.connect(context.destination);

  await context.decodeAudioData(buffer, function (res) {
    audioSource.buffer = res;
  });

  return new MyAudio({ source: audioSource, ctx: context });
};

export class MyAudio {
  private _context: AudioContext;
  private _source: AudioBufferSourceNode;
  private _started: boolean = false;
  constructor({
    source,
    ctx,
  }: {
    source: AudioBufferSourceNode;
    ctx: AudioContext;
  }) {
    this._source = source;
    this._context = ctx;
  }

  private _start() {
    if (!this._started) {
      this._source?.start();
      this._started = true;
    }
  }
  togglePlayPause = ({shouldPause}: {shouldPause?: boolean}) :boolean => {
    console.log('togglePlayPause', shouldPause);
    if (shouldPause ?? this._context.state === "running") {
      this._context.suspend();
      return false;
    } else if (this._context.state === "suspended") {
      this._start();
      this._context.resume();
    }
    return true;
  }
}
