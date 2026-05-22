'use client'
import styles from "./page.module.css";
import { useState } from 'react'
import { createClient } from '../../utils/supabase/client'
import { useRouter } from 'next/navigation'
import { trpc } from '../../utils/trpc'


export default function Login() {

   const [account, setAccount] = useState(false);

   const supabase = createClient();

   const router = useRouter();

   const createGroup = trpc.group.create.useMutation();

   return (
      <div className={styles.page}>
         <div className={styles.container}>

            <div className={`${styles.panel} ${account ? styles.active : styles.inactive}`} onClick={() => setAccount(true)}>
               <form onSubmit={async (e) => {
                  e.preventDefault();
                  const formData = new FormData(e.currentTarget);
                  const email = formData.get("email") as string;
                  const password = formData.get("password") as string;
                  const { error } = await supabase.auth.signInWithPassword({
                     email: email,
                     password: password
                  });
                  if (!error){
                     router.push("/dashboard");
                  }
         }}>
                  <div className={styles.login}>
                     <h1>User Login</h1>
                     <label htmlFor="username-field">
                        Username
                     </label>
                     <input
                        id="username-field"
                        name="email"
                        type="email"
                        placeholder="Enter your email"
                        required
                     />

                     <label htmlFor="password-field">
                        Password
                     </label>
                     <input
                        id="password-field"
                        name="password"
                        type="password"
                        placeholder="Enter your password"
                        required
                     />
                     <button type="submit">Log In</button>
                     <p onClick={(e) => { e.stopPropagation(); setAccount(false); }}>Don't have an account? Sign up</p>

                  </div>
               </form>
            </div>

            <div className={`${styles.panel} ${!account ? styles.active : styles.inactive}`} onClick={() => setAccount(false)}>
               <form onSubmit={async(e)=>{
                  e.preventDefault();
                  const formData = new FormData(e.currentTarget);
                  const groupName = formData.get("group-name")
                  const email = formData.get("email") as string;
                  const password = formData.get("password") as string;
                  const { data, error } = await supabase.auth.signUp({
                     email: email,
                     password: password
                  });
                  console.log("signup error:", error?.message);
                  console.log("signup data:", data);
                  if (!error && data.user){
                     await createGroup.mutateAsync({
                        name: groupName as string,
                        userID: data.user.id,
                     });
                     router.push("/dashboard");
                  }

               }}>
                  <div className={styles.login}>
                     <h1>User Sign Up</h1>
                     <label htmlFor="group-field">
                        Group Name
                     </label>
                     <input
                        id="group-field"
                        name="group-name"
                        type="text"
                        placeholder="Enter group name"
                        required
                     />
                     <label htmlFor="username-field">
                        Email
                     </label>
                     <input
                        id="username-field"
                        name="email"
                        type="email"
                        placeholder="Enter your username"
                        required
                     />

                     <label htmlFor="password-field">
                        Password
                     </label>
                     <input
                        id="password-field"
                        name="password"
                        type="password"
                        placeholder="Enter your password"
                        required
                     />
                     <button type="submit">Sign up</button>
                     <p onClick={(e) => { e.stopPropagation(); setAccount(true); }}>Have an account already? Sign in</p>

                  </div>
               </form>
            </div>
         </div>
      </div>
   );
}
