import * as echarts from 'echarts';

export type ClickChartItem = {
  date: string;
  clicks: number;
};

export function buildClicksLineChartOption(
  data: ClickChartItem[]
): echarts.EChartsOption {
  const dates = data.map((d) => d.date);
  const clicks = data.map((d) => d.clicks);

  return {
    tooltip: {
      trigger: 'axis',
    },

    grid: {
      containLabel: true,
      borderColor: '#ADB1B8',
      width: 'auto',
      height: 'auto',
      left: '4%',
      right: '4%',
      top: '10%',
    },
    xAxis: {
      type: 'category',
      data: dates,
      boundaryGap: false,
      axisLabel: {
        color: '#ADB1B8',
      },
    },
    yAxis: {
      type: 'value',
      minInterval: 1,
    },
    dataZoom: [{ type: 'inside' }, { type: 'slider' }],
    series: [
      {
        name: 'Total Click',
        type: 'line',
        data: clicks,
        smooth: true,
        symbol: 'none',
        sampling: 'lttb',
        itemStyle: { color: '#27a3d9' },
        areaStyle: {
          color: new echarts.graphic.LinearGradient(0, 0, 0, 1, [
            { offset: 0, color: '#38bdf8' },
            { offset: 1, color: '#e0f2fe' },
          ]),
        },
      },
    ],
    graphic:
      data.length === 0
        ? {
            type: 'text',
            left: 'center',
            top: 'middle',
            style: {
              text: 'No click data',
              fill: '#9CA3AF',
              fontSize: 14,
            },
          }
        : undefined,
  };
}
