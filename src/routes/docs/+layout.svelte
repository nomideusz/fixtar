<script lang="ts">
  import { page } from '$app/state';
  import { fade, fly } from 'svelte/transition';
  import { elasticOut } from 'svelte/easing';
  import PageContainer from '$lib/components/layout/PageContainer.svelte';
  import { onMount } from 'svelte';
  import type { Snippet } from 'svelte';
  
  // Props
  const { children } = $props<{ children?: Snippet }>();
  
  // State
  let sidebarOpen = $state(false);
  let isMounted = $state(false);
  
  // Documentation sections
  interface DocItem {
    name: string;
    path: string;
  }
  
  interface DocSection {
    name: string;
    items: DocItem[];
  }
  
  const docSections: DocSection[] = [
    {
      name: 'Components',
      items: [
        // Add documentation sections as needed
      ]
    },
    {
      name: 'API',
      items: []
    },
    {
      name: 'Guides',
      items: []
    }
  ];
  
  // Toggle mobile sidebar
  function toggleSidebar() {
    sidebarOpen = !sidebarOpen;
  }
  
  // Function to check if a path is active
  function isActivePath(path: string): boolean {
    return page.url.pathname === path;
  }
  
  onMount(() => {
    isMounted = true;
  });
</script>

<div class="docs-layout">
  <!-- Desktop Sidebar -->
  <div class="sidebar-desktop" class:visible={isMounted}>
    <div class="sidebar-content">
      <h2 class="sidebar-title">Documentation</h2>
      
      {#each docSections as section (section)}
        {#if section.items.length > 0}
          <div class="sidebar-section">
            <h3 class="sidebar-section-title">{section.name}</h3>
            <nav class="sidebar-nav">
              {#each section.items as item (item)}
                <a 
                  href={item.path} 
                  class="sidebar-link"
                  class:active={isActivePath(item.path)}
                >
                  {item.name}
                </a>
              {/each}
            </nav>
          </div>
        {/if}
      {/each}
    </div>
  </div>
  
  <!-- Mobile Sidebar -->
  <div class="sidebar-mobile">
    <button 
      class="sidebar-toggle" 
      onclick={toggleSidebar}
      aria-label="Toggle documentation menu"
    >
      <span class="icon icon-menu-regular" aria-hidden="true"></span>
      <span class="sidebar-toggle-text">Docs</span>
    </button>
    
    {#if sidebarOpen}
      <button 
        class="sidebar-mobile-backdrop" 
        onclick={() => sidebarOpen = false}
        onkeydown={(e) => e.key === 'Enter' && (sidebarOpen = false)}
        tabindex="0"
        aria-label="Close sidebar"
        transition:fade={{ duration: 150 }}
      ></button>
      
      <div 
        class="sidebar-mobile-panel"
        transition:fly={{ x: -300, duration: 200, easing: elasticOut }}
      >
        <div class="sidebar-mobile-header">
          <h2 class="sidebar-title">Documentation</h2>
          <button 
            class="sidebar-close" 
            onclick={() => sidebarOpen = false}
            aria-label="Close menu"
          >
            <span class="icon icon-x-bold" aria-hidden="true"></span>
          </button>
        </div>
        
        <div class="sidebar-mobile-content">
          {#each docSections as section (section)}
            {#if section.items.length > 0}
              <div class="sidebar-section">
                <h3 class="sidebar-section-title">{section.name}</h3>
                <nav class="sidebar-nav">
                  {#each section.items as item (item)}
                    <a 
                      href={item.path} 
                      class="sidebar-link"
                      class:active={isActivePath(item.path)}
                      onclick={() => sidebarOpen = false}
                    >
                      {item.name}
                    </a>
                  {/each}
                </nav>
              </div>
            {/if}
          {/each}
        </div>
      </div>
    {/if}
  </div>
  
  <!-- Main content -->
  <div class="docs-content">
    <PageContainer paddingY="py-6">
      {@render children?.()}
    </PageContainer>
  </div>
</div>

<style>
  /* Main layout */
  .docs-layout {
    display: flex;
    min-height: calc(100vh - 64px);
    position: relative;
  }
  
  /* Desktop sidebar */
  .sidebar-desktop {
    width: 280px;
    background-color: rgba(17, 24, 39, 0.7);
    backdrop-filter: blur(12px);
    border-right: 1px solid rgba(99, 102, 241, 0.2);
    position: sticky;
    top: 64px;
    height: calc(100vh - 64px);
    overflow-y: auto;
    display: none;
    opacity: 0;
    transition: opacity 0.5s ease;
  }
  
  .sidebar-desktop.visible {
    opacity: 1;
  }
  
  @media (min-width: 1024px) {
    .sidebar-desktop {
      display: block;
    }
  }
  
  .sidebar-content {
    padding: 2rem 1.5rem;
  }
  
  .sidebar-title {
    font-size: 1.5rem;
    font-weight: bold;
    margin-bottom: 2rem;
    padding-bottom: 0.75rem;
    border-bottom: 1px solid rgba(99, 102, 241, 0.3);
    background: linear-gradient(90deg, rgba(99, 102, 241, 1), rgba(167, 139, 250, 1));
    -webkit-background-clip: text;
    -webkit-text-fill-color: transparent;
    background-clip: text;
  }
  
  .sidebar-section {
    margin-bottom: 2rem;
  }
  
  .sidebar-section-title {
    font-size: 0.875rem;
    text-transform: uppercase;
    letter-spacing: 0.05em;
    color: rgba(156, 163, 175, 0.9);
    margin-bottom: 0.75rem;
  }
  
  .sidebar-nav {
    display: flex;
    flex-direction: column;
    gap: 0.5rem;
  }
  
  .sidebar-link {
    padding: 0.75rem 1rem;
    border-radius: 0.5rem;
    text-decoration: none;
    color: rgba(209, 213, 219, 0.9);
    font-weight: 500;
    transition: all 0.2s ease;
    font-size: 0.95rem;
  }
  
  .sidebar-link:hover {
    background-color: rgba(55, 65, 81, 0.7);
    color: rgba(255, 255, 255, 0.95);
    transform: translateX(2px);
  }
  
  .sidebar-link.active {
    background: linear-gradient(90deg, rgba(79, 70, 229, 0.2), rgba(79, 70, 229, 0.1));
    border-left: 3px solid rgba(99, 102, 241, 1);
    color: rgba(255, 255, 255, 0.95);
    box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06);
  }
  
  /* Mobile sidebar */
  .sidebar-mobile {
    display: block;
    position: sticky;
    top: 0;
    z-index: 20;
    width: 100%;
    border-bottom: 1px solid rgba(99, 102, 241, 0.2);
    background-color: rgba(17, 24, 39, 0.8);
    backdrop-filter: blur(12px);
  }
  
  @media (min-width: 1024px) {
    .sidebar-mobile {
      display: none;
    }
  }
  
  .sidebar-toggle {
    display: flex;
    align-items: center;
    gap: 0.5rem;
    padding: 1rem;
    color: rgba(255, 255, 255, 0.9);
    font-weight: 500;
    background: none;
    border: none;
    cursor: pointer;
  }
  
  .sidebar-toggle-text {
    font-size: 1rem;
  }
  
  .sidebar-mobile-backdrop {
    position: fixed;
    inset: 0;
    background-color: rgba(0, 0, 0, 0.6);
    z-index: 30;
    border: none;
    width: 100%;
    cursor: pointer;
    padding: 0;
    margin: 0;
  }
  
  .sidebar-mobile-panel {
    position: fixed;
    top: 0;
    left: 0;
    width: 280px;
    height: 100vh;
    background-color: rgba(17, 24, 39, 0.95);
    backdrop-filter: blur(12px);
    z-index: 40;
    overflow-y: auto;
    border-right: 1px solid rgba(99, 102, 241, 0.3);
    box-shadow: 4px 0 15px rgba(0, 0, 0, 0.3);
  }
  
  .sidebar-mobile-header {
    display: flex;
    align-items: center;
    justify-content: space-between;
    padding: 1.5rem;
    border-bottom: 1px solid rgba(99, 102, 241, 0.3);
  }
  
  .sidebar-close {
    background: none;
    border: none;
    color: rgba(209, 213, 219, 0.9);
    cursor: pointer;
    padding: 0.5rem;
  }
  
  .sidebar-mobile-content {
    padding: 1.5rem;
  }
  
  /* Main content */
  .docs-content {
    flex: 1;
    overflow-x: hidden;
    background-color: rgba(15, 23, 42, 0.3);
  }
</style> 


