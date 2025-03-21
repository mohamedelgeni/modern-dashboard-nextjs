import React from 'react'
import dynamic from 'next/dynamic'

// Dynamic import with no SSR
const ReactApexChart = dynamic(() => import('react-apexcharts').then((mod) => mod.default), {
  ssr: false,
  loading: () => <div className="h-full w-full flex items-center justify-center">Loading Chart...</div>
})

interface PieChartProps {
  chartData: any[]
  chartOptions: any
}

function PieChart({ chartData, chartOptions }: PieChartProps) {
  return (
    <div className="h-full w-full">
      {typeof window !== 'undefined' && (
        <ReactApexChart
          type="pie"
          series={chartData}
          options={chartOptions}
          height="100%"
          width="100%"
        />
      )}
    </div>
  )
}

export default PieChart 