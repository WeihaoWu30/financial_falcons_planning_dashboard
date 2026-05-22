'use client'
import { useState, useEffect } from 'react'
import styles from './page.module.css'
import { trpc } from '@/utils/trpc'
import { createClient } from '@/utils/supabase/client'

const months = ['January', 'February', 'March', 'April', 'May', 'June',
  'July', 'August', 'September', 'October', 'November', 'December']

export default function BudgetPage() {
  const [userID, setUserID] = useState<string | null>(null)
  const [showForm, setShowForm] = useState(false)
  const [selectedMonth, setSelectedMonth] = useState(months[new Date().getMonth()])
  const [selectedYear] = useState(new Date().getFullYear())
  const [limit, setLimit] = useState('')

  const utils = trpc.useUtils()

  useEffect(() => {
    const supabase = createClient()
    supabase.auth.getUser().then(({ data }) => {
      setUserID(data.user?.id ?? null)
    })
  }, [])

  const { data: group } = trpc.group.getByUser.useQuery(
    { userID: userID! },
    { enabled: !!userID }
  )

  const { data: budgets } = trpc.budget.getBudgets.useQuery(
    { groupID: group!.id },
    { enabled: !!group?.id }
  )

  const addBudget = trpc.budget.addBudget.useMutation({
    onSuccess: () => utils.budget.getBudgets.invalidate()
  })

  const handleSubmit = async (e: React.SyntheticEvent) => {
    e.preventDefault()
    if (!group?.id) return
    try {
      await addBudget.mutateAsync({
        groupID: group.id,
        limit: parseFloat(limit),
        month: months.indexOf(selectedMonth) + 1,
        year: selectedYear,
      })
      setLimit('')
      setShowForm(false)
    } catch (err) {
      console.error(err)
    }
  }

  return (
    <div className={styles.page}>
      <div className={styles.header}>
        <div>
          <h1>Budget</h1>
          <p>Set and track your monthly budget</p>
        </div>
        <button className={styles.addBtn} onClick={() => setShowForm(true)}>+ Set Budget</button>
      </div>

      {showForm && (
        <div className={styles.overlay}>
          <div className={styles.modal}>
            <h2>Set Monthly Budget</h2>
            <form onSubmit={handleSubmit}>
              <label>Month</label>
              <select value={selectedMonth} onChange={e => setSelectedMonth(e.target.value)}>
                {months.map(m => <option key={m} value={m}>{m}</option>)}
              </select>

              <label>Budget Limit ($)</label>
              <input
                type="number"
                value={limit}
                onChange={e => setLimit(e.target.value)}
                placeholder="0.00"
                required
              />

              <div className={styles.modalButtons}>
                <button type="button" className={styles.cancelBtn} onClick={() => setShowForm(false)}>Cancel</button>
                <button type="submit" className={styles.submitBtn} disabled={addBudget.isPending}>
                  {addBudget.isPending ? 'Saving...' : 'Save Budget'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      <div className={styles.budgetList}>
        {(budgets ?? []).map(budget => (
          <div key={budget.id} className={styles.budgetCard}>
            <div className={styles.budgetMonth}>
              {months[budget.month - 1]} {budget.year}
            </div>
            <div className={styles.budgetLimit}>
              ${budget.limit.toFixed(2)}
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}