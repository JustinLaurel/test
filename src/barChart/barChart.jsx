import "./barChart.css";
import React, { useMemo } from "react";
import { Bar } from "react-chartjs-2";
import { getFormattedCurrency } from "../util";
import customTooltip from "./customTooltip";
import centerLabelPlugin from "./centerLabelPlugin";
import { chunkString } from "../util";

export default function BarChart(props) {
  const { mainResponseData, tooltipResponseData } = props;

  //#region Response data massaging start
  const tooltipData = useMemo(() => {
    if (!tooltipResponseData) {
      return null;
    }

    const keys = Object.keys(tooltipResponseData.pinjamanUjrahDetails);
    const tooltipData = keys.map((key) => {
      const disbursement = tooltipResponseData.pinjamanUjrahDetails[key];
      return {
        semester:
          disbursement.disbursementSemester +
          "/" +
          disbursement.creditedDate.slice(-2),
        creditDate: formatToTooltipDate(disbursement.creditedDate),
        disbursementAmount:
          getFormattedCurrency(disbursement.creditAmount, true) + " (SELESAI)",
      };
    });
    return [tooltipData];
  }, [tooltipResponseData.pinjamanUjrahDetails]);
  const mainData = useMemo(() => {
    if (!mainResponseData) {
      return null;
    }

    const INSURANCE_SCHEME = "98";
    const noInsurance = mainResponseData.pinjaman.allPinjamanScheme.filter(
      (account) => account.schemeCode !== INSURANCE_SCHEME
    );
    if (noInsurance.length === 0) {
      return null;
    }

    let jumlahPengeluaranPinjaman = 0;
    const labels = [];
    const mainDatasetData = [];
    const stackedDatasetData = [];
    noInsurance.forEach((account, index) => {
      jumlahPengeluaranPinjaman += account.totalLoan;

      const label = chunkString(account.eduLevel, 15);
      labels.push(label);

      mainDatasetData.push({
        x: label,
        y: account.totalDisbursed,
        tooltipData: tooltipData[index] ?? null,
        isStacked: false,
        yFormatted: getFormattedCurrency(account.totalDisbursed, true),
      });

      const stackedValue = account.totalLoan - account.totalDisbursed;
      stackedDatasetData.push({
        x: label,
        y: stackedValue,
        isStacked: true,
        yFormatted:
          stackedValue === 0 ? null : getFormattedCurrency(stackedValue, true),
      });
    });

    return {
      jumlahPengeluaranPinjaman,
      labels,
      datasets: [
        {
          axis: "y",
          label: "Pengeluaran Pinjaman",
          data: mainDatasetData,
          backgroundColor: "#373B96",
        },
        {
          axis: "y",
          label: "Jumlah Pinjaman Diluluskan",
          data: stackedDatasetData,
          backgroundColor: "#F3F3F3",
          borderColor: "#707070",
          borderWidth: 2,
        },
      ],
    };
  }, [mainResponseData.pinjaman, tooltipData]);
  //#endregion Response data massaging end


  function formatToTooltipDate(creditedDate) {
    let parts = creditedDate.split("/").map((part) => part.trim());
    let date = new Date(parts[2], parts[1] - 1, parts[0]);

    let formatted =
      date.getDate().toString().padStart(2, "0") +
      "/" +
      (date.getMonth() + 1).toString().padStart(2, "0") +
      "/" +
      date.getFullYear().toString().slice(-2);
    return formatted;
  }

  return (
    <main className="container">
      <section className="header">
        JUMLAH PENGELUARAN PINJAMAN{" "}
        {getFormattedCurrency(mainData.jumlahPengeluaranPinjaman, true)}
      </section>
      <section id="chartjs-tooltip-placeholder"></section>
      <Bar
        data={mainData}
        plugins={[centerLabelPlugin]}
        options={{
          responsive: true,
          maintainAspectRatio: false,
          scales: {
            xAxes: [
              {
                scaleLabel: {
                  display: true,
                  labelString: "PERINGKAT PENGAJIAN",
                },
                stacked: true,
                ticks: {},
              },
            ],
            yAxes: [
              {
                scaleLabel: {
                  display: true,
                  labelString: "JUMLAH (RM)",
                },
                ticks: {
                  beginAtZero: true,
                  callback: function (value) {
                    return getFormattedCurrency(value);
                  },
                  fontSize: 10,
                },
                stacked: true,
              },
            ],
          },
          tooltips: {
            enabled: false,
            custom: customTooltip,
          },
        }}
      />
    </main>
  );
}
