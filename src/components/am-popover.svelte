<script>
  export let show = false;
</script>

<div
	class="absolute text-sm translate-y-2 bg-white text-neutral-600 shadow-xl p-4 -left-[200px] rounded-xl border border-black border-opacity-5 transition-all transform-gpu origin-top-right z-50"
	class:opacity-0={!show}
	class:scale-50={!show}
	class:opacity-100={show}
	class:scale-100={show}
>
	<slot></slot>
</div>

<!-- svelte-ignore a11y-click-events-have-key-events -->
<div
	class="z-10 fixed left-0 right-0 top-0 bottom-0 bg-white bg-opacity-0"
	class:pointer-events-none={!show}
	class:pointer-events-auto={show}
	on:click={() => {
		show = false;
	}}
/>