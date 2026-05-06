async function handleLoginFormSubmit(event) {
    event.preventDefault();

    const email = document.getElementById("email").value.trim();
    const password = document.getElementById("password").value;
    const errorBox = document.getElementById("login-error");

    errorBox.textContent = "";

    const { error } = await window.quickCodeAuth.supabaseClient.auth.signInWithPassword({
        email,
        password
    });

    if (error) {
        errorBox.textContent = error.message;
        return;
    }

    window.location.href = "/";
}

document.addEventListener("DOMContentLoaded", async () => {
    await window.quickCodeAuth.updateAuthUi();

    const user = await window.quickCodeAuth.getCurrentUser();
    if (user) {
        window.location.href = "/";
        return;
    }

    document.getElementById("login-form").addEventListener("submit", handleLoginFormSubmit);
});
