<script>
    import { login, register } from "./store.js";
    import { addToast } from "./toastStore.js";

    let isLogin = true;
    let email = "";
    let password = "";
    let name = "";
    let confirmPassword = "";
    let rememberMe = false;

    // Error states
    let emailError = "";
    let passwordError = "";
    let confirmError = "";

    const validateEmail = (email) => {
        return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
    };

    const handleLogin = async () => {
        emailError = "";
        if (!validateEmail(email)) {
            emailError = "Please enter a valid email";
            return;
        }

        try {
            await login(email, password);
            addToast("Welcome back!", "success");
        } catch (error) {
            addToast(error.message || "Invalid email or password", "error");
        }
    };

    const handleRegister = async () => {
        emailError = "";
        passwordError = "";
        confirmError = "";

        if (!validateEmail(email)) {
            emailError = "Please enter a valid email";
            return;
        }

        if (password.length < 8) {
            passwordError = "Password must be at least 8 characters";
            return;
        }

        if (password !== confirmPassword) {
            confirmError = "Passwords do not match";
            return;
        }

        try {
            await register(name, email, password);
            addToast("Account created successfully!", "success");
        } catch (error) {
            addToast(error.message || "Registration failed", "error");
        }
    };

    const toggleMode = () => {
        isLogin = !isLogin;
        // Reset form
        email = "";
        password = "";
        name = "";
        confirmPassword = "";
        emailError = "";
        passwordError = "";
        confirmError = "";
    };
</script>

<div id="auth-view" class="view active">
    <div class="auth-container">
        <div class="auth-card">
            <div class="auth-header">
                <div class="logo">
                    <svg width="48" height="48" viewBox="0 0 48 48" fill="none">
                        <rect
                            width="48"
                            height="48"
                            rx="12"
                            fill="url(#gradient1)"
                        />
                        <path
                            d="M16 24L22 30L32 18"
                            stroke="white"
                            stroke-width="3"
                            stroke-linecap="round"
                            stroke-linejoin="round"
                        />
                        <defs>
                            <linearGradient
                                id="gradient1"
                                x1="0"
                                y1="0"
                                x2="48"
                                y2="48"
                            >
                                <stop offset="0%" stop-color="#667eea" />
                                <stop offset="100%" stop-color="#764ba2" />
                            </linearGradient>
                        </defs>
                    </svg>
                </div>
                <h1>OCR Extraction</h1>
                <p class="subtitle">AI-powered text recognition from images</p>
            </div>

            {#if isLogin}
                <!-- Login Form -->
                <form on:submit|preventDefault={handleLogin} class="auth-form">
                    <h2>Welcome Back</h2>
                    <div class="form-group">
                        <label for="login-email">Email</label>
                        <input
                            type="email"
                            id="login-email"
                            placeholder="you@example.com"
                            bind:value={email}
                            class:error={emailError}
                            required
                        />
                        <span class="error-message">{emailError}</span>
                    </div>
                    <div class="form-group">
                        <label for="login-password">Password</label>
                        <input
                            type="password"
                            id="login-password"
                            placeholder="••••••••"
                            bind:value={password}
                            required
                        />
                        <span class="error-message"></span>
                    </div>
                    <div class="form-options">
                        <label class="checkbox-label">
                            <input
                                type="checkbox"
                                id="remember-me"
                                bind:checked={rememberMe}
                            />
                            <span>Remember me</span>
                        </label>
                    </div>
                    <button type="submit" class="btn btn-primary"
                        >Sign In</button
                    >
                    <p class="form-footer">
                        Don't have an account?
                        <a
                            href="javascript:void(0)"
                            on:click|preventDefault={toggleMode}>Sign up</a
                        >
                    </p>
                </form>
            {:else}
                <!-- Register Form -->
                <form
                    on:submit|preventDefault={handleRegister}
                    class="auth-form"
                >
                    <h2>Create Account</h2>
                    <div class="form-group">
                        <label for="register-name">Full Name</label>
                        <input
                            type="text"
                            id="register-name"
                            placeholder="John Doe"
                            bind:value={name}
                            required
                        />
                        <span class="error-message"></span>
                    </div>
                    <div class="form-group">
                        <label for="register-email">Email</label>
                        <input
                            type="email"
                            id="register-email"
                            placeholder="you@example.com"
                            bind:value={email}
                            class:error={emailError}
                            required
                        />
                        <span class="error-message">{emailError}</span>
                    </div>
                    <div class="form-group">
                        <label for="register-password">Password</label>
                        <input
                            type="password"
                            id="register-password"
                            placeholder="••••••••"
                            bind:value={password}
                            class:error={passwordError}
                            required
                        />
                        <span class="error-message">{passwordError}</span>
                        <span class="hint">At least 8 characters</span>
                    </div>
                    <div class="form-group">
                        <label for="register-confirm">Confirm Password</label>
                        <input
                            type="password"
                            id="register-confirm"
                            placeholder="••••••••"
                            bind:value={confirmPassword}
                            class:error={confirmError}
                            required
                        />
                        <span class="error-message">{confirmError}</span>
                    </div>
                    <button type="submit" class="btn btn-primary"
                        >Create Account</button
                    >
                    <p class="form-footer">
                        Already have an account?
                        <a
                            href="javascript:void(0)"
                            on:click|preventDefault={toggleMode}>Sign in</a
                        >
                    </p>
                </form>
            {/if}
        </div>
    </div>
</div>
