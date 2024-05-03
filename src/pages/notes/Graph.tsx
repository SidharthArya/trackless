import { useContext, useEffect, useReducer, useRef, useState } from 'preact/hooks';
import BaseLayout from '../../layouts/GraphLayout';
import { getDocumentAsync, getDocumentsAsync } from '../../lib/database';
import { UserContext } from '../../components/Login';
import {ForceGraph2D} from 'react-force-graph';
import {NodeObject} from 'force-graph';
import NoteEditor from '../../components/NoteEditor';
import { initialVisuals } from '../../components/Graph/config';
import { initialPhysics } from '../../components/Graph/config';
import { useWindowSize, useWindowWidth } from '@react-hook/window-size'

import { FloatButton, Layout, Radio, Input } from 'antd';
import { PlusOutlined } from '@ant-design/icons';
import { MutableRefObject } from 'preact/compat';
import { useSignal, effect } from "@preact/signals";
import * as d3 from "d3";
import TagFilter from '../../components/TagFilter';

const { Header, Content, Footer , Sider} = Layout;

const visuals = initialVisuals;
const physics = initialPhysics;

const Graph = (props) => {
    const {user} = useContext(UserContext);
    const [data, setData] = useState({nodes: [], links: []});
    const [filteredData, setFilteredData] = useState({nodes: [], links: []});
    const [notes, setNotes] = useState([]);
    const [editorId, setEditorId] = useState(props.id ? props.id : '');
    const [mounted, setMounted] = useState(false);
    const [tick, incrementTick] = useReducer(v => v + 1, 0);
    const [nodelinks, setNodeLinks] = useState([]);
    const tags = useSignal({});
    const [windowWidth, windowHeight] = useWindowSize()
    const [noteContent, setNoteContent] = useState()
    const [hasInitialisedForces, setHasInitialisedForces] = useState(false);
    const [stateFilter, setStateFilter] = useState(props.state ? props.state : '');
    const tagsFilter = useSignal(props.tag ? props.tag : '');

    const graphRef = useRef();
    useEffect(() => {
      const physics = initialPhysics;

        const fg = graphRef.current;
        if (!fg  || hasInitialisedForces) return;
        const canvas = document.getElementsByTagName('canvas')[0];
        fg.d3Force('x', d3.forceX().strength(physics.gravity))
        fg.d3Force('y', d3.forceY().strength(physics.gravity))
        fg.d3Force('center', d3.forceCenter().strength(physics.centeringStrength))
        fg.d3Force('charge').strength(physics.charge)
        // if (!(fg && Object.keys(fg).includes('d3Force'))) return;

        fg.d3Force(
          'collide',
          physics.collision ? d3.forceCollide().radius(physics.collisionStrength) : null,
        )
        setHasInitialisedForces(true)
    }, [notes.length, nodelinks.length])
 
    useEffect(()=>{
        getDocumentsAsync(user, 'data', 'notes', [setNotes], false, -1, [],null, [["state", "!=", "ARCHIVE"]]);
    }, [notes.length])
    useEffect(()=>{
        getDocumentAsync(user, 'data', 'noteLinks/notelinks', [(d)=> {setNodeLinks(Object.values(d))}]);
    }, [nodelinks.length, notes])



    useEffect(()=> {
        let nodes = [];
        let links = nodelinks;
        notes.map(note => {
            let d = {};
            d.id = note.id.toString();
            d.title = note.title.text;
            d.group = note.tags;
            nodes.push(d);
        })

        setData({nodes, links});
    }, [notes.length, nodelinks])




  useEffect(()=>{
    let nodes = data.nodes.filter((d)=> {
      if (!tagsFilter.value) return true;
      // console.log(d.group, tagsFilter);
      if (!d.group) return false;
      // return true;
      return d.group.includes(tagsFilter.value);
      // for (let i = 0; i < d.tags.length; i++)
      //   for (let j = 0; j < tagsFilter.length; j++)
      //     if (d.tags[i] === tagsFilter[j])
      //       return true;
      // return false;
    });

    let links = data.links.filter((l) => nodes.map(n=>n.id).includes(typeof l.source === 'object' ? l.source.id : l.source) && nodes.map(n=>n.id).includes(typeof l.target === 'object' ? l.target.id : l.target));
    setFilteredData({nodes, links});
  }, [data, tagsFilter.value])

    const graphCommonProps: ComponentPropsWithoutRef<typeof TForceGraph2D> = {
      nodeRelSize: 10,
      nodeCanvasObjectMode: () => 'after',
      linkColor: (link) => {
        return '#000'
      },
      linkDirectionalParticleWidth: visuals.particlesWidth,
      d3AlphaDecay: physics.alphaDecay,
      d3AlphaMin: physics.alphaMin,
      d3VelocityDecay: physics.velocityDecay,
      
      nodeCanvasObject: (node, ctx, globalScale) => {

        const label = node.title;
        const fontSize = 12/globalScale;
        ctx.font = `${fontSize}px Sans-Serif`;
        const textWidth = ctx.measureText(label).width;
        const bckgDimensions = [textWidth, fontSize].map(n => n + fontSize * 0.2); // some padding

        ctx.fillStyle = 'rgba(255, 255, 255, 0.6)';

        ctx.textAlign = 'center';
        ctx.textBaseline = 'middle';
        ctx.fillStyle = node.color;
        ctx.fillText(label, node.x, node.y + 20);

        node.__bckgDimensions = bckgDimensions; // to re-use in nodePointerAreaPaint
      },
    }
    const makeFilters = () => {
      return (<>
      <div>
            <h4> Tags </h4>
<TagFilter tags={tags} filter={tagsFilter} user={user}/>
      <br></br>
      </div>
      <br></br>
      </>
      )
    }
    
    return (
        <BaseLayout {...props} now={editorId} filters={makeFilters} setEditorId={setEditorId}>
            {filteredData.nodes && filteredData.nodes.length > 0 && (
                <div style={{position: 'absolute', left: 0, top: 0, zIndex: 0}}>
                      <ForceGraph2D 
                      ref={graphRef}
                      width={windowWidth}
                      height={windowHeight}
    graphData={filteredData}
    {...graphCommonProps}
    nodeAutoColorBy={d=>d.group}
    d3ReheatSimulation={1}
    d3Force = {('center', d3.forceCenter().strength(0.2))}
    nodeLabel={d=> d.title}
    nodeRelSize={10}
    onNodeClick={(e)=> {setEditorId(e.id)}}
    nodeCanvasObjectMode = {() => 'after'}
    linkDirectionalArrowLength={10}
    linkDirectionalArrowRelPos={1}

    onEngine={incrementTick}

    />
    <FloatButton style={{zIndex: 20, left: 20}} icon={<PlusOutlined />} type="primary" onClick={(e)=> setEditorId('new')}/>


                </div>
            )}

        </BaseLayout>
    )


}

export default Graph;