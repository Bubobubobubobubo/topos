var o=Object.defineProperty;var u=(e,s,i)=>s in e?o(e,s,{enumerable:!0,configurable:!0,writable:!0,value:i}):e[s]=i;var a=(e,s,i)=>(u(e,typeof s!="symbol"?s+"":s,i),i);(function(){"use strict";class e extends AudioWorkletProcessor{constructor(t){super(t);a(this,"handleMessage",t=>{t.data&&t.data.type==="ping"?this.port.postMessage(t.data):t.data==="start"?this.started=!0:t.data==="pause"?this.started=!1:t.data==="stop"?this.started=!1:t.data.type==="bpm"?(this.bpm=t.data.value,this.currentPulsePosition=0):t.data.type==="ppqn"?(this.ppqn=t.data.value,this.currentPulsePosition=0):t.data.type==="nudge"&&(this.nudge=t.data.value)});this.port.addEventListener("message",this.handleMessage),this.port.start(),this.nudge=0,this.started=!1,this.bpm=120,this.ppqn=48,this.currentPulsePosition=0}process(t,p,d){if(this.started){const n=(currentTime+this.nudge/1e3)/(60/this.bpm),r=Math.ceil(n*this.ppqn);r>this.currentPulsePosition&&(this.currentPulsePosition=r,this.port.postMessage({type:"bang"}))}return!0}}registerProcessor("transport",e)})();