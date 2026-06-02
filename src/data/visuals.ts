import plantas01 from "../assets/plantas/output01.jpg";
import plantas02 from "../assets/plantas/output02.jpg";
import plantas03 from "../assets/plantas/output03.jpg";
import plantas04 from "../assets/plantas/output04.jpg";

export interface VisualImage {
	src: ImageMetadata;
	alt: string;
	title?: string;
	description?: string;
}

export interface VisualProject {
	id: string;
	title: string;
	year: number;
	description: string;
	cover: ImageMetadata;
	images: VisualImage[];
}

export const visuals: VisualProject[] = [
	{
		id: "plantas",
		title: "plantas",
		year: 2026,
		description: "Uma série de experimentos visuais explorando formas botânicas, texturas orgânicas e processamento digital extremo.",
		cover: plantas01,
		images: [
			{ src: plantas01, alt: "planta #01 - plantas series", title: "#01" },
			{ src: plantas02, alt: "planta #02 - plantas series", title: "#02" },
			{ src: plantas03, alt: "planta #03 - plantas series", title: "#03" },
			{ src: plantas04, alt: "planta #04 - plantas series", title: "#04" }
		]
	}
];
