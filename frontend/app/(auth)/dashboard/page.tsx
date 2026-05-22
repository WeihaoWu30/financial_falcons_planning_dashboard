'use client'
export const dynamic = 'force-dynamic'
import { useState, useEffect } from 'react'
import styles from './page.module.css'
import { trpc } from '@/utils/trpc'
import { createClient } from '@/utils/supabase/client'
import { PieChart, Pie } from 'recharts'

const months = ['January', 'February', 'March', 'April', 'May', 'June',
  'July', 'August', 'September', 'October', 'November', 'December']

  const categories = ['GROCERIES', 'HOUSEHOLD', 'TRANSPORTATION', 'UTILITIES', 'FURNITURE']

  const categoryColors: Record<string, string> = {
   GROCERIES: '#c8f56a',
   HOUSEHOLD: '#7ed957',
   TRANSPORTATION: '#4a9e2f',
   UTILITIES: '#2d5e1e',
   FURNITURE: '#1a3d10',
 }

export default function Dashboard() {
  const [selectedMonth, setSelectedMonth] = useState(months[new Date().getMonth()])
  const [showDropdown, setShowDropdown] = useState(false)
  const [showAddMember, setShowAddMember] = useState(false)
  const [memberName, setMemberName] = useState('')
  const [userID, setUserID] = useState<string | null>(null)

  const utils = trpc.useUtils()

  const monthIndex = months.indexOf(selectedMonth) + 1;

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

  const { data: membersData } = trpc.group.getMembers.useQuery(
    { id: group!.id },
    { enabled: !!group?.id }
  )

  const { data: expenses } = trpc.expenses.getExpensesByMonthYear.useQuery({
      groupID: group!.id,
      month: monthIndex },
      { enabled: !!group?.id }
  )

  const { data: budget } = trpc.budget.getBudgetByMonthAndYear.useQuery({
   groupID: group!.id,
   month: monthIndex,
   year: new Date().getFullYear()},
   {enabled: !!group?.id}
  )



  const addMember = trpc.group.addMember.useMutation({
    onSuccess: () => utils.group.getMembers.invalidate()
  })

  const handleAddMember = async (e: React.SyntheticEvent) => {
    e.preventDefault()
    if (!group?.id) return
    await addMember.mutateAsync({ name: memberName, groupID: group.id })
    setMemberName('')
    setShowAddMember(false)
  }

  const members = membersData?.members ?? []

  const sumExpenses = expenses?.reduce((prev, curr) => prev + curr.amount, 0)

  const amountSaved = (budget?.limit ?? 0) - (sumExpenses ?? 0)

  const expensesByCategory = categories.map(c =>({
      category: c,
      expense: expenses?.filter(e => e.category === c).reduce((prev, curr) => prev+curr.amount, 0) ?? 0,
      fill: categoryColors[c]
  }))

  return (
    <div className={styles.mainContent}>
      <div className={styles.header_row}>
        <div>
          <h1>Dashboard Overview</h1>
          <div className={styles.headerSubtitle}>Here&apos;s your financial overview for today.</div>
        </div>
        <div className={styles.monthBtnWrapper}>
          <button className={styles.monthBtn} onClick={() => setShowDropdown(!showDropdown)}>
            {selectedMonth} ▾
          </button>
          {showDropdown && (
            <div className={styles.dropdown}>
              {months.map((month) => (
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
      </div>

      <div className={styles.grid_3_col}>
        <div className={styles.card}>
          <div className={styles.cardLabel}>Monthly Savings</div>
          <h2 className={styles.textGreen}>${amountSaved} saved</h2>
          <div className={styles.cardSubtitle}>Compared to living alone</div>
        </div>
        <div className={styles.card}>
          <div className={styles.cardLabel}>Shared Purchases</div>
          <h2 className={styles.textGreen}>{expenses?.length}</h2>
          <div className={styles.cardSubtitle}>Orders Split</div>
        </div>
        <div className={styles.card}>
          <div className={styles.cardLabel}>Total Shared Expenses</div>
          <h2 className={styles.textRed}>{sumExpenses}</h2>
          <div className={styles.cardSubtitle}>Across {members.length} roommates</div>
        </div>
      </div>

      <div className={styles.two_column_charts}>
        <div className={styles.left_chart_card}>
          <h2 className={styles.chartTitle}>Apartment Spending</h2>
          <div className={styles.donut_flex_container}>
            <PieChart width={170} height={170}>
               <Pie
                  data={expensesByCategory}
                  dataKey="expense"
                  nameKey="category"
                  innerRadius={55}
                  outerRadius={85}
               />
            </PieChart>
            <div className={styles.legend_stuff}>
              <div className={styles.legendEmoji}>💰</div>
              <div className={styles.legendSubtitle}>Total Spending</div>
              <div className={styles.totalValue}>{sumExpenses}</div>
              <div className={styles.legendDivider}></div>
              {expensesByCategory.map(e =>(
                  <div key={e.category} className={styles.legendRow}>
                     <div className={styles.legendDot} style={{ background: e.fill }}></div> {e.category} ( {e.expense} )
                  </div>
              ))}
            </div>
          </div>
        </div>

        <div className={styles.right_column_container}>
          <div className={styles.savingsCard}>
            <div className={styles.savingsLabel}>Savings Trend</div>
            <div className={styles.savingsValue}>$5,200</div>
            <svg className={styles.sparkline} viewBox="0 0 220 90" preserveAspectRatio="none">
              <defs>
                <linearGradient id="blueGrad" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor="#38bdf8" stopOpacity="0.3" />
                  <stop offset="100%" stopColor="#38bdf8" stopOpacity="0" />
                </linearGradient>
              </defs>
              <line x1="0" y1="22" x2="220" y2="22" stroke="#22252a" strokeWidth="1" />
              <line x1="0" y1="45" x2="220" y2="45" stroke="#22252a" strokeWidth="1" />
              <line x1="0" y1="68" x2="220" y2="68" stroke="#22252a" strokeWidth="1" />
              <path d="M 0,74 L 35,62 L 70,44 L 100,20 L 135,10 L 165,30 L 195,58 L 220,76 L 220,90 L 0,90 Z" fill="url(#blueGrad)" />
              <polyline points="0,74 35,62 70,44 100,20 135,10 165,30 195,58 220,76" fill="none" stroke="#38bdf8" strokeWidth="2.5" />
            </svg>
          </div>

          <div className={styles.avatarsCard}>
            <div>
              <div className={styles.membersLabel}>Members</div>
              <div className={styles.avatarStack}>
                {members.map(member => (
                  <div key={member.id} className={styles.avatarChip}>
                    {member.name.slice(0, 2).toUpperCase()}
                  </div>
                ))}
              </div>
            </div>
            <button className={styles.plusBtn} onClick={() => setShowAddMember(true)}>+</button>
          </div>

          {showAddMember && (
            <div className={styles.addMemberOverlay}>
              <div className={styles.addMemberModal}>
                <h2 className={styles.addMemberTitle}>Add Member</h2>
                <form onSubmit={handleAddMember}>
                  <input
                    value={memberName}
                    onChange={e => setMemberName(e.target.value)}
                    placeholder="Member name"
                    required
                    className={styles.addMemberInput}
                  />
                  <div className={styles.addMemberButtons}>
                    <button type="button" onClick={() => setShowAddMember(false)} className={styles.addMemberCancelBtn}>Cancel</button>
                    <button type="submit" disabled={addMember.isPending} className={styles.addMemberSubmitBtn}>
                      {addMember.isPending ? 'Adding...' : 'Add'}
                    </button>
                  </div>
                </form>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}