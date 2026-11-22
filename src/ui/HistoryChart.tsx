import { useEffect, useRef } from 'react'
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

    chartInstanceRef.current = new Chart(ctx, {
      type: 'line',
      data: {
        labels,
        datasets: [
          {
            label: 'Tổng điểm (0–990)',
            data: totalScores,
            borderColor: '#2563eb',
            backgroundColor: 'rgba(37, 99, 235, 0.08)',
            borderWidth: 3,
            pointRadius: 5,
            pointHoverRadius: 7,
            pointBackgroundColor: '#2563eb',
            tension: 0.3,
            fill: true,
          },
          {
            label: 'Điểm Nghe (0–495)',
            data: listeningScores,
            borderColor: '#16a34a',
            backgroundColor: 'transparent',
            borderWidth: 2,
            pointRadius: 4,
            pointHoverRadius: 6,
            pointBackgroundColor: '#16a34a',
            borderDash: [4, 4],
            tension: 0.3,
          },
          {
            label: 'Điểm Đọc (0–495)',
            data: readingScores,
            borderColor: '#ea580c',
            backgroundColor: 'transparent',
            borderWidth: 2,
            pointRadius: 4,
            pointHoverRadius: 6,
            pointBackgroundColor: '#ea580c',
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
              font: {
                size: 12,
                weight: 'bold',
              },
            },
          },
          tooltip: {
            padding: 10,
            cornerRadius: 8,
          },
        },
        scales: {
          y: {
            min: 0,
            max: 990,
            ticks: {
              stepSize: 100,
            },
            grid: {
              color: 'rgba(150, 150, 150, 0.15)',
            },
          },
          x: {
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
  }, [entries])

  return (
    <div className="card history-chart-card" data-testid="history-chart-card">
      <h3 style={{ margin: '0 0 12px 0', fontSize: '1.05rem' }}>Biểu đồ tiến độ điểm số</h3>
      <div style={{ position: 'relative', height: '260px', width: '100%' }}>
        <canvas ref={canvasRef} data-testid="history-chart" />
      </div>
    </div>
  )
}
