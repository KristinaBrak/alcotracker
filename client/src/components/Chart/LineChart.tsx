import Chart from "chart.js";
import { useEffect, useRef } from "react";
import { useWindowSize } from "../../utils/windowSizeHook";

interface LineChartProps {
  title?: string;
  labels: string[];
  data: number[];
}

const calcSuggested = (data: number[]) => {
  const min = Math.min(...data);
  const max = Math.max(...data);
  const offset = 0.05;
  const suggestedMin = min - min * offset;
  const suggestedMax = max + max * offset;
  return { suggestedMin, suggestedMax };
};

const LineChart: React.FC<LineChartProps> = ({ title, labels, data }) => {
  const myChartRef = useRef(null);
  const { width } = useWindowSize();
  const { suggestedMin, suggestedMax } = calcSuggested(data);
  useEffect(() => {
    new Chart(myChartRef.current.getContext("2d"), {
      type: "line",
      data: {
        labels,
        datasets: [
          {
            fill: false,
            lineTension: 0,
            label: "Kaina",
            backgroundColor: "blue",
            borderColor: "rgba(75,192,192,1)",
            borderCapStyle: "butt",
            borderDash: [],
            borderDashOffset: 0.0,
            borderJoinStyle: "miter",
            pointBorderColor: "rgba(75,192,192,1)",
            pointBackgroundColor: "#fff",
            pointBorderWidth: 3,
            pointHoverRadius: 6,
            pointHoverBackgroundColor: "rgba(75,192,192,1)",
            pointHoverBorderColor: "rgba(220,220,220,1)",
            pointHoverBorderWidth: 2,
            pointRadius: 1,
            pointHitRadius: 3,
            data,
          },
        ],
      },
      options: {
        responsive: true,
        title: title
          ? {
              display: true,
              text: title,
            }
          : null,
        legend: {
          display: false,
        },
        scales: {
          yAxes: [
            {
              ticks: {
                suggestedMax,
                suggestedMin,
                callback: (value: number) => `${value.toFixed(2)} €`,
              },
            },
          ],
        },
      },
    });
  }, [width]);

  return <canvas id="lineChart" ref={myChartRef} />;
};

export default LineChart;
