import { createClient } from '@supabase/supabase-js';

const supabaseUrl = 'https://zpgexzsjgmzcpkgquduu.supabase.co';
const supabaseAnonKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InpwZ2V4enNqZ216Y3BrZ3F1ZHV1Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDAwODcyNDcsImV4cCI6MjA1NTY2MzI0N30.YtCAJvcBu_zbH9sa4oOm5YavqXV_Rgmwsifv_Le5aFw';

export const supabase = createClient(supabaseUrl, supabaseAnonKey); 