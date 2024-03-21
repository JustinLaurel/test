export default function customTooltip(tooltip) {
  var BOTTOM_ARROW_HEIGHT = 10;
  var tooltipEl = document.getElementById("chartjs-tooltip-placeholder");

  if (tooltip.opacity === 0) {
    tooltipEl.style.opacity = 0;
    return;
  }

  let tooltipData = null;
  if (tooltip.dataPoints && tooltip.dataPoints.length > 0) {
    const datasetIndex = tooltip.dataPoints[0].datasetIndex;
    const index = tooltip.dataPoints[0].index;
    tooltipData = this._data.datasets[datasetIndex].data[index].tooltipData;
  }

  if (!Array.isArray(tooltipData) || tooltipData.length == 0) {
    return;
  }

  // Generate tooltip HTML
  var tooltipHtml = `
    <main class="tooltip">
      <section class="tooltip-headers">
        <div>Semester</div>
        <div>Tarikh Kredit</div>
        <div>Amaun Pengeluaran Pinjaman</div>
      </section>
      <section class="tooltip-body">`;
  tooltipData.forEach((datum) => {
    tooltipHtml += `
      <div class="body-row">
        <div>${datum.semester}</div>
        <div>${datum.creditDate}</div>
        <div>${datum.disbursementAmount}</div>
      </div>`;
  });
  tooltipHtml += `
      </section>
    </main>`;
  tooltipEl.innerHTML = tooltipHtml;
  // Generate tooltip HTML end

  // Calculate tooltip position
  tooltipEl.style.display = "block";
  tooltipEl.style.opacity = 1;
  tooltipEl.style.visibility = "hidden";

  var position = this._chart.canvas.getBoundingClientRect();
  tooltipEl.style.left = position.left + window.scrollX + tooltip.caretX + "px";
  tooltipEl.style.top = position.top + window.scrollY + tooltip.caretY + "px";

  var tooltipHeight = tooltipEl.offsetHeight;
  tooltipEl.style.top =
    position.top +
    window.scrollY +
    tooltip.caretY -
    BOTTOM_ARROW_HEIGHT / 2 -
    tooltipHeight +
    "px";
  tooltipEl.style.visibility = "";
  // Calculate tooltip position end
}
