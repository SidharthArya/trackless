import { IconLink } from '@codexteam/icons';

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
          title: 'Ref',
          icon: IconLink,
        };
      }
    getInputElement() {
      let elem = document.createElement('select');
      let option = document.createElement('option');
      option.setAttribute('value', {});
      elem.appendChild(option);
      elem.addEventListener('change', (event)=>{
        let value = JSON.parse(event.target[event.target.selectedIndex].value);
        this._data.id = value.id;
        this._data.name = value.title.text;
        this.container.removeChild(elem);
        this.getOutputElement()
      })
      this.notes.map((node)=> {
      let option = document.createElement('option');
      option.setAttribute('value', JSON.stringify(node));
      option.innerHTML = node.title.text;
      elem.appendChild(option);
    });
    this.container.appendChild(elem)
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
        // console.log(this.data && Object.keys(this.data).length < 1)
        if (!Object.keys(this._data).length || !this._data){
          this.getInputElement()
      } else {
        this.getOutputElement()
      }
        // elem.appendChild(document.createElement('select'))
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