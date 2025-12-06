<script>
  import { onMount } from "svelte";
  import { currentUser, currentView, loadUserData } from "./lib/store.js";
  import Navbar from "./lib/Navbar.svelte";
  import Auth from "./lib/Auth.svelte";
  import Dashboard from "./lib/Dashboard.svelte";
  import History from "./lib/History.svelte";
  import Demo from "./lib/Demo.svelte";
  import Tokens from "./lib/Tokens.svelte";
  import Folders from "./lib/Folders.svelte";
  import Toast from "./lib/Toast.svelte";

  onMount(() => {
    // Check for hash change to update view
    const handleHashChange = () => {
      const hash = window.location.hash.slice(1);
      if (hash) {
        currentView.set(hash);
      }
    };

    window.addEventListener("hashchange", handleHashChange);

    // Initial load
    if (window.location.hash) {
      handleHashChange();
    }

    // Load user data if logged in
    if ($currentUser) {
      loadUserData();
    }

    return () => {
      window.removeEventListener("hashchange", handleHashChange);
    };
  });
</script>

<Toast />

{#if !$currentUser}
  <Auth />
{:else}
  <div id="app-view" class="view active">
    <Navbar />

    {#if $currentView === "/" || $currentView === "history"}
      <History />
    {:else if $currentView === "demo"}
      <Demo />
    {:else if $currentView === "tokens"}
      <Tokens />
    {/if}
  </div>
{/if}
