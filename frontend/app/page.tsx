import Link from 'next/link'
import styles from './page.module.css'

export default function Home() {
  return (
    <div className={styles.page}>
      <div className={styles.gridBg} />
      <div className={styles.glowTop} />
      <div className={styles.glowBottom} />

      <nav className={styles.nav}>
        <span className={styles.navLogo}>AbroadBuddy</span>
        <Link href="/login" className={styles.navLogin}>Log in →</Link>
      </nav>

      <main className={styles.hero}>
        <div className={styles.heroLeft}>
          <div className={styles.badge}>✦ For international students</div>
          <h1 className={styles.heading}>
            Your money,<br />
            <span className={styles.headingAccent}>managed together.</span>
          </h1>
          <p className={styles.subheading}>
            Split bills, track expenses, and save more — built for students living abroad with roommates.
          </p>
          <div className={styles.ctaRow}>
            <Link href="/login" className={styles.ctaBtn}>Get Started</Link>
            <Link href="/login" className={styles.ctaSecondary}>Log in</Link>
          </div>
        </div>

        <div className={styles.heroRight}>
          <div className={styles.floatCard1}>
            <div className={styles.cardTopRow}>
              <span className={styles.cardLabel}>Monthly Savings</span>
              <span className={styles.cardDot} />
            </div>
            <div className={styles.cardValue}>$420<span className={styles.cardUnit}>/mo</span></div>
            <div className={styles.cardSub}>↑ 12% from last month</div>
          </div>

          <div className={styles.floatCard2}>
            <div className={styles.cardTopRow}>
              <span className={styles.cardLabel}>Shared Expenses</span>
            </div>
            <div className={styles.chipRow}>
              <span className={styles.chip}>Groceries $84</span>
              <span className={styles.chip}>Utilities $60</span>
              <span className={styles.chip}>Transport $32</span>
            </div>
          </div>

          <div className={styles.floatCard3}>
            <div className={styles.cardLabel}>Roommates</div>
            <div className={styles.avatarRow}>
              {['WW', 'JK', 'AL'].map(initials => (
                <div key={initials} className={styles.avatar}>{initials}</div>
              ))}
              <div className={styles.avatarPlus}>+2</div>
            </div>
          </div>
        </div>
      </main>

      <footer className={styles.footer}>
        © {new Date().getFullYear()} AbroadBuddy
      </footer>
    </div>
  )
}
