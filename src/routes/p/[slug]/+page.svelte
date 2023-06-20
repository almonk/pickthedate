<script>
	import Title from '../../../components/title.svelte';
	import { v4 } from 'uuid';
	import { UserPlusIcon, Share2Icon, CheckCircleIcon, MinusIcon } from 'svelte-feather-icons';
	import { fade } from 'svelte/transition';
	import { CheckCircle2 } from 'lucide-svelte';
	import AmButton from '../../../components/am-button.svelte';
	import AmPopover from '../../../components/am-popover.svelte';

	// Data loaded from server
	export let data;

	/** @type {Participant?} */
	let editedParticipant = null;

	/** @type {PollOption?} */
	let editedOption = null;

	/** @type {Record<string, boolean[]>} */
	let checkboxValues = {};

	// UI state
	let showHelpBanner = true;
	let showShareSheet = false;
	let shareUrl = '';

	/** @type {HTMLInputElement} */
	let shareUrlInput;

	/**
	 * Add or remove participant from poll option
	 * @param {string} participantId
	 * @param {number} optionIndex
	 */
	function toggleParticipantOnOption(participantId, optionIndex) {
		const option = data.event.options[optionIndex];
		const participantIds = option.participantIds || [];
		const participantIndex = participantIds.indexOf(participantId);
		if (participantIndex === -1) {
			option.participantIds = [...participantIds, participantId];
		} else {
			option.participantIds = participantIds.filter((_, i) => i !== participantIndex);
		}

		data = data;
	}

	/**
	 * Update the poll and write back to the database
	 */
	function updatePoll() {
		editedOption = null; // reset the edited option

		fetch(`/p/${data.event.id}`, {
			method: 'POST',
			headers: {
				'Content-Type': 'application/json'
			},
			body: JSON.stringify(data.event)
		});
	}

	/**
	 * Add a new blank participant to the poll and set it as the edited participant
	 */
	function addNewParticipant() {
		const newId = v4();

		data.event.participants = [
			...data.event.participants,
			{
				id: newId,
				name: '',
				email: ''
			}
		];

		data = data;

		editedParticipant = data.event.participants[data.event.participants.length - 1];
	}

	/**
	 * Delete participant from poll
	 * @param {string} id id of participant to delete
	 */
	function deleteParticipant(id) {
		data.event.participants = data.event.participants.filter(
			(participant) => participant.id !== id
		);

		data.event.options.forEach((option) => {
			if (!option.participantIds) return;
			option.participantIds = option.participantIds.filter((participantId) => participantId !== id);
		});

		data = data;

		updatePoll();
	}

	/**
	 * Add a new blank option to the poll and set it as the edited option
	 */
	function addNewOption() {
		data.event.options = [
			...data.event.options,
			{
				id: v4(),
				name: '',
				participantIds: []
			}
		];

		data = data;

		editedOption = data.event.options[data.event.options.length - 1];
	}

	/**
	 * Sets the edited participant back to null and updates the poll in the database
	 * @param {Participant} participant participant object
	 */
	function updateParticipant(participant) {
		if (participant.name === '') {
			deleteParticipant(participant.id);
		}
		editedParticipant = null;
		updatePoll();
	}

	/**
	 * Initialize reactive checkboxValues
	 */
	$: {
		checkboxValues = data.event.participants?.reduce((acc, participant) => {
			// @ts-ignore
			acc[participant.id] = data.event.options.map(
				(option) => option.participantIds?.includes(participant.id) || false
			);
			return acc;
		}, {});
	}

	$: {
		console.log(data);
	}

	$: {
		shareUrl = `https://pickthe.date/p/${data.event.id}`;
	}

	// When there's a window object
	if (typeof window !== 'undefined') {
		addNewParticipant();
	}
</script>

<Title>{data.event.title}</Title>

<div class="mx-auto max-w-lg mt-10">
	<h1 class="text-[22px] font-medium text-neutral-700">When's good to&hellip;{data.event.title}</h1>
</div>
<div>
	<div
		class="mt-4 flex flex-col gap-y-4 items-start mx-auto max-w-2xl p-2 rounded-2xl bg-neutral-50 relative z-10"
	>
		<div class="border rounded-xl w-full bg-white overflow-x-scroll overflow-y-hidden">
			<table class="w-full rounded-xl">
				<thead>
					<tr>
						<th class="p-2 border-b border-r bg-white sticky left-0 shadow-sm" />
						{#each data.event.options as option (option.id)}
							{#if editedOption === option}
								<th class="p-2">
									<!-- svelte-ignore a11y-autofocus -->
									<form on:submit|preventDefault={updatePoll}>
										<input
											type="text"
											bind:value={option.name}
											autofocus={editedOption === option}
										/>
									</form>
								</th>
							{:else}
								<th class="p-2 border-b text-sm font-normal text-neutral-800">{option.name}</th>
							{/if}
						{/each}
						<th class="border-b">
							<!-- <button on:click={addNewOption}> Add Option </button> -->
						</th>
					</tr>
				</thead>
				<tbody class="divide-y divide-gray-100">
					{#each data.event.participants as participant, i (participant.id)}
						<tr>
							<td
								class="border-r whitespace-nowrap min-w-[90px] w-[120px] sticky left-0 shadow-sm p-0 m-0"
								class:bg-white={editedParticipant != participant}
								class:bg-indigo-50={editedParticipant === participant}
							>
								{#if editedParticipant === participant}
									<form
										class="min-w-[90px] w-[120px] h-[40px] flex"
										on:submit|preventDefault={() => {
											updateParticipant(participant);
										}}
									>
										<!-- svelte-ignore a11y-autofocus -->
										<input
											type="text"
											class="w-full text-sm pl-4 pr-2 -mx-[1px] -my-[5px] flex-auto outline-[3px] focus:outline-indigo-400 outline-none -outline-offset-4 bg-transparent focus:bg-white"
											placeholder="Your name"
											class:rounded-bl-xl={i === data.event.participants.length - 1}
											on:focus={(e) => {
												showHelpBanner = true;
											}}
											on:blur={(e) => {
												showHelpBanner = false;
											}}
											autofocus={editedParticipant === participant}
											bind:value={participant.name}
										/>
									</form>
								{:else}
									<div class="px-4 py-2 min-w-[90px] w-[120px] text-sm font-medium">
										{participant.name}
									</div>
								{/if}
							</td>
							{#each data.event.options as option, i}
								<td class="p-2" class:bg-indigo-50={editedParticipant === participant}>
									<label
										class="flex items-center justify-center w-full h-full"
										class:cursor-pointer={editedParticipant === participant}
									>
										{#if editedParticipant === participant}
											<input
												type="checkbox"
												checked={checkboxValues[participant.id][i]}
												disabled={editedParticipant !== participant}
												class:cursor-pointer={editedParticipant === participant}
												on:change={() => toggleParticipantOnOption(participant.id, i)}
											/>
										{:else if checkboxValues[participant.id][i]}
											<CheckCircle2 class="w-[18px] h-[18px] text-indigo-500" />
										{:else}
											<MinusIcon class="w-[18px] h-[18px] text-neutral-300" />
										{/if}
									</label>
								</td>
							{/each}
							<td class="p-2 w-[60px]" class:bg-indigo-50={editedParticipant === participant}>
								{#if editedParticipant === participant}
									<AmButton
										variant="primary"
										size="sm"
										className="w-[60px]"
										on:click={() => {
											updateParticipant(participant);
										}}
									>
										{#if participant.name === ''}
											Save
										{:else}
											Done
										{/if}
									</AmButton>
								{:else}
									<AmButton
										size="sm"
										variant="tertiary"
										className="w-[60px]"
										on:click={() => (editedParticipant = participant)}
									>
										Edit
									</AmButton>
								{/if}
							</td>
						</tr>
					{/each}
				</tbody>
			</table>
		</div>
		{#if showHelpBanner && editedParticipant?.name === ''}
			<div
				class="absolute left-0 right-0 -bottom-7 flex justify-center"
				transition:fade={{ duration: 120 }}
			>
				<div
					class=" bg-black bg-opacity-70 backdrop-blur-lg px-4 rounded-full border border-opacity-5 py-2 right-0 shadow-xl text-sm font-medium text-neutral-200"
				>
					What's your name, and when's good for you?
				</div>
			</div>
		{/if}
	</div>
</div>

<div
	class="max-w-lg mx-auto mt-4 z-0 transition-opacity"
	class:opacity-20={showHelpBanner}
	class:opacity-100={!showHelpBanner}
>
	<div class="flex w-full">
		<AmButton on:click={addNewParticipant}>
			<UserPlusIcon class="h-[16px] w-[16px] text-current" />
			Add someone else</AmButton
		>
		<div class="flex-auto" />
		<div class="relative">
			<AmButton
				on:click={() => {
					showShareSheet = true;
					shareUrlInput.focus();
					shareUrlInput.select();
				}}
			>
				<Share2Icon class="h-[16px] w-[16px] text-current" />
				Share</AmButton
			>
			<!-- svelte-ignore a11y-no-noninteractive-tabindex -->
			<AmPopover bind:show={showShareSheet}>
				Share this URL to find a time that works for everyone&hellip;
				<div class="flex items-center gap-x-2 mt-2">
					<input
						type="text"
						class="text-sm px-2 py-1.5 border bg-neutral-50 flex-auto rounded-lg outline-[3px] focus:outline-indigo-400 outline-none -outline-offset-1"
						value={shareUrl}
						on:keydown={(e) => {
							if (e.key === 'Escape') {
								showShareSheet = false;
							}
						}}
						bind:this={shareUrlInput}
						readonly
					/>
				</div>
			</AmPopover>
		</div>
	</div>
</div>

<div
	class="max-w-lg mx-auto z-0 flex justify-center mt-4 transition-opacity border-t border-neutral-100 pt-4"
	class:opacity-20={showHelpBanner}
	class:opacity-100={!showHelpBanner}
>
	<a class="text-sm font-medium text-indigo-500 px-2" href="/"> Make your own poll like this </a>
</div>
