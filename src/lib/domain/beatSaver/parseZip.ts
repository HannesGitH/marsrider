import type { definitions } from "$lib/types/BeatSaverTypes";
import JSZip from "jszip";

export type Obstacle = {
  _time: number;
  _lineIndex: number;
  _type: number;
  _duration: number;
  _width: number;
};
export type Note = {
  _time: number;
  _lineIndex: number;
  _lineLayer: number;
  _type: number;
  _cutDirection: number;
};
export type Event = {
  _time: number;
  _type: number;
  _value: number;
  _customData: any;
};

export type Data = {
  soundTrack: ArrayBuffer;
  map: {
    _version: string;
    _events: Event[];
    _notes: Note[];
    _obstacles: Obstacle[];
  };
  bpm: number;
  beatOffset: number;
};
export type InputParams = {
  difficulty: definitions["MapDifficulty"]["difficulty"];
};
export type Fetcher = () => Promise<Response>;

//TODO: check if needs worker
export const parseZip = async (
  fetcher: Fetcher,
  { difficulty }: InputParams
): Promise<Data> => {
  const timeStart = Date.now();
  var elapsed = Date.now() - timeStart;

  console.log("fetching zip");
  const response = await fetcher();
  elapsed = Date.now() - timeStart - elapsed;
  console.log("fetched zip in", elapsed);

  const buffer = await response.arrayBuffer();
  const zip = await JSZip.loadAsync(buffer);
  elapsed = Date.now() - timeStart - elapsed;
  console.log("loaded zip in", elapsed);

  const soundTrackBuff = await zip
    .filter((path) => path.endsWith(".egg"))[0]
    .async("arraybuffer");
  // const soundTrack = new Audio(URL.createObjectURL(new Blob([await soundTrackBuff])));

  const infoStr = await zip
    .filter((path) => path.toLowerCase().includes("info"))[0]
    .async("string");
  const infoJson = JSON.parse(infoStr);

  const diff = infoJson._difficultyBeatmapSets[0]._difficultyBeatmaps.filter(
    (diff: any) => diff._difficulty == difficulty
  )[0];
  const diffFileName = diff._beatmapFilename;
  const bpm = infoJson._beatsPerMinute;

  const mapStr = await zip.file(diffFileName)!.async("string");
  const map = JSON.parse(mapStr!);
  const beatOffset = map._time ?? 0;
  elapsed = Date.now() - timeStart - elapsed;
  console.log("parsed zip in", elapsed);

  // console.log(map)

  return { soundTrack: soundTrackBuff, map, bpm, beatOffset };
};
