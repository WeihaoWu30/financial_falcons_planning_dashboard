'use client'
import { useState, useEffect } from 'react'
import { trpc } from '@/utils/trpc'
import { createClient } from '@/utils/supabase/client'
import styles from './ExpensePage.module.css'

const months = ['January', 'February', 'March', 'April', 'May', 'June',
   'July', 'August', 'September', 'October', 'November', 'December']

type Contribution = { memberID: number; amount: number }

type Props = {
   category: 'GROCERIES' | 'HOUSEHOLD' | 'TRANSPORTATION' | 'UTILITIES' | 'FURNITURE'
   categoryLabel: string
}


export default function ExpensePage({ category, categoryLabel }: Props) {

   const utils = trpc.useUtils();

   const [userID, setUserID] = useState<string | null>(null);

   useEffect(() => {
      const supabase = createClient();
      supabase.auth.getUser().then(({ data }) => {
         setUserID(data.user?.id ?? null)
      })
   }, [])

   const currentMonth = new Date().getMonth()
   const currentYear = new Date().getFullYear()

   const [selectedMonth, setSelectedMonth] = useState(months[currentMonth])
   const [selectedYear] = useState(currentYear)
   const [showDropdown, setShowDropdown] = useState(false)
   const [showForm, setShowForm] = useState(false)
   const [title, setTitle] = useState('')
   const [amount, setAmount] = useState('')
   const [contributions, setContributions] = useState<Contribution[]>([])

   const monthIndex = months.indexOf(selectedMonth) + 1

   const { data: group } = trpc.group.getByUser.useQuery(
      {
         userID: userID!
      },
      { enabled: !!userID }
   );

   const { data: members } = trpc.group.getMembers.useQuery(
      {
         id: group?.id!
      },
      { enabled: !!group?.id }
   );

   const memberList = members?.members ?? []

   useEffect(() => {
      if (members?.members && members.members.length > 0) {
         setContributions(members.members.map(member => ({
            memberID: member.id,
            amount: 0
         })))
      }
   }, [memberList.length])

   const { data: expenses } = trpc.expenses.getExpenses.useQuery(
      {
         groupID: group!.id,
         category: category,
         month: monthIndex,
         year: selectedYear
      },
      { enabled: !!group?.id }
   )

   const addExpense = trpc.expenses.addExpense.useMutation({
      onSuccess: ()=> utils.expenses.getExpenses.invalidate()
   });


   const handleContributionChange = (memberID: number, value: string) => {
      setContributions(prev =>
         prev.map(c => c.memberID === memberID ? { ...c, amount: parseFloat(value) || 0 } : c)
      )
   }

   const handleSubmit = async (e: React.SyntheticEvent) => {
      e.preventDefault()
      if (!group?.id) return;
      await addExpense.mutateAsync({
         title: title,
         amount: parseFloat(amount),
         groupID: group.id,
         category: category,
         month: monthIndex,
         year: selectedYear,
         contributions: contributions
      })
      setShowForm(false)
      setTitle('')
      setAmount('')
   }

   return (
      <div className={styles.page}>
         <div className={styles.header}>
            <div>
               <h1>{categoryLabel}</h1>
               <p>Track and split your {categoryLabel.toLowerCase()} expenses</p>
            </div>
            <div className={styles.controls}>
               <div className={styles.monthBtnWrapper}>
                  <button className={styles.monthBtn} onClick={() => setShowDropdown(!showDropdown)}>
                     {selectedMonth} {selectedYear} ▾
                  </button>
                  {showDropdown && (
                     <div className={styles.dropdown}>
                        {months.map(month => (
                           <div
                              key={month}
                              className={styles.dropdownItem}
                              onClick={() => { setSelectedMonth(month); setShowDropdown(false); }}
                           >
                              {month}
                           </div>
                        ))}
                     </div>
                  )}
               </div>
               <button className={styles.addBtn} onClick={() => setShowForm(true)}>+ Add Expense</button>
            </div>
         </div>

         {showForm && (
            <div className={styles.overlay}>
               <div className={styles.modal}>
                  <h2>Add {categoryLabel} Expense</h2>
                  <form onSubmit={handleSubmit}>
                     <label>Title</label>
                     <input value={title} onChange={e => setTitle(e.target.value)} placeholder="e.g. Weekly groceries" required />

                     <label>Total Amount ($)</label>
                     <input type="number" value={amount} onChange={e => setAmount(e.target.value)} placeholder="0.00" required />

                     <label>Contributions per member</label>
                     {(members?.members ?? []).map(member => (
                        <div key={member.id} className={styles.contributionRow}>
                           <span>{member.name}</span>
                           <input
                              type="number"
                              placeholder="0.00"
                              onChange={e => handleContributionChange(member.id, e.target.value)}
                           />
                        </div>
                     ))}

                     <div className={styles.modalButtons}>
                        <button type="button" className={styles.cancelBtn} onClick={() => setShowForm(false)}>Cancel</button>
                        <button type="submit" className={styles.submitBtn}>Add Expense</button>
                     </div>
                  </form>
               </div>
            </div>
         )}

         <div className={styles.expenseList}>
            {(expenses ?? []).map(expense => (
               <div key={expense.id} className={styles.expenseCard}>
                  <div className={styles.expenseHeader}>
                     <div>
                        <p className={styles.expenseTitle}>{expense.title}</p>
                        <p className={styles.expenseDate}>{new Date(expense.createdAt).toLocaleDateString()}</p>
                     </div>
                     <p className={styles.expenseAmount}>${expense.amount.toFixed(2)}</p>
                  </div>
                  <div className={styles.contributions}>
                     {expense.contributions.map(c => {
                        const member = (members?.members ?? []).find(m => m.id === c.memberId)
                        return (
                           <div key={c.id} className={styles.contributionChip}>
                              <span>{member?.name}</span>
                              <span>${c.amount.toFixed(2)}</span>
                           </div>
                        )
                     })}
                  </div>
               </div>
            ))}
         </div>
      </div>
   )
}