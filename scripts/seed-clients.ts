import { createClient } from '@supabase/supabase-js'
import * as dotenv from 'dotenv'

// Load environment variables
dotenv.config({ path: '.env.local' })

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY!

if (!supabaseUrl || !supabaseServiceKey) {
  console.error('Missing Supabase credentials in .env.local')
  process.exit(1)
}

const supabase = createClient(supabaseUrl, supabaseServiceKey)

const clients = [
  {
    email: 'connor@contextworks.co',
    full_name: 'Connor',
    company_name: 'ContextWorks LLC',
  },
  {
    email: 'patrick@contextworks.co',
    full_name: 'Patrick',
    company_name: 'ContextWorks LLC',
  },
]

async function seedClients() {
  console.log('🌱 Seeding clients...')

  for (const client of clients) {
    // Check if client already exists
    const { data: existing } = await supabase
      .from('clients')
      .select('id, email')
      .eq('email', client.email)
      .single()

    if (existing) {
      console.log(`✓ Client ${client.email} already exists`)
      continue
    }

    // Create client
    const { data, error } = await supabase
      .from('clients')
      .insert(client)
      .select()
      .single()

    if (error) {
      console.error(`✗ Error creating ${client.email}:`, error.message)
    } else {
      console.log(`✓ Created client: ${client.email}`)
    }
  }

  console.log('✅ Done!')
}

seedClients().catch(console.error)
