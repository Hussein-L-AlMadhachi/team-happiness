<script>
    import { link } from "svelte-spa-router";
</script>

<nav class="bg-white shadow-md">
    <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div class="flex justify-between items-center h-16">
            <div class="flex items-center">
                <a
                    href="/"
                    use:link
                    class="text-2xl font-bold text-indigo-600 tracking-wider"
                >
                    happiness team
                </a>
            </div>

            <div class="flex items-center space-x-4 space-x-reverse">
                <a
                    href="/login"
                    use:link
                    class="text-sm font-medium text-gray-700 hover:text-indigo-600 transition duration-150 ease-in-out py-2 px-3"
                >
                    Log In
                </a>

                <a
                    href="/signup"
                    use:link
                    class="inline-flex items-center justify-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-indigo-600 hover:bg-indigo-700 transition duration-150 ease-in-out"
                >
                    Sign Up
                </a>
            </div>
        </div>
    </div>
</nav>
