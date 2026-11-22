import { useEffect, useRef, useState } from 'react'
import {
  Chart,
  LineController,
  LineElement,
  PointElement,
  LinearScale,
  CategoryScale,
  Title,
  Tooltip,
  Legend,
  Filler,
} from 'chart.js'
import type { HistoryEntry } from '../lib/contract'

Chart.register(
  LineController,
  LineElement,
  PointElement,
  LinearScale,
  CategoryScale,
  Title,
  Tooltip,
  Legend,
  Filler,
)

interface HistoryChartProps {
  entries: HistoryEntry[]
}

function formatChartDate(ts: number): string {
  const d = new Date(ts)
  return `${d.getDate()}/${d.getMonth() + 1}`
}

export function HistoryChart({ entries }: HistoryChartProps) {
  const canvasRef = useRef<HTMLCanvasElement | null>(null)
  const chartInstanceRef = useRef<Chart | null>(null)
  const [isDark, setIsDark] = useState<boolean>(() => {
    if (typeof document === 'undefined') return false
    return document.documentElement.getAttribute('data-theme') === 'dark'
  })

  useEffect(() => {
    if (typeof document === 'undefined') return

    const checkTheme = () => {
      setIsDark(document.documentElement.getAttribute('data-theme') === 'dark')
    }

    checkTheme()

    const observer = new MutationObserver((mutations) => {
      for (const mutation of mutations) {
        if (mutation.type === 'attributes' && mutation.attributeName === 'data-theme') {
          checkTheme()
        }
      }
    })

    observer.observe(document.documentElement, {
      attributes: true,
      attributeFilter: ['data-theme'],
    })

    return () => observer.disconnect()
  }, [])

  useEffect(() => {
    if (!canvasRef.current || entries.length === 0) return

    // Sắp xếp thứ tự thời gian từ cũ tới mới để vẽ biểu đồ tiến độ
    const sorted = entries.slice().sort((a, b) => a.finishedAt - b.finishedAt)
    const labels = sorted.map((e, idx) => {
      const modeLabel = e.mode === 'mock' ? `Đề #${idx + 1}` : `Luyện #${idx + 1}`
      return `${modeLabel} (${formatChartDate(e.finishedAt)})`
    })

    const totalScores = sorted.map((e) => e.estimateTotal)
    const listeningScores = sorted.map((e) => e.listeningScore ?? Math.round(e.estimateTotal * 0.52))
    const readingScores = sorted.map((e) =>
      e.readingScore ?? Math.max(0, e.estimateTotal - (e.listeningScore ?? Math.round(e.estimateTotal * 0.52))),
    )

    if (chartInstanceRef.current) {
      chartInstanceRef.current.destroy()
    }

    const ctx = canvasRef.current.getContext('2d')
    if (!ctx) return

    const textColor = isDark ? '#cbd5e1' : '#39424f'
    const gridColor = isDark ? 'rgba(43, 57, 77, 0.6)' : 'rgba(217, 223, 232, 0.6)'
    const totalColor = isDark ? '#3b82f6' : '#1c4b87'
    const totalBg = isDark ? 'rgba(59, 130, 246, 0.12)' : 'rgba(28, 75, 135, 0.08)'
    const listeningColor = isDark ? '#22c55e' : '#176038'
    const readingColor = isDark ? '#f97316' : '#c2410c'

    chartInstanceRef.current = new Chart(ctx, {
      type: 'line',
      data: {
        labels,
        datasets: [
          {
            label: 'Tổng điểm (0–990)',
            data: totalScores,
            borderColor: totalColor,
            backgroundColor: totalBg,
            borderWidth: 3,
            pointRadius: 5,
            pointHoverRadius: 7,
            pointBackgroundColor: totalColor,
            tension: 0.3,
            fill: true,
          },
          {
            label: 'Điểm Nghe (0–495)',
            data: listeningScores,
            borderColor: listeningColor,
            backgroundColor: 'transparent',
            borderWidth: 2,
            pointRadius: 4,
            pointHoverRadius: 6,
            pointBackgroundColor: listeningColor,
            borderDash: [4, 4],
            tension: 0.3,
          },
          {
            label: 'Điểm Đọc (0–495)',
            data: readingScores,
            borderColor: readingColor,
            backgroundColor: 'transparent',
            borderWidth: 2,
            pointRadius: 4,
            pointHoverRadius: 6,
            pointBackgroundColor: readingColor,
            borderDash: [4, 4],
            tension: 0.3,
          },
        ],
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        interaction: {
          mode: 'index',
          intersect: false,
        },
        plugins: {
          legend: {
            position: 'top',
            labels: {
              boxWidth: 14,
              color: textColor,
              font: {
                size: 12,
                weight: 'bold',
              },
            },
          },
          tooltip: {
            padding: 10,
            cornerRadius: 8,
            backgroundColor: isDark ? '#263346' : '#14181f',
            titleColor: '#ffffff',
            bodyColor: '#ffffff',
          },
        },
        scales: {
          y: {
            min: 0,
            max: 990,
            ticks: {
              stepSize: 100,
              color: textColor,
            },
            grid: {
              color: gridColor,
            },
          },
          x: {
            ticks: {
              color: textColor,
            },
            grid: {
              display: false,
            },
          },
        },
      },
    })

    return () => {
      if (chartInstanceRef.current) {
        chartInstanceRef.current.destroy()
        chartInstanceRef.current = null
      }
    }
  }, [entries, isDark])

  return (
    <div className="card history-chart-card" data-testid="history-chart-card">
      <h3 style={{ margin: '0 0 12px 0', fontSize: '1.05rem' }}>Biểu đồ tiến độ điểm số</h3>
      <div style={{ position: 'relative', height: '260px', width: '100%' }}>
        <canvas ref={canvasRef} data-testid="history-chart" />
      </div>
    </div>
  )
}
