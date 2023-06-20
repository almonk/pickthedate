<script>
	// An enum for primary, secondary and tertiary buttons
	export let variant = 'secondary';
  export let size = 'md';

	/**
	 * @type {any}
	 */
	export let type = 'button';
	/**
	 * @type {any}
	 */
	export let disabled = false;

  export let className = '';

	const secondaryClasses =
		'bg-white border border-black border-opacity-10 shadow-sm text-neutral-700';

	const primaryClasses =
		'rounded-lg bg-gradient-to-b from-[#4e6ffa] to-[#4e6ffa] border text-white shadow border-black border-opacity-5';

	/**
	 * @type {string}
	 */
	let buttonClasses;
  /**
	 * @type {string}
	 */
  let sizeClasses;

	$: {
		switch (variant) {
			case 'primary':
				buttonClasses = primaryClasses;
				break;
			case 'secondary':
				buttonClasses = secondaryClasses;
				break;
			case 'tertiary':
				buttonClasses = 'bg-neutral-50 rounded-lg border border-neutral-100 text-neutral-600';
				break;
			default:
				buttonClasses = secondaryClasses;
				break;
		}
	}

  $: {
    switch (size) {
      case 'sm':
        sizeClasses = 'px-3 py-[5px]';
        break;
      default:
        sizeClasses = 'px-4 py-2';
        break;
    }
  }
</script>

<button
	{type}
	{disabled}
	class={`rounded-lg text-sm justify-center font-medium flex items-center gap-x-2 disabled:opacity-50 disabled:cursor-not-allowed active:brightness-95  ${buttonClasses} ${sizeClasses} ${className}`}
	on:click
>
	<slot />
</button>
