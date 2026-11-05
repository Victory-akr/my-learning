(function(root){
  'use strict';
  function splitDocument(doc){
    let heading=doc.name, body=[], start=1; const chunks=[];
    function flush(){const text=body.join('\n').trim(); if(text)chunks.push({name:doc.name,heading,text,line:start,url:doc.url||''});body=[];}
    doc.text.split(/\r?\n/).forEach((line,i)=>{if(/^#{1,6}\s+/.test(line)){flush(); heading=line.replace(/^#{1,6}\s+/,'');start=i+1;}else {body.push(line);}});flush();return chunks;
  }
  function tokens(query){
    const cleaned=query.toLowerCase().replace(/怎么|如何|什么|哪里|哪些|请问|一下|可以|需要|这个|那个|的|了|吗|呢/g,' ');
    const out=cleaned.match(/[a-z0-9_+.-]+/g)||[];
    for(const word of cleaned.match(/[\u4e00-\u9fff]+/g)||[]){if(word.length===1)continue; for(let i=0;i<word.length-1;i++)out.push(word.slice(i,i+2));}
    return [...new Set(out)];
  }
  function search(docs,query){
    const terms=tokens(query);if(!terms.length)return [];
    return docs.flatMap(splitDocument).map(x=>{const body=x.text.toLowerCase(),head=x.heading.toLowerCase(); const matched=terms.filter(t=>body.includes(t)||head.includes(t));return {...x,score:matched.reduce((s,t)=>s+(head.includes(t)?3:1),0),matched};})
      .filter(x=>x.matched.length>0).sort((a,b)=>b.score-a.score).slice(0,3);
  }
  const api={splitDocument,search}; if(typeof module!=='undefined'&&module.exports)module.exports=api;else root.DocFinder=api;
})(typeof globalThis==='undefined'?this:globalThis);
