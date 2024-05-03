import { IconLink } from '@codexteam/icons';
// import * as MathJax from 'mathjax/es5/tex-mml-chtml.js';

// MathJax.MathHub.Config({
//     tex2jax: {
//       inlineMath: [["$","$"],["\\(","\\)"]]
//     }
//   });
// console.log('MathJax', MathJax);

class NodeLink {
    constructor(props){
        this.notes = props.config.nodes ? props.config.nodes : []; 
        this._data = props.data;
        console.log(props);
        this.wrapper = document.createElement('div');

        this.container = document.createElement('div');
    }
    static get toolbox() {
        return {
          title: 'Formula',
          icon: IconLink,
        };
      }
    getInputElement() {
        let cont = document.createElement('div');
      let out = document.createElement('p');

      let elem = document.createElement('input');
      let button = document.createElement('button');
      button.innerHTML = '+';
      button.addEventListener('click', (e)=>{
        this._data.text = elem.value;
        out.innerHTML = '`'+elem.value + '`';
        MathJax.typeset()
        cont.removeChild(elem)
        cont.removeChild(button)
    })
        out.addEventListener('dblclick', (e)=> {
            cont.appendChild(elem)
            cont.appendChild(button)
        })
        cont.appendChild(out)
    
      cont.appendChild(elem)
      cont.appendChild(button)
    this.container.appendChild(cont)
    }
    getOutputElement() {
      let link = document.createElement('a');
      let url = new URL(window.location.href);
      url.searchParams.set('id', this._data.id);
      // link.onclick = (e) => {
        
      //   window.history.pushState({}, '', url);
      // }
      
      link.innerHTML = this.data.name;
      link.setAttribute('href', "/notes/note?id=" + this._data.id.toString());
      link.setAttribute('target', '_blank');
      
      this.container.appendChild(link)
    }
    render() {
          this.getInputElement()
        return this.container
    }
    save(e) {
      console.log('Data', this.data)
      return this._data;
    }
    get data() {
      return this._data; 
    }
    set data(data) {
      console.log('Data', data);
      this._data = data;
    }
}

export default NodeLink;