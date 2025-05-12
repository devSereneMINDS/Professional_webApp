import { createClient } from '@supabase/supabase-js';

const supabaseUrl = 'https://qmdfzzfphkfybewcyhej.supabase.co'; // Replace with your project URL
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InFtZGZ6emZwaGtmeWJld2N5aGVqIiwicm9sZSI6ImFub24iLCJpYXQiOjE3MzA1MzI3NzYsImV4cCI6MjA0NjEwODc3Nn0.0I0muA0hJLo4DeYLewc2tCxPHG0TnenZOuTSHwv12Mg';


export const supabase = createClient(supabaseUrl, supabaseKey);
