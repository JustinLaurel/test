const centerLabelPlugin = {
  afterDraw: function (chart) {
    var ctx = chart.chart.ctx;
    var fontSize = 12;
    ctx.font = fontSize + "px bold";
    ctx.textBaseline = "middle";

    ctx.textAlign = "center";
    chart.data.datasets.forEach(function (dataset, i) {
      var meta = chart.getDatasetMeta(i);
      if (!meta.hidden) {
        meta.data.forEach(function (element, index) {
          const datum = dataset.data[index];
          var dataString = datum.yFormatted;
          if (!dataString) {
            return;
          }

          if (datum.isStacked) {
            var padding = 10;
            var yPos = element._model.y - padding;
            ctx.fillStyle = "black";
            ctx.fillText(dataString, element._model.x, yPos);
          } else {
            // vertically center label
            var barHeight = element._model.base - element._model.y;
            var yPos = element._model.y + barHeight / 2.5;
            ctx.fillStyle = "white";
            ctx.fillText(dataString, element._model.x, yPos);
          }
        });
      }
    });
  },
};

export default centerLabelPlugin;
