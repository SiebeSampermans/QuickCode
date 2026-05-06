const scoreboardBody = document.getElementById("scoreboard-body");
const welcomeText = document.getElementById("welcome-text");

function getRankName(score) {
    if (score >= 15) return "Expert";
    if (score >= 10) return "Advanced";
    if (score >= 5) return "Intermediate";
    return "Beginner";
}

async function renderHomepage() {
    await window.quickCodeAuth.updateAuthUi();

    const profile = await window.quickCodeAuth.getCurrentProfile();
    if (welcomeText) {
        welcomeText.textContent = profile
            ? `Welkom terug, ${profile.username}!`
            : "Log in om je score op te slaan en op het leaderboard te komen.";
    }

    const { data, error } = await window.quickCodeAuth.supabaseClient
        .from("profiles")
        .select("username, score")
        .order("score", { ascending: false })
        .limit(10);

    if (error) {
        console.error("Could not load scoreboard:", error.message);
        scoreboardBody.innerHTML = "<tr><td colspan='3'>Scoreboard kon niet geladen worden.</td></tr>";
        return;
    }

    if (!data || data.length === 0) {
        scoreboardBody.innerHTML = "<tr><td colspan='3'>Nog geen spelers gevonden.</td></tr>";
        return;
    }

    scoreboardBody.innerHTML = data
        .map(player => `
            <tr>
                <td>${escapeHtml(player.username)}</td>
                <td>${getRankName(player.score)}</td>
                <td>${player.score}</td>
            </tr>
        `)
        .join("");
}

function escapeHtml(value) {
    const div = document.createElement("div");
    div.textContent = value ?? "";
    return div.innerHTML;
}

document.addEventListener("DOMContentLoaded", renderHomepage);
