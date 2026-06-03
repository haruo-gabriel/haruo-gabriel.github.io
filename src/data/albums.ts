import imensidaoCover from "../assets/Imensidao-capa.png";
import aDerivaCover from "../assets/a_deriva-capa.png";
import microCCover from "../assets/MicroC_Rev4-capa.png";

export interface Album {
	title: string;
	artist: string;
	cover: ImageMetadata;
	year: number;
	tracks: string[];
	soundcloudUrl: string;
}

export const albums: Album[] = [
	{
		title: "Imensidão",
		artist: "haruo g.",
		cover: imensidaoCover,
		year: 2024,
		tracks: [
			"Encontro/Pouso",
			"Vislumbre"
		],
		soundcloudUrl: "https://soundcloud.com/haruooo/sets/imensidao"
	},
	{
		title: "à deriva",
		artist: "haruo g.",
		cover: aDerivaCover,
		year: 2025,
		tracks: [
			"à deriva",
			"todas as flores morrem no outono"
		],
		soundcloudUrl: "https://soundcloud.com/haruooo/sets/a-deriva"
	},
	{
		title: "MicroC Rev4",
		artist: "haruo g.",
		cover: microCCover,
		year: 2025,
		tracks: [
			"Sintomática",
			"HPPD"
		],
		soundcloudUrl: "https://soundcloud.com/haruooo/sets/microc-rev4"
	}
];
