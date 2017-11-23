var width = 0;
var height = 0;

//globals for animation
var interval;
var animatedAngle = 0;
var animationSpeed = 0.05;
var arrayID = 3;

$( document ).ready(function() {
  width = $(document).width();
  height = $(document).height();

  //menu config
  $('#setAngle').on('keydown', function(event) {
    if (event.keyCode == 13) {
      event.preventDefault();
      updateAngle(parseFloat($('#setAngle').val()))
    }
  });

  $('#play').on('click', function(event) {
    animatedAngle = parseFloat(d3.select('#angleSign').text().substring(3,d3.select('#angleSign').text().length-1));
    interval = d3.interval(animation, 1);
  });

  $('#pause').on('click', function(event) {
    interval.stop();
  });

  $('#stop').on('click', function(event) {
    interval.stop();
    animatedAngle = 0;
    updateAngle(animatedAngle);
  });

  $('#slower').on('click', function(event) {
    animationSpeedControl(-1);
  });

  $('#faster').on('click', function(event) {
    animationSpeedControl(1);
  });

  //display setup
  $('#Ssin').html("sin(\u03C6) = ");
  $('#Scos').html("cos(\u03C6) = ");
  $('#Stan').html("tan(\u03C6) = ");
  $('#Scotan').html("cotan(\u03C6) = ");

  $('#Nsin').html("0");
  $('#Ncos').html("1");
  $('#Ntan').html("0");
  $('#Ncotan').html("NaN");

  var svg = d3.select("body")
            .append("svg")
            .attr("width", width)
            .attr("height", height)
            .call(d3.zoom().on("zoom", function () {
              svg.attr("transform", d3.event.transform);
            }))
        .append("g");

  var viewport = svg.append('g');

  var x = d3.scaleLinear().range([10, width-10]).domain([-1.8999, 1.9]); //not very elegant...
  var y = d3.scaleLinear().range([10, height-10]).domain([1.21,  -1.21]);

  // Add the x Axis
  svg.append("g")
      .attr("transform", "translate(" + 0 + "," + height/2 + ")")
      .call(d3.axisBottom(x));

  // Add the y Axis
  svg.append("g")
      .attr("transform", "translate(" + width/2 + "," + 0 + ")")
      .call(d3.axisLeft(y));

  var circle = viewport.append('circle')
                       .attr('cx', width/2)
                       .attr('cy', height/2)
                       .attr('r', height/2.5)
                       .style('stroke','red')
                       .style('fill', 'none')
                       .style('stroke-width', 2);

  // lines for trigFkt
  var sinus = viewport.append("line")
                           .attr("x1", 0)
                           .attr("y1", height/2)
                           .attr("x2", 0)
                           .attr("y2", 0)
                           .attr("stroke-width", 2)
                           .attr("stroke", "yellow")
                           .attr('id', 'sinus')
                           .style("stroke-dasharray", ("3, 3"))
                           .style('opacity', 0);

   var cosinus = viewport.append("line")
                            .attr("x1", width/2)
                            .attr("y1", 0)
                            .attr("x2", 0)
                            .attr("y2", 0)
                            .attr("stroke-width", 2)
                            .attr("stroke", "orange")
                            .attr('id', 'cosinus')
                            .style("stroke-dasharray", ("3, 3"))
                            .style('opacity', 0);

    var cotangent = viewport.append("line")
                             .attr("x1", width/2)
                             .attr("y1", height/2-height/2.5)
                             .attr("x2", 0)
                             .attr("y2", height/2-height/2.5)
                             .attr("stroke-width", 2)
                             .attr("stroke", "#FA58F4")
                             .attr('id', 'cotangent')
                             .style("stroke-dasharray", ("3, 3"))
                             .style('opacity', 0);

   var cotangentHelper = viewport.append("line")
                            .attr("x1", width/2)
                            .attr("y1", height/2-height/2.5)
                            .attr("x2", 0)
                            .attr("y2", height/2-height/2.5)
                            .attr("stroke-width", 2)
                            .attr("stroke", "blue")
                            .attr('id', 'cotangentH')
                            .style("stroke-dasharray", ("1, 4"))
                            .style('stroke-width', 1)
                            .style('opacity', 0);

    var tangent = viewport.append("line")
                             .attr("x1", width/2+height/2.5)
                             .attr("y1", height/2)
                             .attr("x2", width/2+height/2.5)
                             .attr("y2", height/2)
                             .attr("stroke-width", 2)
                             .attr("stroke", "#088A08")
                             .attr('id', 'tangent')
                             .style("stroke-dasharray", ("3, 3"))
                             .style('opacity', 1);

   var tangentHelper = viewport.append("line")
                            .attr("x1", width/2+height/2.5)
                            .attr("y1", height/2)
                            .attr("x2", width/2+height/2.5)
                            .attr("y2", height/2)
                            .attr("stroke-width", 2)
                            .attr("stroke", "blue")
                            .attr('id', 'tangentH')
                            .style("stroke-dasharray", ("1, 4"))
                            .style('stroke-width', 1)
                            .style('opacity', 1);

   var dragPoint = viewport.append('circle')
                        .attr('cx', height/2.5+width/2)
                        .attr('cy', height/2)
                        .attr('r', 5)
                        .attr('id', 'dragPoint')
                        .style('fill', 'blue')
                       .datum({
                         x: height/2.5+width/2,
                         y: height/2
                       })
                       .call(d3.drag()
                       .on("start", dragstarted)
                       .on("drag", dragged)
                       .on("end", dragended));

  var centerVector = viewport.append("line")
                          .attr("x1", width/2)
                          .attr("y1", height/2)
                          .attr("x2", width/2+height/2.5)
                          .attr("y2", height/2)
                          .attr("stroke-width", 2)
                          .attr("stroke", "blue")
                          .attr('id', 'centerVector');

  var angleIndicatorOuter = d3.arc()
    .innerRadius(50)
    .outerRadius(52)
    .startAngle(0)
    .endAngle(0);

    viewport.append('path')
      .attr('d', angleIndicatorOuter)
      .attr('transform', 'translate(' + width/2 + ',' + height/2 + ')')
      .attr('id', 'anglePath')
      .style('fill', 'green');

      var angleIndicatorInner = d3.arc()
        .innerRadius(0)
        .outerRadius(50)
        .startAngle(0)
        .endAngle(0);

   viewport.append('path')
     .attr('d', angleIndicatorInner)
     .attr('transform', 'translate(' + width/2 + ',' + height/2 + ')')
     .attr('id', 'anglePath2')
     .style('fill', 'green')
     .style('opacity', 0.25);

    // text for angle
    viewport.append("text")
    .attr("x", width/2+26)
    .attr("y",  height/2-15)
    .attr("dy", ".35em")
    .attr('id', 'angleSign')
    .style("font-size", "18px")
    .text("\u03C6 = 0°");
});

function dragstarted(d) {
  d3.select(this).classed("active", true);
}

function dragged(d) {
  d.x += d3.event.dx;
  d.y += d3.event.dy;

  var x1 = width/2 - d.x;
  var y1 = height/2 - d.y;

  if(y1<0){
    var phi = 2*Math.PI + 2*Math.acos((x1)/(Math.sqrt(x1*x1+y1*y1)*(1)));
  } else{
    var phi = 2*Math.acos((x1)/(Math.sqrt(x1*x1+y1*y1)*(-1)));
  }

  updateAngle(round(phi*180/(2*Math.PI),2));
}

function dragended(d) {
  d3.select(this).classed("active", false);
}

function round(number, precision) {
    var pair = (number + 'e').split('e')
    var value = Math.round(pair[0] + 'e' + (+pair[1] + precision))
    pair = (value + 'e').split('e')
    return +(pair[0] + 'e' + (+pair[1] - precision))
}

function updateAngle(deg){
  d3.select('#sinus').style('opacity', 1);
  d3.select('#cosinus').style('opacity', 1);

  if(deg>360){
    alert('Value is too big. Only one rotation is allowed. Sorry!');
  } else{

  var phi = deg*2*Math.PI/180;
  //update trigFkts
  d3.select('#sinus').attr('x1', width/2+Math.cos(phi/2)*height/2.5)
                     .attr('x2', width/2+Math.cos(phi/2)*height/2.5)
                     .attr('y2', height/2-Math.sin(phi/2)*height/2.5);

  d3.select('#cosinus').attr('y1', height/2-Math.sin(phi/2)*height/2.5)
  .attr('x2', width/2+Math.cos(phi/2)*height/2.5)
  .attr('y2', height/2-Math.sin(phi/2)*height/2.5);

if(round(deg,2) == 0 || round(deg,2) == 180){
    d3.select('#cotangent').style('opacity', 0);
    d3.select('#cotangentH').style('opacity', 0);
  }
else {
  d3.select('#cotangent').attr('x2', width/2+1/(Math.tan(phi/2))*height/2.5)
  .attr("y1", height/2-height/2.5)
  .attr("y2", height/2-height/2.5)
  .style('opacity', 1);

  d3.select('#cotangentH').attr('x1', width/2+Math.cos(phi/2)*height/2.5)
  .attr('x2', width/2+1/(Math.tan(phi/2))*height/2.5)
  .attr("y1", height/2-Math.sin(phi/2)*height/2.5)
  .attr("y2", height/2-height/2.5)
  .style('opacity', 1);
}

if (round(deg,2) == 90 || round(deg,2) == 270) {
  d3.select('#tangent').style('opacity', 0);
  d3.select('#tangentH').style('opacity', 0);
} else {
  d3.select('#tangent').attr('x1', width/2+height/2.5)
  .attr('x2', width/2+height/2.5)
  .attr("y1", height/2)
  .attr("y2", height/2-Math.tan(phi/2)*height/2.5)
  .style('opacity', 1);

  d3.select('#tangentH').attr('x1', width/2+Math.cos(phi/2)*height/2.5)
  .attr('x2', width/2+height/2.5)
  .attr("y1", height/2-Math.sin(phi/2)*height/2.5)
  .attr("y2", height/2-Math.tan(phi/2)*height/2.5)
  .style('opacity', 1);
}

  d3.select('#angleSign').text("\u03C6 \u2248 " + round(phi*180/(2*Math.PI),2) + "°")

  var angleIndicatorOuter = d3.arc()
    .innerRadius(50)
    .outerRadius(52)
    .startAngle(Math.PI/2)
    .endAngle(-phi/2+Math.PI/2);

  d3.select('#anglePath').attr('d', angleIndicatorOuter);

  var angleIndicatorInner = d3.arc()
    .innerRadius(0)
    .outerRadius(50)
    .startAngle(Math.PI/2)
    .endAngle(-phi/2+Math.PI/2);

  d3.select('#anglePath2').attr('d', angleIndicatorInner);

  d3.select('#centerVector').attr('x2', width/2+Math.cos(phi/2)*height/2.5)
                            .attr('y2', height/2-Math.sin(phi/2)*height/2.5);

  d3.select('#dragPoint').attr('cx', width/2+Math.cos(phi/2)*height/2.5)
                 .attr('cy', height/2-Math.sin(phi/2)*height/2.5)
                 .datum({
                   x: width/2+Math.cos(phi/2)*height/2.5,
                   y: height/2-Math.sin(phi/2)*height/2.5
                 });


  //update Readings
  $('#Nsin').html((Math.sin(phi/2)).toFixed(14));
  $('#Ncos').html((Math.cos(phi/2)).toFixed(14));
  if(deg==90 || deg == 270){
    $('#Ntan').html('NaN');
  } else {
    $('#Ntan').html((Math.tan(phi/2)).toFixed(14));
  }
  if(deg==180 || deg == 0 || deg == 360){
    $('#Ncotan').html('NaN');
  } else {
    $('#Ncotan').html((1/(Math.tan(phi/2))).toFixed(14));
  }
  }
}

function animation(){
  animatedAngle += animationSpeed;
  if(animatedAngle<360){
    updateAngle(animatedAngle);
  } else{
    animatedAngle = 0;
    updateAngle(animatedAngle);
  }
}

function animationSpeedControl(direction){
  var speeds = [0.01,0.05,0.1,0.5,1,5,10];
  if(arrayID + direction > -1 && arrayID + direction < 7){
  arrayID = arrayID + direction;
  console.log(speeds[arrayID]);
  animationSpeed = speeds[arrayID]
} else{
  console.log("Maximum (or minimum) speed is exceeded.");
}
}
