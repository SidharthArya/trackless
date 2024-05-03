const preprocessExercise = (d: any) => {
    d.Date = d.Date.toDate();
    // d.Date = d.Date.toISOString();
    if (d['Weights'] < 0)
        d['Volume'] = (d['Weights']+1) * (20-Math.sqrt(d['Reps'])) * d['Sets']
    else
        d['Volume'] = (d['Weights']+1) * Math.sqrt(d['Reps']) * d['Sets']
    return d;
}

export function getDocsIdOnly(docs) {
    let d = []
    docs.forEach((doc)=> d.push(doc.id))
    return d;
}

export const sortEKeys = (a, b) => {
    const ref = {
    "Date": 1,
    "part": 2,
    "exercise": 3,
      "Weights": 4,
      "Reps": 5,
      "Sets": 6,
      "Time": 7,
      "Volume": 8
    };
    let refa, refb;
    if(ref[a])
      refa = ref[a];
    else
      refa = 1000;
    if(ref[b])
      refb = ref[b];
    else
      refb = 1000;
    if(refa < refb) return -1; else if (refa > refb) return 1; else return 0
  }

const progressingHandlers = {
  'Weights': {deps: ['Reps'], fn: (x,y) => y > 12 ? x * 1.1 : x},
  'Reps': {deps: ['Weights'], fn: (x) => x > 12 ? x*10 : x*1.1 },
}
export const progressiveOverload = (d) => {
  Object.keys(d).map((k)=>{
    if(!progressingHandlers[d]) return;
    let args = [parseFloat(row[k])];
    progressingHandlers[k].deps.map((k1)=> {args.push(parseFloat(row[k1]))});
    d[k] = progressingHandlers[k].fn.apply(null,args);
  })
    if (d.exercise == 'dumbell_shrug') console.log('ds', d)
    return d;
  };

export const makePlotConfigs =(data, yField) => {
    const config = {

        animate: { enter: { type: 'waveIn' } },
        data: data,
        autoFit: true,
        xField: 'Date',
        yField: yField,
        shapeField: 'smooth',
        style: {
          fill: 'linear-gradient(-90deg, #00660000 0%, #00666699 100%)',
        },
        axis: {
          y: { labelFormatter: '~s' , title: yField,  grid: true, gridLineWidth: 2, line: true, gridStroke: '#cccccc', gridStrokeOpacity: .3, gridLineDash: [20, 10]},
          x: {title: 'Date',line: true,  style: {labelTransform: 'rotate(10)'},  grid: true, gridLineWidth: 2, gridStroke: '#cccccc', gridStrokeOpacity: .3, gridLineDash: [20,10]}
        },

      };
      return config;
}