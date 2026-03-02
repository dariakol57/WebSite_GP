const { createClient } = require('@supabase/supabase-js');

const supabaseUrl = 'https://leacmsvisfsrpyvsirce.supabase.co';
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImxlYWNtc3Zpc2ZzcnB5dnNpcmNlIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzIzODM0MDgsImV4cCI6MjA4Nzk1OTQwOH0.pNg_YeYmMqK95XDGbHhCLe8lPmbtlvXtY_oa11EVXG4';
const supabase = createClient(supabaseUrl, supabaseKey);

async function check() {
    const { data: cards, error } = await supabase.from('cards').select('*').order('created_at', { ascending: false }).limit(3);
    console.log("CARDS:", cards, "ERR:", error);

    if (cards && cards.length > 0) {
        const id = cards[0].id;
        const res = await supabase.from('cards').update({ name: 'updated_test_test' }).eq('id', id);
        console.log("UPDATE result:", res.data, "ERR:", res.error);

        // revert
        if (!res.error) {
            await supabase.from('cards').update({ name: cards[0].name }).eq('id', id);
            console.log("Reverted");
        }
    }
}
check();
