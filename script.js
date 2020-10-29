let url = 'https://raw.githubusercontent.com/freeCodeCamp/ProjectReferenceData/master/cyclist-data.json';
let req = new XMLHttpRequest();

let values = [];

//Creating x axis to place our bars horizontally
let xScale;

//Creating y axis to place our scattorplots vertically on canvas
let yScale;

let width = 800;
let height = 600;
let padding = 40;

let svg = d3.select('svg')
let tooltip = d3.select('#tooltip')

let drawCanvas = () => {
    svg.attr('height', height);
    svg.attr('width', width);
}

let generateScales = () => {
    xScale = d3.scaleLinear()
               .domain([d3.min(values,(d)=>d['Year']),d3.max(values,(d)=>d['Year'])])
               .range([padding,width-padding])
    yScale = d3.scaleTime()
               .domain([d3.min(values,(d)=> {return new Date(d['Seconds']*1000)}),
                      d3.max(values,(d)=> {return new Date(d['Seconds']*1000)})])
               .range([padding,height-padding])
}

let drawPoints = () => {
    svg.selectAll('circle')
       .data(values)
       .enter()
       .append('circle')
       .attr('class','dot')
       .attr('r','5')
       .attr('data-xvalue', (d)=>d['Year'])
       .attr('data-yvalue',(d)=> {return new Date(d['Seconds']*1000)})
       .attr('cx',(d)=>xScale(d['Year']))
       .attr('cy',(d)=>yScale(new Date(d['Seconds']*1000)))
       .attr('fill',(d)=> {
              if(d['Doping'] != "") {
                return "orange";
              } else {
                return "green";
              }
            })
        .on('mouseover',(d)=>{
            tooltip.transition()
                    .style('visibility','visible')
            if(d['Doping'] != "") {
              tooltip.text(d['Year'] + ' - ' + d['Name'] + ' - ' + d['Time'] + ' - ' + d['Doping']);
            } else {
              tooltip.text(d['Year'] + ' - ' + d['Name'] + ' - ' + d['Time']);
            }
            tooltip.attr('data-year',d['Year'])
        })
        .on('mouseout',(d)=>{
          tooltip.transition()
                  .style('visibility','hidden')
        })
}

let generateAxis = () => {
    let xAxis = d3.axisBottom(xScale).tickFormat(d3.format('d'))
    let yAxis = d3.axisLeft(yScale).tickFormat(d3.timeFormat('%M:%S'))
    svg.append('g')
       .call(xAxis)
       .attr('id','x-axis')
       .attr('transform','translate(0,' + (height-padding) + ')')
    svg.append('g')
       .call(yAxis)
       .attr('id','y-axis')
       .attr('transform','translate(' + padding + ', 0)')

}
req.open('GET', url, true);
req.onload = () => {
  values=JSON.parse(req.responseText);
  console.log(values);
  drawCanvas();
  generateScales();
  drawPoints();
  generateAxis();
}
req.send();
