import imensidaoCover from "../assets/Imensidao-capa.png";
import aDerivaCover from "../assets/a_deriva-capa.png";
import microCCover from "../assets/MicroC_Rev4-capa.png";

export interface Album {
	title: string;
	cover: ImageMetadata;
	year: number;
	tracks: string[];
}

export const albums: Album[] = [
	{
		title: "Imensidão",
		cover: imensidaoCover,
		year: 2024,
		tracks: [
			"Encontro/Pouso",
			"Vislumbre"
		]
	},
	{
		title: "à deriva",
		cover: aDerivaCover,
		year: 2025,
		tracks: [
			"à deriva",
			"todas as flores morrem no outono"
		]
	},
	{
		title: "MicroC Rev4",
		cover: microCCover,
		year: 2025,
		tracks: [
			"Sintomática",
			"HPPD"
		]
	}
];
