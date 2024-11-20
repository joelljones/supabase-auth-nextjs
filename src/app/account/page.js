import { createClient } from '@/utils/supabase/server'
import AccountForm from './AccountForm'

export default async function Account() {
	const supabase = createClient()

	const {
		data: { user },
	} = await supabase.auth.getUser()

	return <AccountForm user={user} />
}
