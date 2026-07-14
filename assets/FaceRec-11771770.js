import{c as he,aj as ue,ak as me,al as nt,am as st,an as Ye,ao as it,ap as at,aq as ot,ar as ct,as as Be,at as lt,j as n,L as dt,u as Ve,r,h as p,au as ut,Y as ne,av as ze,aw as Oe,ax as mt,ay as ft,i as fe,s as I,a9 as gt,aa as ht,ab as pt,ac as xt,ad as $e}from"./index-e09a357f.js";import{L as wt}from"./loader-2-b68ccee6.js";import{D as bt}from"./DashboardAnalogClock-eee7aeb8.js";const yt=he("Camera",[["path",{d:"M14.5 4h-5L7 7H4a2 2 0 0 0-2 2v9a2 2 0 0 0 2 2h16a2 2 0 0 0 2-2V9a2 2 0 0 0-2-2h-3l-2.5-3z",key:"1tc9qg"}],["circle",{cx:"12",cy:"13",r:"3",key:"1vg3eu"}]]),vt=he("MapPin",[["path",{d:"M20 10c0 6-8 12-8 12s-8-6-8-12a8 8 0 0 1 16 0Z",key:"2oe9fu"}],["circle",{cx:"12",cy:"10",r:"3",key:"ilqhr7"}]]),St=he("Video",[["path",{d:"m22 8-6 4 6 4V8Z",key:"50v9me"}],["rect",{width:"14",height:"12",x:"2",y:"6",rx:"2",ry:"2",key:"1rqjg6"}]]);function kt(s,o){var l=Array.isArray(o)?o:[o];l.forEach(function(a){var c=a instanceof ue?a.score:me(a)?a.detection.score:void 0,d=a instanceof ue?a.box:me(a)?a.detection.box:new nt(a),u=c?""+st(c):void 0;new Ye(d,{label:u}).draw(s)})}function jt(s,o,l){l===void 0&&(l=!1);var a=l?it(o):o,c=a.width,d=a.height;return s.width=c,s.height=d,{width:c,height:d}}function Ke(s,o){var l=new at(o.width,o.height),a=l.width,c=l.height;if(a<=0||c<=0)throw new Error("resizeResults - invalid dimensions: "+JSON.stringify({width:a,height:c}));if(Array.isArray(s))return s.map(function(j){return Ke(j,{width:a,height:c})});if(ot(s)){var d=s.detection.forSize(a,c),u=s.unshiftedLandmarks.forSize(d.box.width,d.box.height);return ct(Be(s,d),u)}return me(s)?Be(s,s.detection.forSize(a,c)):s instanceof lt||s instanceof ue?s.forSize(a,c):s}const Ct=()=>n.jsx("div",{className:"flex flex-col items-center justify-center h-screen w-full",children:n.jsxs("div",{className:"bg-card border border-border rounded-md p-8 shadow-md flex flex-col items-center",children:[n.jsx("p",{className:"text-2xl font-bold text-primary mb-2",children:"Face Registration Required"}),n.jsx("p",{className:"text-foreground text-center",children:"Please register your face from your profile to use this page."}),n.jsx(dt,{to:"/regional/user/profile",className:" animate-bounce cursor-pointer text-primary text-xs",children:" View Profile →  Register your Face for Digital Biometric"}),n.jsx("p",{className:" text-xs text-yellow-500 mt-5",children:"*Note: Images won't be saved to the database — your privacy is safe 😊!"})]})}),se="location_permission_granted",ie="camera_permission_granted",_e="permissions_explained";function Nt(s,o,l,a){const d=(l-s)*Math.PI/180,u=(a-o)*Math.PI/180,j=Math.sin(d/2)*Math.sin(d/2)+Math.cos(s*Math.PI/180)*Math.cos(l*Math.PI/180)*Math.sin(u/2)*Math.sin(u/2);return 6371*(2*Math.atan2(Math.sqrt(j),Math.sqrt(1-j)))}function Pt(s){return s.happy>.5}const ge=()=>typeof navigator<"u"&&/android|iphone|ipad|ipod|iemobile|mobile/i.test(navigator.userAgent),Ue=()=>typeof navigator<"u"&&/chrome|crios/i.test(navigator.userAgent)&&!/edg|opr|brave|firefox/i.test(navigator.userAgent),Et=s=>s+(Ue()?.01:0),We=()=>{try{const s=navigator.deviceMemory??4,o=navigator.hardwareConcurrency??4;return ge()&&(s<=2||o<=4)||s<=2||o<=2?"low":s<=4||o<=4?"mid":"high"}catch{return"mid"}};function Rt(s,o,l,a=.08){let c=1/0,d=!1,u="";const j=Et(a);return l.forEach(v=>{const[N,S]=v.split(",").map(x=>parseFloat(x.trim())),f=Nt(s,o,N,S);f<=j&&(d=!0),f<c&&(c=f,u=v)}),{isNearby:d,distance:c,nearestLocation:u}}function Lt(){const s=new Date,o=s.getFullYear(),l=String(s.getMonth()+1).padStart(2,"0"),a=String(s.getDate()).padStart(2,"0"),c=String(s.getHours()).padStart(2,"0"),d=String(s.getMinutes()).padStart(2,"0"),u=String(s.getSeconds()).padStart(2,"0");return`${o}-${l}-${a}T${c}:${d}:${u}Z`}function It(s,o){let l;return(...a)=>{clearTimeout(l),l=setTimeout(()=>s(...a),o)}}function Ft(s,o){let l;return(...a)=>{l||(s(...a),l=!0,setTimeout(()=>l=!1,o))}}const y={hasStoredPermission:s=>I.getItem(s)==="true",setPermissionStatus:(s,o)=>{I.setItem(s,o.toString())},hasShownExplanation:()=>I.getItem(_e)==="true",setExplanationShown:()=>{I.setItem(_e,"true")},checkBrowserPermission:async s=>{try{return"permissions"in navigator?(await navigator.permissions.query({name:s})).state:null}catch(o){return console.warn(`Permission check failed for ${s}:`,o),null}}},ae="/regional/models",qe=(s,o)=>{const l=We();let a={ideal:640,max:1280},c={ideal:480,max:720},d={ideal:15,max:30};l==="low"?(a={ideal:480,max:640},c={ideal:360,max:480},d={ideal:12,max:24}):l==="mid"?(a={ideal:640,max:960},c={ideal:480,max:540},d={ideal:15,max:30}):(a={ideal:640,max:1280},c={ideal:480,max:720},d={ideal:24,max:30});const u={width:a,height:c,frameRate:d,aspectRatio:1.333};return o?u.deviceId={exact:o}:u.facingMode=s,{video:u}};function Dt({userObject:s}){const o=Ve(),[l,a]=r.useState(!1),[c,d]=r.useState(!1),[u,j]=r.useState([]),[v,N]=r.useState([]),[S,f]=r.useState(null),[x,F]=r.useState(null),[K,D]=r.useState(null),[pe,Ge]=r.useState("pending"),[h,U]=r.useState("Checking permissions..."),[xe,P]=r.useState("Loading..."),[$,Mt]=r.useState("user"),[we,He]=r.useState(!1),[W,oe]=r.useState(!1),[be,Ze]=r.useState([]),[M,ye]=r.useState(""),[ce,G]=r.useState(!1),[ve,Je]=r.useState(!1),H=r.useRef(null),C=r.useRef(!1),Z=r.useRef(null),le=r.useRef(!1),b=r.useRef(null),E=r.useRef(null),T=r.useRef(),J=r.useRef(null),_=r.useRef(),q=r.useRef(),Se=r.useRef(),R=r.useRef(0),ke=r.useRef(0),X=r.useRef(null),je=r.useRef("pending"),Ce=r.useRef(""),Ne=pe==="passed"&&C.current&&x==="ok"&&H.current===!0,Pe=r.useCallback(()=>{if(!W&&!(Date.now()<R.current)){try{if(p.isVisible&&p.isVisible())return}catch{}oe(!0),p.fire({title:"Biometric Actions",html:`
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
    `,showConfirmButton:!1,showCancelButton:!1,allowOutsideClick:!1,allowEscapeKey:!1,position:"center",toast:!1,timer:6e3,timerProgressBar:!0,width:"420px",background:"#fff",customClass:{popup:"floating-menu-popup",timerProgressBar:"floating-menu-timer"},didOpen:()=>{var e,t,i,m;(e=document.getElementById("time-in-btn"))==null||e.addEventListener("click",()=>{R.current=Date.now()+3e3,te("I"),p.close()}),(t=document.getElementById("break-in-btn"))==null||t.addEventListener("click",()=>{R.current=Date.now()+3e3,te("i"),p.close()}),(i=document.getElementById("break-out-btn"))==null||i.addEventListener("click",()=>{R.current=Date.now()+3e3,te("0"),p.close()}),(m=document.getElementById("time-out-btn"))==null||m.addEventListener("click",()=>{R.current=Date.now()+3e3,te("o"),p.close()})},willClose:()=>{R.current=Math.max(R.current,Date.now()+3e3),oe(!1)}}),q.current=setTimeout(()=>{p.close(),oe(!1)},4e3)}},[W]);r.useEffect(()=>(Ne&&!W&&Date.now()>=R.current&&(!p.isVisible||!p.isVisible())&&Pe(),()=>{q.current&&clearTimeout(q.current)}),[Ne,W,Pe]);const Ee=r.useCallback(()=>{y.hasShownExplanation()?Re():p.fire({title:"Permission Setup Required",html:`
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
          `,icon:"info",confirmButtonText:"Grant Permissions",confirmButtonColor:"#3085d6",allowOutsideClick:!1,allowEscapeKey:!1}).then(()=>{y.setExplanationShown(),Re()})},[]),Re=r.useCallback(async()=>{P("Checking permissions...");const e=y.hasStoredPermission(ie),t=y.hasStoredPermission(se),i=await y.checkBrowserPermission("camera"),m=await y.checkBrowserPermission("geolocation");e&&i==="granted"?F("ok"):i==="denied"?(F("permission_denied"),y.setPermissionStatus(ie,!1)):await Q(),t&&m==="granted"?(f("ok"),C.current=!0):m==="denied"?(f("permission_denied"),C.current=!1,y.setPermissionStatus(se,!1)):await V(),He(!0)},[]),A=r.useCallback(async()=>{var e;try{if(!((e=navigator.mediaDevices)!=null&&e.enumerateDevices))return;const t=await navigator.mediaDevices.enumerateDevices();Ze(t.filter(i=>i.kind==="videoinput"))}catch(t){console.warn("Failed to enumerate cameras:",t)}},[]),Q=r.useCallback(async()=>{F("checking");try{const e=qe($,M||void 0),t=await navigator.mediaDevices.getUserMedia(e);F("ok"),y.setPermissionStatus(ie,!0),t.getTracks().forEach(i=>i.stop()),A()}catch(e){e.name==="NotAllowedError"||e.name==="PermissionDeniedError"?(F("permission_denied"),y.setPermissionStatus(ie,!1),Xe()):(F("error"),console.error("Camera access error:",e))}},[$,M,A]),Y=r.useCallback(()=>{const e=window.location.origin,t=navigator.userAgent.toLowerCase(),i=t.includes("edg"),m=t.includes("firefox"),g=/android|iphone|ipad|ipod/i.test(t),k=(t.includes("chrome")||t.includes("crios"))&&!i&&!t.includes("opr");let w=null;if(!g&&(k||i)?w=`${i?"edge":"chrome"}://settings/content/siteDetails?site=${encodeURIComponent(e)}`:!g&&m&&(w="about:preferences#privacy"),w)try{window.open(w,"_blank")}catch{}const L=g?`<ol style="text-align:left; padding-left: 20px;">
            <li>Tap the lock icon in the address bar</li>
            <li>Permissions ➜ Location</li>
            <li>Choose "Allow while using"</li>
          </ol>`:`<p>In Site Settings, set Location to <strong>Allow</strong> for ${e}, then return here.</p>`;p.fire({icon:"info",title:"Enable location for this site",html:L,confirmButtonText:"Reload Page",allowOutsideClick:!1,allowEscapeKey:!1}).then(()=>window.location.reload())},[]),V=r.useCallback(async()=>(f("checking"),navigator.geolocation?new Promise(e=>{navigator.geolocation.getCurrentPosition(t=>{f("ok"),C.current=!0,y.setPermissionStatus(se,!0),e("granted")},t=>{t.code===t.PERMISSION_DENIED?(f("permission_denied"),C.current=!1,y.setPermissionStatus(se,!1),e("denied")):(f("error"),C.current=!1,console.error("Location access error:",t),e("error"))},{enableHighAccuracy:!1,timeout:1e4,maximumAge:0})}):(f("error"),D("❌ Geolocation not supported"),C.current=!1,"error")),[]),Xe=r.useCallback(()=>{p.fire({title:"Camera Permission Required",html:`
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
        `,icon:"warning",confirmButtonText:"Try Again",showCancelButton:!0,cancelButtonText:"Skip",confirmButtonColor:"#3085d6"}).then(e=>{e.isConfirmed&&Q()})},[Q]),Le=r.useCallback(()=>{p.fire({title:"Location Permission Required",html:`
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
        `,icon:"warning",confirmButtonText:"Grant Location Access",showCancelButton:!1,confirmButtonColor:"#3085d6"}).then(e=>{e.isConfirmed?y.checkBrowserPermission("geolocation").then(t=>{t==="denied"?Y():V().then(i=>{i==="granted"?window.location.reload():i==="denied"?Y():p.fire({icon:"warning",title:"Location Unavailable",text:"Please turn on GPS/Location Services on your device and try again.",confirmButtonText:"OK",confirmButtonColor:"#3085d6"})})}).catch(()=>V().then(t=>{t==="granted"?window.location.reload():t==="denied"&&Y()})):e.isDenied&&Y()})},[V,Y]),ee=r.useCallback(Ft(e=>{if(Z.current=e,!C.current){D("❌ Location permission required"),f("permission_denied");return}const t=()=>{if(!navigator.geolocation){D("❌ Geolocation not supported"),f("error");return}navigator.geolocation.getCurrentPosition(i=>{const{latitude:m,longitude:g}=i.coords,{isNearby:k,distance:w}=Rt(m,g,e);H.current=k;const L=k?`✅ Within office range! (${w.toFixed(2)} km)`:`❌ Outside office range (${w.toFixed(2)} km from nearest office)`;D(L),f("ok")},i=>{if(console.error("Location error:",i),H.current!==null){const m=H.current?"✅ Within office range! (checking...)":"❌ Outside office range (checking...)";D(g=>!g||g.includes("Location permission required")||g.includes("Location access failed")?m:g)}else D("❌ Location access failed"),f("error")},{enableHighAccuracy:ge()||Ue(),timeout:ge()?2e4:1e4,maximumAge:0})};_.current&&clearInterval(_.current),t(),_.current=setInterval(t,45e3)},15e3),[]),Ie=r.useCallback(async()=>{if(!c)try{P("Loading models...");try{const e=ut;e!=null&&e.setBackend&&(await e.setBackend("webgl"),e!=null&&e.ready&&await e.ready())}catch{}await Promise.all([ne.tinyFaceDetector.loadFromUri(ae),ne.faceLandmark68TinyNet.loadFromUri(ae),ne.faceRecognitionNet.loadFromUri(ae),ne.faceExpressionNet.loadFromUri(ae)]);try{const e=document.createElement("canvas");e.width=128,e.height=128;const t=e.getContext("2d");t==null||t.fillRect(0,0,1,1),await ze(e,new Oe({inputSize:160,scoreThreshold:.9})).withFaceLandmarks(!0).withFaceDescriptors().withFaceExpressions()}catch{}d(!0)}catch{P("Error loading models")}},[c]),Fe=r.useCallback(async()=>{try{const e=await Promise.all(u.map(t=>{const i=t.descriptors.map(m=>new Float32Array(m));return new mt(t.label,i)}));J.current=new ft(e,.6),Je(!0)}catch(e){console.error("Face matcher initialization error:",e)}},[u]),De=r.useCallback(async()=>{var e;if(x!=="ok"){U("Camera permission required");return}G(!0);try{(e=b.current)!=null&&e.srcObject&&(b.current.srcObject.getTracks().forEach(g=>g.stop()),b.current.srcObject=null),X.current=null;const t=qe($,M||void 0),i=await navigator.mediaDevices.getUserMedia(t);b.current&&(b.current.srcObject=i,b.current.onloadedmetadata=()=>{U("Please smile to verify liveliness"),G(!1)})}catch(t){if(console.error("Error starting video:",t),M&&((t==null?void 0:t.name)==="OverconstrainedError"||(t==null?void 0:t.name)==="NotFoundError")){U("Selected camera unavailable — reverting to default"),ye(""),G(!1);return}P("Error accessing camera"),F("error"),G(!1)}},[$,x,M]),Me=r.useCallback(()=>{if(!J.current||!b.current||!E.current||x!=="ok")return;T.current&&clearInterval(T.current);const e=We(),t=e==="low"?224:e==="mid"?320:416,i=e==="low"?700:e==="mid"?500:350,m={width:500,height:600},g=async()=>{var k;try{if(!b.current||!E.current||!J.current)return;const w=await ze(b.current,new Oe({inputSize:t,scoreThreshold:.6})).withFaceLandmarks(!0).withFaceDescriptors().withFaceExpressions(),L=E.current;jt(L,m);const B=Ke(w,m);X.current||(X.current=L.getContext("2d",{willReadFrequently:!0})),(k=X.current)==null||k.clearRect(0,0,m.width,m.height);const re=(z,O)=>{z!==je.current&&(je.current=z,Ge(z)),O!==Ce.current&&(Ce.current=O,U(O))};if(B.length>0){const z=B.map(de=>J.current.findBestMatch(de.descriptor));kt(L,B),z.forEach((de,tt)=>{const rt=B[tt].detection.box;new Ye(rt,{label:de.toString()}).draw(L)});const O=z[0],Ae=O&&O.label!=="unknown",et=Pt(B[0].expressions);Ae&&et&&(ke.current=Date.now()+4e3),Date.now()<ke.current?re("passed","Nice Smile!😉"):Ae?re("pending","Please smile."):re("pending","Face not recognized."),P("Running")}else re("pending","No face detected"),P("Running")}catch(w){console.error("Face detection error:",w)}};T.current=setInterval(g,i)},[x]),Te=r.useCallback(async()=>{var e;try{const i=(await fe.get("users/userDetails",{headers:{Authorization:`Token ${I.getItem("accessToken")}`}})).data;if(I.setItem("user",JSON.stringify(i)),!(i!=null&&i.description))throw new Error("No face description data in API response");j([{label:i.full_name,descriptors:i.description}]),N([{id:i.full_name,name:i.full_name,position:i.job_title}]),a(!0),((e=i.location)==null?void 0:e.length)>0?(Z.current=i.location,ee(i.location)):(D("❌ No office locations configured"),f("error"))}catch(t){P(t.message||"Error loading face data"),f("error")}},[ee]),Qe={I:{message:"clocked in",emoji:"🌅"},i:{message:"started break",emoji:"☕"},0:{message:"ended break",emoji:"🍽️"},o:{message:"clocked out",emoji:"🌙"}},te=r.useCallback(It(e=>{const{message:t,emoji:i}=Qe[e],m=Lt();fe.post("checkinoutregion/create/",{CHECKTIME:m,CHECKTYPE:e,VERIFYCODE:s.deptid,SENSORID:0},{headers:{Authorization:`Token ${I.getItem("accessToken")}`}}).then(()=>{const g={I:"Have a great day at work! 💼",i:"Enjoy your break! ☕",0:"Welcome back! 🔋",o:"See you tomorrow! 🌙"};p.fire({title:`${i} Success! ${i}`,html:`
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
            `,confirmButtonColor:"#d33",confirmButtonText:"Try Again 🔄"})})},1e3),[s,o]);return r.useEffect(()=>(Te(),Ee(),()=>{var e;if((e=b.current)!=null&&e.srcObject&&(b.current.srcObject.getTracks().forEach(i=>i.stop()),b.current.srcObject=null),T.current&&clearInterval(T.current),_.current&&clearInterval(_.current),q.current&&clearTimeout(q.current),Se.current&&cancelAnimationFrame(Se.current),E.current){const t=E.current.getContext("2d",{willReadFrequently:!0});t&&t.clearRect(0,0,E.current.width,E.current.height)}P("Stopped")}),[Te,Ee]),r.useEffect(()=>{c||Ie()},[c,Ie]),r.useEffect(()=>{var t;if(x!=="ok")return;A();const e=navigator.mediaDevices;return(t=e==null?void 0:e.addEventListener)==null||t.call(e,"devicechange",A),()=>{var i;return(i=e==null?void 0:e.removeEventListener)==null?void 0:i.call(e,"devicechange",A)}},[x,A]),r.useEffect(()=>{c&&l&&u.length>0&&Fe()},[c,l,u.length,Fe]),r.useEffect(()=>(ve&&we&&x==="ok"&&(async()=>(await De(),Me()))(),()=>{T.current&&clearInterval(T.current)}),[ve,we,x,$,M,De,Me]),r.useEffect(()=>{(S==="permission_denied"||K&&K.includes("Location permission required"))&&!le.current&&(le.current=!0,Le()),S==="ok"&&(le.current=!1)},[S,K,Le]),r.useEffect(()=>{let e=null;return(async()=>{try{const i=await navigator.permissions.query({name:"geolocation"});e=i;const m=()=>{i.state==="granted"?(f("ok"),C.current=!0,Z.current&&ee(Z.current)):i.state==="denied"&&(f("permission_denied"),C.current=!1)};i.onchange=m}catch{}})(),()=>{e&&(e.onchange=null)}},[ee]),n.jsxs("div",{className:"flex-1 h-full overflow-auto bg-background",children:[n.jsx("style",{children:`
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
        `}),n.jsxs("div",{className:"flex-1 flex flex-col items-center justify-center min-h-screen p-6",children:[n.jsxs("div",{className:"text-center mb-12",children:[n.jsx("h1",{className:"text-4xl sm:text-3xl font-bold text-primary mb-2",children:"🔐 Digital Biometric"}),n.jsxs("p",{className:"text-secondary-foreground text-lg",children:["Welcome back, ",n.jsx("span",{className:"font-semibold text-primary",children:s.full_name})]}),n.jsx("p",{className:"text-sm text-secondary-foreground mt-2",children:K})]}),n.jsx("div",{className:"flex w-full justify-center px-4 animate-in fade-in zoom-in-95 duration-500",children:n.jsx("div",{className:"flex flex-col items-center gap-6",children:n.jsxs("div",{className:"relative flex items-center justify-center",children:[n.jsxs("div",{className:"absolute w-[350px] h-[350px] sm:w-[240px] sm:h-[240px] pointer-events-none rounded-full ",children:[n.jsx("div",{className:`absolute inset-0 rounded-full pulse-ring ${h==="Nice Smile!😉"?"ring-2 ring-blue-400":h==="Please smile."?"ring-2 ring-green-500":h==="Face not recognized."?"ring-2 ring-red-500":h==="No face detected"?"ring-2 ring-red-500/80":"ring-2 ring-gray-400/30"}`}),n.jsx("div",{className:`absolute inset-0 rounded-full pulse-ring-alt ${h==="Nice Smile!😉"?"ring-2 ring-blue-400":h==="Please smile."?"ring-2 ring-green-300/70":h==="Face not recognized."?"ring-2 ring-yellow-400/70":h==="No face detected"?"ring-2 ring-red-400/30":"ring-2 ring-gray-300/20"}`}),n.jsx("div",{className:`absolute inset-0 rounded-full pulse-ring-slow ${h==="Nice Smile!😉"?"ring-2 ring-blue-300":h==="Please smile."?"ring-2 ring-green-300/40":h==="Face not recognized."?"ring-2 ring-yellow-300/40":h==="No face detected"?"ring-2 ring-red-400/20":"ring-2 ring-gray-300/10"}`})]}),n.jsxs("div",{className:`flex items-center justify-center w-[400px] h-[400px] sm:w-80 sm:h-80 rounded-full overflow-hidden transition-all duration-300 ${h==="Nice Smile!😉"?"ring-4 ring-blue-500 ring-offset-2 shadow-lg shadow-blue-500/50":h==="Please smile."?"ring-4 ring-green-400 ring-offset-2 shadow-lg shadow-green-500/50":h==="Face not recognized."?"ring-4 ring-yellow-500 ring-offset-2 shadow-lg shadow-yellow-500/50":h==="No face detected"?"ring-4 ring-red-400 ring-offset-2 shadow-lg shadow-red-500/40":"ring-4 ring-gray-400 ring-offset-2"} bg-gradient-to-br from-slate-900 to-slate-800`,style:{clipPath:"circle(50%)"},children:[n.jsx("video",{crossOrigin:"anonymous",ref:b,className:`w-full h-full object-cover transition-opacity duration-300 ease-out ${ce?"opacity-0":"opacity-100"}`,style:{clipPath:"circle(50%)"},autoPlay:!0,muted:!0,playsInline:!0}),n.jsx("canvas",{ref:E,className:"w-full h-full absolute inset-0",style:{clipPath:"circle(50%)"}}),ce&&n.jsx("div",{className:"absolute inset-0 z-10 flex items-center justify-center bg-slate-900/70 backdrop-blur-sm transition-opacity duration-200",children:n.jsxs("div",{className:"flex flex-col items-center gap-2",children:[n.jsx(wt,{className:"w-8 h-8 text-white animate-spin"}),n.jsx("span",{className:"text-xs text-white/80 font-medium",children:"Switching camera…"})]})})]}),n.jsx("div",{className:"absolute flex justify-center translate-y-[190px] sm:translate-y-[140px] w-full ",children:n.jsx("span",{className:`px-4 py-2 backdrop-blur-sm rounded-full text-sm sm:text-xs font-medium transition-all ${pe==="passed"?"bg-blue-500/60 text-green-50 border ":"bg-green-500/60  text-yellow-50 border "}`,children:h})})]})})}),n.jsxs("div",{className:"relative grid grid-cols-3 justify-center w-full mt-20 px-4 gap-4",children:[n.jsxs("div",{className:"flex flex-col gap-2 justify-start max-w-60",children:[n.jsx("p",{className:"text-xs font-semibold text-secondary-foreground uppercase tracking-wide",children:"Status"}),n.jsxs("span",{className:`inline-flex items-center gap-2 px-3 py-1 rounded-full text-sm font-medium ${xe==="Running"?"bg-green-600 text-green-50 border border-green-500":"bg-red-600 text-red-50 border border-red-500"}`,children:[n.jsx("span",{className:"w-2 h-2 rounded-full bg-current animate-pulse"}),xe]})]}),n.jsx("div",{className:"flex flex-col items-center gap-2",children:be.length>1&&n.jsxs(gt,{value:M||"auto",onValueChange:e=>ye(e==="auto"?"":e),disabled:ce,children:[n.jsxs(ht,{className:"h-8 w-40 text-xs gap-1 px-2 text-accent-foreground",children:[n.jsx(St,{className:"w-3.5 h-3.5 shrink-0 text-muted-foreground"}),n.jsx(pt,{placeholder:"Camera",className:" text-accent-foreground"})]}),n.jsxs(xt,{className:" text-accent-foreground ",children:[n.jsx($e,{value:"auto",children:"Auto (Front/Back)"}),be.map((e,t)=>n.jsx($e,{className:" text-accent-foreground ",value:e.deviceId,children:e.label||`Camera ${t+1}`},e.deviceId))]})]})}),n.jsxs("div",{className:"flex flex-col gap-2 justify-end text-right",children:[n.jsx("p",{className:"text-xs font-semibold text-secondary-foreground uppercase tracking-wide",children:"Permissions"}),n.jsxs("div",{className:"flex gap-3 justify-end",children:[n.jsxs("button",{onClick:()=>{x!=="ok"&&Q()},className:"flex items-center gap-1 px-2 py-1 rounded transition-all hover:bg-white/10 cursor-pointer group",title:x==="ok"?"Camera enabled":"Click to enable camera",children:[n.jsx(yt,{className:`w-4 h-4 transition-all ${x==="ok"?"text-green-500":"text-red-500 group-hover:scale-110"}`}),n.jsx("span",{className:`w-2 h-2 rounded-full transition-all ${x==="ok"?"bg-green-500":"bg-red-500 group-hover:scale-125"}`})]}),n.jsxs("button",{onClick:()=>{S!=="ok"&&V()},className:"flex items-center gap-1 px-2 py-1 rounded transition-all hover:bg-white/10 cursor-pointer group",title:S==="ok"?"Location enabled":"Click to enable location",children:[n.jsx(vt,{className:`w-4 h-4 transition-all ${S==="ok"?"text-green-500":"text-red-500 group-hover:scale-110"}`}),n.jsx("span",{className:`w-2 h-2 rounded-full transition-all ${S==="ok"?"bg-green-500":"bg-red-500 group-hover:scale-125"}`})]})]})]})]})]})]})}function Ot(){const[s,o]=r.useState(null),[l,a]=r.useState(!0),[c,d]=r.useState(60),u=Ve();r.useEffect(()=>{fe.get("users/userDetails",{headers:{Authorization:`Token ${I.getItem("accessToken")}`}}).then(v=>{o(v.data)}).finally(()=>a(!1))},[]),r.useEffect(()=>{const v=setInterval(()=>{d(N=>(N<=1&&(u("/regional/user/temp"),window.location.reload()),N-1))},1e3);return()=>clearInterval(v)},[u]);const j=v=>{const N=Math.floor(v/60),S=v%60;return`${N.toString().padStart(2,"0")}:${S.toString().padStart(2,"0")}`};return l?n.jsx("div",{className:"flex h-full w-full justify-center items-center",children:"Loading..."}):!s||!s.description||s.description.length===0?n.jsx("div",{className:"flex-1 h-full flex items-center justify-center",children:n.jsx(Ct,{})}):n.jsxs("div",{className:"flex-1 h-full overflow-auto",children:[n.jsxs("div",{className:"fixed bottom-20 right-2 bg-gray-100 px-3 py-1 rounded-md font-mono text-sm z-50",children:[n.jsx("span",{className:" md:hidden",children:"Session Timer:"}),"   ",j(c)]}),n.jsx(bt,{}),n.jsx(r.Suspense,{fallback:n.jsx("div",{children:"Loading..."}),children:n.jsx(Dt,{userObject:s})})]})}export{Ot as default};
