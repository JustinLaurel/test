import "./chart.css";
import React from "react";
import { Doughnut } from "react-chartjs-2";
import { getFormattedCurrency, getNumberFromCurrency } from "../util";
import { doughnutLabel } from "./config";

export default function Chart(props) {
  const { data } = props;
  const { centerAmt, label, pieChartData } = data;

  function Legend(props) {
    const { color, children } = props;
    return (
      <main className="legend">
        <div className="color" style={{ backgroundColor: color }}></div>
        <div className="label">{children}</div>
      </main>
    );
  }

  return (
    <main className="pieChart-container">
      <div className="pieChart">
        <div className="pieChart-innerPie">
          <div className="innerPie-title">jumlah keseluruhan</div>
          <div className="innerPie-amount">
            <div>{centerAmt}</div>
          </div>
        </div>
        <Doughnut
          id="canvas"
          data={data.pieChartData}
          plugins={[doughnutLabel]}
          options={{
            tooltips: {
              displayColors: false,
              callbacks: {
                label: (tooltipItem, data) => {
                  return getFormattedCurrency(
                    data.datasets[tooltipItem.datasetIndex].data[
                      tooltipItem.index
                    ],
                    true
                  );
                },
              },
              bodyFontSize: "10",
              caretSize: 0,
              caretPadding: -60,
            },
            elements: {
              center: {
                text: "Red is 2/3 the total numbers",
                color: "white",
                fontStyle: "Arial",
                sidePadding: 20,
                minFontSize: 20,
                lineHeight: 25,
              },
            },
            legend: {
              display: false,
            },
            responsive: true,
            maintainAspectRatio: false,
          }}
        />
      </div>
      <section className="legends">
        {pieChartData.labels.map((label, index) => {
          return (
            <Legend
              key={label}
              color={pieChartData.datasets[0].backgroundColor[index]}
            >
              {label}
            </Legend>
          );
        })}
      </section>
      <section className="chartTitle">{label}</section>
      <button className="viewAccountBtn">LIHAT AKAUN</button>
    </main>
  );
}
