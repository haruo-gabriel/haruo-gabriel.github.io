export class Tag {
	readonly id: string;
	readonly label: string;
	readonly category: string;

	constructor(id: string, label: string, category: string = "general") {
		this.id = id;
		this.label = label;
		this.category = category;
	}

	get cssClass(): string {
		return `tag-${this.id}`;
	}
}

export class LanguageTag extends Tag {
	constructor(id: string, label: string) {
		super(id, label, "language");
	}
}

export class ToolTag extends Tag {
	constructor(id: string, label: string) {
		super(id, label, "tool");
	}
}

export class DomainTag extends Tag {
	constructor(id: string, label: string) {
		super(id, label, "domain");
	}
}

export class ProjectTag extends Tag {
	constructor(id: string, label: string) {
		super(id, label, "project");
	}
}

// Predefined Tags Registry for type-safety and reusability
export const TAGS = {
	// Languages
	CPP: new LanguageTag("cpp", "C++"),
	PYTHON: new LanguageTag("python", "Python"),
	TYPESCRIPT: new LanguageTag("typescript", "TypeScript"),

	// Tools / Frameworks
	DJANGO: new ToolTag("django", "Django"),
	NEXT_JS: new ToolTag("nextjs", "Next.js"),
	POSTGRESQL: new ToolTag("postgresql", "PostgreSQL"),
	DOCKER: new ToolTag("docker", "Docker"),
	QT: new ToolTag("qt", "Qt"),
	ASTRO: new ToolTag("astro", "Astro"),
	GITHUB_PAGES: new ToolTag("github-pages", "GitHub Pages"),
	GITHUB_ACTIONS: new ToolTag("github-actions", "GitHub Actions"),
	JUCE_FRAMEWORK: new ToolTag("juce-framework", "JUCE"),
	DAISY_SEED: new ToolTag("daisy-seed", "Daisy Seed"),

	// Domains
	SOFTWARE_ENGINEERING: new DomainTag("software-engineering", "Software Engineering"),
	WEB_DEVELOPMENT: new DomainTag("web-development", "Web Development"),
	FULL_STACK: new DomainTag("fullstack", "Full-Stack"),
	DATA_ENGINEERING: new DomainTag("data-engineering", "Data Engineering"),
	DESKTOP_APP: new DomainTag("desktop-app", "Desktop App"),
	AUDIO_CODING: new DomainTag("audio-coding", "Audio Coding"),
	DSP: new DomainTag("dsp", "DSP"),
	DARWIN: new DomainTag("darwin", "Darwin"),
	HARDWARE: new DomainTag("hardware", "Hardware"),
	EMBEDDED_SYSTEMS: new DomainTag("embedded-systems", "Embedded Systems"),
	GUITAR_PEDAL: new DomainTag("guitar-pedal", "Guitar Pedal"),
	SYNTH: new DomainTag("synth", "Synth"),
	PCB_LAYOUT: new DomainTag("pcb-layout", "PCB Layout"),

	// Projects
	PLUGDATA: new ProjectTag("plugdata", "plugdata"),
	PURE_DATA: new ProjectTag("pure-data", "Pure Data"),
} as const;

export type TagId = keyof typeof TAGS;
