module.exports = (req, res) => {
    const url = process.env.QUICKCODE_SUPABASE_URL;
    const anonKey = process.env.QUICKCODE_SUPABASE_ANON_KEY;

    if (!url || !anonKey) {
        res.status(500).json({
            error: "Missing QUICKCODE_SUPABASE_URL or QUICKCODE_SUPABASE_ANON_KEY."
        });
        return;
    }

    res.setHeader("Cache-Control", "no-store");
    res.status(200).json({
        url,
        anonKey
    });
};
