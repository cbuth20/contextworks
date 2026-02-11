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

const supabase = createClient(supabaseUrl, supabaseServiceKey, {
  auth: {
    autoRefreshToken: false,
    persistSession: false
  }
})

const adminUsers = [
  {
    email: 'connor@contextworks.co',
    password: 'ChangeMe123!', // They should change this immediately
  },
  {
    email: 'patrick@contextworks.co',
    password: 'ChangeMe123!', // They should change this immediately
  },
]

async function createAdminUsers() {
  console.log('👤 Creating admin users...')

  for (const user of adminUsers) {
    // Create auth user
    const { data, error } = await supabase.auth.admin.createUser({
      email: user.email,
      password: user.password,
      email_confirm: true, // Auto-confirm email
    })

    if (error) {
      if (error.message.includes('already registered')) {
        console.log(`✓ User ${user.email} already exists`)
      } else {
        console.error(`✗ Error creating ${user.email}:`, error.message)
      }
    } else {
      console.log(`✓ Created admin user: ${user.email}`)
      console.log(`  Password: ${user.password} (CHANGE THIS IMMEDIATELY)`)
    }
  }

  console.log('\n✅ Done!')
  console.log('\n⚠️  IMPORTANT: Both users should log in and change their passwords immediately!')
  console.log('   Go to /admin/settings after logging in to change your password.')
}

createAdminUsers().catch(console.error)
