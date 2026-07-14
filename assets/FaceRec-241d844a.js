import{c as ce,aj as fe,ak as ge,al as st,am as it,an as Ye,ao as at,ap as ot,aq as ct,ar as lt,as as ze,at as dt,j as r,L as ut,u as Ve,r as n,h as p,au as mt,Y as se,av as Be,aw as $e,ax as ft,ay as gt,i as he,s as I,a9 as ht,aa as pt,ab as xt,ac as wt,ad as Oe}from"./index-dc47488f.js";import{L as bt}from"./loader-2-36a0efa2.js";import{D as yt}from"./DashboardAnalogClock-93675ea1.js";const vt=ce("Camera",[["path",{d:"M14.5 4h-5L7 7H4a2 2 0 0 0-2 2v9a2 2 0 0 0 2 2h16a2 2 0 0 0 2-2V9a2 2 0 0 0-2-2h-3l-2.5-3z",key:"1tc9qg"}],["circle",{cx:"12",cy:"13",r:"3",key:"1vg3eu"}]]),St=ce("MapPin",[["path",{d:"M20 10c0 6-8 12-8 12s-8-6-8-12a8 8 0 0 1 16 0Z",key:"2oe9fu"}],["circle",{cx:"12",cy:"10",r:"3",key:"ilqhr7"}]]),kt=ce("RotateCcw",[["path",{d:"M3 12a9 9 0 1 0 9-9 9.75 9.75 0 0 0-6.74 2.74L3 8",key:"1357e3"}],["path",{d:"M3 3v5h5",key:"1xhq8a"}]]),jt=ce("Video",[["path",{d:"m22 8-6 4 6 4V8Z",key:"50v9me"}],["rect",{width:"14",height:"12",x:"2",y:"6",rx:"2",ry:"2",key:"1rqjg6"}]]);function Ct(s,o){var l=Array.isArray(o)?o:[o];l.forEach(function(a){var c=a instanceof fe?a.score:ge(a)?a.detection.score:void 0,d=a instanceof fe?a.box:ge(a)?a.detection.box:new st(a),u=c?""+it(c):void 0;new Ye(d,{label:u}).draw(s)})}function Nt(s,o,l){l===void 0&&(l=!1);var a=l?at(o):o,c=a.width,d=a.height;return s.width=c,s.height=d,{width:c,height:d}}function Ke(s,o){var l=new ot(o.width,o.height),a=l.width,c=l.height;if(a<=0||c<=0)throw new Error("resizeResults - invalid dimensions: "+JSON.stringify({width:a,height:c}));if(Array.isArray(s))return s.map(function(j){return Ke(j,{width:a,height:c})});if(ct(s)){var d=s.detection.forSize(a,c),u=s.unshiftedLandmarks.forSize(d.box.width,d.box.height);return lt(ze(s,d),u)}return ge(s)?ze(s,s.detection.forSize(a,c)):s instanceof dt||s instanceof fe?s.forSize(a,c):s}const Et=()=>r.jsx("div",{className:"flex flex-col items-center justify-center h-screen w-full",children:r.jsxs("div",{className:"bg-card border border-border rounded-md p-8 shadow-md flex flex-col items-center",children:[r.jsx("p",{className:"text-2xl font-bold text-primary mb-2",children:"Face Registration Required"}),r.jsx("p",{className:"text-foreground text-center",children:"Please register your face from your profile to use this page."}),r.jsx(ut,{to:"/regional/user/profile",className:" animate-bounce cursor-pointer text-primary text-xs",children:" View Profile →  Register your Face for Digital Biometric"}),r.jsx("p",{className:" text-xs text-yellow-500 mt-5",children:"*Note: Images won't be saved to the database — your privacy is safe 😊!"})]})}),ie="location_permission_granted",ae="camera_permission_granted",_e="permissions_explained";function Pt(s,o,l,a){const d=(l-s)*Math.PI/180,u=(a-o)*Math.PI/180,j=Math.sin(d/2)*Math.sin(d/2)+Math.cos(s*Math.PI/180)*Math.cos(l*Math.PI/180)*Math.sin(u/2)*Math.sin(u/2);return 6371*(2*Math.atan2(Math.sqrt(j),Math.sqrt(1-j)))}function Rt(s){return s.happy>.5}const pe=()=>typeof navigator<"u"&&/android|iphone|ipad|ipod|iemobile|mobile/i.test(navigator.userAgent),Ue=()=>typeof navigator<"u"&&/chrome|crios/i.test(navigator.userAgent)&&!/edg|opr|brave|firefox/i.test(navigator.userAgent),Lt=s=>s+(Ue()?.01:0),We=()=>{try{const s=navigator.deviceMemory??4,o=navigator.hardwareConcurrency??4;return pe()&&(s<=2||o<=4)||s<=2||o<=2?"low":s<=4||o<=4?"mid":"high"}catch{return"mid"}};function It(s,o,l,a=.08){let c=1/0,d=!1,u="";const j=Lt(a);return l.forEach(v=>{const[N,S]=v.split(",").map(x=>parseFloat(x.trim())),f=Pt(s,o,N,S);f<=j&&(d=!0),f<c&&(c=f,u=v)}),{isNearby:d,distance:c,nearestLocation:u}}function Ft(){const s=new Date,o=s.getFullYear(),l=String(s.getMonth()+1).padStart(2,"0"),a=String(s.getDate()).padStart(2,"0"),c=String(s.getHours()).padStart(2,"0"),d=String(s.getMinutes()).padStart(2,"0"),u=String(s.getSeconds()).padStart(2,"0");return`${o}-${l}-${a}T${c}:${d}:${u}Z`}function Mt(s,o){let l;return(...a)=>{clearTimeout(l),l=setTimeout(()=>s(...a),o)}}function Dt(s,o){let l;return(...a)=>{l||(s(...a),l=!0,setTimeout(()=>l=!1,o))}}const y={hasStoredPermission:s=>I.getItem(s)==="true",setPermissionStatus:(s,o)=>{I.setItem(s,o.toString())},hasShownExplanation:()=>I.getItem(_e)==="true",setExplanationShown:()=>{I.setItem(_e,"true")},checkBrowserPermission:async s=>{try{return"permissions"in navigator?(await navigator.permissions.query({name:s})).state:null}catch(o){return console.warn(`Permission check failed for ${s}:`,o),null}}},oe="/regional/models",qe=(s,o)=>{const l=We();let a={ideal:640,max:1280},c={ideal:480,max:720},d={ideal:15,max:30};l==="low"?(a={ideal:480,max:640},c={ideal:360,max:480},d={ideal:12,max:24}):l==="mid"?(a={ideal:640,max:960},c={ideal:480,max:540},d={ideal:15,max:30}):(a={ideal:640,max:1280},c={ideal:480,max:720},d={ideal:24,max:30});const u={width:a,height:c,frameRate:d,aspectRatio:1.333};return o?u.deviceId={exact:o}:u.facingMode=s,{video:u}};function Tt({userObject:s}){const o=Ve(),[l,a]=n.useState(!1),[c,d]=n.useState(!1),[u,j]=n.useState([]),[v,N]=n.useState([]),[S,f]=n.useState(null),[x,F]=n.useState(null),[K,M]=n.useState(null),[xe,Ge]=n.useState("pending"),[h,U]=n.useState("Checking permissions..."),[we,E]=n.useState("Loading..."),[A,He]=n.useState("user"),[be,Ze]=n.useState(!1),[W,le]=n.useState(!1),[ye,Je]=n.useState([]),[D,de]=n.useState(""),[G,H]=n.useState(!1),[ve,Xe]=n.useState(!1),Z=n.useRef(null),C=n.useRef(!1),J=n.useRef(null),ue=n.useRef(!1),b=n.useRef(null),P=n.useRef(null),T=n.useRef(),X=n.useRef(null),_=n.useRef(),q=n.useRef(),Se=n.useRef(),R=n.useRef(0),ke=n.useRef(0),Q=n.useRef(null),je=n.useRef("pending"),Ce=n.useRef(""),Ne=xe==="passed"&&C.current&&x==="ok"&&Z.current===!0,Ee=n.useCallback(()=>{if(!W&&!(Date.now()<R.current)){try{if(p.isVisible&&p.isVisible())return}catch{}le(!0),p.fire({title:"Biometric Actions",html:`
      <div style="display: grid; grid-template-columns: repeat(2, 1fr); gap: 1rem; justify-content: center; margin-top: 1rem; max-width: 400px; margin-left: auto; margin-right: auto;">
        <button 
          id="time-in-btn" 
          style="
            background: linear-gradient(135deg, #2196F3, #1976D2);
            color: white;
            padding: 1rem;
            border: none;
            border-radius: 0.75rem;
            cursor: pointer;
            font-weight: 600;
            transition: all 0.3s;
            font-size: 14px;
            box-shadow: 0 2px 4px rgba(0,0,0,0.1);
          "
          onmouseover="this.style.transform='translateY(-2px)'; this.style.boxShadow='0 4px 8px rgba(0,0,0,0.2)'"
          onmouseout="this.style.transform='translateY(0)'; this.style.boxShadow='0 2px 4px rgba(0,0,0,0.1)'"
        >
         🏢 Time In
        </button>
          <button 
          id="time-out-btn" 
          style="
            background: linear-gradient(135deg, #2196F3, #1976D2);
            color: white;
            padding: 1rem;
            border: none;
            border-radius: 0.75rem;
            cursor: pointer;
            font-weight: 600;
            transition: all 0.3s;
            font-size: 14px;
            box-shadow: 0 2px 4px rgba(0,0,0,0.1);
          "
          onmouseover="this.style.transform='translateY(-2px)'; this.style.boxShadow='0 4px 8px rgba(0,0,0,0.2)'"
          onmouseout="this.style.transform='translateY(0)'; this.style.boxShadow='0 2px 4px rgba(0,0,0,0.1)'"
        >
          🌙 Time Out
        </button>
        <button 
          id="break-in-btn" 
          style="
            background: linear-gradient(135deg, #2196F3, #1976D2);
            color: white;
            padding: 1rem;
            border: none;
            border-radius: 0.75rem;
            cursor: pointer;
            font-weight: 600;
            transition: all 0.3s;
            font-size: 14px;
            box-shadow: 0 2px 4px rgba(0,0,0,0.1);
          "
          onmouseover="this.style.transform='translateY(-2px)'; this.style.boxShadow='0 4px 8px rgba(0,0,0,0.2)'"
          onmouseout="this.style.transform='translateY(0)'; this.style.boxShadow='0 2px 4px rgba(0,0,0,0.1)'"
        >
          ☕ Break In
        </button>
        <button 
          id="break-out-btn" 
          style="
            background: linear-gradient(135deg, #2196F3, #1976D2);
            color: white;
            padding: 1rem;
            border: none;
            border-radius: 0.75rem;
            cursor: pointer;
            font-weight: 600;
            transition: all 0.3s;
            font-size: 14px;
            box-shadow: 0 2px 4px rgba(0,0,0,0.1);
          "
          onmouseover="this.style.transform='translateY(-2px)'; this.style.boxShadow='0 4px 8px rgba(0,0,0,0.2)'"
          onmouseout="this.style.transform='translateY(0)'; this.style.boxShadow='0 2px 4px rgba(0,0,0,0.1)'"
        >
          🍽️ Break Out
        </button>
      
      </div>
    `,showConfirmButton:!1,showCancelButton:!1,allowOutsideClick:!1,allowEscapeKey:!1,position:"center",toast:!1,timer:6e3,timerProgressBar:!0,width:"420px",background:"#fff",customClass:{popup:"floating-menu-popup",timerProgressBar:"floating-menu-timer"},didOpen:()=>{var e,t,i,m;(e=document.getElementById("time-in-btn"))==null||e.addEventListener("click",()=>{R.current=Date.now()+3e3,re("I"),p.close()}),(t=document.getElementById("break-in-btn"))==null||t.addEventListener("click",()=>{R.current=Date.now()+3e3,re("i"),p.close()}),(i=document.getElementById("break-out-btn"))==null||i.addEventListener("click",()=>{R.current=Date.now()+3e3,re("0"),p.close()}),(m=document.getElementById("time-out-btn"))==null||m.addEventListener("click",()=>{R.current=Date.now()+3e3,re("o"),p.close()})},willClose:()=>{R.current=Math.max(R.current,Date.now()+3e3),le(!1)}}),q.current=setTimeout(()=>{p.close(),le(!1)},4e3)}},[W]);n.useEffect(()=>(Ne&&!W&&Date.now()>=R.current&&(!p.isVisible||!p.isVisible())&&Ee(),()=>{q.current&&clearTimeout(q.current)}),[Ne,W,Ee]);const Pe=n.useCallback(()=>{y.hasShownExplanation()?Re():p.fire({title:"Permission Setup Required",html:`
            <div style="text-align: left; margin: 20px 0;">
              <p><strong>This app requires two permissions to function:</strong></p>
              <ul style="margin: 10px 0; padding-left: 20px;">
                <li><strong>Camera Access:</strong> For facial recognition and biometric verification</li>
                <li><strong>Location Access:</strong> To verify you're within the office premises</li>
              </ul>
              <p style="margin-top: 15px; font-size: 14px; color: #666;">
                <em>Note: These permissions are required for security and will be requested once. 
                You can manage them in your browser settings later.</em>
              </p>
            </div>
          `,icon:"info",confirmButtonText:"Grant Permissions",confirmButtonColor:"#3085d6",allowOutsideClick:!1,allowEscapeKey:!1}).then(()=>{y.setExplanationShown(),Re()})},[]),Re=n.useCallback(async()=>{E("Checking permissions...");const e=y.hasStoredPermission(ae),t=y.hasStoredPermission(ie),i=await y.checkBrowserPermission("camera"),m=await y.checkBrowserPermission("geolocation");e&&i==="granted"?F("ok"):i==="denied"?(F("permission_denied"),y.setPermissionStatus(ae,!1)):await ee(),t&&m==="granted"?(f("ok"),C.current=!0):m==="denied"?(f("permission_denied"),C.current=!1,y.setPermissionStatus(ie,!1)):await V(),Ze(!0)},[]),z=n.useCallback(async()=>{var e;try{if(!((e=navigator.mediaDevices)!=null&&e.enumerateDevices))return;const t=await navigator.mediaDevices.enumerateDevices();Je(t.filter(i=>i.kind==="videoinput"))}catch(t){console.warn("Failed to enumerate cameras:",t)}},[]),ee=n.useCallback(async()=>{F("checking");try{const e=qe(A,D||void 0),t=await navigator.mediaDevices.getUserMedia(e);F("ok"),y.setPermissionStatus(ae,!0),t.getTracks().forEach(i=>i.stop()),z()}catch(e){e.name==="NotAllowedError"||e.name==="PermissionDeniedError"?(F("permission_denied"),y.setPermissionStatus(ae,!1),Qe()):(F("error"),console.error("Camera access error:",e))}},[A,D,z]),Y=n.useCallback(()=>{const e=window.location.origin,t=navigator.userAgent.toLowerCase(),i=t.includes("edg"),m=t.includes("firefox"),g=/android|iphone|ipad|ipod/i.test(t),k=(t.includes("chrome")||t.includes("crios"))&&!i&&!t.includes("opr");let w=null;if(!g&&(k||i)?w=`${i?"edge":"chrome"}://settings/content/siteDetails?site=${encodeURIComponent(e)}`:!g&&m&&(w="about:preferences#privacy"),w)try{window.open(w,"_blank")}catch{}const L=g?`<ol style="text-align:left; padding-left: 20px;">
            <li>Tap the lock icon in the address bar</li>
            <li>Permissions ➜ Location</li>
            <li>Choose "Allow while using"</li>
          </ol>`:`<p>In Site Settings, set Location to <strong>Allow</strong> for ${e}, then return here.</p>`;p.fire({icon:"info",title:"Enable location for this site",html:L,confirmButtonText:"Reload Page",allowOutsideClick:!1,allowEscapeKey:!1}).then(()=>window.location.reload())},[]),V=n.useCallback(async()=>(f("checking"),navigator.geolocation?new Promise(e=>{navigator.geolocation.getCurrentPosition(t=>{f("ok"),C.current=!0,y.setPermissionStatus(ie,!0),e("granted")},t=>{t.code===t.PERMISSION_DENIED?(f("permission_denied"),C.current=!1,y.setPermissionStatus(ie,!1),e("denied")):(f("error"),C.current=!1,console.error("Location access error:",t),e("error"))},{enableHighAccuracy:!1,timeout:1e4,maximumAge:0})}):(f("error"),M("❌ Geolocation not supported"),C.current=!1,"error")),[]),Qe=n.useCallback(()=>{p.fire({title:"Camera Permission Required",html:`
          <div style="text-align: left; margin: 20px 0;">
            <p>Camera access is required for facial recognition. To enable:</p>
            <ol style="margin: 10px 0; padding-left: 20px;">
              <li>Click the camera icon in your browser's address bar</li>
              <li>Select "Allow" for camera access</li>
              <li>Refresh the page</li>
            </ol>
            <p style="margin-top: 15px; font-size: 14px; color: #666;">
              <em>Or go to browser Settings > Privacy & Security > Site Settings > Camera</em>
            </p>
          </div>
        `,icon:"warning",confirmButtonText:"Try Again",showCancelButton:!0,cancelButtonText:"Skip",confirmButtonColor:"#3085d6"}).then(e=>{e.isConfirmed&&ee()})},[ee]),Le=n.useCallback(()=>{p.fire({title:"Location Permission Required",html:`
          <div style="text-align: left; margin: 20px 0;">
            <p>Location access is required to verify office proximity. To enable:</p>
            <ol style="margin: 10px 0; padding-left: 20px;">
              <li>Click the location icon in your browser's address bar</li>
              <li>Select "Allow" for location access</li>
              <li>Refresh the page</li>
            </ol>
            <p style="margin-top: 15px; font-size: 14px; color: #666;">
              <em>Or use the button below to open your browser's site settings.</em>
            </p>
          </div>
        `,icon:"warning",confirmButtonText:"Grant Location Access",showCancelButton:!1,confirmButtonColor:"#3085d6"}).then(e=>{e.isConfirmed?y.checkBrowserPermission("geolocation").then(t=>{t==="denied"?Y():V().then(i=>{i==="granted"?window.location.reload():i==="denied"?Y():p.fire({icon:"warning",title:"Location Unavailable",text:"Please turn on GPS/Location Services on your device and try again.",confirmButtonText:"OK",confirmButtonColor:"#3085d6"})})}).catch(()=>V().then(t=>{t==="granted"?window.location.reload():t==="denied"&&Y()})):e.isDenied&&Y()})},[V,Y]),te=n.useCallback(Dt(e=>{if(J.current=e,!C.current){M("❌ Location permission required"),f("permission_denied");return}const t=()=>{if(!navigator.geolocation){M("❌ Geolocation not supported"),f("error");return}navigator.geolocation.getCurrentPosition(i=>{const{latitude:m,longitude:g}=i.coords,{isNearby:k,distance:w}=It(m,g,e);Z.current=k;const L=k?`✅ Within office range! (${w.toFixed(2)} km)`:`❌ Outside office range (${w.toFixed(2)} km from nearest office)`;M(L),f("ok")},i=>{if(console.error("Location error:",i),Z.current!==null){const m=Z.current?"✅ Within office range! (checking...)":"❌ Outside office range (checking...)";M(g=>!g||g.includes("Location permission required")||g.includes("Location access failed")?m:g)}else M("❌ Location access failed"),f("error")},{enableHighAccuracy:pe()||Ue(),timeout:pe()?2e4:1e4,maximumAge:0})};_.current&&clearInterval(_.current),t(),_.current=setInterval(t,45e3)},15e3),[]),Ie=n.useCallback(async()=>{if(!c)try{E("Loading models...");try{const e=mt;e!=null&&e.setBackend&&(await e.setBackend("webgl"),e!=null&&e.ready&&await e.ready())}catch{}await Promise.all([se.tinyFaceDetector.loadFromUri(oe),se.faceLandmark68TinyNet.loadFromUri(oe),se.faceRecognitionNet.loadFromUri(oe),se.faceExpressionNet.loadFromUri(oe)]);try{const e=document.createElement("canvas");e.width=128,e.height=128;const t=e.getContext("2d");t==null||t.fillRect(0,0,1,1),await Be(e,new $e({inputSize:160,scoreThreshold:.9})).withFaceLandmarks(!0).withFaceDescriptors().withFaceExpressions()}catch{}d(!0)}catch{E("Error loading models")}},[c]),Fe=n.useCallback(async()=>{try{const e=await Promise.all(u.map(t=>{const i=t.descriptors.map(m=>new Float32Array(m));return new ft(t.label,i)}));X.current=new gt(e,.6),Xe(!0)}catch(e){console.error("Face matcher initialization error:",e)}},[u]),Me=n.useCallback(async()=>{var e;if(x!=="ok"){U("Camera permission required");return}H(!0);try{(e=b.current)!=null&&e.srcObject&&(b.current.srcObject.getTracks().forEach(g=>g.stop()),b.current.srcObject=null),Q.current=null;const t=qe(A,D||void 0),i=await navigator.mediaDevices.getUserMedia(t);b.current&&(b.current.srcObject=i,b.current.onloadedmetadata=()=>{U("Please smile to verify liveliness"),H(!1)})}catch(t){if(console.error("Error starting video:",t),D&&((t==null?void 0:t.name)==="OverconstrainedError"||(t==null?void 0:t.name)==="NotFoundError")){U("Selected camera unavailable — reverting to default"),de(""),H(!1);return}E("Error accessing camera"),F("error"),H(!1)}},[A,x,D]),De=n.useCallback(()=>{if(!X.current||!b.current||!P.current||x!=="ok")return;T.current&&clearInterval(T.current);const e=We(),t=e==="low"?224:e==="mid"?320:416,i=e==="low"?700:e==="mid"?500:350,m={width:500,height:600},g=async()=>{var k;try{if(!b.current||!P.current||!X.current)return;const w=await Be(b.current,new $e({inputSize:t,scoreThreshold:.6})).withFaceLandmarks(!0).withFaceDescriptors().withFaceExpressions(),L=P.current;Nt(L,m);const B=Ke(w,m);Q.current||(Q.current=L.getContext("2d",{willReadFrequently:!0})),(k=Q.current)==null||k.clearRect(0,0,m.width,m.height);const ne=($,O)=>{$!==je.current&&(je.current=$,Ge($)),O!==Ce.current&&(Ce.current=O,U(O))};if(B.length>0){const $=B.map(me=>X.current.findBestMatch(me.descriptor));Ct(L,B),$.forEach((me,rt)=>{const nt=B[rt].detection.box;new Ye(nt,{label:me.toString()}).draw(L)});const O=$[0],Ae=O&&O.label!=="unknown",tt=Rt(B[0].expressions);Ae&&tt&&(ke.current=Date.now()+4e3),Date.now()<ke.current?ne("passed","Nice Smile!😉"):Ae?ne("pending","Please smile."):ne("pending","Face not recognized."),E("Running")}else ne("pending","No face detected"),E("Running")}catch(w){console.error("Face detection error:",w)}};T.current=setInterval(g,i)},[x]),Te=n.useCallback(async()=>{var e;try{const i=(await he.get("users/userDetails",{headers:{Authorization:`Token ${I.getItem("accessToken")}`}})).data;if(I.setItem("user",JSON.stringify(i)),!(i!=null&&i.description))throw new Error("No face description data in API response");j([{label:i.full_name,descriptors:i.description}]),N([{id:i.full_name,name:i.full_name,position:i.job_title}]),a(!0),((e=i.location)==null?void 0:e.length)>0?(J.current=i.location,te(i.location)):(M("❌ No office locations configured"),f("error"))}catch(t){E(t.message||"Error loading face data"),f("error")}},[te]),et={I:{message:"clocked in",emoji:"🌅"},i:{message:"started break",emoji:"☕"},0:{message:"ended break",emoji:"🍽️"},o:{message:"clocked out",emoji:"🌙"}},re=n.useCallback(Mt(e=>{const{message:t,emoji:i}=et[e],m=Ft();he.post("checkinoutregion/create/",{CHECKTIME:m,CHECKTYPE:e,VERIFYCODE:s.deptid,SENSORID:0},{headers:{Authorization:`Token ${I.getItem("accessToken")}`}}).then(()=>{const g={I:"Have a great day at work! 💼",i:"Enjoy your break! ☕",0:"Welcome back! 🔋",o:"See you tomorrow! 🌙"};p.fire({title:`${i} Success! ${i}`,html:`
              <div style="text-align: center; margin: 20px 0;">
                <p style="font-size: 18px; margin-bottom: 15px;">
                  You have successfully ${t}! 
                </p>
                <p style="font-size: 16px; color: #10b981; margin-bottom: 10px;">
                  😊 Nice smile, by the way! 😊
                </p>
                <p style="font-size: 14px; color: #666; font-style: italic;">
                  ${g[e]}
                </p>
              </div>
            `,icon:"success",confirmButtonColor:"#3085d6",timer:3e3,showConfirmButton:!1,customClass:{popup:"success-popup",title:"success-title"}}),setTimeout(()=>{o("/regional/user/home"),window.location.reload()},3e3)}).catch(g=>{var k,w;p.fire({icon:"error",title:"❌ Oops! Something went wrong",html:`
              <div style="text-align: center; margin: 20px 0;">
                <p style="font-size: 16px; margin-bottom: 10px;">
                  ${((w=(k=g.response)==null?void 0:k.data)==null?void 0:w.detail)||"An error occurred while processing your request."}
                </p>
                <p style="font-size: 14px; color: #666; font-style: italic;">
                  😔 Don't worry, please try again!
                </p>
              </div>
            `,confirmButtonColor:"#d33",confirmButtonText:"Try Again 🔄"})})},1e3),[s,o]);return n.useEffect(()=>(Te(),Pe(),()=>{var e;if((e=b.current)!=null&&e.srcObject&&(b.current.srcObject.getTracks().forEach(i=>i.stop()),b.current.srcObject=null),T.current&&clearInterval(T.current),_.current&&clearInterval(_.current),q.current&&clearTimeout(q.current),Se.current&&cancelAnimationFrame(Se.current),P.current){const t=P.current.getContext("2d",{willReadFrequently:!0});t&&t.clearRect(0,0,P.current.width,P.current.height)}E("Stopped")}),[Te,Pe]),n.useEffect(()=>{c||Ie()},[c,Ie]),n.useEffect(()=>{var t;if(x!=="ok")return;z();const e=navigator.mediaDevices;return(t=e==null?void 0:e.addEventListener)==null||t.call(e,"devicechange",z),()=>{var i;return(i=e==null?void 0:e.removeEventListener)==null?void 0:i.call(e,"devicechange",z)}},[x,z]),n.useEffect(()=>{c&&l&&u.length>0&&Fe()},[c,l,u.length,Fe]),n.useEffect(()=>(ve&&be&&x==="ok"&&(async()=>(await Me(),De()))(),()=>{T.current&&clearInterval(T.current)}),[ve,be,x,A,D,Me,De]),n.useEffect(()=>{(S==="permission_denied"||K&&K.includes("Location permission required"))&&!ue.current&&(ue.current=!0,Le()),S==="ok"&&(ue.current=!1)},[S,K,Le]),n.useEffect(()=>{let e=null;return(async()=>{try{const i=await navigator.permissions.query({name:"geolocation"});e=i;const m=()=>{i.state==="granted"?(f("ok"),C.current=!0,J.current&&te(J.current)):i.state==="denied"&&(f("permission_denied"),C.current=!1)};i.onchange=m}catch{}})(),()=>{e&&(e.onchange=null)}},[te]),r.jsxs("div",{className:"flex-1 h-full overflow-auto bg-background",children:[r.jsx("style",{children:`
          @keyframes pulse-ring {
            0% {
              transform: scale(1);
              opacity: 1;
            }
            100% {
              transform: scale(1.4);
              opacity: 0;
            }
          }
          @keyframes pulse-ring-alt {
            0% {
              transform: scale(1);
              opacity: 0.8;
            }
            100% {
              transform: scale(1.5);
              opacity: 0;
            }
          }
          .pulse-ring {
            animation: pulse-ring 2s ease-out infinite;
          }
          .pulse-ring-alt {
            animation: pulse-ring-alt 2.5s ease-out infinite;
            animation-delay: 0.3s;
          }
          .pulse-ring-slow {
            animation: pulse-ring 3s ease-out infinite;
            animation-delay: 0.6s;
          }
        `}),r.jsxs("div",{className:"flex-1 flex flex-col items-center justify-center min-h-screen p-6",children:[r.jsxs("div",{className:"text-center mb-12",children:[r.jsx("h1",{className:"text-4xl sm:text-3xl font-bold text-primary mb-2",children:"🔐 Digital Biometric"}),r.jsxs("p",{className:"text-secondary-foreground text-lg",children:["Welcome back, ",r.jsx("span",{className:"font-semibold text-primary",children:s.full_name})]}),r.jsx("p",{className:"text-sm text-secondary-foreground mt-2",children:K})]}),r.jsx("div",{className:"flex w-full justify-center px-4 animate-in fade-in zoom-in-95 duration-500",children:r.jsx("div",{className:"flex flex-col items-center gap-6",children:r.jsxs("div",{className:"relative flex items-center justify-center",children:[r.jsxs("div",{className:"absolute w-[350px] h-[350px] sm:w-[240px] sm:h-[240px] pointer-events-none rounded-full ",children:[r.jsx("div",{className:`absolute z-[999] inset-0 rounded-full pulse-ring ${h==="Nice Smile!😉"?"ring-2 ring-blue-400":h==="Please smile."?"ring-2 ring-green-500":h==="Face not recognized."?"ring-2 ring-red-500":h==="No face detected"?"ring-2 ring-red-500/80":"ring-2 ring-gray-400/30"}`}),r.jsx("div",{className:`absolute inset-0 rounded-full pulse-ring-alt ${h==="Nice Smile!😉"?"ring-2 ring-blue-400":h==="Please smile."?"ring-2 ring-green-300/70":h==="Face not recognized."?"ring-2 ring-yellow-400/70":h==="No face detected"?"ring-2 ring-red-400/30":"ring-2 ring-gray-300/20"}`}),r.jsx("div",{className:`absolute inset-0 rounded-full pulse-ring-slow ${h==="Nice Smile!😉"?"ring-2 ring-blue-300":h==="Please smile."?"ring-2 ring-green-300/40":h==="Face not recognized."?"ring-2 ring-yellow-300/40":h==="No face detected"?"ring-2 ring-red-400/20":"ring-2 ring-gray-300/10"}`})]}),r.jsxs("div",{className:`flex items-center justify-center w-[400px] h-[400px] sm:w-80 sm:h-80 rounded-full overflow-hidden transition-all duration-300 ${h==="Nice Smile!😉"?"ring-4 ring-blue-500 ring-offset-2 shadow-lg shadow-blue-500/50":h==="Please smile."?"ring-4 ring-green-400 ring-offset-2 shadow-lg shadow-green-500/50":h==="Face not recognized."?"ring-4 ring-yellow-500 ring-offset-2 shadow-lg shadow-yellow-500/50":h==="No face detected"?"ring-4 ring-red-400 ring-offset-2 shadow-lg shadow-red-500/40":"ring-4 ring-gray-400 ring-offset-2"} bg-gradient-to-br from-slate-900 to-slate-800`,children:[r.jsx("video",{crossOrigin:"anonymous",ref:b,className:`w-full h-full object-cover transition-opacity duration-300 ease-out ${G?"opacity-0":"opacity-100"}`,autoPlay:!0,muted:!0,playsInline:!0}),r.jsx("canvas",{ref:P,className:"w-full h-full absolute inset-0"}),G&&r.jsx("div",{className:"absolute inset-0 z-10 flex items-center justify-center bg-slate-900/70 backdrop-blur-sm transition-opacity duration-200",children:r.jsxs("div",{className:"flex flex-col items-center gap-2",children:[r.jsx(bt,{className:"w-8 h-8 text-white animate-spin"}),r.jsx("span",{className:"text-xs text-white/80 font-medium",children:"Switching camera…"})]})})]}),r.jsx("div",{className:"absolute flex justify-center translate-y-[190px] sm:translate-y-[140px] w-full ",children:r.jsx("span",{className:`px-4 py-2 backdrop-blur-sm rounded-full text-sm sm:text-xs font-medium transition-all ${xe==="passed"?"bg-blue-500/60 text-green-50 border ":"bg-green-500/60  text-yellow-50 border "}`,children:h})})]})})}),r.jsxs("div",{className:"relative grid grid-cols-3 justify-center w-full mt-20 px-4 gap-4",children:[r.jsxs("div",{className:"flex flex-col gap-2 justify-start max-w-60",children:[r.jsx("p",{className:"text-xs font-semibold text-secondary-foreground uppercase tracking-wide",children:"Status"}),r.jsxs("span",{className:`inline-flex items-center gap-2 px-3 py-1 rounded-full text-sm font-medium ${we==="Running"?"bg-green-600 text-green-50 border border-green-500":"bg-red-600 text-red-50 border border-red-500"}`,children:[r.jsx("span",{className:"w-2 h-2 rounded-full bg-current animate-pulse"}),we]})]}),r.jsxs("div",{className:"flex flex-col items-center gap-2",children:[r.jsx("button",{onClick:()=>{de(""),He(e=>e==="user"?"environment":"user")},disabled:G,className:"group relative p-3 rounded-full bg-primary hover:bg-primary/90 text-white border border-primary transition-all duration-300 hover:shadow-lg hover:shadow-primary/50 disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:shadow-none",title:"Flip front/back camera",children:r.jsx(kt,{className:`w-5 h-5 text-white transition-transform duration-500 ${A==="user"?"rotate-180":"rotate-0"}`})}),ye.length>1&&r.jsxs(ht,{value:D||"auto",onValueChange:e=>de(e==="auto"?"":e),disabled:G,children:[r.jsxs(pt,{className:"h-8 w-40 text-xs gap-1 px-2",children:[r.jsx(jt,{className:"w-3.5 h-3.5 shrink-0 text-muted-foreground"}),r.jsx(xt,{placeholder:"Camera"})]}),r.jsxs(wt,{children:[r.jsx(Oe,{value:"auto",children:"Auto (Front/Back)"}),ye.map((e,t)=>r.jsx(Oe,{value:e.deviceId,children:e.label||`Camera ${t+1}`},e.deviceId))]})]})]}),r.jsxs("div",{className:"flex flex-col gap-2 justify-end text-right",children:[r.jsx("p",{className:"text-xs font-semibold text-secondary-foreground uppercase tracking-wide",children:"Permissions"}),r.jsxs("div",{className:"flex gap-3 justify-end",children:[r.jsxs("button",{onClick:()=>{x!=="ok"&&ee()},className:"flex items-center gap-1 px-2 py-1 rounded transition-all hover:bg-white/10 cursor-pointer group",title:x==="ok"?"Camera enabled":"Click to enable camera",children:[r.jsx(vt,{className:`w-4 h-4 transition-all ${x==="ok"?"text-green-500":"text-red-500 group-hover:scale-110"}`}),r.jsx("span",{className:`w-2 h-2 rounded-full transition-all ${x==="ok"?"bg-green-500":"bg-red-500 group-hover:scale-125"}`})]}),r.jsxs("button",{onClick:()=>{S!=="ok"&&V()},className:"flex items-center gap-1 px-2 py-1 rounded transition-all hover:bg-white/10 cursor-pointer group",title:S==="ok"?"Location enabled":"Click to enable location",children:[r.jsx(St,{className:`w-4 h-4 transition-all ${S==="ok"?"text-green-500":"text-red-500 group-hover:scale-110"}`}),r.jsx("span",{className:`w-2 h-2 rounded-full transition-all ${S==="ok"?"bg-green-500":"bg-red-500 group-hover:scale-125"}`})]})]})]})]})]})]})}function Ot(){const[s,o]=n.useState(null),[l,a]=n.useState(!0),[c,d]=n.useState(60),u=Ve();n.useEffect(()=>{he.get("users/userDetails",{headers:{Authorization:`Token ${I.getItem("accessToken")}`}}).then(v=>{o(v.data)}).finally(()=>a(!1))},[]),n.useEffect(()=>{const v=setInterval(()=>{d(N=>(N<=1&&(u("/regional/user/temp"),window.location.reload()),N-1))},1e3);return()=>clearInterval(v)},[u]);const j=v=>{const N=Math.floor(v/60),S=v%60;return`${N.toString().padStart(2,"0")}:${S.toString().padStart(2,"0")}`};return l?r.jsx("div",{className:"flex h-full w-full justify-center items-center",children:"Loading..."}):!s||!s.description||s.description.length===0?r.jsx("div",{className:"flex-1 h-full flex items-center justify-center",children:r.jsx(Et,{})}):r.jsxs("div",{className:"flex-1 h-full overflow-auto",children:[r.jsxs("div",{className:"fixed bottom-20 right-2 bg-gray-100 px-3 py-1 rounded-md font-mono text-sm z-50",children:[r.jsx("span",{className:" md:hidden",children:"Session Timer:"}),"   ",j(c)]}),r.jsx(yt,{}),r.jsx(n.Suspense,{fallback:r.jsx("div",{children:"Loading..."}),children:r.jsx(Tt,{userObject:s})})]})}export{Ot as default};
