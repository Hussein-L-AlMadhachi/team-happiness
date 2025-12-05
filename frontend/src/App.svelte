<script>
  import Router from "svelte-spa-router";
  import Nav from "./lib/components/nav.svelte";

  // Import components
  import Home from "./lib/components/Home.svelte";
  import LoginPage from "./lib/components/login-01/+page.svelte";
  import SignupPage from "./lib/components/signup-01/+page.svelte";

  import "./app.css";

  const routes = {
    "/": Home,
    "/login": LoginPage,
    "/signup": SignupPage,
  };
</script>

<main>
  <Nav />
  <Router {routes} />
</main>

<style>
</style>
