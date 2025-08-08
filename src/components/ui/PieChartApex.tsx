import React, { useMemo, useEffect, useState } from "react";
import ApexChart from "react-apexcharts";

export interface PieChartApexProps {
  series: number[];
  labels: string[];
  colors?: string[];
  height?: number;
  width?: string | number;
  totalLabel?: string;
  totalFormatter?: (sum: number) => string;
}

const defaultColors = ["#1C64F2", "#16BDCA", "#FDBA8C", "#E74694"];

export const PieChartApex: React.FC<PieChartApexProps> = ({
  series,
  labels,
  colors = defaultColors,
  height = 320,
  width = "100%",
  totalLabel = "Total",
  totalFormatter = (sum) =>
    `$${sum.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",")}`,
}) => {
  // Dynamically track theme changes
  const [isDark, setIsDark] = useState(() => {
    if (typeof window !== "undefined") {
      return document.documentElement.classList.contains("dark");
    }
    return false;
  });

  useEffect(() => {
    const observer = new MutationObserver(() => {
      setIsDark(document.documentElement.classList.contains("dark"));
    });
    observer.observe(document.documentElement, {
      attributes: true,
      attributeFilter: ["class"],
    });
    return () => observer.disconnect();
  }, []);

  const textColor = isDark ? "#fff" : "#222";
  const legendLabelColors = isDark ? "#fff" : "#222";

  const options = {
    series,
    colors,
    chart: {
      height,
      width,
      type: "donut",
      background: "transparent",
      fontFamily: "Inter, sans-serif",
      toolbar: { show: false },
    },
    stroke: {
      colors: ["transparent"],
    },
    plotOptions: {
      pie: {
        donut: {
          labels: {
            show: true,
            name: {
              show: true,
              fontFamily: "Inter, sans-serif",
              offsetY: 20,
              color: textColor,
            },
            total: {
              showAlways: true,
              show: true,
              label: totalLabel,
              fontFamily: "Inter, sans-serif",
              color: textColor,
              formatter: function (w: any) {
                const sum = w.globals.seriesTotals.reduce(
                  (a: number, b: number) => a + b,
                  0
                );
                return totalFormatter(sum);
              },
            },
            value: {
              show: true,
              fontFamily: "Inter, sans-serif",
              offsetY: -20,
              color: textColor,
              formatter: function (value: number) {
                return `$${value
                  .toString()
                  .replace(/\B(?=(\d{3})+(?!\d))/g, ",")}`;
              },
            },
          },
          size: "80%",
        },
      },
    },
    grid: {
      padding: {
        top: -2,
      },
    },
    labels,
    dataLabels: {
      enabled: false,
    },
    legend: {
      show: true, // Show built-in legend
      position: "bottom",
      fontFamily: "Inter, sans-serif",
      labels: {
        colors: legendLabelColors,
      },
    },
    tooltip: {
      theme: isDark ? "dark" : "light",
      y: {
        formatter: (val: number) =>
          `$${val.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",")}`,
      },
    },
    theme: {
      mode: isDark ? "dark" : "light",
    },
    responsive: [
      {
        breakpoint: 640,
        options: {
          chart: { height: 220 },
        },
      },
    ],
  };

  return (
    <div className="w-full flex flex-col items-center justify-center">
      <ApexChart
        options={options as any}
        series={series}
        type="donut"
        height={height}
        width={width}
      />
    </div>
  );
};

export default PieChartApex;
