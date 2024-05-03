class ReviseTune {
    constructor({ api, data, config }) {
      this.data = data;
        this.api = api;
        this.config = config;
        this.parser = new DOMParser();
      console.log('What data', data);
    }
    static isTune = true;
    render() {
        let index = this.api.blocks.getCurrentBlockIndex();
        let block = this.api.blocks.getBlockByIndex(index);
        block.save().then((d)=> {
            this.blockdata =  d;
        return d;
    });
        return this.data;
    }
    save() {
        console.log('finaldata', this.blockdata)
        // parsedHtml = parser.parseFromString(htmlContent, 'text/html'); 
        return {something: 'cool'}
    }
}
export default ReviseTune;