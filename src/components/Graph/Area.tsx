import * as d3 from 'd3-shape';
import * as d3m from 'd3';
import { useEffect, useRef, useState } from 'preact/hooks';

const aapl = [
    {
        "Date": "2024-03-11T17:55:41.827Z",
        "Volume": 0,
        "Weights": null,
        "Reps": null,
        "Sets": null,
        "id": "1710179741827"
    },
    {
        "Sets": 3,
        "Reps": 10,
        "Weights": 10,
        "Date": "2024-03-11T17:59:40.615Z",
        "Volume": 104.35516278555653,
        "id": "1710179980615"
    },
    {
        "Reps": 10,
        "Sets": 3,
        "Volume": 104.35516278555653,
        "Weights": 10,
        "Date": "2024-03-14T06:09:37.165Z",
        "id": "1710396577165"
    },
    {
        "Sets": 3,
        "Date": "2024-03-14T06:13:56.513Z",
        "Volume": 104.35516278555653,
        "Reps": 10,
        "Weights": 10,
        "id": "1710396836513"
    },
    {
        "Volume": 9.486832980505138,
        "Date": "2024-03-14T06:37:33.745Z",
        "Reps": 10,
        "Weights": 0,
        "Sets": 3,
        "id": "1710398253745"
    },
    {
        "Volume": 10.392304845413264,
        "Reps": 12,
        "Sets": 3,
        "Weights": 0,
        "Date": "2024-03-18T15:12:57.842Z",
        "id": "1710774777842"
    },
    {
        "Sets": 0,
        "Date": "2024-03-31T01:01:08.621Z",
        "Volume": 0,
        "Reps": 0,
        "Weights": 0,
        "id": "1711846868621"
    },
    {
        "Volume": 0,
        "Date": "2024-03-31T01:02:55.844Z",
        "Weights": 0,
        "Reps": 0,
        "Sets": 0,
        "id": "1711846975844"
    },
    {
        "Weights": 0,
        "Volume": 0,
        "Reps": 0,
        "Sets": 0,
        "Date": "2024-03-31T01:05:33.661Z",
        "id": "1711847133661"
    },
    {
        "Volume": 0,
        "Reps": 0,
        "Weights": 0,
        "Date": "2024-03-31T01:05:42.447Z",
        "Sets": 0,
        "id": "1711847142447"
    },
    {
        "Weights": 0,
        "Sets": 0,
        "Volume": 0,
        "Date": "2024-03-31T01:06:55.834Z",
        "Reps": 0,
        "id": "1711847215834"
    },
    {
        "Sets": 3,
        "Reps": 11,
        "Weights": 0,
        "Date": "2024-03-31T03:48:17.948Z",
        "Volume": 0,
        "id": "1711856897948"
    },
    {
        "Reps": 12,
        "Weights": 0,
        "Volume": 0,
        "Sets": 3,
        "Date": "2024-03-31T10:49:27.943Z",
        "id": "1711882167943"
    },
    {
        "Weights": 0,
        "Reps": 15,
        "Sets": 3,
        "Volume": 11.618950038622252,
        "Date": "2024-04-15T14:25:16.620Z",
        "id": "1713191116620"
    }
];
const Area = (props) => {
    const width = 928;
    const height = 500;
    const marginTop = 20;
    const marginRight = 30;
    const marginBottom = 30;
    const marginLeft = 40;

    const SVG = useRef();
    useEffect(()=>{
    // Declare the x (horizontal position) scale.
    const yScale = d3m.scaleLinear().domain([0, 100]).range([200, 0]);
    var areaGenerator = d3.area()
    .y0((d) => yScale(d.Volume))

    var points = [
        [0, 80],
        [100, 100],
        [200, 30],
        [300, 50],
        [400, 40],
        [500, 80]
      ];
    points = aapl.map((d)=> [parseFloat(d.id), d.Volume])
    console.log(points)
    const svg = d3m.create("svg")
        .attr("width", width)
        .attr("height", height)
        .attr("viewBox", [0, 0, width, height])
        .attr("style", "max-width: 100%; height: auto;background: #999");
  
    var pathData = areaGenerator(points)  
    console.log(pathData);
    svg.append("path").attr("d", pathData);

    SVG.current.replaceWith(svg.node());
    }, [])

    return <div><svg ref={SVG}></svg></div>;
}

export default Area;