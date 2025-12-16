import{o as Ue,a5 as ce,a6 as le,a7 as We,a8 as He,a9 as Fe,aa as Ve,ab as Ge,ac as Je,ad as Xe,ae as Ie,af as Ze,j as n,L as Qe,u as Me,r,S as w,ag as et,z as J,ah as Re,ai as Le,aj as tt,ak as rt,a as de}from"./index-c75f5be5.js";import{D as st}from"./DashboardAnalogClock-4fc29b6e.js";const ot=Ue("RotateCcw",[["path",{d:"M3 12a9 9 0 1 0 9-9 9.75 9.75 0 0 0-6.74 2.74L3 8",key:"1357e3"}],["path",{d:"M3 3v5h5",key:"1xhq8a"}]]);function nt(e,a){var c=Array.isArray(a)?a:[a];c.forEach(function(i){var l=i instanceof ce?i.score:le(i)?i.detection.score:void 0,f=i instanceof ce?i.box:le(i)?i.detection.box:new We(i),h=l?""+He(l):void 0;new Fe(f,{label:h}).draw(e)})}function it(e,a,c){c===void 0&&(c=!1);var i=c?Ve(a):a,l=i.width,f=i.height;return e.width=l,e.height=f,{width:l,height:f}}function Te(e,a){var c=new Ge(a.width,a.height),i=c.width,l=c.height;if(i<=0||l<=0)throw new Error("resizeResults - invalid dimensions: "+JSON.stringify({width:i,height:l}));if(Array.isArray(e))return e.map(function(C){return Te(C,{width:i,height:l})});if(Je(e)){var f=e.detection.forSize(i,l),h=e.unshiftedLandmarks.forSize(f.box.width,f.box.height);return Xe(Ie(e,f),h)}return le(e)?Ie(e,e.detection.forSize(i,l)):e instanceof Ze||e instanceof ce?e.forSize(i,l):e}const at=()=>n.jsx("div",{className:"flex flex-col items-center justify-center h-screen w-full",children:n.jsxs("div",{className:"bg-card border border-border rounded-md p-8 shadow-md flex flex-col items-center",children:[n.jsx("p",{className:"text-2xl font-bold text-primary mb-2",children:"Face Registration Required"}),n.jsx("p",{className:"text-foreground text-center",children:"Please register your face from your profile to use this page."}),n.jsx(Qe,{to:"/regional/user/profile",className:" animate-bounce cursor-pointer text-primary text-xs",children:" View Profile →  Register your Face for Digital Biometric"}),n.jsx("p",{className:" text-xs text-yellow-500 mt-5",children:"*Note: Images won't be saved to the database — your privacy is safe 😊!"})]})}),X="location_permission_granted",Z="camera_permission_granted",De="permissions_explained";function ct(e,a,c,i){const f=(c-e)*Math.PI/180,h=(i-a)*Math.PI/180,C=Math.sin(f/2)*Math.sin(f/2)+Math.cos(e*Math.PI/180)*Math.cos(c*Math.PI/180)*Math.sin(h/2)*Math.sin(h/2);return 6371*(2*Math.atan2(Math.sqrt(C),Math.sqrt(1-C)))}function lt(e){return e.happy>.5}const ue=()=>typeof navigator<"u"&&/android|iphone|ipad|ipod|iemobile|mobile/i.test(navigator.userAgent),Ae=()=>typeof navigator<"u"&&/chrome|crios/i.test(navigator.userAgent)&&!/edg|opr|brave|firefox/i.test(navigator.userAgent),dt=e=>e+(Ae()?.01:0),_e=()=>{try{const e=navigator.deviceMemory??4,a=navigator.hardwareConcurrency??4;return ue()&&(e<=2||a<=4)||e<=2||a<=2?"low":e<=4||a<=4?"mid":"high"}catch{return"mid"}};function ut(e,a,c,i=.08){let l=1/0,f=!1,h="";const C=dt(i);return c.forEach(v=>{const[I,k]=v.split(",").map(y=>parseFloat(y.trim())),g=ct(e,a,I,k);g<=C&&(f=!0),g<l&&(l=g,h=v)}),{isNearby:f,distance:l,nearestLocation:h}}function mt(){const e=new Date,a=e.getFullYear(),c=String(e.getMonth()+1).padStart(2,"0"),i=String(e.getDate()).padStart(2,"0"),l=String(e.getHours()).padStart(2,"0"),f=String(e.getMinutes()).padStart(2,"0"),h=String(e.getSeconds()).padStart(2,"0");return`${a}-${c}-${i}T${l}:${f}:${h}Z`}function ft(e,a){let c;return(...i)=>{clearTimeout(c),c=setTimeout(()=>e(...i),a)}}function ht(e,a){let c;return(...i)=>{c||(e(...i),c=!0,setTimeout(()=>c=!1,a))}}const S={hasStoredPermission:e=>localStorage.getItem(e)==="true",setPermissionStatus:(e,a)=>{localStorage.setItem(e,a.toString())},hasShownExplanation:()=>localStorage.getItem(De)==="true",setExplanationShown:()=>{localStorage.setItem(De,"true")},checkBrowserPermission:async e=>{try{return"permissions"in navigator?(await navigator.permissions.query({name:e})).state:null}catch(a){return console.warn(`Permission check failed for ${e}:`,a),null}}},Q="/regional/models",Ne=e=>{const a=_e();let c={ideal:640,max:1280},i={ideal:480,max:720},l={ideal:15,max:30};return a==="low"?(c={ideal:480,max:640},i={ideal:360,max:480},l={ideal:12,max:24}):a==="mid"?(c={ideal:640,max:960},i={ideal:480,max:540},l={ideal:15,max:30}):(c={ideal:640,max:1280},i={ideal:480,max:720},l={ideal:24,max:30}),{video:{facingMode:e,width:c,height:i,frameRate:l,aspectRatio:1.333}}};function gt({userObject:e}){const a=Me(),[c,i]=r.useState(!1),[l,f]=r.useState(!1),[h,C]=r.useState([]),[v,I]=r.useState([]),[k,g]=r.useState(null),[y,D]=r.useState(null),[$,N]=r.useState(null),[me,q]=r.useState("pending"),[Be,A]=r.useState("Checking permissions..."),[fe,E]=r.useState("Loading..."),[_,ze]=r.useState("user"),[he,ge]=r.useState([]),[pe,Oe]=r.useState(!1),[Y,ee]=r.useState(!1),B=r.useRef(null),j=r.useRef(!1),K=r.useRef(null),te=r.useRef(!1),b=r.useRef(null),R=r.useRef(null),F=r.useRef(),U=r.useRef(null),z=r.useRef(),O=r.useRef(),xe=r.useRef(),L=r.useRef(0),re=me==="passed"&&j.current&&y==="ok"&&B.current===!0,we=r.useCallback(()=>{if(!Y&&!(Date.now()<L.current)){try{if(w.isVisible&&w.isVisible())return}catch{}ee(!0),w.fire({title:"Biometric Actions",html:`
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
    `,showConfirmButton:!1,showCancelButton:!1,allowOutsideClick:!1,allowEscapeKey:!1,position:"center",toast:!1,timer:6e3,timerProgressBar:!0,width:"420px",background:"#fff",customClass:{popup:"floating-menu-popup",timerProgressBar:"floating-menu-timer"},didOpen:()=>{var t,o,s,d;(t=document.getElementById("time-in-btn"))==null||t.addEventListener("click",()=>{L.current=Date.now()+3e3,V("I"),w.close()}),(o=document.getElementById("break-in-btn"))==null||o.addEventListener("click",()=>{L.current=Date.now()+3e3,V("i"),w.close()}),(s=document.getElementById("break-out-btn"))==null||s.addEventListener("click",()=>{L.current=Date.now()+3e3,V("0"),w.close()}),(d=document.getElementById("time-out-btn"))==null||d.addEventListener("click",()=>{L.current=Date.now()+3e3,V("o"),w.close()})},willClose:()=>{L.current=Math.max(L.current,Date.now()+3e3),ee(!1)}}),O.current=setTimeout(()=>{w.close(),ee(!1)},4e3)}},[Y]);r.useEffect(()=>(re&&!Y&&Date.now()>=L.current&&(!w.isVisible||!w.isVisible())&&we(),()=>{O.current&&clearTimeout(O.current)}),[re,Y,we]);const ye=r.useCallback(()=>{S.hasShownExplanation()?be():w.fire({title:"Permission Setup Required",html:`
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
          `,icon:"info",confirmButtonText:"Grant Permissions",confirmButtonColor:"#3085d6",allowOutsideClick:!1,allowEscapeKey:!1}).then(()=>{S.setExplanationShown(),be()})},[]),be=r.useCallback(async()=>{E("Checking permissions...");const t=S.hasStoredPermission(Z),o=S.hasStoredPermission(X),s=await S.checkBrowserPermission("camera"),d=await S.checkBrowserPermission("geolocation");t&&s==="granted"?D("ok"):s==="denied"?(D("permission_denied"),S.setPermissionStatus(Z,!1)):await se(),o&&d==="granted"?(g("ok"),j.current=!0):d==="denied"?(g("permission_denied"),j.current=!1,S.setPermissionStatus(X,!1)):await W(),Oe(!0)},[]),se=r.useCallback(async()=>{D("checking");try{const t=Ne(_),o=await navigator.mediaDevices.getUserMedia(t);D("ok"),S.setPermissionStatus(Z,!0),o.getTracks().forEach(s=>s.stop())}catch(t){t.name==="NotAllowedError"||t.name==="PermissionDeniedError"?(D("permission_denied"),S.setPermissionStatus(Z,!1),$e()):(D("error"),console.error("Camera access error:",t))}},[_]),oe=r.useCallback(()=>{const t=window.location.origin,o=navigator.userAgent.toLowerCase(),s=o.includes("edg"),d=o.includes("firefox"),m=/android|iphone|ipad|ipod/i.test(o),p=(o.includes("chrome")||o.includes("crios"))&&!s&&!o.includes("opr");let x=null;if(!m&&(p||s)?x=`${s?"edge":"chrome"}://settings/content/siteDetails?site=${encodeURIComponent(t)}`:!m&&d&&(x="about:preferences#privacy"),x)try{window.open(x,"_blank")}catch{}const u=m?`<ol style="text-align:left; padding-left: 20px;">
            <li>Tap the lock icon in the address bar</li>
            <li>Permissions ➜ Location</li>
            <li>Choose "Allow while using"</li>
          </ol>`:`<p>In Site Settings, set Location to <strong>Allow</strong> for ${t}, then return here.</p>`;w.fire({icon:"info",title:"Enable location for this site",html:u,confirmButtonText:"Reload Page",allowOutsideClick:!1,allowEscapeKey:!1}).then(()=>window.location.reload())},[]),W=r.useCallback(async()=>(g("checking"),navigator.geolocation?new Promise(t=>{navigator.geolocation.getCurrentPosition(o=>{g("ok"),j.current=!0,S.setPermissionStatus(X,!0),t("granted")},o=>{o.code===o.PERMISSION_DENIED?(g("permission_denied"),j.current=!1,S.setPermissionStatus(X,!1),ne(),t("denied")):(g("error"),j.current=!1,console.error("Location access error:",o),t("error"))},{enableHighAccuracy:!1,timeout:1e4,maximumAge:0})}):(g("error"),N("❌ Geolocation not supported"),j.current=!1,"error")),[]),$e=r.useCallback(()=>{w.fire({title:"Camera Permission Required",html:`
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
        `,icon:"warning",confirmButtonText:"Try Again",showCancelButton:!0,cancelButtonText:"Skip",confirmButtonColor:"#3085d6"}).then(t=>{t.isConfirmed&&se()})},[se]),ne=r.useCallback(()=>{w.fire({title:"Location Permission Required",html:`
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
        `,icon:"warning",confirmButtonText:"Grant Location Access",showCancelButton:!1,confirmButtonColor:"#3085d6"}).then(t=>{t.isConfirmed?S.checkBrowserPermission("geolocation").then(o=>{o==="denied"?oe():W().finally(()=>window.location.reload())}).catch(()=>W().finally(()=>window.location.reload())):t.isDenied&&oe()})},[W,oe]),H=r.useCallback(ht(t=>{if(K.current=t,!j.current){N("❌ Location permission required"),g("permission_denied");return}const o=()=>{if(!navigator.geolocation){N("❌ Geolocation not supported"),g("error");return}navigator.geolocation.getCurrentPosition(s=>{const{latitude:d,longitude:m}=s.coords,{isNearby:p,distance:x}=ut(d,m,t);B.current=p;const u=p?`✅ Within office range! (${x.toFixed(2)} km)`:`❌ Outside office range (${x.toFixed(2)} km from nearest office)`;N(u),g("ok")},s=>{if(console.error("Location error:",s),B.current!==null){const d=B.current?"✅ Within office range! (checking...)":"❌ Outside office range (checking...)";N(m=>!m||m.includes("Location permission required")||m.includes("Location access failed")?d:m)}else N("❌ Location access failed"),g("error")},{enableHighAccuracy:ue()||Ae(),timeout:ue()?2e4:1e4,maximumAge:0})};z.current&&clearInterval(z.current),o(),z.current=setInterval(o,45e3)},15e3),[]),Se=r.useCallback(async()=>{if(l)return;const t="faceapi_models_cached",o="faceapi_cache_timestamp",s=7*24*60*60*1e3;try{E("Loading models...");const d=localStorage.getItem(o);d&&Date.now()-parseInt(d)<s||(localStorage.removeItem(t),localStorage.removeItem(o));try{const u=et;u!=null&&u.setBackend&&(await u.setBackend("webgl"),u!=null&&u.ready&&await u.ready())}catch{}const p=async(u,P,M=2)=>{for(let T=0;T<M;T++)try{return E(`Loading ${P}... (${T+1}/${M})`),await u(),!0}catch(ie){console.error(`Failed to load ${P}, attempt ${T+1}:`,ie),T<M-1&&await new Promise(G=>setTimeout(G,Math.pow(2,T)*1e3))}return!1},x=await Promise.all([p(()=>J.tinyFaceDetector.loadFromUri(Q),"Face Detector"),p(()=>J.faceRecognitionNet.loadFromUri(Q),"Face Recognition")]);if(await Promise.all([p(()=>J.faceLandmark68TinyNet.loadFromUri(Q),"Landmarks"),p(()=>J.faceExpressionNet.loadFromUri(Q),"Expressions")]),!x.every(Boolean))throw new Error("Failed to load critical models");E("Optimizing models...");try{const u=document.createElement("canvas");u.width=128,u.height=128;const P=u.getContext("2d");P==null||P.fillRect(0,0,1,1),await Re(u,new Le({inputSize:160,scoreThreshold:.9})).withFaceLandmarks(!0).withFaceDescriptors().withFaceExpressions()}catch(u){console.warn("Warm-up pass failed (non-critical):",u)}localStorage.setItem(t,"true"),localStorage.setItem(o,Date.now().toString()),f(!0),E("AI is going to be ready soon...")}catch(d){console.error("Model loading error:",d),E("Error loading models - Please refresh")}},[l]),ve=r.useCallback(async()=>{try{const t=await Promise.all(h.map(o=>{const s=o.descriptors.map(d=>new Float32Array(d));return new tt(o.label,s)}));U.current=new rt(t,.6)}catch(t){console.error("Face matcher initialization error:",t)}},[h]),ke=r.useCallback(async()=>{var t;if(y!=="ok"){A("Camera permission required");return}try{(t=b.current)!=null&&t.srcObject&&(b.current.srcObject.getTracks().forEach(m=>m.stop()),b.current.srcObject=null);const o=Ne(_),s=await navigator.mediaDevices.getUserMedia(o);b.current&&(b.current.srcObject=s,b.current.onloadedmetadata=()=>{A("Please smile to verify liveliness")})}catch(o){console.error("Error starting video:",o),E("Error accessing camera"),D("error")}},[_,y]),Ce=r.useCallback(()=>{if(!U.current||!b.current||!R.current||y!=="ok")return;F.current&&clearInterval(F.current);const t=_e(),o=t==="low"?224:t==="mid"?320:416,s=t==="low"?700:t==="mid"?500:350,d=async()=>{try{if(!b.current||!R.current||!U.current)return;const m=await Re(b.current,new Le({inputSize:o,scoreThreshold:.6})).withFaceLandmarks(!0).withFaceDescriptors().withFaceExpressions(),p=R.current,x={width:500,height:600};it(p,x);const u=Te(m,x),P=p.getContext("2d",{willReadFrequently:!0});if(P&&P.clearRect(0,0,x.width,x.height),u.length>0){const M=u.map(ae=>U.current.findBestMatch(ae.descriptor));nt(p,u),M.forEach((ae,Ye)=>{const Ke=u[Ye].detection.box;new Fe(Ke,{label:ae.toString()}).draw(p)});const ie=u[0].expressions,G=M[0],je=G&&G.label!=="unknown",Pe=lt(ie);je&&Pe?(q("passed"),A("Nice Smile!😉")):je&&!Pe?(q("pending"),A("Please smile.")):(q("pending"),A("Face not recognized.")),ge(M),E("Running")}else q("pending"),A("No face detected"),ge([])}catch(m){console.error("Face detection error:",m)}};F.current=setInterval(d,s)},[y]),Ee=r.useCallback(async()=>{var t;try{const s=(await de.get("users/userDetails",{headers:{Authorization:`Token ${localStorage.getItem("accessToken")}`}})).data;if(localStorage.setItem("user",JSON.stringify(s)),!(s!=null&&s.description))throw new Error("No face description data in API response");C([{label:s.full_name,descriptors:s.description}]),I([{id:s.full_name,name:s.full_name,position:s.job_title}]),i(!0),((t=s.location)==null?void 0:t.length)>0?(K.current=s.location,H(s.location)):(N("❌ No office locations configured"),g("error"))}catch(o){E(o.message||"Error loading face data"),g("error")}},[H]),qe={I:{message:"clocked in",emoji:"🌅"},i:{message:"started break",emoji:"☕"},0:{message:"ended break",emoji:"🍽️"},o:{message:"clocked out",emoji:"🌙"}},V=r.useCallback(ft(t=>{const{message:o,emoji:s}=qe[t],d=mt();de.post("checkinoutregion/create/",{CHECKTIME:d,CHECKTYPE:t,VERIFYCODE:e.deptid,SENSORID:e.deptid},{headers:{Authorization:`Token ${localStorage.getItem("accessToken")}`}}).then(()=>{const m={I:"Have a great day at work! 💼",i:"Enjoy your break! ☕",0:"Welcome back! 🔋",o:"See you tomorrow! 🌙"};w.fire({title:`${s} Success! ${s}`,html:`
              <div style="text-align: center; margin: 20px 0;">
                <p style="font-size: 18px; margin-bottom: 15px;">
                  You have successfully ${o}! 
                </p>
                <p style="font-size: 16px; color: #10b981; margin-bottom: 10px;">
                  😊 Nice smile, by the way! 😊
                </p>
                <p style="font-size: 14px; color: #666; font-style: italic;">
                  ${m[t]}
                </p>
              </div>
            `,icon:"success",confirmButtonColor:"#3085d6",timer:3e3,showConfirmButton:!1,customClass:{popup:"success-popup",title:"success-title"}}),setTimeout(()=>{a("/regional/user/home"),window.location.reload()},3e3)}).catch(m=>{var p,x;w.fire({icon:"error",title:"❌ Oops! Something went wrong",html:`
              <div style="text-align: center; margin: 20px 0;">
                <p style="font-size: 16px; margin-bottom: 10px;">
                  ${((x=(p=m.response)==null?void 0:p.data)==null?void 0:x.detail)||"An error occurred while processing your request."}
                </p>
                <p style="font-size: 14px; color: #666; font-style: italic;">
                  😔 Don't worry, please try again!
                </p>
              </div>
            `,confirmButtonColor:"#d33",confirmButtonText:"Try Again 🔄"})})},1e3),[e,a]);return r.useEffect(()=>(Ee(),ye(),()=>{var t;if((t=b.current)!=null&&t.srcObject&&(b.current.srcObject.getTracks().forEach(s=>s.stop()),b.current.srcObject=null),F.current&&clearInterval(F.current),z.current&&clearInterval(z.current),O.current&&clearTimeout(O.current),xe.current&&cancelAnimationFrame(xe.current),R.current){const o=R.current.getContext("2d",{willReadFrequently:!0});o&&o.clearRect(0,0,R.current.width,R.current.height)}E("Stopped")}),[Ee,ye]),r.useEffect(()=>{l||Se()},[l,Se]),r.useEffect(()=>(l&&c&&h.length>0&&pe&&y==="ok"&&(async()=>(await ve(),await ke(),Ce()))(),()=>{F.current&&clearInterval(F.current)}),[l,c,h.length,pe,y,_,ve,ke,Ce]),r.useEffect(()=>{(k==="permission_denied"||$&&$.includes("Location permission required"))&&!te.current&&(te.current=!0,ne()),k==="ok"&&(te.current=!1)},[k,$,ne]),r.useEffect(()=>{let t=null;return(async()=>{try{const s=await navigator.permissions.query({name:"geolocation"});t=s;const d=()=>{s.state==="granted"?(g("ok"),j.current=!0,K.current&&H(K.current)):s.state==="denied"&&(g("permission_denied"),j.current=!1)};s.onchange=d}catch{}})(),()=>{t&&(t.onchange=null)}},[H]),n.jsx("div",{className:"flex-1 h-full overflow-auto",children:n.jsxs("div",{className:"flex-1 items-center mt-20 justify-between",children:[n.jsxs("div",{children:[n.jsxs("p",{className:"animate-pulse ml-4 text-2xl text-primary",children:["Hello, ",e.full_name,"! 👋"]}),n.jsxs("p",{className:"ml-4 text-sm italic text-foreground",children:["You are currently ",n.jsx("span",{children:$})]}),n.jsxs("div",{className:"ml-4 mt-2 flex gap-4 text-xs",children:[n.jsxs("span",{className:`flex items-center gap-1 ${y==="ok"?"text-green-600":y==="permission_denied"?"text-red-600":"text-yellow-600"}`,children:["📷 Camera: ",y==="ok"?"✅ Active":y==="permission_denied"?"❌ Denied":y==="checking"?"⏳ Checking...":"⚠️ Error"]}),n.jsxs("span",{className:`flex items-center gap-1 ${k==="ok"?"text-green-600":k==="permission_denied"?"text-red-600":"text-yellow-600"}`,children:["📍 Location: ",k==="ok"?"✅ Active":k==="permission_denied"?"❌ Denied":k==="checking"?"⏳ Checking...":"⚠️ Error"]})]})]}),n.jsxs("div",{className:"flex flex-col items-center justify-center mt-2",children:[n.jsx("p",{className:"text-2xl font-bold sm:text-base text-primary",children:"Digital Biometric"}),n.jsx("p",{className:"text-secondary-foreground text-sm mt-2",children:"Please Smile🙂 To enable the Clock In/Out Button"}),n.jsx("div",{className:"flex w-full justify-center mt-2",children:n.jsx("div",{className:re?"flex self-center w-[80%] sm:w-[90%] sm:h-[40vh] h-[50vh] bg-border border border-5 border-green-500 rounded-md":"flex self-center w-[80%] sm:w-[90%] sm:h-[40vh] h-[50vh] bg-border border rounded-md",children:n.jsx("div",{className:B.current?"flex flex-col gap-5 items-center justify-center h-full w-full relative border border-green-500 rounded-sm ":"flex flex-col gap-5 items-center justify-center h-full w-full relative border border-red-500 rounded-sm ",children:n.jsxs("div",{className:"overflow-hidden w-full max-w-[500px] h-[500px] relative flex",children:[n.jsx("div",{className:"ml-2 mt-5 absolute gap-2 text-primary col-span-1 flex flex-col",children:he&&he.map((t,o)=>{const s=v.find(d=>d.id===t._label);return n.jsxs("div",{className:"text-sm bg-card/50 backdrop-blur-md p-2 rounded-md",children:[n.jsx("h3",{children:s?s.name:"Unknown"}),n.jsx("p",{children:s?s.position:"Unrecognized Person"})]},o)})}),n.jsx("video",{crossOrigin:"anonymous",ref:b,className:"w-full h-full rounded-md",autoPlay:!0,muted:!0,playsInline:!0}),n.jsx("canvas",{ref:R,className:"w-full h-full absolute"})]})})})}),n.jsxs("div",{className:"relative grid grid-cols-3 justify-center w-[80%] items-center h-full",children:[n.jsxs("p",{className:"relative bottom-0 left-0 p-4 z-[999] justify-start justify-self-start sm:text-sm text-secondary-foreground",children:["Status:  ",n.jsx("span",{className:fe==="Running"?"justify-end justify-self-end z-[999] text-green-600":"text-red-500 justify-end z-[999] justify-self-end",children:fe})]}),n.jsx(ot,{className:_==="user"?"cursor-pointer m-5 text-foreground justify-center self-center justify-self-center rotate-180 transition-all duration-700 col-span-1":"justify-center self-center justify-self-center cursor-pointer m-5 text-foreground col-span-1 rotate-0 transition-all duration-700",onClick:()=>ze(t=>t==="user"?"environment":"user")}),n.jsx("span",{className:me==="passed"?"text-green-600 sm:text-sm justify-self-end":"text-yellow-600 sm:text-sm justify-self-end",children:Be})]})]})]})})}function wt(){const[e,a]=r.useState(null),[c,i]=r.useState(!0),[l,f]=r.useState(60),h=Me();r.useEffect(()=>{de.get("users/userDetails",{headers:{Authorization:`Token ${localStorage.getItem("accessToken")}`}}).then(v=>{a(v.data)}).finally(()=>i(!1))},[]),r.useEffect(()=>{const v=setInterval(()=>{f(I=>(I<=1&&(h("/regional/user/temp"),window.location.reload()),I-1))},1e3);return()=>clearInterval(v)},[h]);const C=v=>{const I=Math.floor(v/60),k=v%60;return`${I.toString().padStart(2,"0")}:${k.toString().padStart(2,"0")}`};return c?n.jsx("div",{className:"flex h-full w-full justify-center items-center",children:"Loading..."}):!e||!e.description||e.description.length===0?n.jsx("div",{className:"flex-1 h-full flex items-center justify-center",children:n.jsx(at,{})}):n.jsxs("div",{className:"flex-1 h-full overflow-auto",children:[n.jsxs("div",{className:"fixed bottom-20 right-2 bg-gray-100 px-3 py-1 rounded-md font-mono text-sm z-50",children:[n.jsx("span",{className:" md:hidden",children:"Session Timer:"}),"   ",C(l)]}),n.jsx(st,{}),n.jsx(gt,{userObject:e})]})}export{wt as default};
