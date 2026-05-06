async function getSupabaseClient() {
    return window.quickCodeSupabaseReady;
}

async function getCurrentUser() {
    const supabaseClient = await getSupabaseClient();
    const { data, error } = await supabaseClient.auth.getUser();

    if (error) {
        console.error("Could not load current user:", error.message);
        return null;
    }

    return data.user;
}

async function getCurrentProfile() {
    const supabaseClient = await getSupabaseClient();
    const user = await getCurrentUser();

    if (!user) {
        return null;
    }

    const { data, error } = await supabaseClient
        .from("profiles")
        .select("id, username, score")
        .eq("id", user.id)
        .maybeSingle();

    if (error) {
        console.error("Could not load profile:", error.message);
        return null;
    }

    return data;
}

async function updateAuthUi() {
    const supabaseClient = await getSupabaseClient();
    const user = await getCurrentUser();
    const authContainer = document.querySelector("[data-auth-links]");

    if (!authContainer) {
        return;
    }

    if (user) {
        authContainer.innerHTML = '<a href="#" id="logout-link" class="auth-link">Logout</a>';
        const logoutLink = document.getElementById("logout-link");
        logoutLink.addEventListener("click", async event => {
            event.preventDefault();
            const { error } = await supabaseClient.auth.signOut();

            if (error) {
                alert(error.message);
                return;
            }

            window.location.href = "/login";
        });
    } else {
        authContainer.innerHTML = `
            <a href="/login" class="auth-link">Login</a>
            <a href="/register" class="auth-link">Register</a>
        `;
    }
}

window.quickCodeAuth = {
    getSupabaseClient,
    getCurrentUser,
    getCurrentProfile,
    updateAuthUi
};
