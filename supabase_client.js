const supabaseUrl = 'https://leacmsvisfsrpyvsirce.supabase.co';
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImxlYWNtc3Zpc2ZzcnB5dnNpcmNlIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzIzODM0MDgsImV4cCI6MjA4Nzk1OTQwOH0.pNg_YeYmMqK95XDGbHhCLe8lPmbtlvXtY_oa11EVXG4';

// Initialize Supabase client globally, overwriting the UMD library object
window.supabase = window.supabase.createClient(supabaseUrl, supabaseKey);
