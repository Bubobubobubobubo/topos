<script>
	import topos_frog from '$lib/images/topos_frog.svg';
</script>

<header class="py-0 block">
	<div id="topbar" class="mx-auto flex flex-wrap pl-2 py-1 flex-row items-center bg-background">
		<a class="flex title-font font-medium items-center mb-0">
			<img
				src={topos_frog}
				class="w-12 h-12 text-selection_foreground p-2 rounded-full bg-foreground"
				alt="Topos Frog Logo"
			/>
			<input
				class="hidden transparent xl:block ml-4 text-2xl bg-background text-brightwhite placeholder-brightwhite"
				type="text"
				placeholder="Topos"
			/>
		</a>
		<nav class="py-2 flex flex-wrap items-center text-base absolute right-0">
			<!-- Play Button -->
			<a title="Play button (Ctrl+P)" id="play-button-1" class="bar_button">
				<svg class="w-7 h-7" fill="currentColor" viewBox="0 0 14 16">
					<path
						d="M0 .984v14.032a1 1 0 0 0 1.506.845l12.006-7.016a.974.974 0 0 0 0-1.69L1.506.139A1 1 0 0 0 0 .984Z"
					/>
				</svg>
				<p class="hidden lg:block text-xl pl-2 inline-block">Play</p>
			</a>

			<!-- Stop Button -->
			<a title="Stop button (Ctrl+R)" id="stop-button-1" class="bar_button">
				<svg class="w-7 h-7" fill="currentColor" viewBox="0 0 20 20">
					<path d="M10 .5a9.5 9.5 0 1 0 9.5 9.5A9.51 9.51 0 0 0 10 .5Z" />
					<rect x="6.5" y="6.5" width="7" height="7" fill="selection_background" rx="1" ry="1" />
				</svg>
				<p class="hidden lg:block text-xl pl-2 inline-block">Stop</p>
			</a>

			<!-- Eval Button -->
			<a title="Eval button (Ctrl+Enter)" id="eval-button-1" class="bar_button">
				<svg class="w-7 h-7" fill="none" viewBox="0 0 18 20">
					<path
						stroke="currentColor"
						stroke-linecap="round"
						stroke-linejoin="round"
						stroke-width="2"
						d="M16 1v5h-5M2 19v-5h5m10-4a8 8 0 0 1-14.947 3.97M1 10a8 8 0 0 1 14.947-3.97"
					/>
				</svg>
				<p class="hidden lg:block text-xl pl-2 inline-block">Eval</p>
			</a>

			<!-- Clear Button -->
			<a title="Clear button" id="clear-button-1" class="bar_button">
				<svg class="w-7 h-7" fill="currentColor" viewBox="0 0 18 20">
					<path
						d="M17 4h-4V2a2 2 0 0 0-2-2H7a2 2 0 0 0-2 2v2H1a1 1 0 0 0 0 2h1v12a2 2 0 0 0 2 2h10a2 2 0 0 0 2-2V6h1a1 1 0 1 0 0-2ZM7 2h4v2H7V2Zm1 14a1 1 0 1 1-2 0V8a1 1 0 0 1 2 0v8Zm4 0a1 1 0 0 1-2 0V8a1 1 0 0 1 2 0v8Z"
					/>
				</svg>
				<p class="hidden lg:block text-xl pl-2 inline-block">Clear</p>
			</a>

			<!-- Share Button -->
			<a title="Share button" id="share-button" class="bar_button">
				<svg class="w-7 h-7" fill="none" viewBox="0 0 19 19">
					<path
						stroke="currentColor"
						stroke-linecap="round"
						stroke-linejoin="round"
						stroke-width="2"
						d="M11.013 7.962a3.519 3.519 0 0 0-4.975 0l-3.554 3.554a3.518 3.518 0 0 0 4.975 4.975l.461-.46m-.461-4.515a3.518 3.518 0 0 0 4.975 0l3.553-3.554a3.518 3.518 0 0 0-4.974-4.975L10.3 3.7"
					/>
				</svg>
				<p class="hidden lg:block text-xl pl-2 inline-block">Share</p>
			</a>

			<!-- Docs Button -->
			<a title="Open Documentation (Ctrl+D)" id="doc-button-1" class="bar_button">
				<svg class="w-7 h-7" fill="currentColor" viewBox="0 0 20 20">
					<path
						d="M10 .5a9.5 9.5 0 1 0 9.5 9.5A9.51 9.51 0 0 0 10 .5ZM9.5 4a1.5 1.5 0 1 1 0 3 1.5 1.5 0 0 1 0-3ZM12 15H8a1 1 0 0 1 0-2h1v-3H8a1 1 0 0 1 0-2h2a1 1 0 0 1 1 1v4h1a1 1 0 0 1 0 2Z"
					/>
				</svg>
				<p class="hidden lg:block text-xl pl-2 inline-block">Docs</p>
			</a>
		</nav>
	</div>
</header>
