<script lang="ts">
	import { CreditCardIcon } from 'phosphor-svelte';

	interface Props {
		message: string;
	}

	let { message }: Props = $props();
</script>

<div class="py-8 text-center">
	<div class="mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-xl bg-[--ft-frost]">
		<CreditCardIcon size={24} weight="light" class="text-[--ft-text-muted]" aria-hidden="true" />
	</div>
	<p class="text-[--ft-text-muted]">{message}</p>
</div>
