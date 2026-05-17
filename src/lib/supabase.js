import { createClient } from '@supabase/supabase-js'

const SUPA_URL = 'https://xfniavcbswqapietgjbe.supabase.co'
const SUPA_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InhmbmlhdmNic3dxYXBpZXRnamJlIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzY2MzU1NDYsImV4cCI6MjA5MjIxMTU0Nn0.48EA6SISfpNhVvToEFC6FgXbv7lIsW-VtinGtWsYxr8'

export const sb = createClient(SUPA_URL, SUPA_KEY)
