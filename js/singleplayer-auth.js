let currentUser = "Guest";

async function loadCurrentPlayerName() {
    await window.quickCodeAuth.updateAuthUi();

    const profile = await window.quickCodeAuth.getCurrentProfile();
    currentUser = profile?.username || "Guest";
}

async function updatePlayerScore(pointsToAdd = 1) {
    const supabaseClient = await window.quickCodeAuth.getSupabaseClient();
    const profile = await window.quickCodeAuth.getCurrentProfile();

    if (!profile) {
        return;
    }

    const nextScore = (profile.score || 0) + pointsToAdd;

    const { error } = await supabaseClient
        .from("profiles")
        .update({ score: nextScore })
        .eq("id", profile.id);

    if (error) {
        console.error("Could not update score:", error.message);
    }
}

document.addEventListener("DOMContentLoaded", loadCurrentPlayerName);
