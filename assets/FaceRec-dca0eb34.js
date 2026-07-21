import{c as he,j as n,L as st,u as Ue,r,a as de,s as E}from"./index-fbe34ded.js";import{S as p}from"./sweetalert2.esm.all-3fe0d2e9.js";import{F as me,i as fe,B as it,r as ot,D as Ve,g as at,a as ct,b as lt,e as ut,c as Oe,f as dt,t as mt,n as te,h as ft,T as _e,L as gt,j as ht,d as pt}from"./FaceMatcher-01d4fa20.js";import{S as xt,a as wt,b as bt,c as yt,d as $e}from"./select-da370350.js";import{L as vt}from"./loader-2-4172381a.js";import{D as St}from"./DashboardAnalogClock-f4bbf322.js";const kt=he("Camera",[["path",{d:"M14.5 4h-5L7 7H4a2 2 0 0 0-2 2v9a2 2 0 0 0 2 2h16a2 2 0 0 0 2-2V9a2 2 0 0 0-2-2h-3l-2.5-3z",key:"1tc9qg"}],["circle",{cx:"12",cy:"13",r:"3",key:"1vg3eu"}]]),jt=he("MapPin",[["path",{d:"M20 10c0 6-8 12-8 12s-8-6-8-12a8 8 0 0 1 16 0Z",key:"2oe9fu"}],["circle",{cx:"12",cy:"10",r:"3",key:"ilqhr7"}]]),Ct=he("Video",[["path",{d:"m22 8-6 4 6 4V8Z",key:"50v9me"}],["rect",{width:"14",height:"12",x:"2",y:"6",rx:"2",ry:"2",key:"1rqjg6"}]]);function Nt(s,a){var l=Array.isArray(a)?a:[a];l.forEach(function(o){var c=o instanceof me?o.score:fe(o)?o.detection.score:void 0,u=o instanceof me?o.box:fe(o)?o.detection.box:new it(o),d=c?""+ot(c):void 0;new Ve(u,{label:d}).draw(s)})}function Pt(s,a,l){l===void 0&&(l=!1);var o=l?at(a):a,c=o.width,u=o.height;return s.width=c,s.height=u,{width:c,height:u}}function We(s,a){var l=new ct(a.width,a.height),o=l.width,c=l.height;if(o<=0||c<=0)throw new Error("resizeResults - invalid dimensions: "+JSON.stringify({width:o,height:c}));if(Array.isArray(s))return s.map(function(j){return We(j,{width:o,height:c})});if(lt(s)){var u=s.detection.forSize(o,c),d=s.unshiftedLandmarks.forSize(u.box.width,u.box.height);return ut(Oe(s,u),d)}return fe(s)?Oe(s,s.detection.forSize(o,c)):s instanceof dt||s instanceof me?s.forSize(o,c):s}const Et=()=>n.jsx("div",{className:"flex flex-col items-center justify-center h-screen w-full",children:n.jsxs("div",{className:"bg-card border border-border rounded-md p-8 shadow-md flex flex-col items-center",children:[n.jsx("p",{className:"text-2xl font-bold text-primary mb-2",children:"Face Registration Required"}),n.jsx("p",{className:"text-foreground text-center",children:"Please register your face from your profile to use this page."}),n.jsx(st,{to:"/regional/user/profile",className:" animate-bounce cursor-pointer text-primary text-xs",children:" View Profile →  Register your Face for Digital Biometric"}),n.jsx("p",{className:" text-xs text-yellow-500 mt-5",children:"*Note: Images won't be saved to the database — your privacy is safe 😊!"})]})}),re="location_permission_granted",ne="camera_permission_granted",qe="permissions_explained";function Rt(s,a,l,o){const u=(l-s)*Math.PI/180,d=(o-a)*Math.PI/180,j=Math.sin(u/2)*Math.sin(u/2)+Math.cos(s*Math.PI/180)*Math.cos(l*Math.PI/180)*Math.sin(d/2)*Math.sin(d/2);return 6371*(2*Math.atan2(Math.sqrt(j),Math.sqrt(1-j)))}function Lt(s){return s.happy>.5}const ge=()=>typeof navigator<"u"&&/android|iphone|ipad|ipod|iemobile|mobile/i.test(navigator.userAgent),Ke=()=>typeof navigator<"u"&&/chrome|crios/i.test(navigator.userAgent)&&!/edg|opr|brave|firefox/i.test(navigator.userAgent),It=s=>s+(Ke()?.01:0),Ge=()=>{try{const s=navigator.deviceMemory??4,a=navigator.hardwareConcurrency??4;return ge()&&(s<=2||a<=4)||s<=2||a<=2?"low":s<=4||a<=4?"mid":"high"}catch{return"mid"}};function Ft(s,a,l,o=.08){let c=1/0,u=!1,d="";const j=It(o);return l.forEach(S=>{const[R,k]=S.split(",").map(x=>parseFloat(x.trim())),g=Rt(s,a,R,k);g<=j&&(u=!0),g<c&&(c=g,d=S)}),{isNearby:u,distance:c,nearestLocation:d}}function Dt(){const s=new Date,a=s.getFullYear(),l=String(s.getMonth()+1).padStart(2,"0"),o=String(s.getDate()).padStart(2,"0"),c=String(s.getHours()).padStart(2,"0"),u=String(s.getMinutes()).padStart(2,"0"),d=String(s.getSeconds()).padStart(2,"0");return`${a}-${l}-${o}T${c}:${u}:${d}Z`}function Mt(s,a){let l;return(...o)=>{clearTimeout(l),l=setTimeout(()=>s(...o),a)}}function Tt(s,a){let l;return(...o)=>{l||(s(...o),l=!0,setTimeout(()=>l=!1,a))}}const y={hasStoredPermission:s=>E.getItem(s)==="true",setPermissionStatus:(s,a)=>{E.setItem(s,a.toString())},hasShownExplanation:()=>E.getItem(qe)==="true",setExplanationShown:()=>{E.setItem(qe,"true")},checkBrowserPermission:async s=>{try{return"permissions"in navigator?(await navigator.permissions.query({name:s})).state:null}catch(a){return console.warn(`Permission check failed for ${s}:`,a),null}}},se="/regional/models",At="/regional/models-sw.js",Ye=(s,a)=>{const l=Ge();let o={ideal:640,max:1280},c={ideal:480,max:720},u={ideal:15,max:30};l==="low"?(o={ideal:480,max:640},c={ideal:360,max:480},u={ideal:12,max:24}):l==="mid"?(o={ideal:640,max:960},c={ideal:480,max:540},u={ideal:15,max:30}):(o={ideal:640,max:1280},c={ideal:480,max:720},u={ideal:24,max:30});const d={width:o,height:c,frameRate:u,aspectRatio:1.333};return a?d.deviceId={exact:a}:d.facingMode=s,{video:d}};function Bt({userObject:s}){const a=Ue(),[l,o]=r.useState(!1),[c,u]=r.useState(!1),[d,j]=r.useState([]),[S,R]=r.useState([]),[k,g]=r.useState(null),[x,D]=r.useState(null),[U,M]=r.useState(null),[pe,He]=r.useState("pending"),[h,V]=r.useState("Checking permissions..."),[xe,L]=r.useState("Loading..."),[z,zt]=r.useState("user"),[we,Je]=r.useState(!1),[W,ie]=r.useState(!1),[be,Ze]=r.useState([]),[T,ye]=r.useState(""),[oe,K]=r.useState(!1),[ve,Xe]=r.useState(!1),G=r.useRef(null),C=r.useRef(!1),H=r.useRef(null),ae=r.useRef(!1),w=r.useRef(null),I=r.useRef(null),A=r.useRef(),ce=r.useRef(!1),J=r.useRef(null),O=r.useRef(),_=r.useRef(),Se=r.useRef(),F=r.useRef(0),ke=r.useRef(0),Z=r.useRef(null),je=r.useRef("pending"),Ce=r.useRef(""),Ne=pe==="passed"&&C.current&&x==="ok"&&G.current===!0,Pe=r.useCallback(()=>{if(!W&&!(Date.now()<F.current)){try{if(p.isVisible&&p.isVisible())return}catch{}ie(!0),p.fire({title:"Biometric Actions",html:`
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
    `,showConfirmButton:!1,showCancelButton:!1,allowOutsideClick:!1,allowEscapeKey:!1,position:"center",toast:!1,timer:6e3,timerProgressBar:!0,width:"420px",background:"#fff",customClass:{popup:"floating-menu-popup",timerProgressBar:"floating-menu-timer"},didOpen:()=>{var e,t,i,m;(e=document.getElementById("time-in-btn"))==null||e.addEventListener("click",()=>{F.current=Date.now()+3e3,ee("I"),p.close()}),(t=document.getElementById("break-in-btn"))==null||t.addEventListener("click",()=>{F.current=Date.now()+3e3,ee("i"),p.close()}),(i=document.getElementById("break-out-btn"))==null||i.addEventListener("click",()=>{F.current=Date.now()+3e3,ee("0"),p.close()}),(m=document.getElementById("time-out-btn"))==null||m.addEventListener("click",()=>{F.current=Date.now()+3e3,ee("o"),p.close()})},willClose:()=>{F.current=Math.max(F.current,Date.now()+3e3),ie(!1)}}),_.current=setTimeout(()=>{p.close(),ie(!1)},4e3)}},[W]);r.useEffect(()=>(Ne&&!W&&Date.now()>=F.current&&(!p.isVisible||!p.isVisible())&&Pe(),()=>{_.current&&clearTimeout(_.current)}),[Ne,W,Pe]);const Ee=r.useCallback(()=>{y.hasShownExplanation()?Re():p.fire({title:"Permission Setup Required",html:`
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
          `,icon:"info",confirmButtonText:"Grant Permissions",confirmButtonColor:"#3085d6",allowOutsideClick:!1,allowEscapeKey:!1}).then(()=>{y.setExplanationShown(),Re()})},[]),Re=r.useCallback(async()=>{L("Checking permissions...");const e=y.hasStoredPermission(ne),t=y.hasStoredPermission(re),i=await y.checkBrowserPermission("camera"),m=await y.checkBrowserPermission("geolocation");e&&i==="granted"?D("ok"):i==="denied"?(D("permission_denied"),y.setPermissionStatus(ne,!1)):await X(),t&&m==="granted"?(g("ok"),C.current=!0):m==="denied"?(g("permission_denied"),C.current=!1,y.setPermissionStatus(re,!1)):await q(),Je(!0)},[]),B=r.useCallback(async()=>{var e;try{if(!((e=navigator.mediaDevices)!=null&&e.enumerateDevices))return;const t=await navigator.mediaDevices.enumerateDevices();Ze(t.filter(i=>i.kind==="videoinput"))}catch(t){console.warn("Failed to enumerate cameras:",t)}},[]),X=r.useCallback(async()=>{D("checking");try{const e=Ye(z,T||void 0),t=await navigator.mediaDevices.getUserMedia(e);D("ok"),y.setPermissionStatus(ne,!0),t.getTracks().forEach(i=>i.stop()),B()}catch(e){e.name==="NotAllowedError"||e.name==="PermissionDeniedError"?(D("permission_denied"),y.setPermissionStatus(ne,!1),Qe()):(D("error"),console.error("Camera access error:",e))}},[z,T,B]),$=r.useCallback(()=>{const e=window.location.origin,t=navigator.userAgent.toLowerCase(),i=t.includes("edg"),m=t.includes("firefox"),f=/android|iphone|ipad|ipod/i.test(t),b=(t.includes("chrome")||t.includes("crios"))&&!i&&!t.includes("opr");let v=null;if(!f&&(b||i)?v=`${i?"edge":"chrome"}://settings/content/siteDetails?site=${encodeURIComponent(e)}`:!f&&m&&(v="about:preferences#privacy"),v)try{window.open(v,"_blank")}catch{}const N=f?`<ol style="text-align:left; padding-left: 20px;">
            <li>Tap the lock icon in the address bar</li>
            <li>Permissions ➜ Location</li>
            <li>Choose "Allow while using"</li>
          </ol>`:`<p>In Site Settings, set Location to <strong>Allow</strong> for ${e}, then return here.</p>`;p.fire({icon:"info",title:"Enable location for this site",html:N,confirmButtonText:"Reload Page",allowOutsideClick:!1,allowEscapeKey:!1}).then(()=>window.location.reload())},[]),q=r.useCallback(async()=>(g("checking"),navigator.geolocation?new Promise(e=>{navigator.geolocation.getCurrentPosition(t=>{g("ok"),C.current=!0,y.setPermissionStatus(re,!0),e("granted")},t=>{t.code===t.PERMISSION_DENIED?(g("permission_denied"),C.current=!1,y.setPermissionStatus(re,!1),e("denied")):(g("error"),C.current=!1,console.error("Location access error:",t),e("error"))},{enableHighAccuracy:!1,timeout:1e4,maximumAge:0})}):(g("error"),M("❌ Geolocation not supported"),C.current=!1,"error")),[]),Qe=r.useCallback(()=>{p.fire({title:"Camera Permission Required",html:`
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
        `,icon:"warning",confirmButtonText:"Try Again",showCancelButton:!0,cancelButtonText:"Skip",confirmButtonColor:"#3085d6"}).then(e=>{e.isConfirmed&&X()})},[X]),Le=r.useCallback(()=>{p.fire({title:"Location Permission Required",html:`
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
        `,icon:"warning",confirmButtonText:"Grant Location Access",showCancelButton:!1,confirmButtonColor:"#3085d6"}).then(e=>{e.isConfirmed?y.checkBrowserPermission("geolocation").then(t=>{t==="denied"?$():q().then(i=>{i==="granted"?window.location.reload():i==="denied"?$():p.fire({icon:"warning",title:"Location Unavailable",text:"Please turn on GPS/Location Services on your device and try again.",confirmButtonText:"OK",confirmButtonColor:"#3085d6"})})}).catch(()=>q().then(t=>{t==="granted"?window.location.reload():t==="denied"&&$()})):e.isDenied&&$()})},[q,$]),Q=r.useCallback(Tt(e=>{if(H.current=e,!C.current){M("❌ Location permission required"),g("permission_denied");return}const t=()=>{if(!navigator.geolocation){M("❌ Geolocation not supported"),g("error");return}navigator.geolocation.getCurrentPosition(i=>{const{latitude:m,longitude:f}=i.coords,{isNearby:b,distance:v}=Ft(m,f,e);G.current=b;const N=b?`✅ Within office range! (${v.toFixed(2)} km)`:`❌ Outside office range (${v.toFixed(2)} km from nearest office)`;M(N),g("ok")},i=>{if(console.error("Location error:",i),G.current!==null){const m=G.current?"✅ Within office range! (checking...)":"❌ Outside office range (checking...)";M(f=>!f||f.includes("Location permission required")||f.includes("Location access failed")?m:f)}else M("❌ Location access failed"),g("error")},{enableHighAccuracy:ge()||Ke(),timeout:ge()?2e4:1e4,maximumAge:0})};O.current&&clearInterval(O.current),t(),O.current=setInterval(t,45e3)},15e3),[]),Ie=r.useCallback(async()=>{if(!c)try{L("Loading models...");try{const e=mt;e!=null&&e.setBackend&&(await e.setBackend("webgl"),e!=null&&e.ready&&await e.ready())}catch{}await Promise.all([te.tinyFaceDetector.loadFromUri(se),te.faceLandmark68TinyNet.loadFromUri(se),te.faceRecognitionNet.loadFromUri(se),te.faceExpressionNet.loadFromUri(se)]);try{const e=document.createElement("canvas");e.width=128,e.height=128;const t=e.getContext("2d");t==null||t.fillRect(0,0,1,1),await ft(e,new _e({inputSize:160,scoreThreshold:.9})).withFaceLandmarks(!0).withFaceDescriptors().withFaceExpressions()}catch{}u(!0)}catch{L("Error loading models")}},[c]),Fe=r.useCallback(async()=>{try{const e=await Promise.all(d.map(t=>{const i=t.descriptors.map(m=>new Float32Array(m));return new gt(t.label,i)}));J.current=new ht(e,.6),Xe(!0)}catch(e){console.error("Face matcher initialization error:",e)}},[d]),De=r.useCallback(async()=>{var e;if(x!=="ok"){V("Camera permission required");return}K(!0);try{(e=w.current)!=null&&e.srcObject&&(w.current.srcObject.getTracks().forEach(f=>f.stop()),w.current.srcObject=null),Z.current=null;const t=Ye(z,T||void 0),i=await navigator.mediaDevices.getUserMedia(t);w.current&&(w.current.srcObject=i,w.current.onloadedmetadata=()=>{V("Please smile to verify liveliness"),K(!1)})}catch(t){if(console.error("Error starting video:",t),T&&((t==null?void 0:t.name)==="OverconstrainedError"||(t==null?void 0:t.name)==="NotFoundError")){V("Selected camera unavailable — reverting to default"),ye(""),K(!1);return}L("Error accessing camera"),D("error"),K(!1)}},[z,x,T]),Me=r.useCallback(()=>{if(!J.current||!w.current||!I.current||x!=="ok")return;A.current&&clearInterval(A.current);const e=Ge(),t=e==="low"?160:e==="mid"?320:416,i=e==="low"?900:e==="mid"?500:350,m={width:500,height:600},f=I.current;Pt(f,m);const b=(N,P)=>{N!==je.current&&(je.current=N,He(N)),P!==Ce.current&&(Ce.current=P,V(P))},v=async()=>{var N;if(!ce.current){ce.current=!0;try{if(!w.current||!I.current||!J.current)return;const P=await pt(w.current,new _e({inputSize:t,scoreThreshold:.6})).withFaceLandmarks(!0).withFaceDescriptor().withFaceExpressions(),Y=P?[We(P,m)]:[];if(Z.current||(Z.current=f.getContext("2d",{willReadFrequently:!0})),(N=Z.current)==null||N.clearRect(0,0,m.width,m.height),Y.length>0){const Ae=Y.map(ue=>J.current.findBestMatch(ue.descriptor));Nt(f,Y),Ae.forEach((ue,rt)=>{const nt=Y[rt].detection.box;new Ve(nt,{label:ue.toString()}).draw(f)});const Be=Ae[0],ze=Be&&Be.label!=="unknown",tt=Lt(Y[0].expressions);ze&&tt&&(ke.current=Date.now()+4e3),Date.now()<ke.current?b("passed","Nice Smile!😉"):ze?b("pending","Please smile."):b("pending","Face not recognized."),L("Running")}else b("pending","No face detected"),L("Running")}catch(P){console.error("Face detection error:",P)}finally{ce.current=!1}}};A.current=setInterval(v,i)},[x]),le=r.useCallback(e=>{var t;return e!=null&&e.description?(j([{label:e.full_name,descriptors:e.description}]),R([{id:e.full_name,name:e.full_name,position:e.job_title}]),o(!0),((t=e.location)==null?void 0:t.length)>0?(H.current=e.location,Q(e.location)):(M("❌ No office locations configured"),g("error")),!0):!1},[Q]),Te=r.useCallback(async()=>{try{const t=(await de.get("users/userDetails",{headers:{Authorization:`Token ${E.getItem("accessToken")}`}})).data;if(E.setItem("user",JSON.stringify(t)),!le(t))throw new Error("No face description data in API response")}catch(e){if(!(e!=null&&e.response))try{const t=JSON.parse(E.getItem("user")||"null");if(le(t))return}catch{}L(e.message||"Error loading face data"),g("error")}},[le]),et={I:{message:"clocked in",emoji:"🌅"},i:{message:"started break",emoji:"☕"},0:{message:"ended break",emoji:"🍽️"},o:{message:"clocked out",emoji:"🌙"}},ee=r.useCallback(Mt(e=>{const{message:t,emoji:i}=et[e],m=Dt();de.post("checkinoutregion/create/",{CHECKTIME:m,CHECKTYPE:e,VERIFYCODE:s.deptid,SENSORID:0},{headers:{Authorization:`Token ${E.getItem("accessToken")}`}}).then(()=>{const f={I:"Have a great day at work! 💼",i:"Enjoy your break! ☕",0:"Welcome back! 🔋",o:"See you tomorrow! 🌙"};p.fire({title:`${i} Success! ${i}`,html:`
              <div style="text-align: center; margin: 20px 0;">
                <p style="font-size: 18px; margin-bottom: 15px;">
                  You have successfully ${t}! 
                </p>
                <p style="font-size: 16px; color: #10b981; margin-bottom: 10px;">
                  😊 Nice smile, by the way! 😊
                </p>
                <p style="font-size: 14px; color: #666; font-style: italic;">
                  ${f[e]}
                </p>
              </div>
            `,icon:"success",confirmButtonColor:"#3085d6",timer:3e3,showConfirmButton:!1,customClass:{popup:"success-popup",title:"success-title"}}),setTimeout(()=>{a("/regional/user/home"),window.location.reload()},3e3)}).catch(f=>{var b,v;p.fire({icon:"error",title:"❌ Oops! Something went wrong",html:`
              <div style="text-align: center; margin: 20px 0;">
                <p style="font-size: 16px; margin-bottom: 10px;">
                  ${((v=(b=f.response)==null?void 0:b.data)==null?void 0:v.detail)||"An error occurred while processing your request."}
                </p>
                <p style="font-size: 14px; color: #666; font-style: italic;">
                  😔 Don't worry, please try again!
                </p>
              </div>
            `,confirmButtonColor:"#d33",confirmButtonText:"Try Again 🔄"})})},1e3),[s,a]);return r.useEffect(()=>{"serviceWorker"in navigator&&navigator.serviceWorker.register(At).catch(e=>console.warn("Offline model cache unavailable:",e))},[]),r.useEffect(()=>(Te(),Ee(),()=>{var e;if((e=w.current)!=null&&e.srcObject&&(w.current.srcObject.getTracks().forEach(i=>i.stop()),w.current.srcObject=null),A.current&&clearInterval(A.current),O.current&&clearInterval(O.current),_.current&&clearTimeout(_.current),Se.current&&cancelAnimationFrame(Se.current),I.current){const t=I.current.getContext("2d",{willReadFrequently:!0});t&&t.clearRect(0,0,I.current.width,I.current.height)}L("Stopped")}),[Te,Ee]),r.useEffect(()=>{c||Ie()},[c,Ie]),r.useEffect(()=>{var t;if(x!=="ok")return;B();const e=navigator.mediaDevices;return(t=e==null?void 0:e.addEventListener)==null||t.call(e,"devicechange",B),()=>{var i;return(i=e==null?void 0:e.removeEventListener)==null?void 0:i.call(e,"devicechange",B)}},[x,B]),r.useEffect(()=>{c&&l&&d.length>0&&Fe()},[c,l,d.length,Fe]),r.useEffect(()=>(ve&&we&&x==="ok"&&(async()=>(await De(),Me()))(),()=>{A.current&&clearInterval(A.current)}),[ve,we,x,z,T,De,Me]),r.useEffect(()=>{(k==="permission_denied"||U&&U.includes("Location permission required"))&&!ae.current&&(ae.current=!0,Le()),k==="ok"&&(ae.current=!1)},[k,U,Le]),r.useEffect(()=>{let e=null;return(async()=>{try{const i=await navigator.permissions.query({name:"geolocation"});e=i;const m=()=>{i.state==="granted"?(g("ok"),C.current=!0,H.current&&Q(H.current)):i.state==="denied"&&(g("permission_denied"),C.current=!1)};i.onchange=m}catch{}})(),()=>{e&&(e.onchange=null)}},[Q]),n.jsxs("div",{className:"flex-1 h-full overflow-auto bg-background",children:[n.jsx("style",{children:`
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
        `}),n.jsxs("div",{className:"flex-1 flex flex-col items-center justify-center min-h-screen p-6",children:[n.jsxs("div",{className:"text-center mb-12",children:[n.jsx("h1",{className:"text-4xl sm:text-3xl font-bold text-primary mb-2",children:"🔐 Digital Biometric"}),n.jsxs("p",{className:"text-secondary-foreground text-lg",children:["Welcome back, ",n.jsx("span",{className:"font-semibold text-primary",children:s.full_name})]}),n.jsx("p",{className:"text-sm text-secondary-foreground mt-2",children:U})]}),n.jsx("div",{className:"flex w-full justify-center px-4 animate-in fade-in zoom-in-95 duration-500",children:n.jsx("div",{className:"flex flex-col items-center gap-6",children:n.jsxs("div",{className:"relative flex items-center justify-center",children:[n.jsxs("div",{className:"absolute w-[350px] h-[350px] sm:w-[240px] sm:h-[240px] pointer-events-none rounded-full ",children:[n.jsx("div",{className:`absolute inset-0 rounded-full pulse-ring ${h==="Nice Smile!😉"?"ring-2 ring-blue-400":h==="Please smile."?"ring-2 ring-green-500":h==="Face not recognized."?"ring-2 ring-red-500":h==="No face detected"?"ring-2 ring-red-500/80":"ring-2 ring-gray-400/30"}`}),n.jsx("div",{className:`absolute inset-0 rounded-full pulse-ring-alt ${h==="Nice Smile!😉"?"ring-2 ring-blue-400":h==="Please smile."?"ring-2 ring-green-300/70":h==="Face not recognized."?"ring-2 ring-yellow-400/70":h==="No face detected"?"ring-2 ring-red-400/30":"ring-2 ring-gray-300/20"}`}),n.jsx("div",{className:`absolute inset-0 rounded-full pulse-ring-slow ${h==="Nice Smile!😉"?"ring-2 ring-blue-300":h==="Please smile."?"ring-2 ring-green-300/40":h==="Face not recognized."?"ring-2 ring-yellow-300/40":h==="No face detected"?"ring-2 ring-red-400/20":"ring-2 ring-gray-300/10"}`})]}),n.jsxs("div",{className:`flex items-center justify-center w-[400px] h-[400px] sm:w-80 sm:h-80 rounded-full overflow-hidden transition-all duration-300 ${h==="Nice Smile!😉"?"ring-4 ring-blue-500 ring-offset-2 shadow-lg shadow-blue-500/50":h==="Please smile."?"ring-4 ring-green-400 ring-offset-2 shadow-lg shadow-green-500/50":h==="Face not recognized."?"ring-4 ring-yellow-500 ring-offset-2 shadow-lg shadow-yellow-500/50":h==="No face detected"?"ring-4 ring-red-400 ring-offset-2 shadow-lg shadow-red-500/40":"ring-4 ring-gray-400 ring-offset-2"} bg-gradient-to-br from-slate-900 to-slate-800`,style:{clipPath:"circle(50%)"},children:[n.jsx("video",{crossOrigin:"anonymous",ref:w,className:`w-full h-full object-cover transition-opacity duration-300 ease-out ${oe?"opacity-0":"opacity-100"}`,style:{clipPath:"circle(50%)"},autoPlay:!0,muted:!0,playsInline:!0}),n.jsx("canvas",{ref:I,className:"w-full h-full absolute inset-0",style:{clipPath:"circle(50%)"}}),oe&&n.jsx("div",{className:"absolute inset-0 z-10 flex items-center justify-center bg-slate-900/70 backdrop-blur-sm transition-opacity duration-200",children:n.jsxs("div",{className:"flex flex-col items-center gap-2",children:[n.jsx(vt,{className:"w-8 h-8 text-white animate-spin"}),n.jsx("span",{className:"text-xs text-white/80 font-medium",children:"Switching camera…"})]})})]}),n.jsx("div",{className:"absolute flex justify-center translate-y-[190px] sm:translate-y-[140px] w-full ",children:n.jsx("span",{className:`px-4 py-2 backdrop-blur-sm rounded-full text-sm sm:text-xs font-medium transition-all ${pe==="passed"?"bg-blue-500/60 text-green-50 border ":"bg-green-500/60  text-yellow-50 border "}`,children:h})})]})})}),n.jsxs("div",{className:"relative grid grid-cols-3 justify-center w-full mt-20 px-4 gap-4",children:[n.jsxs("div",{className:"flex flex-col gap-2 justify-start max-w-60",children:[n.jsx("p",{className:"text-xs font-semibold text-secondary-foreground uppercase tracking-wide",children:"Status"}),n.jsxs("span",{className:`inline-flex items-center gap-2 px-3 py-1 rounded-full text-sm font-medium ${xe==="Running"?"bg-green-600 text-green-50 border border-green-500":"bg-red-600 text-red-50 border border-red-500"}`,children:[n.jsx("span",{className:"w-2 h-2 rounded-full bg-current animate-pulse"}),xe]})]}),n.jsx("div",{className:"flex flex-col items-center gap-2",children:be.length>1&&n.jsxs(xt,{value:T||"auto",onValueChange:e=>ye(e==="auto"?"":e),disabled:oe,children:[n.jsxs(wt,{className:"h-8 w-40 text-xs gap-1 px-2 text-accent-foreground",children:[n.jsx(Ct,{className:"w-3.5 h-3.5 shrink-0 text-muted-foreground"}),n.jsx(bt,{placeholder:"Camera",className:" text-accent-foreground"})]}),n.jsxs(yt,{className:" text-accent-foreground ",children:[n.jsx($e,{value:"auto",children:"Auto (Front/Back)"}),be.map((e,t)=>n.jsx($e,{className:" text-accent-foreground ",value:e.deviceId,children:e.label||`Camera ${t+1}`},e.deviceId))]})]})}),n.jsxs("div",{className:"flex flex-col gap-2 justify-end text-right",children:[n.jsx("p",{className:"text-xs font-semibold text-secondary-foreground uppercase tracking-wide",children:"Permissions"}),n.jsxs("div",{className:"flex gap-3 justify-end",children:[n.jsxs("button",{onClick:()=>{x!=="ok"&&X()},className:"flex items-center gap-1 px-2 py-1 rounded transition-all hover:bg-white/10 cursor-pointer group",title:x==="ok"?"Camera enabled":"Click to enable camera",children:[n.jsx(kt,{className:`w-4 h-4 transition-all ${x==="ok"?"text-green-500":"text-red-500 group-hover:scale-110"}`}),n.jsx("span",{className:`w-2 h-2 rounded-full transition-all ${x==="ok"?"bg-green-500":"bg-red-500 group-hover:scale-125"}`})]}),n.jsxs("button",{onClick:()=>{k!=="ok"&&q()},className:"flex items-center gap-1 px-2 py-1 rounded transition-all hover:bg-white/10 cursor-pointer group",title:k==="ok"?"Location enabled":"Click to enable location",children:[n.jsx(jt,{className:`w-4 h-4 transition-all ${k==="ok"?"text-green-500":"text-red-500 group-hover:scale-110"}`}),n.jsx("span",{className:`w-2 h-2 rounded-full transition-all ${k==="ok"?"bg-green-500":"bg-red-500 group-hover:scale-125"}`})]})]})]})]})]})]})}function Wt(){const[s,a]=r.useState(null),[l,o]=r.useState(!0),[c,u]=r.useState(60),d=Ue();r.useEffect(()=>{de.get("users/userDetails",{headers:{Authorization:`Token ${E.getItem("accessToken")}`}}).then(S=>{a(S.data)}).finally(()=>o(!1))},[]),r.useEffect(()=>{const S=setInterval(()=>{u(R=>(R<=1&&(d("/regional/user/temp"),window.location.reload()),R-1))},1e3);return()=>clearInterval(S)},[d]);const j=S=>{const R=Math.floor(S/60),k=S%60;return`${R.toString().padStart(2,"0")}:${k.toString().padStart(2,"0")}`};return l?n.jsx("div",{className:"flex h-full w-full justify-center items-center",children:"Loading..."}):!s||!s.description||s.description.length===0?n.jsx("div",{className:"flex-1 h-full flex items-center justify-center",children:n.jsx(Et,{})}):n.jsxs("div",{className:"flex-1 h-full overflow-auto",children:[n.jsxs("div",{className:"fixed bottom-20 right-2 bg-gray-100 px-3 py-1 rounded-md font-mono text-sm z-50",children:[n.jsx("span",{className:" md:hidden",children:"Session Timer:"}),"   ",j(c)]}),n.jsx(St,{}),n.jsx(r.Suspense,{fallback:n.jsx("div",{children:"Loading..."}),children:n.jsx(Bt,{userObject:s})})]})}export{Wt as default};
