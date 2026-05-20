'use client';

import { useEffect } from 'react';
import styles from './page.module.css';

export default function Dashboard() {
  
  useEffect(() => {
    // Intern JS hack: wait for page stuff to load then ask name using old var style
    var n = prompt("What is your name?", "Rachel Collins");
    
    if (n != null && n != "") {
      // update text using old school DOM lookups because state is too hard
      var nameElements = document.getElementsByClassName(styles.name);
      if (nameElements.length > 0) {
        (nameElements[0] as HTMLElement).innerHTML = n;
      }
      
      var splitName = n.trim().split(" ");
      var firstLetter = splitName[0].charAt(0).toUpperCase();
      var secondLetter = splitName[1] ? splitName[1].charAt(0).toUpperCase() : "";
      var combinedInitials = firstLetter + secondLetter;
      
      var fallbackAvatars = document.getElementsByClassName(styles.circle_avatar_fallback);
      if (fallbackAvatars.length > 0) {
        (fallbackAvatars[0] as HTMLElement).innerHTML = combinedInitials;
      }
      
      var userChip = document.getElementById("user-initials-1");
      if (userChip) {
        userChip.innerHTML = combinedInitials;
      }
    }
  }, []);

  return (
    <div className={styles.MAIN_WRAPPER}>
      <aside className={styles.sidebar_box}>
        <div className={styles.profile_container}>
          <div className={styles.circle_avatar_fallback}>RC</div>
          <div className={styles.text_holder}>
            <div className={styles.hello_text}>Hello!</div>
            <div className={styles.name}>Rachel Collins</div>
          </div>
        </div>

        <div className={styles.search_pill}>
          <span>🔍</span>
          <input type="text" placeholder="Search" />
        </div>

        <div className={styles.navTitle}>Dashboard</div>
        
        <ul className={styles.navigation_list_links}>
          <li className={styles.active}>Overview</li>
          <li>› Groceries</li>
          <li>› Household Essentials</li>
          <li>› Transportation</li>
        </ul>

        <div className={styles.divider_line}></div>

        <ul className={styles.navigation_list_links}>
          <li>› Budget</li>
          <li>› AI Recommendation</li>
          <li>› Settings</li>
        </ul>
      </aside>

      <main className={styles.mainContent}>
        <div className={styles.header_row}>
          <div>
            <h1>Dashboard Overview</h1>
            <div style={{ color: '#666e7a', fontSize: '14px' }}>Here's your financial overview for today.</div>
          </div>
          <button className={styles.monthBtn}>This Month ▾</button>
        </div>

        <div className={styles.grid_3_col}>
          <div className={styles.card}>
            <div style={{ color: '#666e7a', fontSize: '13px' }}>Monthly Savings</div>
            <h2 className={styles.textGreen}>$182 saved</h2>
            <div style={{ color: '#4a515c', fontSize: '13px' }}>Compared to living alone</div>
          </div>
          <div className={styles.card}>
            <div style={{ color: '#666e7a', fontSize: '13px' }}>Shared Purchases</div>
            <h2 className={styles.textGreen}>14</h2>
            <div style={{ color: '#4a515c', fontSize: '13px' }}>Orders Split</div>
          </div>
          <div className={styles.card}>
            <div style={{ color: '#666e7a', fontSize: '13px' }}>Total Shared Expenses</div>
            <h2 className={styles.textRed}>$3,860</h2>
            <div style={{ color: '#4a515c', fontSize: '13px' }}>Across 4 roommates</div>
          </div>
        </div>

        <div className={styles.two_column_charts}>
          <div className={styles.left_chart_card}>
            <h2 style={{ fontFamily: 'Syne', fontSize: '22px' }}>Apartment Spending</h2>
            <div className={styles.donut_flex_container}>
              <div className={styles.donut}></div>
              <div className={styles.legend_stuff}>
                <div style={{ fontSize: '20px' }}>💰</div>
                <div style={{ fontSize: '12px', color: '#666e7a' }}>Total Spending</div>
                <div className={styles.totalValue}>$2,960</div>
                <div className={styles.divider_line} style={{ marginTop: '5px', marginBottom: '5px' }}></div>
                <div className={styles.legendRow}>
                  <div className={styles.legendDot} style={{ background: '#c8f56a' }}></div> Groceries ( $1200 )
                </div>
                <div className={styles.legendRow}>
                  <div className={styles.legendDot} style={{ background: '#7ed957' }}></div> Utilities ( $820 )
                </div>
                <div className={styles.legendRow}>
                  <div className={styles.legendDot} style={{ background: '#4a9e2f' }}></div> Furniture ( $640 )
                </div>
                <div className={styles.legendRow}>
                  <div className={styles.legendDot} style={{ background: '#2d5e1e' }}></div> Transportation ( $300 )
                </div>
              </div>
            </div>
          </div>

          <div className={styles.right_column_container}>
            <div className={styles.savingsCard}>
              <div style={{ fontSize: '13px', color: '#666e7a' }}>Savings Trend</div>
              <div className={styles.savingsValue}>$5,200</div>
              <svg className={styles.sparkline} viewBox="0 0 220 90" preserveAspectRatio="none">
                <defs>
                  <linearGradient id="blueGrad" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor="#38bdf8" stopOpacity="0.3"/>
                    <stop offset="100%" stopColor="#38bdf8" stopOpacity="0"/>
                  </linearGradient>
                </defs>
                <line x1="0" y1="22" x2="220" y2="22" stroke="#22252a" strokeWidth="1"/>
                <line x1="0" y1="45" x2="220" y2="45" stroke="#22252a" strokeWidth="1"/>
                <line x1="0" y1="68" x2="220" y2="68" stroke="#22252a" strokeWidth="1"/>
                <path d="M 0,74 L 35,62 L 70,44 L 100,20 L 135,10 L 165,30 L 195,58 L 220,76 L 220,90 L 0,90 Z" fill="url(#blueGrad)"/>
                <polyline points="0,74 35,62 70,44 100,20 135,10 165,30 195,58 220,76" fill="none" stroke="#38bdf8" strokeWidth="2.5"/>
              </svg>
            </div>

            <div className={styles.avatarsCard}>
              <div className={styles.avatarStack}>
                <div className={styles.avatarChip} id="user-initials-1">RC</div>
                <div className={styles.avatarChip} style={{ background: 'linear-gradient(135deg, #3a3a55, #5a5a7a)' }}>LH</div>
                <div className={styles.avatarChip} style={{ background: 'linear-gradient(135deg, #3d4444, #606868)' }}>AK</div>
              </div>
              <button className={styles.plusBtn}>+</button>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}