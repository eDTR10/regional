import{c as ue,ai as oe,aj as ae,ak as Ve,al as Ge,am as Me,an as He,ao as Je,ap as Ze,aq as Xe,ar as Ee,as as Qe,j as n,L as et,u as Te,r,h as p,at as tt,W as X,au as Le,av as Ie,aw as rt,ax as nt,i as ce}from"./index-6a1d31fa.js";import{D as st}from"./DashboardAnalogClock-b3e97a2f.js";const it=ue("Camera",[["path",{d:"M14.5 4h-5L7 7H4a2 2 0 0 0-2 2v9a2 2 0 0 0 2 2h16a2 2 0 0 0 2-2V9a2 2 0 0 0-2-2h-3l-2.5-3z",key:"1tc9qg"}],["circle",{cx:"12",cy:"13",r:"3",key:"1vg3eu"}]]),ot=ue("MapPin",[["path",{d:"M20 10c0 6-8 12-8 12s-8-6-8-12a8 8 0 0 1 16 0Z",key:"2oe9fu"}],["circle",{cx:"12",cy:"10",r:"3",key:"ilqhr7"}]]),at=ue("RotateCcw",[["path",{d:"M3 12a9 9 0 1 0 9-9 9.75 9.75 0 0 0-6.74 2.74L3 8",key:"1357e3"}],["path",{d:"M3 3v5h5",key:"1xhq8a"}]]);function ct(t,a){var c=Array.isArray(a)?a:[a];c.forEach(function(o){var l=o instanceof oe?o.score:ae(o)?o.detection.score:void 0,d=o instanceof oe?o.box:ae(o)?o.detection.box:new Ve(o),m=l?""+Ge(l):void 0;new Me(d,{label:m}).draw(t)})}function lt(t,a,c){c===void 0&&(c=!1);var o=c?He(a):a,l=o.width,d=o.height;return t.width=l,t.height=d,{width:l,height:d}}function Ae(t,a){var c=new Je(a.width,a.height),o=c.width,l=c.height;if(o<=0||l<=0)throw new Error("resizeResults - invalid dimensions: "+JSON.stringify({width:o,height:l}));if(Array.isArray(t))return t.map(function(C){return Ae(C,{width:o,height:l})});if(Ze(t)){var d=t.detection.forSize(o,l),m=t.unshiftedLandmarks.forSize(d.box.width,d.box.height);return Xe(Ee(t,d),m)}return ae(t)?Ee(t,t.detection.forSize(o,l)):t instanceof Qe||t instanceof oe?t.forSize(o,l):t}const ut=()=>n.jsx("div",{className:"flex flex-col items-center justify-center h-screen w-full",children:n.jsxs("div",{className:"bg-card border border-border rounded-md p-8 shadow-md flex flex-col items-center",children:[n.jsx("p",{className:"text-2xl font-bold text-primary mb-2",children:"Face Registration Required"}),n.jsx("p",{className:"text-foreground text-center",children:"Please register your face from your profile to use this page."}),n.jsx(et,{to:"/regional/user/profile",className:" animate-bounce cursor-pointer text-primary text-xs",children:" View Profile →  Register your Face for Digital Biometric"}),n.jsx("p",{className:" text-xs text-yellow-500 mt-5",children:"*Note: Images won't be saved to the database — your privacy is safe 😊!"})]})}),Q="location_permission_granted",ee="camera_permission_granted",Fe="permissions_explained";function dt(t,a,c,o){const d=(c-t)*Math.PI/180,m=(o-a)*Math.PI/180,C=Math.sin(d/2)*Math.sin(d/2)+Math.cos(t*Math.PI/180)*Math.cos(c*Math.PI/180)*Math.sin(m/2)*Math.sin(m/2);return 6371*(2*Math.atan2(Math.sqrt(C),Math.sqrt(1-C)))}function mt(t){return t.happy>.5}const le=()=>typeof navigator<"u"&&/android|iphone|ipad|ipod|iemobile|mobile/i.test(navigator.userAgent),Be=()=>typeof navigator<"u"&&/chrome|crios/i.test(navigator.userAgent)&&!/edg|opr|brave|firefox/i.test(navigator.userAgent),ft=t=>t+(Be()?.01:0),ze=()=>{try{const t=navigator.deviceMemory??4,a=navigator.hardwareConcurrency??4;return le()&&(t<=2||a<=4)||t<=2||a<=2?"low":t<=4||a<=4?"mid":"high"}catch{return"mid"}};function gt(t,a,c,o=.08){let l=1/0,d=!1,m="";const C=ft(o);return c.forEach(v=>{const[N,S]=v.split(",").map(w=>parseFloat(w.trim())),f=dt(t,a,N,S);f<=C&&(d=!0),f<l&&(l=f,m=v)}),{isNearby:d,distance:l,nearestLocation:m}}function ht(){const t=new Date,a=t.getFullYear(),c=String(t.getMonth()+1).padStart(2,"0"),o=String(t.getDate()).padStart(2,"0"),l=String(t.getHours()).padStart(2,"0"),d=String(t.getMinutes()).padStart(2,"0"),m=String(t.getSeconds()).padStart(2,"0");return`${a}-${c}-${o}T${l}:${d}:${m}Z`}function pt(t,a){let c;return(...o)=>{clearTimeout(c),c=setTimeout(()=>t(...o),a)}}function xt(t,a){let c;return(...o)=>{c||(t(...o),c=!0,setTimeout(()=>c=!1,a))}}const y={hasStoredPermission:t=>localStorage.getItem(t)==="true",setPermissionStatus:(t,a)=>{localStorage.setItem(t,a.toString())},hasShownExplanation:()=>localStorage.getItem(Fe)==="true",setExplanationShown:()=>{localStorage.setItem(Fe,"true")},checkBrowserPermission:async t=>{try{return"permissions"in navigator?(await navigator.permissions.query({name:t})).state:null}catch(a){return console.warn(`Permission check failed for ${t}:`,a),null}}},te="/regional/models",De=t=>{const a=ze();let c={ideal:640,max:1280},o={ideal:480,max:720},l={ideal:15,max:30};return a==="low"?(c={ideal:480,max:640},o={ideal:360,max:480},l={ideal:12,max:24}):a==="mid"?(c={ideal:640,max:960},o={ideal:480,max:540},l={ideal:15,max:30}):(c={ideal:640,max:1280},o={ideal:480,max:720},l={ideal:24,max:30}),{video:{facingMode:t,width:c,height:o,frameRate:l,aspectRatio:1.333}}};function wt({userObject:t}){const a=Te(),[c,o]=r.useState(!1),[l,d]=r.useState(!1),[m,C]=r.useState([]),[v,N]=r.useState([]),[S,f]=r.useState(null),[w,I]=r.useState(null),[q,F]=r.useState(null),[de,Oe]=r.useState("pending"),[h,re]=r.useState("Checking permissions..."),[me,P]=r.useState("Loading..."),[M,$e]=r.useState("user"),[fe,_e]=r.useState(!1),[Y,ne]=r.useState(!1),K=r.useRef(null),j=r.useRef(!1),U=r.useRef(null),se=r.useRef(!1),b=r.useRef(null),R=r.useRef(null),D=r.useRef(),W=r.useRef(null),z=r.useRef(),O=r.useRef(),ge=r.useRef(),E=r.useRef(0),he=r.useRef(0),V=r.useRef(null),pe=r.useRef("pending"),xe=r.useRef(""),we=de==="passed"&&j.current&&w==="ok"&&K.current===!0,be=r.useCallback(()=>{if(!Y&&!(Date.now()<E.current)){try{if(p.isVisible&&p.isVisible())return}catch{}ne(!0),p.fire({title:"Biometric Actions",html:`
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
    `,showConfirmButton:!1,showCancelButton:!1,allowOutsideClick:!1,allowEscapeKey:!1,position:"center",toast:!1,timer:6e3,timerProgressBar:!0,width:"420px",background:"#fff",customClass:{popup:"floating-menu-popup",timerProgressBar:"floating-menu-timer"},didOpen:()=>{var e,s,i,u;(e=document.getElementById("time-in-btn"))==null||e.addEventListener("click",()=>{E.current=Date.now()+3e3,J("I"),p.close()}),(s=document.getElementById("break-in-btn"))==null||s.addEventListener("click",()=>{E.current=Date.now()+3e3,J("i"),p.close()}),(i=document.getElementById("break-out-btn"))==null||i.addEventListener("click",()=>{E.current=Date.now()+3e3,J("0"),p.close()}),(u=document.getElementById("time-out-btn"))==null||u.addEventListener("click",()=>{E.current=Date.now()+3e3,J("o"),p.close()})},willClose:()=>{E.current=Math.max(E.current,Date.now()+3e3),ne(!1)}}),O.current=setTimeout(()=>{p.close(),ne(!1)},4e3)}},[Y]);r.useEffect(()=>(we&&!Y&&Date.now()>=E.current&&(!p.isVisible||!p.isVisible())&&be(),()=>{O.current&&clearTimeout(O.current)}),[we,Y,be]);const ye=r.useCallback(()=>{y.hasShownExplanation()?ve():p.fire({title:"Permission Setup Required",html:`
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
          `,icon:"info",confirmButtonText:"Grant Permissions",confirmButtonColor:"#3085d6",allowOutsideClick:!1,allowEscapeKey:!1}).then(()=>{y.setExplanationShown(),ve()})},[]),ve=r.useCallback(async()=>{P("Checking permissions...");const e=y.hasStoredPermission(ee),s=y.hasStoredPermission(Q),i=await y.checkBrowserPermission("camera"),u=await y.checkBrowserPermission("geolocation");e&&i==="granted"?I("ok"):i==="denied"?(I("permission_denied"),y.setPermissionStatus(ee,!1)):await G(),s&&u==="granted"?(f("ok"),j.current=!0):u==="denied"?(f("permission_denied"),j.current=!1,y.setPermissionStatus(Q,!1)):await _(),_e(!0)},[]),G=r.useCallback(async()=>{I("checking");try{const e=De(M),s=await navigator.mediaDevices.getUserMedia(e);I("ok"),y.setPermissionStatus(ee,!0),s.getTracks().forEach(i=>i.stop())}catch(e){e.name==="NotAllowedError"||e.name==="PermissionDeniedError"?(I("permission_denied"),y.setPermissionStatus(ee,!1),qe()):(I("error"),console.error("Camera access error:",e))}},[M]),$=r.useCallback(()=>{const e=window.location.origin,s=navigator.userAgent.toLowerCase(),i=s.includes("edg"),u=s.includes("firefox"),g=/android|iphone|ipad|ipod/i.test(s),k=(s.includes("chrome")||s.includes("crios"))&&!i&&!s.includes("opr");let x=null;if(!g&&(k||i)?x=`${i?"edge":"chrome"}://settings/content/siteDetails?site=${encodeURIComponent(e)}`:!g&&u&&(x="about:preferences#privacy"),x)try{window.open(x,"_blank")}catch{}const L=g?`<ol style="text-align:left; padding-left: 20px;">
            <li>Tap the lock icon in the address bar</li>
            <li>Permissions ➜ Location</li>
            <li>Choose "Allow while using"</li>
          </ol>`:`<p>In Site Settings, set Location to <strong>Allow</strong> for ${e}, then return here.</p>`;p.fire({icon:"info",title:"Enable location for this site",html:L,confirmButtonText:"Reload Page",allowOutsideClick:!1,allowEscapeKey:!1}).then(()=>window.location.reload())},[]),_=r.useCallback(async()=>(f("checking"),navigator.geolocation?new Promise(e=>{navigator.geolocation.getCurrentPosition(s=>{f("ok"),j.current=!0,y.setPermissionStatus(Q,!0),e("granted")},s=>{s.code===s.PERMISSION_DENIED?(f("permission_denied"),j.current=!1,y.setPermissionStatus(Q,!1),e("denied")):(f("error"),j.current=!1,console.error("Location access error:",s),e("error"))},{enableHighAccuracy:!1,timeout:1e4,maximumAge:0})}):(f("error"),F("❌ Geolocation not supported"),j.current=!1,"error")),[]),qe=r.useCallback(()=>{p.fire({title:"Camera Permission Required",html:`
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
        `,icon:"warning",confirmButtonText:"Try Again",showCancelButton:!0,cancelButtonText:"Skip",confirmButtonColor:"#3085d6"}).then(e=>{e.isConfirmed&&G()})},[G]),Se=r.useCallback(()=>{p.fire({title:"Location Permission Required",html:`
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
        `,icon:"warning",confirmButtonText:"Grant Location Access",showCancelButton:!1,confirmButtonColor:"#3085d6"}).then(e=>{e.isConfirmed?y.checkBrowserPermission("geolocation").then(s=>{s==="denied"?$():_().then(i=>{i==="granted"?window.location.reload():i==="denied"?$():p.fire({icon:"warning",title:"Location Unavailable",text:"Please turn on GPS/Location Services on your device and try again.",confirmButtonText:"OK",confirmButtonColor:"#3085d6"})})}).catch(()=>_().then(s=>{s==="granted"?window.location.reload():s==="denied"&&$()})):e.isDenied&&$()})},[_,$]),H=r.useCallback(xt(e=>{if(U.current=e,!j.current){F("❌ Location permission required"),f("permission_denied");return}const s=()=>{if(!navigator.geolocation){F("❌ Geolocation not supported"),f("error");return}navigator.geolocation.getCurrentPosition(i=>{const{latitude:u,longitude:g}=i.coords,{isNearby:k,distance:x}=gt(u,g,e);K.current=k;const L=k?`✅ Within office range! (${x.toFixed(2)} km)`:`❌ Outside office range (${x.toFixed(2)} km from nearest office)`;F(L),f("ok")},i=>{if(console.error("Location error:",i),K.current!==null){const u=K.current?"✅ Within office range! (checking...)":"❌ Outside office range (checking...)";F(g=>!g||g.includes("Location permission required")||g.includes("Location access failed")?u:g)}else F("❌ Location access failed"),f("error")},{enableHighAccuracy:le()||Be(),timeout:le()?2e4:1e4,maximumAge:0})};z.current&&clearInterval(z.current),s(),z.current=setInterval(s,45e3)},15e3),[]),ke=r.useCallback(async()=>{if(!l)try{P("Loading models...");try{const e=tt;e!=null&&e.setBackend&&(await e.setBackend("webgl"),e!=null&&e.ready&&await e.ready())}catch{}await Promise.all([X.tinyFaceDetector.loadFromUri(te),X.faceLandmark68TinyNet.loadFromUri(te),X.faceRecognitionNet.loadFromUri(te),X.faceExpressionNet.loadFromUri(te)]);try{const e=document.createElement("canvas");e.width=128,e.height=128;const s=e.getContext("2d");s==null||s.fillRect(0,0,1,1),await Le(e,new Ie({inputSize:160,scoreThreshold:.9})).withFaceLandmarks(!0).withFaceDescriptors().withFaceExpressions()}catch{}d(!0)}catch{P("Error loading models")}},[l]),Ce=r.useCallback(async()=>{try{const e=await Promise.all(m.map(s=>{const i=s.descriptors.map(u=>new Float32Array(u));return new rt(s.label,i)}));W.current=new nt(e,.6)}catch(e){console.error("Face matcher initialization error:",e)}},[m]),je=r.useCallback(async()=>{var e;if(w!=="ok"){re("Camera permission required");return}try{(e=b.current)!=null&&e.srcObject&&(b.current.srcObject.getTracks().forEach(g=>g.stop()),b.current.srcObject=null),V.current=null;const s=De(M),i=await navigator.mediaDevices.getUserMedia(s);b.current&&(b.current.srcObject=i,b.current.onloadedmetadata=()=>{re("Please smile to verify liveliness")})}catch(s){console.error("Error starting video:",s),P("Error accessing camera"),I("error")}},[M,w]),Ne=r.useCallback(()=>{if(!W.current||!b.current||!R.current||w!=="ok")return;D.current&&clearInterval(D.current);const e=ze(),s=e==="low"?224:e==="mid"?320:416,i=e==="low"?700:e==="mid"?500:350,u={width:500,height:600},g=async()=>{var k;try{if(!b.current||!R.current||!W.current)return;const x=await Le(b.current,new Ie({inputSize:s,scoreThreshold:.6})).withFaceLandmarks(!0).withFaceDescriptors().withFaceExpressions(),L=R.current;lt(L,u);const T=Ae(x,u);V.current||(V.current=L.getContext("2d",{willReadFrequently:!0})),(k=V.current)==null||k.clearRect(0,0,u.width,u.height);const Z=(A,B)=>{A!==pe.current&&(pe.current=A,Oe(A)),B!==xe.current&&(xe.current=B,re(B))};if(T.length>0){const A=T.map(ie=>W.current.findBestMatch(ie.descriptor));ct(L,T),A.forEach((ie,Ue)=>{const We=T[Ue].detection.box;new Me(We,{label:ie.toString()}).draw(L)});const B=A[0],Re=B&&B.label!=="unknown",Ke=mt(T[0].expressions);Re&&Ke&&(he.current=Date.now()+4e3),Date.now()<he.current?Z("passed","Nice Smile!😉"):Re?Z("pending","Please smile."):Z("pending","Face not recognized."),P("Running")}else Z("pending","No face detected"),P("Running")}catch(x){console.error("Face detection error:",x)}};D.current=setInterval(g,i)},[w]),Pe=r.useCallback(async()=>{var e;try{const i=(await ce.get("users/userDetails",{headers:{Authorization:`Token ${localStorage.getItem("accessToken")}`}})).data;if(localStorage.setItem("user",JSON.stringify(i)),!(i!=null&&i.description))throw new Error("No face description data in API response");C([{label:i.full_name,descriptors:i.description}]),N([{id:i.full_name,name:i.full_name,position:i.job_title}]),o(!0),((e=i.location)==null?void 0:e.length)>0?(U.current=i.location,H(i.location)):(F("❌ No office locations configured"),f("error"))}catch(s){P(s.message||"Error loading face data"),f("error")}},[H]),Ye={I:{message:"clocked in",emoji:"🌅"},i:{message:"started break",emoji:"☕"},0:{message:"ended break",emoji:"🍽️"},o:{message:"clocked out",emoji:"🌙"}},J=r.useCallback(pt(e=>{const{message:s,emoji:i}=Ye[e],u=ht();ce.post("checkinoutregion/create/",{CHECKTIME:u,CHECKTYPE:e,VERIFYCODE:t.deptid,SENSORID:0},{headers:{Authorization:`Token ${localStorage.getItem("accessToken")}`}}).then(()=>{const g={I:"Have a great day at work! 💼",i:"Enjoy your break! ☕",0:"Welcome back! 🔋",o:"See you tomorrow! 🌙"};p.fire({title:`${i} Success! ${i}`,html:`
              <div style="text-align: center; margin: 20px 0;">
                <p style="font-size: 18px; margin-bottom: 15px;">
                  You have successfully ${s}! 
                </p>
                <p style="font-size: 16px; color: #10b981; margin-bottom: 10px;">
                  😊 Nice smile, by the way! 😊
                </p>
                <p style="font-size: 14px; color: #666; font-style: italic;">
                  ${g[e]}
                </p>
              </div>
            `,icon:"success",confirmButtonColor:"#3085d6",timer:3e3,showConfirmButton:!1,customClass:{popup:"success-popup",title:"success-title"}}),setTimeout(()=>{a("/regional/user/home"),window.location.reload()},3e3)}).catch(g=>{var k,x;p.fire({icon:"error",title:"❌ Oops! Something went wrong",html:`
              <div style="text-align: center; margin: 20px 0;">
                <p style="font-size: 16px; margin-bottom: 10px;">
                  ${((x=(k=g.response)==null?void 0:k.data)==null?void 0:x.detail)||"An error occurred while processing your request."}
                </p>
                <p style="font-size: 14px; color: #666; font-style: italic;">
                  😔 Don't worry, please try again!
                </p>
              </div>
            `,confirmButtonColor:"#d33",confirmButtonText:"Try Again 🔄"})})},1e3),[t,a]);return r.useEffect(()=>(Pe(),ye(),()=>{var e;if((e=b.current)!=null&&e.srcObject&&(b.current.srcObject.getTracks().forEach(i=>i.stop()),b.current.srcObject=null),D.current&&clearInterval(D.current),z.current&&clearInterval(z.current),O.current&&clearTimeout(O.current),ge.current&&cancelAnimationFrame(ge.current),R.current){const s=R.current.getContext("2d",{willReadFrequently:!0});s&&s.clearRect(0,0,R.current.width,R.current.height)}P("Stopped")}),[Pe,ye]),r.useEffect(()=>{l||ke()},[l,ke]),r.useEffect(()=>(l&&c&&m.length>0&&fe&&w==="ok"&&(async()=>(await Ce(),await je(),Ne()))(),()=>{D.current&&clearInterval(D.current)}),[l,c,m.length,fe,w,M,Ce,je,Ne]),r.useEffect(()=>{(S==="permission_denied"||q&&q.includes("Location permission required"))&&!se.current&&(se.current=!0,Se()),S==="ok"&&(se.current=!1)},[S,q,Se]),r.useEffect(()=>{let e=null;return(async()=>{try{const i=await navigator.permissions.query({name:"geolocation"});e=i;const u=()=>{i.state==="granted"?(f("ok"),j.current=!0,U.current&&H(U.current)):i.state==="denied"&&(f("permission_denied"),j.current=!1)};i.onchange=u}catch{}})(),()=>{e&&(e.onchange=null)}},[H]),n.jsxs("div",{className:"flex-1 h-full overflow-auto bg-background",children:[n.jsx("style",{children:`
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
        `}),n.jsxs("div",{className:"flex-1 flex flex-col items-center justify-center min-h-screen p-6",children:[n.jsxs("div",{className:"text-center mb-12",children:[n.jsx("h1",{className:"text-4xl sm:text-3xl font-bold text-primary mb-2",children:"🔐 Digital Biometric"}),n.jsxs("p",{className:"text-secondary-foreground text-lg",children:["Welcome back, ",n.jsx("span",{className:"font-semibold text-primary",children:t.full_name})]}),n.jsx("p",{className:"text-sm text-secondary-foreground mt-2",children:q})]}),n.jsx("div",{className:"flex w-full justify-center px-4",children:n.jsx("div",{className:"flex flex-col items-center gap-6",children:n.jsxs("div",{className:"relative flex items-center justify-center",children:[n.jsxs("div",{className:"absolute w-[350px] h-[350px] sm:w-[240px] sm:h-[240px] pointer-events-none rounded-full ",children:[n.jsx("div",{className:`absolute z-[999] inset-0 rounded-full pulse-ring ${h==="Nice Smile!😉"?"ring-2 ring-blue-400":h==="Please smile."?"ring-2 ring-green-500":h==="Face not recognized."?"ring-2 ring-red-500":h==="No face detected"?"ring-2 ring-red-500/80":"ring-2 ring-gray-400/30"}`}),n.jsx("div",{className:`absolute inset-0 rounded-full pulse-ring-alt ${h==="Nice Smile!😉"?"ring-2 ring-blue-400":h==="Please smile."?"ring-2 ring-green-300/70":h==="Face not recognized."?"ring-2 ring-yellow-400/70":h==="No face detected"?"ring-2 ring-red-400/30":"ring-2 ring-gray-300/20"}`}),n.jsx("div",{className:`absolute inset-0 rounded-full pulse-ring-slow ${h==="Nice Smile!😉"?"ring-2 ring-blue-300":h==="Please smile."?"ring-2 ring-green-300/40":h==="Face not recognized."?"ring-2 ring-yellow-300/40":h==="No face detected"?"ring-2 ring-red-400/20":"ring-2 ring-gray-300/10"}`})]}),n.jsxs("div",{className:`flex items-center justify-center w-[400px] h-[400px] sm:w-80 sm:h-80 rounded-full overflow-hidden transition-all duration-300 ${h==="Nice Smile!😉"?"ring-4 ring-blue-500 ring-offset-2 shadow-lg shadow-blue-500/50":h==="Please smile."?"ring-4 ring-green-400 ring-offset-2 shadow-lg shadow-green-500/50":h==="Face not recognized."?"ring-4 ring-yellow-500 ring-offset-2 shadow-lg shadow-yellow-500/50":h==="No face detected"?"ring-4 ring-red-400 ring-offset-2 shadow-lg shadow-red-500/40":"ring-4 ring-gray-400 ring-offset-2"} bg-gradient-to-br from-slate-900 to-slate-800`,children:[n.jsx("video",{crossOrigin:"anonymous",ref:b,className:"w-full h-full object-cover",autoPlay:!0,muted:!0,playsInline:!0}),n.jsx("canvas",{ref:R,className:"w-full h-full absolute inset-0"})]}),n.jsx("div",{className:"absolute flex justify-center translate-y-[190px] sm:translate-y-[140px] w-full ",children:n.jsx("span",{className:`px-4 py-2 backdrop-blur-sm rounded-full text-sm sm:text-xs font-medium transition-all ${de==="passed"?"bg-blue-500/60 text-green-50 border ":"bg-green-500/60  text-yellow-50 border "}`,children:h})})]})})}),n.jsxs("div",{className:"relative grid grid-cols-3 justify-center w-full mt-20 px-4 gap-4",children:[n.jsxs("div",{className:"flex flex-col gap-2 justify-start max-w-60",children:[n.jsx("p",{className:"text-xs font-semibold text-secondary-foreground uppercase tracking-wide",children:"Status"}),n.jsxs("span",{className:`inline-flex items-center gap-2 px-3 py-1 rounded-full text-sm font-medium ${me==="Running"?"bg-green-600 text-green-50 border border-green-500":"bg-red-600 text-red-50 border border-red-500"}`,children:[n.jsx("span",{className:"w-2 h-2 rounded-full bg-current animate-pulse"}),me]})]}),n.jsx("div",{className:"flex justify-center",children:n.jsx("button",{onClick:()=>$e(e=>e==="user"?"environment":"user"),className:"group relative p-3 rounded-full bg-primary hover:bg-primary/90 text-white border border-primary transition-all duration-300 hover:shadow-lg hover:shadow-primary/50",title:"Switch camera",children:n.jsx(at,{className:`w-5 h-5 text-white transition-transform duration-500 ${M==="user"?"rotate-180":"rotate-0"}`})})}),n.jsxs("div",{className:"flex flex-col gap-2 justify-end text-right",children:[n.jsx("p",{className:"text-xs font-semibold text-secondary-foreground uppercase tracking-wide",children:"Permissions"}),n.jsxs("div",{className:"flex gap-3 justify-end",children:[n.jsxs("button",{onClick:()=>{w!=="ok"&&G()},className:"flex items-center gap-1 px-2 py-1 rounded transition-all hover:bg-white/10 cursor-pointer group",title:w==="ok"?"Camera enabled":"Click to enable camera",children:[n.jsx(it,{className:`w-4 h-4 transition-all ${w==="ok"?"text-green-500":"text-red-500 group-hover:scale-110"}`}),n.jsx("span",{className:`w-2 h-2 rounded-full transition-all ${w==="ok"?"bg-green-500":"bg-red-500 group-hover:scale-125"}`})]}),n.jsxs("button",{onClick:()=>{S!=="ok"&&_()},className:"flex items-center gap-1 px-2 py-1 rounded transition-all hover:bg-white/10 cursor-pointer group",title:S==="ok"?"Location enabled":"Click to enable location",children:[n.jsx(ot,{className:`w-4 h-4 transition-all ${S==="ok"?"text-green-500":"text-red-500 group-hover:scale-110"}`}),n.jsx("span",{className:`w-2 h-2 rounded-full transition-all ${S==="ok"?"bg-green-500":"bg-red-500 group-hover:scale-125"}`})]})]})]})]})]})]})}function St(){const[t,a]=r.useState(null),[c,o]=r.useState(!0),[l,d]=r.useState(60),m=Te();r.useEffect(()=>{ce.get("users/userDetails",{headers:{Authorization:`Token ${localStorage.getItem("accessToken")}`}}).then(v=>{a(v.data)}).finally(()=>o(!1))},[]),r.useEffect(()=>{const v=setInterval(()=>{d(N=>(N<=1&&(m("/regional/user/temp"),window.location.reload()),N-1))},1e3);return()=>clearInterval(v)},[m]);const C=v=>{const N=Math.floor(v/60),S=v%60;return`${N.toString().padStart(2,"0")}:${S.toString().padStart(2,"0")}`};return c?n.jsx("div",{className:"flex h-full w-full justify-center items-center",children:"Loading..."}):!t||!t.description||t.description.length===0?n.jsx("div",{className:"flex-1 h-full flex items-center justify-center",children:n.jsx(ut,{})}):n.jsxs("div",{className:"flex-1 h-full overflow-auto",children:[n.jsxs("div",{className:"fixed bottom-20 right-2 bg-gray-100 px-3 py-1 rounded-md font-mono text-sm z-50",children:[n.jsx("span",{className:" md:hidden",children:"Session Timer:"}),"   ",C(l)]}),n.jsx(st,{}),n.jsx(r.Suspense,{fallback:n.jsx("div",{children:"Loading..."}),children:n.jsx(wt,{userObject:t})})]})}export{St as default};
