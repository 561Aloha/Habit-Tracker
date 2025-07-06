// src/client.js
import { createClient } from '@supabase/supabase-js';

const Url = 'https://kbbiodosjzrhkzgmjfeb.supabase.co';
const API_Key = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImtiYmlvZG9zanpyaGt6Z21qZmViIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTE3NTQwODYsImV4cCI6MjA2NzMzMDA4Nn0.71B6LgHhpBP5zVNYsan_ywcOcPyt9pDGAZXzb53lMsU'

export const supabase = createClient(Url, API_Key);
