import { useMemo } from 'react'
import {
  Area,
  AreaChart,
  CartesianGrid,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from 'recharts'
import { Card, CardBody, CardHeader } from '../ui/Card.jsx'
import { formatLiter } from '../../utils/format.js'
import { CHART_AXIS_STROKE, CHART_GRID_STROKE, CHART_TOOLTIP_STYLE } from '../../utils/chartTheme.js'
import { createChartDataWithDeviceTime } from '../../utils/deviceTime.js'

function tickTime(displayTime) {
  if (!displayTime) return ''
  // displayTime is already formatted as HH:MM:SS from createChartDataWithDeviceTime
  return displayTime
}

export function TankVolumeChart({ history }) {
  const data = useMemo(() => {
    const historyArray = Array.isArray(history) ? history : []
    const baseData = createChartDataWithDeviceTime(historyArray, 80, 1)
    return baseData.slice(-80).map((h) => ({
      t: h.t,
      displayTime: h.displayTime,
      v: h.tank?.currentVolumeLiter,
    }))
  }, [history])

  return (
    <Card>
      <CardHeader title="Volume Tangki" subtitle="Perubahan volume air terhadap waktu" />
      <CardBody className="h-72">
        <ResponsiveContainer width="100%" height="100%">
          <AreaChart data={data}>
            <CartesianGrid stroke={CHART_GRID_STROKE} strokeDasharray="3 3" />
            <XAxis dataKey="t" tickFormatter={tickTime} stroke={CHART_AXIS_STROKE} />
            <YAxis stroke={CHART_AXIS_STROKE} />
            <Tooltip
              contentStyle={CHART_TOOLTIP_STYLE}
              labelFormatter={(v) => tickTime(v)}
              formatter={(v) => [formatLiter(v, 1), 'Volume']}
            />
            <Area type="monotone" dataKey="v" stroke="#06b6d4" fill="rgba(34,211,238,0.18)" strokeWidth={2} />
          </AreaChart>
        </ResponsiveContainer>
      </CardBody>
    </Card>
  )
}

