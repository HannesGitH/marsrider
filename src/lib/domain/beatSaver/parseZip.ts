import type { definitions } from "$lib/types/BeatSaverTypes";
import JSZip from "jszip";

//todo: not any
export type Data = {soundTrack: ArrayBuffer, map: any};
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