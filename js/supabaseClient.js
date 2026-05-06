async function loadSupabaseConfig() {
    const response = await fetch("/api/supabase-config");

    if (!response.ok) {
        throw new Error("Supabase config kon niet geladen worden vanaf Vercel.");
    }

    const data = await response.json();

    if (!data.url || !data.anonKey) {
        throw new Error("Supabase config is onvolledig.");
    }

    return data;
}

async function createSupabaseBrowserClient() {
    const { url, anonKey } = await loadSupabaseConfig();
    return window.supabase.createClient(url, anonKey);
}

window.quickCodeSupabaseReady = createSupabaseBrowserClient();
