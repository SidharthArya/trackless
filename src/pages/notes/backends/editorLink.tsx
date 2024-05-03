import { useEffect, useState } from "preact/hooks";
// import ogs from 'open-graph-scraper';

const options = { url: 'http://ogp.me/' };

const EditorLink = (props) => {
    const [link, setLink] = useState(props.link ? props.link : '');
    // useEffect(()=> {
    //     if (typeof window && window != undefined){
    //     ogs(options).then((data) => {
    //         const { error, html, result, response } = data;
    //         console.log('error:', error);  // This returns true or false. True if there was an error. The error itself is inside the result object.
    //         console.log('html:', html); // This contains the HTML of page
    //         console.log('result:', result); // This contains all of the Open Graph results
    //         console.log('response:', response); // This contains response from the Fetch API
    //       })}
    // }, [])

    return JSON.stringify({
        "success" : 1,
        "meta": {
            "title" : "CodeX Team",
            "description" : "Club of web-development, design and marketing. We build team learning how to build full-valued projects on the world market.",
            "image" : {
                "url" : "https://codex.so/public/app/img/meta_img.png"
            }
        }
    });
}
export default EditorLink;