'use client'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import styles from './Sidebar.module.css'
import { createClient } from '@/utils/supabase/client'
import { useRouter } from 'next/navigation'
import { trpc } from '@/utils/trpc'
import { useState, useEffect } from 'react'

const navItems = [
   { label: 'Overview', href: '/dashboard' },
   { label: 'Groceries', href: '/groceries' },
   { label: 'Household Essentials', href: '/household_essentials' },
   { label: 'Transportation', href: '/transportation' },
   { label: 'Budget', href: '/budget' },
   { label: 'AI Recommendation', href: '/ai_service' },
   //   { label: 'Settings', href: '/settings' },
]

export default function Sidebar() {
   const pathname = usePathname()

   const router = useRouter();

   const [userID, setUserID] = useState<string | null>(null)

   useEffect(()=>{
      const supabase = createClient();
      supabase.auth.getUser().then(({data})=>{
         setUserID(data.user?.id ?? null)
      })
   }, [])

   const { data: group } = trpc.group.getByUser.useQuery(
      {
         userID: userID!
      },
      { enabled: !!userID }
   );

   return (
      <aside className={styles.sidebar}>
         <div className={styles.profile}>
            <div className={styles.avatar}>AB</div>
            <div>
               <p className={styles.hello}>Hello!</p>
               <p className={styles.name}>{group?.name}</p>
            </div>
         </div>

         <div className={styles.search}>
            <input type="text" placeholder="Search" />
         </div>

         <p className={styles.sectionLabel}>DASHBOARD</p>

         <nav className={styles.nav}>
            {navItems.map((item) => (
               <Link
                  key={item.href}
                  href={item.href}
                  className={`${styles.navItem} ${pathname === item.href ? styles.active : ''}`}
               >
                  {item.label}
               </Link>
            ))}
            <button className={styles.signOutBtn} onClick={async () => {
               const supabase = createClient();
               await supabase.auth.signOut();
               router.push('/login');
            }}>Sign Out</button>
         </nav>
      </aside>
   )
}
