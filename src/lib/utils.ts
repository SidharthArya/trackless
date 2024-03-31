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

export const progressiveOverload = (d) => {
    if(d.Weights && d.Reps) {
      let w = 0;
      let r = 0;
      if(d.Reps > 12) {
        w = 0.12
        r = -0.12
      }
      else {
        w = 0
        r = 0.12
      }
      d.Weights = d.Weights + w*d.Weights;
      d.Reps = d.Reps + r*d.Reps;
    }
    else if(d.Weights && d.Time) {
      let w = 0;
      let t = 0;
      if(d.Reps > 12) {
        w = 0.12
        t = -0.12
      }
      else {
        w = 0
        t = 0.12
      }
      d.Weights = d.Weights + w*d.Weights;
      d.Time = d.Time + t*d.Time;
    }
    else if (d.Time) {
      let t = 0.12;
      d.Time = d.Time + t*d.Time;

    }
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