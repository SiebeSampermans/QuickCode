function getSupabaseConfig() {
    const url = window.QUICKCODE_SUPABASE_URL;
    const anonKey = window.QUICKCODE_SUPABASE_ANON_KEY;

    if (!url || !anonKey) {
        throw new Error(
            "Supabase config ontbreekt. Maak js/supabase-config.js op basis van js/supabase-config.example.js."
        );
    }

    return { url, anonKey };
}

function createSupabaseBrowserClient() {
    const { url, anonKey } = getSupabaseConfig();
    return window.supabase.createClient(url, anonKey);
}

window.quickCodeSupabase = createSupabaseBrowserClient();
