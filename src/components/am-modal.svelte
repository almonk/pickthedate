<script>
	import { DeleteIcon } from "svelte-feather-icons";

	export let show = false;
</script>

<!-- svelte-ignore a11y-click-events-have-key-events -->
<div
	class="z-50 fixed left-0 right-0 top-0 flex justify-center items-center bottom-0 bg-black bg-opacity-30 transition-all"
  class:opacity-0={!show}
	class:pointer-events-none={!show}
	class:pointer-events-auto={show}
	on:keydown={e => e.key === "Escape" && (show = false)}
>
	<div
		class="fixed text-sm translate-y-2 bg-white text-neutral-600 shadow-2xl -left-rounded-xl border border-black border-opacity-40 transition-all transform-gpu max-w-[400px] rounded-2xl origin-center duration-200 overflow-hidden"
		class:opacity-0={!show}
		class:scale-50={!show}
		class:opacity-100={show}
		class:-translate-y-40={!show}
		class:translate-y-0={show}
		class:scale-100={show}
	>
		
		<slot />
	</div>
</div>
