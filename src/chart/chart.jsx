import "./chart.css";
import React from "react";
import { Chart as ChartJS, ArcElement, Tooltip, Legend } from "chart.js";
import { Doughnut, Pie } from "react-chartjs-2";
import { useEffect } from "react";
import { useMemo } from "react";
import { getFormattedCurrency, getNumberFromCurrency } from "../util";
import { DEFAULT_SLICE_COLORS, doughnutLabel, fakeData } from "./config";

export default function Chart(props) {
  const { data } = props;
  const accountResponse = useMemo(() => {
    if (data.response_code == "00") {
      let pinjamanObj = data.pinjaman;
      let accounts = [];

      if (pinjamanObj.allPinjamanScheme) {
        let formattedArray = pinjamanObj.allPinjamanScheme.map((acc, index) => {
          return {
            ...acc,
            accountNo: acc.loanNo ? acc.loanNo : undefined,
            accountHolderIc: data.ic,
            loanType: acc.favoriteAccountTypeName,
            accountName: acc.program ? acc.program : acc.schemeDesc,
            amount: acc.balance,
            status: acc.status ?? undefined,
            arrearsAmt: acc.totalArreas,
          };
        });
        accounts.push(...formattedArray);
      }

      const totalPinjamanCurrentBalanceAmount = getNumberFromCurrency(
        pinjamanObj.totalPinjamanCurrentBalanceAmount
      );
      const totalPinjamanArrears = getNumberFromCurrency(
        pinjamanObj.totalPinjamanArrears
      );
      const totalPinjamanAmount = getNumberFromCurrency(
        pinjamanObj.totalPinjamanAmount
      );

      return {
        accounts,
        totalPinjamanAmount,
        totalPinjamanCurrentBalanceAmount,
        totalPinjamanArrears,
        currentPercentage:
          totalPinjamanAmount === 0
            ? 0
            : totalPinjamanCurrentBalanceAmount / totalPinjamanAmount,
        arrearsPercentage:
          totalPinjamanAmount === 0
            ? 0
            : totalPinjamanArrears / totalPinjamanAmount,
      };
    }
  }, [data]);

  // const pieChartData = useMemo(() => {
  //   return {
  //     labels: [],
  //   };
  // }, [accountResponse]);

  console.log(`accountResponse`, accountResponse);

  const center = {};

  return (
    <div className="chart-container">
      <div className="background">
        <div className="background-title">Hi</div>
        <div className="background-amount-wrapper">
          <div>RM1,540.30</div>
        </div>
      </div>
      <Doughnut
        id="canvas"
        width={750}
        height={750}
        data={fakeData}
        plugins={[doughnutLabel]}
        options={{
          tooltips: {
            displayColors: false,
            callbacks: {
              title: function (tooltipItems, data) {
                return "";
              },
              label: function (tooltipItem, data) {
                return getFormattedCurrency(
                  data.datasets[tooltipItem.datasetIndex].data[
                    tooltipItem.index
                  ],
                  true
                );
              },
            },
          },
          elements: {
            center: {
              text: "Red is 2/3 the total numbers",
              color: "white", // Default is #000000
              fontStyle: "Arial", // Default is Arial
              sidePadding: 20, // Default is 20 (as a percentage)
              minFontSize: 20, // Default is 20 (in px), set to false and text will not wrap.
              lineHeight: 25, // Default is 25 (in px), used for when text wraps
            },
          },
          legend: {
            display: false,
          },
        }}
      />
    </div>
  );
}
