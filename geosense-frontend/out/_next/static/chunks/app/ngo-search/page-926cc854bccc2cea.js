(self.webpackChunk_N_E=self.webpackChunk_N_E||[]).push([[205],{397:function(e,s,t){Promise.resolve().then(t.bind(t,8464))},8464:function(e,s,t){"use strict";t.r(s),t.d(s,{default:function(){return o}});var a=t(7437),l=t(7637),n=t(2265);function o(){let[e,s]=(0,n.useState)(),[t,o]=(0,n.useState)(),[i,r]=(0,n.useState)(),[c,d]=(0,n.useState)(),[p,m]=(0,n.useState)(),[h,x]=(0,n.useState)(),[u,g]=(0,n.useState)(),f=(0,l.Z)();(0,n.useEffect)(()=>{let e=async()=>o(await f.ngos.getSectors());(async()=>s(await f.ngos.getStates()))(),e()},[]),(0,n.useEffect)(()=>{m(void 0),i&&(async()=>m(await f.ngos.getDistricts(i)))()},[i]);let b=e=>{d(s=>{let t=null==s?void 0:s.filter(s=>s!==e);return(null==t?void 0:t.length)===0?void 0:t})},j=async()=>{g(await f.ngos.search(i,h,c))};return(0,a.jsxs)("div",{className:"p-4 flex flex-col space-y-2 select-none",children:[(0,a.jsx)("p",{className:"text-2xl font-bold",children:"NGO Search"}),(0,a.jsx)("hr",{}),(0,a.jsxs)("div",{className:"flex flex-col items-stretch mt-2",children:[(0,a.jsxs)("label",{className:"flex flex-col items-stretch px-2 py-1",children:[(0,a.jsx)("p",{className:"font-semibold",children:"State"}),(0,a.jsxs)("select",{className:"appearance-none px-3 py-1 capitalize rounded-lg border-2 border-slate-300 focus:outline-teal-600 disabled:border-transparent disabled:bg-slate-200 transition",value:i,onChange:e=>{r(e.target.value)},disabled:void 0==e,children:[(0,a.jsx)("option",{children:e?void 0:"Loading..."}),null==e?void 0:e.map(e=>(0,a.jsx)("option",{value:e[0],children:e[1].toLowerCase()},e[0]))]})]}),i?(0,a.jsxs)("label",{className:"flex flex-col items-stretch px-2 py-1",children:[(0,a.jsx)("p",{className:"font-semibold",children:"District"}),(0,a.jsxs)("select",{className:"appearance-none px-3 py-1 capitalize rounded-lg border-2 border-slate-300 focus:outline-teal-600 disabled:border-transparent disabled:bg-slate-200 transition",value:h,onChange:e=>{x(e.target.value)},disabled:void 0==p,children:[(0,a.jsx)("option",{children:p?void 0:"Loading..."}),null==p?void 0:p.map(e=>(0,a.jsx)("option",{value:e[0],children:e[1]},e[0]))]})]}):"",(0,a.jsxs)("label",{className:"flex flex-col items-stretch px-2 py-1",children:[(0,a.jsx)("p",{className:"font-semibold",children:"Sectors"}),(0,a.jsxs)("select",{disabled:void 0==t,onChange:e=>{let s=e.target.value;0!==s.length&&d(t=>{let a=t;return t?-1===t.indexOf(s)&&(a=[...t,s]):a=[s],e.target&&(e.target.selectedIndex=0),a})},className:"appearance-none px-3 py-1 capitalize rounded-lg border-2 border-slate-300 focus:outline-teal-600 disabled:border-transparent disabled:bg-slate-200 transition",children:[(0,a.jsx)("option",{children:t?void 0:"Loading..."}),null==t?void 0:t.map(e=>(0,a.jsx)("option",{value:e[1],children:e[1]},e[1]))]})]}),c&&c.length>0?(0,a.jsx)("ul",{className:"flex flex-wrap gap-2 p-2",children:c.map((e,s)=>(0,a.jsxs)("li",{className:"text-xs bg-teal-100 rounded-md font-semibold px-3 py-px flex items-center space-x-2",children:[(0,a.jsx)("p",{children:e}),(0,a.jsx)("button",{onClick:()=>b(e),children:(0,a.jsx)("span",{className:"material-symbols-rounded text-base msr-bold",children:"close"})})]},s))}):void 0,(0,a.jsxs)("div",{className:"grid grid-cols-2 gap-2 p-2",children:[(0,a.jsxs)("button",{className:"flex items-center justify-center font-bold p-2 space-x-2 bg-teal-700 text-white rounded-lg",onClick:j,children:[(0,a.jsx)("p",{children:"Search"}),(0,a.jsx)("span",{className:"material-symbols-rounded msr-bold",children:"search"})]}),(0,a.jsxs)("button",{className:"flex items-center justify-center font-bold p-2 space-x-2 bg-slate-200 rounded-lg",children:[(0,a.jsx)("p",{children:"Clear"}),(0,a.jsx)("span",{className:"material-symbols-rounded msr-bold",children:"clear"})]})]})]}),(0,a.jsx)("hr",{}),u?(0,a.jsxs)("div",{children:[(0,a.jsx)("p",{className:"text-xl font-semibold",children:"Results"}),(0,a.jsx)("div",{className:"flex flex-col gap-2 mt-2",children:u.map(e=>(0,a.jsxs)("div",{role:"radiogroup",className:"overflow-hidden rounded-md border-2 border-teal-800 bg-teal-800 text-white",children:[(0,a.jsx)("input",{type:"radio",name:"results-item",id:"result-item-radio-".concat(e.ngo_name_title),className:"hidden peer"}),(0,a.jsx)("label",{htmlFor:"result-item-radio-".concat(e.ngo_name_title),children:(0,a.jsx)("p",{className:"font-semibold w-full px-4 py-2 capitalize",children:e.ngo_name_title.toLowerCase()})}),(0,a.jsxs)("div",{className:"bg-slate-50 text-slate-800 text-sm overflow-hidden h-0 p-0 peer-checked:h-fit peer-checked:p-2 transition-all",children:[(0,a.jsxs)("p",{className:"font-semibold mb-1",children:["Sectors:"," ",(0,a.jsx)("span",{className:"font-normal capitalize flex flex-wrap gap-1",children:e.key_issues.toLowerCase().split(",").map((e,s)=>(0,a.jsx)("span",{className:"px-1 bg-teal-100 rounded",children:e},s))})]}),(0,a.jsxs)("p",{className:"font-semibold",children:["NGO Type:"," ",(0,a.jsx)("span",{className:"font-normal capitalize",children:e.ngo_type.toLowerCase()})]}),(0,a.jsxs)("p",{className:"font-semibold",children:["Email:"," ",(0,a.jsx)("span",{className:"font-normal font-mono bg-slate-200 rounded px-1 select-text",children:e.email_n.replace("(at)","@").replace("[dot]",".")})]}),(0,a.jsxs)("p",{className:"font-semibold",children:["City:"," ",(0,a.jsx)("span",{className:"font-normal capitalize",children:e.ngo_city_p.toLowerCase()})]}),(0,a.jsxs)("p",{className:"font-semibold",children:["State:"," ",(0,a.jsx)("span",{className:"font-normal capitalize",children:e.ngo_state_p.toLowerCase()})]}),(0,a.jsxs)("div",{children:[(0,a.jsx)("p",{className:"font-semibold",children:"Address"}),(0,a.jsx)("p",{className:"capitalize",children:e.address.toLowerCase()})]}),(0,a.jsx)("div",{children:(0,a.jsxs)("a",{href:e.ngo_web_url,className:"flex items-center space-x-2 bg-teal-100 text-teal-800 font-semibold w-fit px-2 rounded-lg mt-1",children:[(0,a.jsx)("p",{children:"Website"}),(0,a.jsx)("span",{className:"material-symbols-rounded text-lg msr-bold",children:"open_in_new"})]})})]})]},e.ngo_name_title))})]}):void 0]})}},7637:function(e,s,t){"use strict";function a(){let e="http://192.168.248.44:5000/",s=async function(s){let t=arguments.length>1&&void 0!==arguments[1]?arguments[1]:{},a=await fetch(e+s,t);if(!a.ok)throw Error("HTTP error! Status: ".concat(a.status));return a.json()};return{ngos:{getStates:async()=>await s("ngos/states"),getDistricts:async e=>await s("ngos/states/".concat(e,"/districts")),getSectors:async()=>await s("ngos/sectors"),search:async(e,t,a)=>{let l=new URLSearchParams({state:e,district:t,sectors:a?a.join(","):void 0});return await s("ngos/search?".concat(l.toString()))}},gmaps:{getNearByPlaces:async(e,t)=>{let a=new URLSearchParams({location:e.join(","),place:t}),l=await s("gmaps/nearbyplaces?".concat(a.toString()));return console.log(l),l.results},getNearByPlaceDetailsById:async e=>{let t=new URLSearchParams({place_id:e}),a=await s("gmaps/nearbyplaces/details?".concat(t.toString()));return console.log(a.result),a.result},getRoutes:async(e,t)=>{let a=new URLSearchParams({origin:e.join(","),dest:t.join(",")}),l=await s("gmaps/routes?".concat(a.toString()));return console.log(l),l.result}},medchat:{newChat:async()=>(await s("medchat/new")).sessionId,send:async(s,t)=>{let a=await fetch("".concat(e,"medchat/send"),{method:"POST",headers:{"Content-Type":"application/json"},body:JSON.stringify({sessionId:s,msg:t})});return(await a.json()).result},closeChat:async s=>{await fetch("".concat(e,"medchat/close"),{method:"POST",headers:{"Content-Type":"application/json"},body:JSON.stringify({sessionId:s})})}},s2t:{convertSpeechToText:async s=>{let t=await fetch("".concat(e,"speechttext"),{method:"POST",headers:{"Content-Type":"application/json"},body:JSON.stringify({audio:s})});return(await t.json()).text}}}}t.d(s,{Z:function(){return a}})}},function(e){e.O(0,[971,117,744],function(){return e(e.s=397)}),_N_E=e.O()}]);