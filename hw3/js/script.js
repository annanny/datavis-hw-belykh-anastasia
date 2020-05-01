const b_width = 700;
const d_width = 500;
const b_height = 1000;
const d_height = 1000;
const colors = [
    '#DB202C','#a6cee3','#1f78b4',
    '#33a02c','#fb9a99','#b2df8a',
    '#fdbf6f','#ff7f00','#cab2d6',
    '#6a3d9a','#ffff99','#b15928']

// Part 1: Создать шкалы для цвета, радиуса и позиции 
const radius = d3.scaleLinear().range([.5, 20]);
const color = d3.scaleOrdinal().range(colors);
const x = d3.scaleLinear().range([0, b_width]);

const bubble = d3.select('.bubble-chart')
    .attr('width', b_width).attr('height', b_height);
const donut = d3.select('.donut-chart')
    .attr('width', d_width).attr('height', d_height)
    .append("g")
        .attr("transform", "translate(" + d_width / 2 + "," + d_height / 2 + ")");

const donut_lable = d3.select('.donut-chart').append('text')
        .attr('class', 'donut-lable')
        .attr("text-anchor", "middle")
        .attr('transform', `translate(${(d_width/2)} ${d_height/2})`);
const tooltip = d3.select('.tooltip');

//  Part 1 - Создать симуляцию с использованием forceCenter(), forceX() и forceCollide()
const simulation = d3.forceSimulation()
        .force("center", d3.forceCenter(b_width/2, b_height/2))
        .force("x", d3.forceX().x(d => x(d['release year'])))
        .force("collision", d3.forceCollide().radius(d => radius(d['user rating score'])));
        

d3.csv('data/netflix.csv').then(data=>{
    data = d3.nest().key(d=>d.title).rollup(d=>d[0]).entries(data).map(d=>d.value).filter(d=>d['user rating score']!=='NA');
    console.log(data)
    
    const rating = data.map(d=>+d['user rating score']);
    const years = data.map(d=>+d['release year']);
    let ratings = d3.nest().key(d=>d.rating).rollup(d=>d.length).entries(data);
    
    
    // Part 1 - задать domain  для шкал цвета, радиуса и положения по x
    color.domain(ratings);
    radius.domain([d3.min(rating), d3.max(rating)]);
    x.domain([d3.min(years), d3.max(years)]);
    
    // Part 1 - создать circles на основе data
    var nodes = bubble
        .selectAll("circle").data(data)
            .enter()
                .append('circle')
                .attr("r", d => radius(d['user rating score']))
                .style("fill",d => color(d.rating))
                .on('mouseover', overBubble)
                .on('mouseout', outOfBubble);

    // Part 1 - передать данные в симуляцию и добавить обработчик события tick
    simulation
        .nodes(data)
        .on('tick',ticked);
    
    function ticked() {
        nodes
            .attr("cx", d=>d.x)
            .attr("cy", d=>d.y)    
    
    }   
    

    // Part 1 - Создать шаблон при помощи d3.pie() на основе ratings
    var pie = d3.pie().value(d => d.value);
    
    // Part 1 - Создать генератор арок при помощи d3.arc()
    
    var arc = d3.arc()
        .innerRadius(100)
        .outerRadius(230)
        .padAngle(0.02)
        .cornerRadius(5);
    
    // Part 1 - построить donut chart внутри donut
    donut.selectAll('path').data(pie(ratings))
        .enter()
            .append('path')
            .attr('d', arc)
            .attr('fill',  d => color(d.data.key))
            .on('mouseover', overArc)
            .on('mouseout', outOfArc);


        
    function overBubble(d){
        console.log(d)
        // Part 2 - задать stroke и stroke-width для выделяемого элемента   
        d3.select(this)
            .attr('stroke', "black")
            .attr('stroke-width', 1.5);
        
        // Part 3 - обновить содержимое tooltip с использованием классов title и year
        tooltip.html(d.title + '<br/>' + d['release year']);

        // Part 3 - изменить display и позицию tooltip
        tooltip
            .style('left', (d.x+7)+'px')
            .style('top', (d.y+7)+'px')
            .style('display', 'block');
    }
    function outOfBubble(){
        // Part 2 - сбросить stroke и stroke-width
        bubble.selectAll("circle").attr("stroke", "none");
            
        // Part 3 - изменить display у tooltip
        tooltip.style("display", "none")
    }

    function overArc(d){
        console.log(d)
        // Part 2 - изменить содержимое donut_lable
        donut_lable.text(d.data.key)
        
        // Part 2 - изменить opacity арки
        d3.select(this).style("opacity", 0.2);

        // Part 3 - изменить opacity, stroke и stroke-width для circles в зависимости от rating
        
        bubble.selectAll('circle')
            .filter(e => e.rating != d.data.key)
            .style('opacity', 0.5);

        bubble.selectAll('circle')
            .filter(e => e.rating == d.data.key)
            .attr('stroke', 'black')
            .style('stroke-width', 1.5);
    }
    function outOfArc(){
        // Part 2 - изменить содержимое donut_lable
        donut_lable.text("")
        // Part 2 - изменить opacity арки
        d3.selectAll('path').style("opacity", 1);

        // Part 3 - вернуть opacity, stroke и stroke-width для circles
        bubble.selectAll('circle')
            .style("opacity", 1)
            .attr("stroke", "none");

    }
});