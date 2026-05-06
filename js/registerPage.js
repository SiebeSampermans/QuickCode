async function createProfileForUser(userId, username) {
    const supabaseClient = await window.quickCodeAuth.getSupabaseClient();
    const { error } = await supabaseClient
        .from("profiles")
        .insert({
            id: userId,
            username,
            score: 0
        });

    return error;
}

async function handleRegisterFormSubmit(event) {
    event.preventDefault();
    const supabaseClient = await window.quickCodeAuth.getSupabaseClient();

    const username = document.getElementById("username").value.trim();
    const email = document.getElementById("email").value.trim();
    const password = document.getElementById("password").value;
    const messageBox = document.getElementById("register-message");

    messageBox.textContent = "";

    const { data, error } = await supabaseClient.auth.signUp({
        email,
        password,
        options: {
            data: {
                username
            },
            emailRedirectTo: window.location.origin
        }
    });

    if (error) {
        messageBox.textContent = error.message;
        return;
    }

    if (data.user) {
        const profileError = await createProfileForUser(data.user.id, username);
        if (profileError) {
            messageBox.textContent = profileError.message;
            return;
        }
    }

    messageBox.textContent = "Account aangemaakt. Controleer eventueel je e-mailverificatie en log daarna in.";
    document.getElementById("register-form").reset();
}

document.addEventListener("DOMContentLoaded", async () => {
    await window.quickCodeAuth.updateAuthUi();

    const user = await window.quickCodeAuth.getCurrentUser();
    if (user) {
        window.location.href = "/";
        return;
    }

    document.getElementById("register-form").addEventListener("submit", handleRegisterFormSubmit);
});
