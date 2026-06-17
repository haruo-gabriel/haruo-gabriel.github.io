// ─── Constants ─────────────────────────────────────────────────────────────

const PLAYHEAD_RESET_THRESHOLD_MS = 800;
const REWIND_THRESHOLD_MS = 5000;

// ─── Types ─────────────────────────────────────────────────────────────────

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
	duration?: number;
}

// ─── Time Formatting Helper ────────────────────────────────────────────────

function formatTime(ms: number): string {
	const totalSeconds = Math.floor(ms / 1000);
	const minutes = Math.floor(totalSeconds / 60);
	const seconds = String(totalSeconds % 60).padStart(2, "0");
	return `${minutes}:${seconds}`;
}

// ─── Script Singleton ──────────────────────────────────────────────────────

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

// ─── PlayerController ──────────────────────────────────────────────────────

class PlayerController {
	private readonly widget: any;
	private readonly cardEl: HTMLElement;
	
	// DOM Elements
	private readonly loader: HTMLElement;
	private readonly player: HTMLElement;
	private readonly fill: HTMLElement;
	private readonly loadFill: HTMLElement;
	private readonly thumb: HTMLElement;
	private readonly timeCur: HTMLElement;
	private readonly timeTot: HTMLElement;
	private readonly tracklist: HTMLElement;
	private readonly trackTitle: HTMLElement;
	private readonly trackArtist: HTMLElement;
	private readonly playBtn: HTMLElement;
	private readonly progressBar: HTMLElement;
	private readonly nextBtn: HTMLButtonElement;
	private readonly prevBtn: HTMLButtonElement;

	// State
	private sounds: SoundObject[] = [];
	private currentIndex = 0;
	private durationMs = 0;
	private isPlaying = false;
	private _currentPositionMs = 0;
	private shouldResetPlayhead = false;

	constructor(iframe: HTMLIFrameElement, cardEl: HTMLElement) {
		this.cardEl = cardEl;
		this.widget = (window as any).SC.Widget(iframe);

		// Cache DOM Elements
		this.loader = cardEl.querySelector<HTMLElement>(".loader-container")!;
		this.player = cardEl.querySelector<HTMLElement>(".custom-player")!;
		this.fill = cardEl.querySelector<HTMLElement>(".player-progress-fill")!;
		this.loadFill = cardEl.querySelector<HTMLElement>(".player-load-fill")!;
		this.thumb = cardEl.querySelector<HTMLElement>(".player-thumb")!;
		this.timeCur = cardEl.querySelector<HTMLElement>(".player-time-current")!;
		this.timeTot = cardEl.querySelector<HTMLElement>(".player-time-total")!;
		this.tracklist = cardEl.querySelector<HTMLElement>(".player-tracklist")!;
		this.trackTitle = cardEl.querySelector<HTMLElement>(".player-track-title")!;
		this.trackArtist = cardEl.querySelector<HTMLElement>(".player-track-artist")!;
		this.playBtn = cardEl.querySelector<HTMLElement>(".player-playpause")!;
		this.progressBar = cardEl.querySelector<HTMLElement>(".player-progress-bar")!;
		this.nextBtn = cardEl.querySelector<HTMLButtonElement>(".player-next")!;
		this.prevBtn = cardEl.querySelector<HTMLButtonElement>(".player-prev")!;

		this.showSpinner(true);
		this._bindWidgetEvents();
		this._bindUIEvents();
	}

	private _bindWidgetEvents(): void {
		// Widget loaded — populate tracklist and reveal player
		this.widget.bind("ready", async () => {
			try {
				const [sounds, dur] = await Promise.all([
					new Promise<SoundObject[]>((r) => this.widget.getSounds(r)),
					new Promise<number>((r) => this.widget.getDuration(r)),
				]);
				this.sounds = sounds;
				this.durationMs = dur;
				this.renderTracks();
				if (sounds.length > 0) {
					this.setActiveTrack(0, sounds[0]);
					this.updateProgress(0, dur, 0);
					this.updateNavigationButtons();
				}
				this.showSpinner(false);
			} catch {
				this.showError("Erro ao carregar playlist.");
			}
		});

		// Track started playing
		this.widget.bind("play", () => {
			this.isPlaying = true;
			this.setPlayIcon(true);

			this.widget.getCurrentSoundIndex((idx: number) => {
				this.widget.getDuration((dur: number) => {
					if (!this.isPlaying) return;

					if (idx !== this.currentIndex) {
						this.shouldResetPlayhead = true;
						this.currentIndex = idx;
						this.durationMs = dur;
						this._currentPositionMs = 0;
						this.updateProgress(0, dur, 0);
						this.setActiveTrack(idx, this.sounds[idx]);
						this.updateNavigationButtons();
					} else {
						this.durationMs = dur;
						this.setActiveTrack(idx, this.sounds[idx]);
						this.updateNavigationButtons();
					}
				});
			});
		});

		// Playback paused
		this.widget.bind("pause", () => {
			this.isPlaying = false;
			this.setPlayIcon(false);
		});

		// Track finished — Widget auto-advances; PLAY fires for next track
		this.widget.bind("finish", () => {
			this.isPlaying = false;
			this.setPlayIcon(false);
			this.shouldResetPlayhead = true;
		});

		// Playback progress tick
		this.widget.bind("playProgress", (data: ProgressData) => {
			if (!data) return;

			// Handle SoundCloud caching playback positions across tracks
			if (this.shouldResetPlayhead) {
				if (data.currentPosition > PLAYHEAD_RESET_THRESHOLD_MS) {
					this.widget.seekTo(0);
					return; // Ignore this tick to prevent UI jump
				}
				this.shouldResetPlayhead = false;
			}

			this._currentPositionMs = data.currentPosition;
			this.updateProgress(
				data.currentPosition,
				this.durationMs,
				data.loadProgress,
			);
			this.updateNavigationButtons();
		});

		// Widget error
		this.widget.bind("error", () => {
			this.showError("Esta faixa não está disponível.");
		});
	}

	private _bindUIEvents(): void {
		this.playBtn.addEventListener("click", () => this._togglePlay());

		this.nextBtn.addEventListener("click", () => {
			if (this.sounds.length === 0) return;
			if (this.currentIndex < this.sounds.length - 1) {
				this._skipTo(this.currentIndex + 1);
			}
		});

		this.prevBtn.addEventListener("click", () => {
			if (this.sounds.length === 0) return;
			
			// SoundCloud standard: 5s (5000ms) threshold
			if (this._currentPositionMs >= REWIND_THRESHOLD_MS) {
				this.shouldResetPlayhead = true;
				this._currentPositionMs = 0;
				this.updateProgress(0, this.durationMs, 0);
				this.updateNavigationButtons();
				this.widget.seekTo(0);
			} else {
				if (this.currentIndex > 0) {
					this._skipTo(this.currentIndex - 1);
				}
			}
		});

		// Click-to-seek on progress bar
		this.progressBar.addEventListener("click", (e: Event) => {
			const bar = e.currentTarget as HTMLElement;
			const rect = bar.getBoundingClientRect();
			const ratio = Math.max(
				0,
				Math.min(
					1,
					((e as MouseEvent).clientX - rect.left) / rect.width,
				),
			);
			this.widget.seekTo(ratio * this.durationMs);
		});

		// Keyboard seek on progress bar (ArrowLeft / ArrowRight)
		this.progressBar.addEventListener("keydown", (e: KeyboardEvent) => {
			if (e.key === "ArrowLeft" || e.key === "ArrowRight") {
				e.preventDefault();
				const delta = e.key === "ArrowLeft" ? -REWIND_THRESHOLD_MS : REWIND_THRESHOLD_MS;
				const newPos = Math.max(
					0,
					Math.min(this.durationMs, this._currentPositionMs + delta),
				);
				this.widget.seekTo(newPos);
				// Optimistically update view for snappy responsiveness
				this.updateProgress(
					newPos,
					this.durationMs,
					this.sounds.length ? 1 : 0,
				);
			}
		});
	}

	private _togglePlay(): void {
		this.isPlaying ? this.widget.pause() : this.widget.play();
	}

	private _skipTo(index: number): void {
		if (index === this.currentIndex) return;
		this.shouldResetPlayhead = true;
		this.currentIndex = index;
		this.durationMs = this.sounds[index]?.duration || 0;
		this._currentPositionMs = 0;
		this.updateProgress(0, this.durationMs, 0);
		this.updateNavigationButtons();
		this.widget.skip(index);
	}

	private updateNavigationButtons(): void {
		if (this.sounds.length === 0) return;

		const isFirst = this.currentIndex === 0;
		const isLast = this.currentIndex === this.sounds.length - 1;

		// Prev button is disabled on the first track if we are under the 5-second rewind threshold
		const disablePrev = isFirst && this._currentPositionMs < REWIND_THRESHOLD_MS;

		const prevDisabledAttr = this.prevBtn.hasAttribute("disabled");
		if (disablePrev !== prevDisabledAttr) {
			if (disablePrev) {
				this.prevBtn.setAttribute("disabled", "true");
				this.prevBtn.style.opacity = "0.35";
				this.prevBtn.style.cursor = "not-allowed";
				this.prevBtn.style.pointerEvents = "none";
			} else {
				this.prevBtn.removeAttribute("disabled");
				this.prevBtn.style.opacity = "";
				this.prevBtn.style.cursor = "";
				this.prevBtn.style.pointerEvents = "";
			}
		}

		const nextDisabledAttr = this.nextBtn.hasAttribute("disabled");
		if (isLast !== nextDisabledAttr) {
			if (isLast) {
				this.nextBtn.setAttribute("disabled", "true");
				this.nextBtn.style.opacity = "0.35";
				this.nextBtn.style.cursor = "not-allowed";
				this.nextBtn.style.pointerEvents = "none";
			} else {
				this.nextBtn.removeAttribute("disabled");
				this.nextBtn.style.opacity = "";
				this.nextBtn.style.cursor = "";
				this.nextBtn.style.pointerEvents = "";
			}
		}
	}

	// ─── View Helpers ────────────────────────────────────────────────────────

	private showSpinner(visible: boolean): void {
		this.loader.style.display = visible ? "flex" : "none";
		if (!visible) this.player.classList.add("visible");
	}

	private renderTracks(): void {
		this.tracklist.innerHTML = "";
		this.sounds.forEach((s, i) => {
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
				if (s.access !== "blocked") this._skipTo(i);
			});
			li.addEventListener("keydown", (e: KeyboardEvent) => {
				if (e.key === "Enter" || e.key === " ") {
					e.preventDefault();
					if (s.access !== "blocked") this._skipTo(i);
				}
			});
			this.tracklist.appendChild(li);
		});
	}

	private setActiveTrack(index: number, sound: SoundObject): void {
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

	private setPlayIcon(playing: boolean): void {
		this.playBtn.setAttribute(
			"aria-label",
			playing ? "Pausar" : "Reproduzir",
		);
		this.playBtn.classList.toggle("playing", playing);
		// Toggle glowing dot on the card front
		this.cardEl.classList.toggle("playing", playing);
	}

	private updateProgress(
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

		this.timeCur.textContent = formatTime(posMs);
		this.timeTot.textContent = formatTime(durMs);
	}

	private showError(msg: string): void {
		this.showSpinner(false);
		this.trackTitle.textContent = msg;
		console.error("[AlbumPlayer]", msg);
	}

	/** Call ONLY on page navigation (astro:before-swap). Not on card close. */
	destroy(): void {
		if (this.isPlaying) this.widget.pause();
		["ready", "play", "pause", "finish", "playProgress", "error"].forEach((e) => {
			this.widget.unbind(e);
		});
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

			const header =
				card.querySelector<HTMLElement>(".card-header")!;
			const iframeContainer =
				card.querySelector<HTMLElement>(".iframe-container")!;
			const loaderEl =
				card.querySelector<HTMLElement>(".loader-container")!;
			const soundcloudUrl = card.dataset.soundcloudUrl ?? "";

			// ── Toggle: expand/collapse panel on header click ─────────────
			header.addEventListener("click", async (e: MouseEvent) => {
				const target = e.target as HTMLElement;

				// Don't interfere with attribution link
				if (target.closest(".sc-attribution")) return;

				// Already expanded — collapse it
				if (card.classList.contains("active")) {
					card.classList.remove("active");
					// Intentionally NO pause / destroy here — audio continues
					return;
				}

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
