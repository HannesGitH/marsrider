import type { definitions } from "$lib/types/BeatSaverTypes";
import JSZip from "jszip";

export type Obstacle = {_time: number, _lineIndex: number, _type: number, _duration: number, _width: number};
export type Note = {_time: number, _lineIndex: number, _lineLayer: number, _type: number, _cutDirection: number};
export type Event = {_time: number, _type: number, _value: number, _customData: any};

export type Data = {soundTrack: ArrayBuffer, map: { _version: string, _events: Event[], _notes: Note[], _obstacles: Obstacle[] }};
export type InputParams = {difficulty: definitions['MapDifficulty']['difficulty']};

export const parseZip = async (zipUrl: string, {difficulty}:InputParams):Promise<Data> => {
	const response = await fetch(zipUrl);
	const buffer = await response.arrayBuffer();
	const zip = await JSZip.loadAsync(buffer);
    const soundTrackBuff = await zip.filter((path) => path.endsWith(".egg"))[0].async("arraybuffer");
    // const soundTrack = new Audio(URL.createObjectURL(new Blob([await soundTrackBuff])));
    const mapStr = await zip.file(`${difficulty}Standard.dat`)?.async("string");
    const map = JSON.parse(mapStr!);
	return {soundTrack: soundTrackBuff, map };
}