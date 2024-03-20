import { useMemo, useState } from "react";
import "./App.css";
import Chart from "./chart/chart";
import { getFormattedCurrency, getNumberFromCurrency } from "./util";

function App() {
  const chartData = useMemo(() => {
    const INSURANCE_SCHEME = "98";
    const noInsurance = data.pinjaman.allPinjamanScheme.filter(
      (account) => account.schemeCode !== INSURANCE_SCHEME
    );
    return noInsurance.map((datum) => {
      const hasLoanCompleted = Boolean(datum.tarikhMulaJbb);
      let intermediateData = null;

      if (hasLoanCompleted) {
        intermediateData = [
          {
            label: "Jumlah Bayaran Balik",
            value: getNumberFromCurrency(datum.totalDisbursed),
            color: "#0071BB",
          },
          {
            label: "Jumlah Belum Dikreditkan",
            value: datum.totalLoan - datum.totalDisbursed,
            color: "#ADADAD",
          },
        ];
      } else {
        intermediateData = [
          {
            label: "Belum Dibayar",
            value: getNumberFromCurrency(datum.balance),
            color: "#FB840E",
          },
          {
            label: "Jumlah Bayaran Balik",
            value: Math.max(
              getNumberFromCurrency(datum.totalLoan) -
                getNumberFromCurrency(datum.balance),
              0
            ),
            color: "#0071BB",
          },
          {
            label: "Jumlah Tunggakan",
            value: getNumberFromCurrency(datum.totalArreas),
            color: "#FF0000",
          },
        ];
      }

      const excludeZeroes = intermediateData.filter((item) => item.value > 0);
      const labels = [];
      const data = [];
      const backgroundColor = [];
      excludeZeroes.forEach((item) => {
        labels.push(item.label);
        data.push(item.value);
        backgroundColor.push(item.color);
      });
      const chartData = {
        labels,
        datasets: [
          {
            data,
            backgroundColor,
            borderWidth: 0,
          },
        ],
      };

      return {
        label: datum.eduLevel,
        centerAmt: getFormattedCurrency(datum.totalLoan),
        pieChartData: chartData,
      };
    });
  }, [data]);
  console.log(`chartData`, chartData);
  return (
    <main>
      {chartData.map((datum) => {
        return <Chart key={datum.label} data={datum} />;
      })}
    </main>
  );
}

export default App;

const data = {
  response_code: "00",
  pinjaman: {
    totalPinjamanArrears: "0.00",
    totalPinjamanAmount: "0.00",
    totalPinjamanCurrentBalanceAmount: "18,056.41",
    allPinjamanScheme: [
      {
        schemeCode: "12",
        deductionFlag: {
          validDD: true,
          validAD: false,
          validPG: true,
        },
        loanNo: "2619665",
        validForDeduction: true,
        totalLoan: 31560,
        repayAmount: "0.00",
        program: "SEPENUH MASA-BSC (HONS) IN SOFTWARE ENGINEERING",
        tarikhMulaJbb: "",
        intArrears: "0.00",
        ds: "ujrah",
        principalArrears2: -7801.35,
        trxCode: "1228",
        balance: "18454.29",
        intArrears2: 0,
        totalDisbursed: 26300,
        favoriteAccountTypeName: "Pinjaman Ujrah",
        startPay: "01 / 10 / 2018",
        endPay: "",
        openingBalance: -18454.29,
        limitTransfer: -18454.29,
        schemeDesc: "PINJAMAN 2          ",
        eduLevel: "IJAZAH PERTAMA SEPENUH MASA",
        favoriteAccountTypeID: 4,
        yearCreated: "2018",
        module: "ujrah",
        loanPrincipal: "0.00",
        lebihanBayaran: "0.00",
        totalArreas: "0.00",
        tunggakan: 0,
        initialBalance: -18454.29,
        name: "FOO CHE XUIAN",
        institute:
          "ASIA PACIFIC UNIVERSITY OF TECHNOLOGY AND INNOVATION (ASIA PACIFIC UTI)",
        principalArrears: "-7801.35",
        layakPindahan: false,
        statusCode: "TC",
        status: "TAMAT PINJAMAN - CEMERLANG",
      },
      {
        schemeCode: "98",
        deductionFlag: {
          validDD: false,
          validAD: false,
          validPG: false,
        },
        validForDeduction: false,
        repayAmount: "0.00",
        program: "",
        tarikhMulaJbb: "",
        intArrears: "0.00",
        ds: "ujrah",
        principalArrears2: 0,
        trxCode: "9828",
        balance: "-397.88",
        intArrears2: 0,
        favoriteAccountTypeName: "Pinjaman Ujrah",
        endPay: "",
        openingBalance: 398.97,
        limitTransfer: 397.88,
        schemeDesc: "INSURANS            ",
        eduLevel: "",
        favoriteAccountTypeID: 4,
        module: "ujrah",
        loanPrincipal: "0.00",
        lebihanBayaran: "397.88",
        totalArreas: "0.00",
        tunggakan: 0,
        initialBalance: 397.88,
        name: "FOO CHE XUIAN",
        principalArrears: "0.00",
        layakPindahan: false,
      },
    ],
  },
  response_message: "Berjaya",
  name: "FOO CHE XUIAN",
  convStatementYears: [2024],
  ic: "980820565143",
  convMinYear: "",
  ujrahMinYear: "2018",
  ujrahStatementYears: [2024, 2023, 2022, 2021, 2020, 2019, 2018],
};
