
    let url = "https://raw.githubusercontent.com/freeCodeCamp/ProjectReferenceData/master/GDP-data.json"; //url to JSON with data
    let data; //JSON response
    let request = new XMLHttpRequest(); //Async request for data
    let values = [];

    let hScale;
    let xScale;
    let xAxScale;
    let yAxScale;

    let width = 800;
    let height = 600;
    let padding = 40;

    let svg = d3.select("svg");

    request.open('GET', url, true);
    request.onload = () => {
        data = JSON.parse(request.responseText);
        values = data.data;
        drawCanvas();
        generateScales();
        drawBars();
        generateAxes();

    }
    request.send();

let drawCanvas = () => {
    svg.attr('width', width);
    svg.attr('height', height);
}

let generateScales = () => {
    hScale = d3.scaleLinear().domain([0, d3.max(values,(item)=>{
        return item[1]
    } )])
    .range([0, height - (2 * padding)]);
    
    xScale = d3.scaleLinear()
    .domain([0, values.length - 1 ])
    .range([padding, width - padding]);

    let dates = values.map((item) => {
        return new Date(item[0]);
    });

    xAxScale = d3.scaleTime()
    .domain([d3.min(dates), d3.max(dates)])
    .range([padding, width - padding]);

    yAxScale = d3.scaleLinear()
    .domain([0, d3.max(values, (item) => {
        return item[1];
    })])
    .range([height-padding, padding])
    ;
}



let drawBars = () => {
    let tooltip = d3.select('body')
    .append('div')
    .attr('id', 'tooltip')
    .style('visibility', 'hidden')
    .style('height', 'auto')
    .style('width','auto');


    svg.selectAll('rect')
    .data(values)
    .enter()
    .append('rect')
    .attr('class', 'bar')
    .attr('width', (width - (2 * padding))/values.length)
    .attr('data-date', (item) =>{
        return item[0];
    })
    .attr('data-gdp', (item) => {
        return item[1];
    })
    .attr('height', (item)=>{
        return hScale(item[1]);
    })
    .attr('x', (item, index)=>{
        return xScale(index);
    })
    .attr('y', (item)=>{
        return (height-padding) - hScale(item[1]);
    })
    .on('mouseover', (item) =>{
        tooltip.transition()
        .style('visibility', 'visible');

        tooltip.text(item[0])

    })
    .on('mouseout', (item) => {
        tooltip.transition()
        .style('visibility', 'hidden');
    })
   
}

let generateAxes = () => {
    let xAxis = d3.axisBottom(xAxScale); 
    let yAxis = d3.axisLeft(yAxScale);

    svg.append('g')
    .call(xAxis)
    .attr('id', "x-axis")
    .attr('transform', 'translate(0,' + (height - padding) + ')')

    svg.append('g')
    .call(yAxis)
    .attr('id', "y-axis")
    .attr('transform', 'translate('+ padding + ', 0)')
    
    ;
}


       