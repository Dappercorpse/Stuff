
import { createClient } from '@supabase/supabase-js'

let supabaseUrl = 'https://agbbhfursgfesbbsijyx.supabase.co'
let supabaseKey = 'sb_publishable_ADAyq3HdIypgWc65Dd3pNQ_f16TIHZ2'

export let supabase = createClient(supabaseUrl, supabaseKey)