// src/client.js
import { createClient } from '@supabase/supabase-js';

const Url = 'https://pmcjzwtyfuwqtyqwgoik.supabase.co'; // Use your Supabase project URL
const API_Key = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InBtY2p6d3R5ZnV3cXR5cXdnb2lrIiwicm9sZSI6ImFub24iLCJpYXQiOjE3MTMzNzU5MjUsImV4cCI6MjAyODk1MTkyNX0.1_GQlrWf7gS-arzKHlNSjQB9cIyp5X-SizSHtIFRl1o';// Use your Supabase API key

export const supabase = createClient(Url, API_Key);
