'use client'
export const dynamic = 'force-dynamic'
import { useState, useEffect } from 'react'
import styles from './page.module.css'
import { trpc } from '@/utils/trpc'
import { createClient } from '@/utils/supabase/client'

const months = ['January', 'February', 'March', 'April', 'May', 'June',
  'July', 'August', 'September', 'October', 'November', 'December']

export default function AiService() {
  const [userID, setUserID] = useState<string | null>(null)
  const [report, setReport] = useState<string | null>(null)

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

  const getRecommendation = trpc.aiRecommendation.getAIRecommendation.useMutation({
    onSuccess: (data) => setReport(data.text ?? null)
  })

  const handleGenerate = async () => {
    if (!group?.id) return
    setReport(null)
    await getRecommendation.mutateAsync({
      groupID: group.id,
      month: new Date().getMonth() + 1,
    })
  }

  return (
    <div className={styles.page}>
      <div className={styles.header}>
        <h1>AI Recommendation</h1>
        <p>Get personalized financial advice based on your group&apos;s spending habits this month.</p>
      </div>

      <div className={styles.infoCards}>
        <div className={styles.infoCard}>
          <div className={styles.infoIcon}>📊</div>
          <div className={styles.infoTitle}>Spending Analysis</div>
          <div className={styles.infoDesc}>Analyzes your expenses across all categories for the current month</div>
        </div>
        <div className={styles.infoCard}>
          <div className={styles.infoIcon}>💡</div>
          <div className={styles.infoTitle}>Smart Tips</div>
          <div className={styles.infoDesc}>Get 3 actionable tips tailored to international students saving money</div>
        </div>
        <div className={styles.infoCard}>
          <div className={styles.infoIcon}>🎯</div>
          <div className={styles.infoTitle}>Budget Aware</div>
          <div className={styles.infoDesc}>Takes your monthly budget into account to suggest realistic improvements</div>
        </div>
      </div>

      <div className={styles.generateSection}>
        <p className={styles.monthLabel}>
          Generating report for: <span>{months[new Date().getMonth()]} {new Date().getFullYear()}</span>
        </p>
        <button
          className={styles.generateBtn}
          onClick={handleGenerate}
          disabled={getRecommendation.isPending || !group?.id}
        >
          {getRecommendation.isPending ? 'Generating...' : 'Generate Plan'}
        </button>
      </div>

      {report && (
        <div className={styles.reportCard}>
          <h2>Your Personalized Plan</h2>
          <div className={styles.reportText}>{report}</div>
        </div>
      )}
    </div>
  )
}