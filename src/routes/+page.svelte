<script>
	import { v4 } from 'uuid';
	import { MinusCircleIcon, PlusCircleIcon, ArrowRightCircleIcon } from 'svelte-feather-icons';
	import { fade, slide } from 'svelte/transition';
	import Title from '../components/title.svelte';
	import AmButton from '../components/am-button.svelte';

	// New Poll object
	/** @type {Poll} */
	let newPoll = {
		id: '',
		title: '',
		options: [
			{
				id: v4(),
				name: ''
			},
			{
				id: v4(),
				name: ''
			},
			{
				id: v4(),
				name: ''
			}
		],
		participants: []
	};

	let latestOption = '';

	let canSubmit = false;

	/**
	 * Add a new option
	 * @param {Event} e
	 */
	function addOption(e) {
		e.preventDefault();
		newPoll.options = [
			...newPoll.options,
			{
				id: v4(),
				name: latestOption
			}
		];
		latestOption = '';
	}

	/**
	 * Delete option from options array
	 * @param {number} index
	 * @param {Event} e
	 */
	function deleteOption(index, e) {
		e.preventDefault();
		newPoll.options = newPoll.options.filter((_, i) => i !== index);
	}

	$: canSubmit = newPoll.title.length > 0 && newPoll.options.length > 1;
</script>

<Title>Make a new poll</Title>

<form method="POST" action="?/createPoll" class="max-w-lg mx-auto mt-10 flex flex-col gap-y-4">
	<div class="flex flex-col gap-y-2">
		<h1 class="text-[22px] font-medium text-neutral-700">When's good to&hellip;?</h1>
		<input
			name="title"
			class="border text-[22px] px-3 py-2 rounded-xl outline-[4px] focus:outline-indigo-400 outline-none -outline-offset-1"
			type="text"
			autofocus
			placeholder="Onsite in Amsterdam"
			bind:value={newPoll.title}
		/>
	</div>

	<ul class="flex flex-col px-4 py-2 rounded-xl border">
		<div class="py-1 text-sm text-neutral-400">Give the people some options&hellip;</div>
		{#each newPoll.options as option, index (option.id)}
			<!-- Inputs -->
			<div transition:slide={{ duration: 120 }} class="py-2">
				<li class="flex gap-x-4">
					<input
						autofocus
						name="option"
						type="text"
						on:keydown={(e) => {
							if (e.key === 'Enter') {
								e.preventDefault();
							}
						}}
						placeholder={`Option ${index + 1}`}
						value={option.name}
						class="text-sm px-2 py-1.5 border flex-auto rounded-lg outline-[3px] focus:outline-indigo-400 outline-none -outline-offset-1"
					/>
					{#if newPoll.options.length > 2}
						<AmButton
							size="small"
							variant="tertiary"
							on:click={(e) => deleteOption(index, e)}
						>
							<MinusCircleIcon class="w-[16px] h-[16px] text-current" />
						</AmButton>
					{/if}
				</li>
			</div>
		{/each}
	</ul>

	<div class="flex justify-between items-center">
		<AmButton
			on:click={(e) => addOption(e)}
		>
			<PlusCircleIcon class="w-[16px] h-[16px] text-current" />
			Add option</AmButton
		>

		<AmButton
			variant="primary"
			type="submit"
			disabled={!canSubmit}
		>
			Create poll
		</AmButton>
	</div>
</form>
