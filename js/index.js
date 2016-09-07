'use strict';

var url = "https://raw.githubusercontent.com/FreeCodeCamp/ProjectReferenceData/master/GDP-data.json";
var chartData = [];

var margin = { top: 50, right: 30, bottom: 100, left: 60 };
var w = window.innerWidth;
var h = window.innerHeight;
var height = h * 0.9 - margin.top - margin.bottom,
    width = w * 0.9 - margin.left - margin.right;
var color = undefined;

function drawChart() {
  d3.json(url, function (json) {
    chartData = json.data;

    var years = chartData.map(function (item, idx) {
      var y = item[0].split('-');
      var year = parseInt(y[0]);
      if (idx === 0) year = year - 1;
      return year;
    });
    var months = chartData.map(function (item) {
      var y = item[0].split('-');
      var m = parseInt(y[1]);
      var month = undefined;
      if (m === 1) month = 'Dec';else if (m === 4) month = 'Mar';else if (m === 7) month = 'Jun';else month = 'Sept';
      return month;
    });
    var tooltip = d3.select('body').append('div').style('position', 'absolute').style('padding', '5px 10px').style('background', 'green').style('border-radius', '5px').style('opacity', 0);

    var yScale = d3.scale.linear().domain([0, d3.max(chartData)[1]]).range([0, height]);

    var xScale = d3.scale.ordinal().domain(d3.range(0, chartData.length)).rangeBands([0, width], 0.2);
    var winWidth = width + margin.left + margin.right;
    var winHeight = height + margin.top + margin.bottom;

    var chart = d3.select('#chart').append('svg').style('background', '#C9D7AA').attr('width', winWidth).attr('height', winHeight).style('margin-top', '20').append('g').attr('transform', 'translate(' + margin.left + ',' + margin.top + ')').style('margin-top', '20').style('margin-left', '20').selectAll('rect').data(chartData).enter().append('rect').style('fill', '#C61C00').attr('width', xScale.rangeBand()).attr('height', function (d) {
      return yScale(d[1]);
    }).attr('x', function (d, i) {
      return xScale(i);
    }).attr('y', function (d) {
      // console.log(height-d[1])
      return height - yScale(d[1]);
    }).on('mouseover', function (d, i) {
      tooltip.transition().style('opacity', .9);
      tooltip.html("$" + d[1] + " Billions" + '</br>' + years[i] + ' ' + months[i]).style('left', d3.event.pageX + 10 + 'px').style('top', d3.event.pageY - 35 + 'px');
      color = this.style.fill;
      d3.select(this).style('opacity', .5).style('fill', 'black');
    }).on('mouseout', function (d) {
      tooltip.transition().delay(700).style('opacity', 0);
      d3.select(this).style('opacity', 1).style('fill', color);
    });

    var vGuideScale = d3.scale.linear().domain([0, d3.max(chartData)[1]]).range([height, 0]);

    var vAxis = d3.svg.axis().scale(vGuideScale).orient('left').ticks(10);
    var vGuide = d3.select('svg').append('g');
    vAxis(vGuide);
    vGuide.attr('transform', 'translate(' + margin.left + ', ' + margin.top + ')');
    vGuide.selectAll('path').style({ fill: 'none', stroke: '#000' });
    vGuide.selectAll('line').style({ fill: 'none', stroke: '#000' });
    vGuide.append('text').attr('transform', 'rotate(-90)').attr('y', 20).style('text-anchor', 'end').style('font-size', '1.1em').text('Gross Domestic Product, in Billions');

    var hGuideScale = d3.scale.ordinal().domain(years).rangeBands([0, width]);
    var hAxis = d3.svg.axis().scale(hGuideScale).orient('bottom').tickValues(hGuideScale.domain().filter(function (d, i) {
      return !(i % 4);
    }));

    var hGuide = d3.select('svg').append('g');
    hAxis(hGuide);
    hGuide.attr('transform', 'translate(' + margin.left + ', ' + (height + margin.top) + ')');
    hGuide.selectAll('path').style({ fill: 'none', stroke: '#000' });
    hGuide.selectAll('line').style({ stroke: '#000' });

    var title = d3.select('svg').append("text").attr("x", width / 2).attr("y", 50).attr("text-anchor", "middle").style("font-size", "2em").style("text-decoration", "underline").text("Gross Domestic Product");

    var description = d3.select('svg').append('foreignObject').style('width', width).attr("x", '50').attr("y", height + 100).style("font-size", ".8em").html(json.description);
  });
}
drawChart();