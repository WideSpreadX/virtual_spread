$.get("../data/data.json", function(data) {
  let myChart = document.getElementById("myChart");
  myChart.setAttribute("charts", { type: "bar", dataPoints: data });
});
