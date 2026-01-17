import * as echarts from 'echarts';
import { useEffect, useRef } from 'react';

import {
  buildClicksLineChartOption,
  type ClickChartItem,
} from './line-chart.utils';

interface ClickLineChartProps {
  data: ClickChartItem[];
}

export const ClickLineChart = ({ data }: ClickLineChartProps) => {
  const containerRef = useRef<HTMLDivElement | null>(null);
  const chartRef = useRef<echarts.ECharts | null>(null);

  useEffect(() => {
    if (!containerRef.current) return;

    chartRef.current = echarts.init(containerRef.current, null, {
      renderer: 'canvas',
    });

    const resizeHandler = () => {
      chartRef.current?.resize();
    };

    window.addEventListener('resize', resizeHandler);

    return () => {
      window.removeEventListener('resize', resizeHandler);
      chartRef.current?.dispose();
      chartRef.current = null;
    };
  }, []);

  useEffect(() => {
    if (!chartRef.current) return;

    chartRef.current.setOption(buildClicksLineChartOption(data), {
      notMerge: true,
    });
  }, [data]);

  return (
    <div
      ref={containerRef}
      style={{
        height: 400,
      }}
      className="h-full w-full"
    />
  );
};
