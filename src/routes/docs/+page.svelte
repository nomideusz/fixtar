<script>
  import { goto } from '$app/navigation';
  import { onMount } from 'svelte';
  import LoadingSpinner from '$lib/components/ui/LoadingSpinner.svelte';
  import PageContainer from '$lib/components/layout/PageContainer.svelte';
  
  // Redirect to the icons page when loaded
  onMount(() => {
    goto('/docs/icons');
  });
</script>

<PageContainer paddingY="pb-8 pb-12">
  <div class="loading-container">
    <LoadingSpinner visible={true} message="Loading documentation..." />
  </div>
</PageContainer>

<style>
  .loading-container {
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
    height: 100%;
    min-height: 300px;
  }
</style> 

