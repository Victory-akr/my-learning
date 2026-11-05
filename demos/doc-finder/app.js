'use strict';
let documents=structuredClone(window.DEMO_DOCUMENTS);
const $=id=>document.getElementById(id);
function node(tag,content,cls){const el=document.createElement(tag);el.textContent=content;if(cls)el.className=cls;return el;}
function inventory(){ $('documents').replaceChildren(...documents.map(d=>node('p',d.name))); }
function run(){const q=$('query').value.trim();$('results').replaceChildren();if(!q){$('status').textContent='请先输入问题。';return;}
  const results=DocFinder.search(documents,q);$('status').textContent=results.length?`找到 ${results.length} 段相关原文，请核对是否回答了你的问题。`:'当前资料中未找到依据。';
  if(!results.length){$('results').append(node('p','试试更具体的关键词，或导入包含答案的资料。当前不会补写资料之外的答案。','empty'));return;}
  for(const item of results){const article=document.createElement('article');article.append(node('h2',item.heading));const source=node('div',`${item.name} · 第 ${item.line} 行起`,'source');if(item.url){const a=node('a','查看原文件');a.href=item.url;a.target='_blank';a.rel='noopener';source.append(document.createTextNode(' · '),a);}article.append(source,node('pre',item.text));$('results').append(article);}
}
$('query-form').addEventListener('submit',e=>{e.preventDefault();run();});
document.querySelectorAll('[data-query]').forEach(b=>b.addEventListener('click',()=>{$('query').value=b.dataset.query;run();}));
$('files').addEventListener('change',async e=>{const files=[...e.target.files];try{if(files.some(f=>f.size>1024*1024))throw Error('单份文件请控制在1MB以内。');const loaded=await Promise.all(files.map(async f=>({name:f.name,text:await f.text(),url:''})));if(loaded.some(d=>!d.text.trim()))throw Error('有文件为空，请检查后重新导入。');documents.push(...loaded);inventory();$('status').textContent=`已导入 ${loaded.length} 份本地资料，可以开始查询。`;}catch(err){$('status').textContent=err.message;}e.target.value='';});
$('reset').addEventListener('click',()=>{documents=structuredClone(window.DEMO_DOCUMENTS);inventory();$('results').replaceChildren();$('query').value='';$('status').textContent='已恢复内置资料。';});inventory();
$('query').value='C语言练习怎么编译？';run();
