'use client'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { trpc } from '@/utils/trpc'
import { httpBatchLink } from '@trpc/client'
import { useState } from 'react' 
import { createClient } from '@/utils/supabase/client'

export default function Providers({children}: {children: React.ReactNode}){
   const [queryClient] = useState(() => new QueryClient())
   const [trpcClient] = useState(() =>trpc.createClient({links: [httpBatchLink({url: process.env.NEXT_PUBLIC_BACKEND_URL + '/trpc',
      async headers(){
         const supabase = createClient();
         const { data } = await supabase.auth.getSession();
         return{
            Authorization: `Bearer ${data.session?.access_token}`
         }
      }}
   )]}));

   return (
      <trpc.Provider client={trpcClient} queryClient={queryClient}>
         <QueryClientProvider client={queryClient}>
            {children}
         </QueryClientProvider>
      </trpc.Provider>
   )

}