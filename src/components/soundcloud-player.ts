// ─── Types ─────────────────────────────────────────────────────────────────

type PlayerStateType =
	| "idle"
	| "loading"
	| "ready"
	| "playing"
	| "paused";
type PlayerEventName =
	| "ready"
	| "play"
	| "pause"
	| "finish"
	| "progress"
	| "seek"
	| "error";

interface ProgressData {
	currentPosition: number;
	relativePosition: number;
	loadProgress: number;
}

interface SoundObject {
	id: number;
	title: string;
	user: { username: string };
	permalink_url: string;
	access: "playable" | "preview" | "blocked";
}

// ─── Pattern 1: Script Singleton ───────────────────────────────────────────

let _scriptPromise: Promise<void> | null = null;

function loadWidgetScript(): Promise<void> {
	if ((window as any).SC) return Promise.resolve();
	if (_scriptPromise) return _scriptPromise;

	_scriptPromise = new Promise<void>((resolve, reject) => {
		const s = document.createElement("script");
		s.src = "https://w.soundcloud.com/player/api.js";
		s.onload = () => resolve();
		s.onerror = () =>
			reject(new Error("SC Widget script failed to load"));
		document.head.appendChild(s);
	});
	return _scriptPromise;
}

// ─── Pattern 2: WidgetFacade ────────────────────────────────────────────────

const SC_EVENTS: Record<PlayerEventName, string> = {
	ready: "ready",
	play: "play",
	pause: "pause",
	finish: "finish",
	progress: "playProgress",
	seek: "seek",
	error: "error",
};

class WidgetFacade {
	private w: any;

	constructor(iframe: HTMLIFrameElement) {
		this.w = (window as any).SC.Widget(iframe);
	}

	// Commands
	play() {
		this.w.play();
	}
	pause() {
		this.w.pause();
	}
	next() {
		this.w.next();
	}
	prev() {
		this.w.prev();
	}
	skip(i: number) {
		this.w.skip(i);
	}
	seekTo(ms: number) {
		this.w.seekTo(ms);
	}

	// Queries → Promise
	getSounds(): Promise<SoundObject[]> {
		return new Promise((r) => this.w.getSounds(r));
	}
	getDuration(): Promise<number> {
		return new Promise((r) => this.w.getDuration(r));
	}
	getCurrentSoundIndex(): Promise<number> {
		return new Promise((r) => this.w.getCurrentSoundIndex(r));
	}

	// Events
	on(event: PlayerEventName, handler: (data?: any) => void): void {
		this.w.bind(SC_EVENTS[event], handler);
	}
	off(event: PlayerEventName): void {
		this.w.unbind(SC_EVENTS[event]);
	}
	/** Unbind all listeners. Call only on page navigation. */
	destroy(): void {
		(Object.keys(SC_EVENTS) as PlayerEventName[]).forEach((e) =>
			this.off(e),
		);
	}
}

// ─── Pattern 3: PlayerState (state machine) ─────────────────────────────────

const VALID_TRANSITIONS: Record<PlayerStateType, PlayerStateType[]> = {
	idle: ["loading"],
	loading: ["ready", "idle"],
	ready: ["playing", "paused"],
	playing: ["paused", "ready"],
	paused: ["playing", "idle"],
};

class PlayerState {
	current: PlayerStateType = "idle";
	sounds: SoundObject[] = [];
	currentIndex = 0;
	durationMs = 0;

	get isPlaying() {
		return this.current === "playing";
	}

	transition(next: PlayerStateType): void {
		if (!VALID_TRANSITIONS[this.current]?.includes(next)) {
			console.warn(
				`[PlayerState] Unexpected: ${this.current} → ${next}`,
			);
		}
		this.current = next;
	}
}

// ─── Pattern 4a: PlayerView (DOM only) ─────────────────────────────────────

class PlayerView {
	private cardEl: HTMLElement;
	private loader: HTMLElement;
	private player: HTMLElement;
	private fill: HTMLElement;
	private loadFill: HTMLElement;
	private thumb: HTMLElement;
	private timeCur: HTMLElement;
	private timeTot: HTMLElement;
	private tracklist: HTMLElement;
	private trackTitle: HTMLElement;
	private trackArtist: HTMLElement;
	private playBtn: HTMLElement;
	private progressBar: HTMLElement;

	constructor(cardEl: HTMLElement) {
		this.cardEl = cardEl;
		const back = cardEl.querySelector<HTMLElement>(".card-back")!;
		this.loader =
			back.querySelector<HTMLElement>(".loader-container")!;
		this.player =
			back.querySelector<HTMLElement>(".custom-player")!;
		this.fill = back.querySelector<HTMLElement>(
			".player-progress-fill",
		)!;
		this.loadFill =
			back.querySelector<HTMLElement>(".player-load-fill")!;
		this.thumb = back.querySelector<HTMLElement>(".player-thumb")!;
		this.timeCur = back.querySelector<HTMLElement>(
			".player-time-current",
		)!;
		this.timeTot =
			back.querySelector<HTMLElement>(".player-time-total")!;
		this.tracklist =
			back.querySelector<HTMLElement>(".player-tracklist")!;
		this.trackTitle = back.querySelector<HTMLElement>(
			".player-track-title",
		)!;
		this.trackArtist = back.querySelector<HTMLElement>(
			".player-track-artist",
		)!;
		this.playBtn =
			back.querySelector<HTMLElement>(".player-playpause")!;
		this.progressBar = back.querySelector<HTMLElement>(
			".player-progress-bar",
		)!;
	}

	showSpinner(visible: boolean): void {
		this.loader.style.display = visible ? "flex" : "none";
		if (!visible) this.player.classList.add("visible");
	}

	renderTracks(
		sounds: SoundObject[],
		onSelect: (i: number) => void,
	): void {
		this.tracklist.innerHTML = "";
		sounds.forEach((s, i) => {
			const li = document.createElement("li");
			li.className = "player-track-item";
			li.setAttribute("role", "button");
			li.setAttribute("tabindex", "0");
			li.textContent = s.title;
			if (s.access === "blocked") {
				li.classList.add("blocked");
				li.setAttribute("aria-disabled", "true");
			}
			li.addEventListener("click", () => {
				if (s.access !== "blocked") onSelect(i);
			});
			li.addEventListener("keydown", (e: KeyboardEvent) => {
				if (e.key === "Enter" || e.key === " ") {
					e.preventDefault();
					if (s.access !== "blocked") onSelect(i);
				}
			});
			this.tracklist.appendChild(li);
		});
	}

	setActiveTrack(index: number, sound: SoundObject): void {
		this.tracklist
			.querySelectorAll<HTMLElement>(".player-track-item")
			.forEach((el, i) => {
				const isActive = i === index;
				el.classList.toggle("active", isActive);
				if (isActive) {
					el.scrollIntoView({
						block: "nearest",
						behavior: "smooth",
					});
				}
			});
		this.trackTitle.textContent = sound.title;
		this.trackArtist.textContent = sound.user.username;
	}

	setPlayIcon(playing: boolean): void {
		this.playBtn.setAttribute(
			"aria-label",
			playing ? "Pausar" : "Reproduzir",
		);
		this.playBtn.classList.toggle("playing", playing);
		// Toggle glowing dot on the card front
		this.cardEl.classList.toggle("playing", playing);
	}

	updateProgress(
		posMs: number,
		durMs: number,
		loadRatio: number,
	): void {
		const ratio = durMs > 0 ? Math.min(posMs / durMs, 1) : 0;
		const pct = `${ratio * 100}%`;
		this.fill.style.width = pct;
		this.thumb.style.left = pct;
		this.loadFill.style.width = `${loadRatio * 100}%`;
		this.progressBar.setAttribute(
			"aria-valuenow",
			String(Math.round(ratio * 100)),
		);

		const fmt = (ms: number) => {
			const s = Math.floor(ms / 1000);
			return `${Math.floor(s / 60)}:${String(s % 60).padStart(2, "0")}`;
		};
		this.timeCur.textContent = fmt(posMs);
		this.timeTot.textContent = fmt(durMs);
	}

	showError(msg: string): void {
		this.showSpinner(false);
		this.trackTitle.textContent = msg;
		console.error("[AlbumPlayer]", msg);
	}
}

// ─── Pattern 4b: PlayerController (coordinates Facade ↔ State ↔ View) ──────

class PlayerController {
	private readonly facade: WidgetFacade;
	private readonly state = new PlayerState();
	private readonly view: PlayerView;
	private _currentPositionMs = 0;

	constructor(iframe: HTMLIFrameElement, cardEl: HTMLElement) {
		this.facade = new WidgetFacade(iframe);
		this.view = new PlayerView(cardEl);
		this.state.transition("loading");
		this._bindWidgetEvents();
		this._bindUIEvents(cardEl);
	}

	private _bindWidgetEvents(): void {
		// Widget loaded — populate tracklist and reveal player
		this.facade.on("ready", async () => {
			this.state.transition("ready");
			try {
				const [sounds, dur] = await Promise.all([
					this.facade.getSounds(),
					this.facade.getDuration(),
				]);
				this.state.sounds = sounds;
				this.state.durationMs = dur;
				this.view.renderTracks(sounds, (i) => this._skipTo(i));
				if (sounds.length > 0) {
					this.view.setActiveTrack(0, sounds[0]);
					this.view.updateProgress(0, dur, 0);
				}
				this.view.showSpinner(false);
			} catch {
				this.view.showError("Erro ao carregar playlist.");
			}
		});

		// Track started playing
		this.facade.on("play", async () => {
			this.state.transition("playing");
			const [idx, dur] = await Promise.all([
				this.facade.getCurrentSoundIndex(),
				this.facade.getDuration(),
			]);
			// Guard: state may have changed during await (e.g. rapid pause)
			if (this.state.current !== "playing") return;
			this.state.currentIndex = idx;
			this.state.durationMs = dur;
			if (this.state.sounds[idx]) {
				this.view.setActiveTrack(idx, this.state.sounds[idx]);
			}
			this.view.setPlayIcon(true);
		});

		// Playback paused
		this.facade.on("pause", () => {
			this.state.transition("paused");
			this.view.setPlayIcon(false);
		});

		// Track finished — Widget auto-advances; PLAY fires for next track
		this.facade.on("finish", () => {
			this.state.transition("ready");
			this.view.setPlayIcon(false);
		});

		// Playback progress tick
		this.facade.on("progress", (data: ProgressData) => {
			if (!data) return;
			this._currentPositionMs = data.currentPosition;
			this.view.updateProgress(
				data.currentPosition,
				this.state.durationMs,
				data.loadProgress,
			);
		});

		// Widget error
		this.facade.on("error", () => {
			this.view.showError("Esta faixa não está disponível.");
		});
	}

	private _bindUIEvents(cardEl: HTMLElement): void {
		const back = cardEl.querySelector<HTMLElement>(".card-back")!;

		back.querySelector(".player-playpause")!.addEventListener(
			"click",
			() => this._togglePlay(),
		);

		back.querySelector(".player-next")!.addEventListener("click", () =>
			this.facade.next(),
		);

		back.querySelector(".player-prev")!.addEventListener("click", () =>
			this.facade.prev(),
		);

		// Click-to-seek on progress bar
		const progressBar = back.querySelector<HTMLElement>(".player-progress-bar")!;
		progressBar.addEventListener("click", (e: Event) => {
			const bar = e.currentTarget as HTMLElement;
			const rect = bar.getBoundingClientRect();
			const ratio = Math.max(
				0,
				Math.min(
					1,
					((e as MouseEvent).clientX - rect.left) / rect.width,
				),
			);
			this.facade.seekTo(ratio * this.state.durationMs);
		});

		// Keyboard seek on progress bar (ArrowLeft / ArrowRight)
		progressBar.addEventListener("keydown", (e: KeyboardEvent) => {
			if (e.key === "ArrowLeft" || e.key === "ArrowRight") {
				e.preventDefault();
				const delta = e.key === "ArrowLeft" ? -5000 : 5000;
				const newPos = Math.max(
					0,
					Math.min(this.state.durationMs, this._currentPositionMs + delta),
				);
				this.facade.seekTo(newPos);
				// Optimistically update view for snappy responsiveness
				this.view.updateProgress(
					newPos,
					this.state.durationMs,
					this.state.sounds.length ? 1 : 0,
				);
			}
		});
	}

	private _togglePlay(): void {
		this.state.isPlaying ? this.facade.pause() : this.facade.play();
	}

	private _skipTo(index: number): void {
		this.facade.skip(index);
		// Widget fires PLAY after skip → state/view updated in 'play' handler
	}

	/** Call ONLY on page navigation (astro:before-swap). Not on card close. */
	destroy(): void {
		if (this.state.isPlaying) this.facade.pause();
		this.facade.destroy();
	}
}

// ─── Module-level controller registry ──────────────────────────────────────

// WeakMap: when Astro swaps the DOM, old elements are GC'd automatically
const controllers = new WeakMap<HTMLElement, PlayerController>();

// ─── Helpers ───────────────────────────────────────────────────────────────

function buildEmbedUrl(soundcloudUrl: string): string {
	const params = new URLSearchParams({
		url: soundcloudUrl,
		color: "#ff5500",
		auto_play: "false",
		hide_related: "true",
		show_comments: "false",
		show_user: "false",
		show_reposts: "false",
		show_teaser: "false",
		visual: "false",
	});
	return `https://w.soundcloud.com/player/?${params}`;
}

// ─── Bootstrap ─────────────────────────────────────────────────────────────

export function setupAlbumCards(): void {
	document
		.querySelectorAll<HTMLElement>(".album-card")
		.forEach((card) => {
			if (card.dataset.initialized === "true") return;
			card.dataset.initialized = "true";

			const closeBtn =
				card.querySelector<HTMLButtonElement>(".close-btn");
			const iframeContainer =
				card.querySelector<HTMLElement>(".iframe-container")!;
			const loaderEl =
				card.querySelector<HTMLElement>(".loader-container")!;
			const soundcloudUrl = card.dataset.soundcloudUrl ?? "";

			// ── Open: flip card and (on first open) init player ────────────
			card.addEventListener("click", async (e: MouseEvent) => {
				const target = e.target as HTMLElement;

				// Don't interfere with close button or attribution link
				if (target.closest(".close-btn")) return;
				if (target.closest(".sc-attribution")) return;

				// Already showing back face
				if (card.classList.contains("active")) return;

				card.classList.add("active");

				// First open: load Widget, inject iframe, create controller
				if (!iframeContainer.querySelector("iframe")) {
					loaderEl.style.display = "flex"; // show spinner immediately

					try {
						await loadWidgetScript();
					} catch {
						card.classList.remove("active");
						loaderEl.style.display = "none";
						return;
					}

					const iframe = document.createElement("iframe");
					iframe.id = `sc-player-${Math.random().toString(36).slice(2)}`;
					iframe.src = buildEmbedUrl(soundcloudUrl);
					iframe.allow = "autoplay";
					iframe.setAttribute("scrolling", "no");
					iframe.setAttribute("frameborder", "no");
					Object.assign(iframe.style, {
						border: "none",
						display: "block",
						width: "100%",
						height: "100%",
					});
					iframeContainer.appendChild(iframe);

					controllers.set(
						card,
						new PlayerController(iframe, card),
					);
				}
				// Re-opens: controller already running, no action needed
			});

			// ── Close: visual flip only — audio continues ───────────────────
			closeBtn?.addEventListener("click", (e: MouseEvent) => {
				e.stopPropagation();
				card.classList.remove("active");
				// Intentionally NO pause / destroy here
			});
		});
}

// Cleanup ONLY on page navigation (not on card close)
document.addEventListener("astro:before-swap", () => {
	document
		.querySelectorAll<HTMLElement>(".album-card")
		.forEach((card) => {
			controllers.get(card)?.destroy();
		});
});

// Re-initialise after Astro view transition
document.addEventListener("astro:after-swap", setupAlbumCards);

// Initial page load
setupAlbumCards();
