import{o as Ue,a5 as oe,a6 as ie,a7 as Ke,a8 as We,a9 as Ne,aa as Ve,ab as He,ac as Ge,ad as Je,ae as Ee,af as Xe,j as o,L as Ze,u as De,r,S as g,ag as Qe,z as W,ah as Pe,ai as Re,aj as et,ak as tt,a as ae}from"./index-95c36ae7.js";import{D as rt}from"./DashboardAnalogClock-23547ae4.js";const st=Ue("RotateCcw",[["path",{d:"M3 12a9 9 0 1 0 9-9 9.75 9.75 0 0 0-6.74 2.74L3 8",key:"1357e3"}],["path",{d:"M3 3v5h5",key:"1xhq8a"}]]);function nt(t,a){var c=Array.isArray(a)?a:[a];c.forEach(function(i){var l=i instanceof oe?i.score:ie(i)?i.detection.score:void 0,u=i instanceof oe?i.box:ie(i)?i.detection.box:new Ke(i),f=l?""+We(l):void 0;new Ne(u,{label:f}).draw(t)})}function ot(t,a,c){c===void 0&&(c=!1);var i=c?Ve(a):a,l=i.width,u=i.height;return t.width=l,t.height=u,{width:l,height:u}}function Fe(t,a){var c=new He(a.width,a.height),i=c.width,l=c.height;if(i<=0||l<=0)throw new Error("resizeResults - invalid dimensions: "+JSON.stringify({width:i,height:l}));if(Array.isArray(t))return t.map(function(k){return Fe(k,{width:i,height:l})});if(Ge(t)){var u=t.detection.forSize(i,l),f=t.unshiftedLandmarks.forSize(u.box.width,u.box.height);return Je(Ee(t,u),f)}return ie(t)?Ee(t,t.detection.forSize(i,l)):t instanceof Xe||t instanceof oe?t.forSize(i,l):t}const it=()=>o.jsx("div",{className:"flex flex-col items-center justify-center h-screen w-full",children:o.jsxs("div",{className:"bg-card border border-border rounded-md p-8 shadow-md flex flex-col items-center",children:[o.jsx("p",{className:"text-2xl font-bold text-primary mb-2",children:"Face Registration Required"}),o.jsx("p",{className:"text-foreground text-center",children:"Please register your face from your profile to use this page."}),o.jsx(Ze,{to:"/regional/user/profile",className:" animate-bounce cursor-pointer text-primary text-xs",children:" View Profile →  Register your Face for Digital Biometric"}),o.jsx("p",{className:" text-xs text-yellow-500 mt-5",children:"*Note: Images won't be saved to the database — your privacy is safe 😊!"})]})}),V="location_permission_granted",H="camera_permission_granted",Ie="permissions_explained";function at(t,a,c,i){const u=(c-t)*Math.PI/180,f=(i-a)*Math.PI/180,k=Math.sin(u/2)*Math.sin(u/2)+Math.cos(t*Math.PI/180)*Math.cos(c*Math.PI/180)*Math.sin(f/2)*Math.sin(f/2);return 6371*(2*Math.atan2(Math.sqrt(k),Math.sqrt(1-k)))}function ct(t){return t.happy>.5}const ce=()=>typeof navigator<"u"&&/android|iphone|ipad|ipod|iemobile|mobile/i.test(navigator.userAgent),Me=()=>typeof navigator<"u"&&/chrome|crios/i.test(navigator.userAgent)&&!/edg|opr|brave|firefox/i.test(navigator.userAgent),lt=t=>t+(Me()?.01:0),Te=()=>{try{const t=navigator.deviceMemory??4,a=navigator.hardwareConcurrency??4;return ce()&&(t<=2||a<=4)||t<=2||a<=2?"low":t<=4||a<=4?"mid":"high"}catch{return"mid"}};function dt(t,a,c,i=.3){let l=1/0,u=!1,f="";const k=lt(i);return c.forEach(v=>{const[E,S]=v.split(",").map(x=>parseFloat(x.trim())),h=at(t,a,E,S);h<=k&&(u=!0),h<l&&(l=h,f=v)}),{isNearby:u,distance:l,nearestLocation:f}}function ut(){const t=new Date,a=t.getFullYear(),c=String(t.getMonth()+1).padStart(2,"0"),i=String(t.getDate()).padStart(2,"0"),l=String(t.getHours()).padStart(2,"0"),u=String(t.getMinutes()).padStart(2,"0"),f=String(t.getSeconds()).padStart(2,"0");return`${a}-${c}-${i}T${l}:${u}:${f}Z`}function mt(t,a){let c;return(...i)=>{clearTimeout(c),c=setTimeout(()=>t(...i),a)}}function ft(t,a){let c;return(...i)=>{c||(t(...i),c=!0,setTimeout(()=>c=!1,a))}}const b={hasStoredPermission:t=>localStorage.getItem(t)==="true",setPermissionStatus:(t,a)=>{localStorage.setItem(t,a.toString())},hasShownExplanation:()=>localStorage.getItem(Ie)==="true",setExplanationShown:()=>{localStorage.setItem(Ie,"true")},checkBrowserPermission:async t=>{try{return"permissions"in navigator?(await navigator.permissions.query({name:t})).state:null}catch(a){return console.warn(`Permission check failed for ${t}:`,a),null}}},G="/regional/models",Le=t=>{const a=Te();let c={ideal:640,max:1280},i={ideal:480,max:720},l={ideal:15,max:30};return a==="low"?(c={ideal:480,max:640},i={ideal:360,max:480},l={ideal:12,max:24}):a==="mid"?(c={ideal:640,max:960},i={ideal:480,max:540},l={ideal:15,max:30}):(c={ideal:640,max:1280},i={ideal:480,max:720},l={ideal:24,max:30}),{video:{facingMode:t,width:c,height:i,frameRate:l,aspectRatio:1.333}}};function ht({userObject:t}){const a=De(),[c,i]=r.useState(!1),[l,u]=r.useState(!1),[f,k]=r.useState([]),[v,E]=r.useState([]),[S,h]=r.useState(null),[x,I]=r.useState(null),[z,L]=r.useState(null),[le,_]=r.useState("pending"),[Ae,F]=r.useState("Checking permissions..."),[de,N]=r.useState("Loading..."),[M,Be]=r.useState("user"),[ue,me]=r.useState([]),[fe,ze]=r.useState(!1),[O,J]=r.useState(!1),T=r.useRef(null),C=r.useRef(!1),$=r.useRef(null),X=r.useRef(!1),w=r.useRef(null),P=r.useRef(null),D=r.useRef(),q=r.useRef(null),A=r.useRef(),B=r.useRef(),he=r.useRef(),R=r.useRef(0),Z=le==="passed"&&C.current&&x==="ok"&&T.current===!0,ge=r.useCallback(()=>{if(!O&&!(Date.now()<R.current)){try{if(g.isVisible&&g.isVisible())return}catch{}J(!0),g.fire({title:"Biometric Actions",html:`
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
    `,showConfirmButton:!1,showCancelButton:!1,allowOutsideClick:!1,allowEscapeKey:!1,position:"center",toast:!1,timer:6e3,timerProgressBar:!0,width:"420px",background:"#fff",customClass:{popup:"floating-menu-popup",timerProgressBar:"floating-menu-timer"},didOpen:()=>{var e,s,n,d;(e=document.getElementById("time-in-btn"))==null||e.addEventListener("click",()=>{R.current=Date.now()+3e3,K("I"),g.close()}),(s=document.getElementById("break-in-btn"))==null||s.addEventListener("click",()=>{R.current=Date.now()+3e3,K("i"),g.close()}),(n=document.getElementById("break-out-btn"))==null||n.addEventListener("click",()=>{R.current=Date.now()+3e3,K("0"),g.close()}),(d=document.getElementById("time-out-btn"))==null||d.addEventListener("click",()=>{R.current=Date.now()+3e3,K("o"),g.close()})},willClose:()=>{R.current=Math.max(R.current,Date.now()+3e3),J(!1)}}),B.current=setTimeout(()=>{g.close(),J(!1)},4e3)}},[O]);r.useEffect(()=>(Z&&!O&&Date.now()>=R.current&&(!g.isVisible||!g.isVisible())&&ge(),()=>{B.current&&clearTimeout(B.current)}),[Z,O,ge]);const pe=r.useCallback(()=>{b.hasShownExplanation()?xe():g.fire({title:"Permission Setup Required",html:`
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
          `,icon:"info",confirmButtonText:"Grant Permissions",confirmButtonColor:"#3085d6",allowOutsideClick:!1,allowEscapeKey:!1}).then(()=>{b.setExplanationShown(),xe()})},[]),xe=r.useCallback(async()=>{N("Checking permissions...");const e=b.hasStoredPermission(H),s=b.hasStoredPermission(V),n=await b.checkBrowserPermission("camera"),d=await b.checkBrowserPermission("geolocation");e&&n==="granted"?I("ok"):n==="denied"?(I("permission_denied"),b.setPermissionStatus(H,!1)):await Q(),s&&d==="granted"?(h("ok"),C.current=!0):d==="denied"?(h("permission_denied"),C.current=!1,b.setPermissionStatus(V,!1)):await Y(),ze(!0)},[]),Q=r.useCallback(async()=>{I("checking");try{const e=Le(M),s=await navigator.mediaDevices.getUserMedia(e);I("ok"),b.setPermissionStatus(H,!0),s.getTracks().forEach(n=>n.stop())}catch(e){e.name==="NotAllowedError"||e.name==="PermissionDeniedError"?(I("permission_denied"),b.setPermissionStatus(H,!1),_e()):(I("error"),console.error("Camera access error:",e))}},[M]),ee=r.useCallback(()=>{const e=window.location.origin,s=navigator.userAgent.toLowerCase(),n=s.includes("edg"),d=s.includes("firefox"),m=/android|iphone|ipad|ipod/i.test(s),y=(s.includes("chrome")||s.includes("crios"))&&!n&&!s.includes("opr");let p=null;if(!m&&(y||n)?p=`${n?"edge":"chrome"}://settings/content/siteDetails?site=${encodeURIComponent(e)}`:!m&&d&&(p="about:preferences#privacy"),p)try{window.open(p,"_blank")}catch{}const j=m?`<ol style="text-align:left; padding-left: 20px;">
            <li>Tap the lock icon in the address bar</li>
            <li>Permissions ➜ Location</li>
            <li>Choose "Allow while using"</li>
          </ol>`:`<p>In Site Settings, set Location to <strong>Allow</strong> for ${e}, then return here.</p>`;g.fire({icon:"info",title:"Enable location for this site",html:j,confirmButtonText:"Reload Page",allowOutsideClick:!1,allowEscapeKey:!1}).then(()=>window.location.reload())},[]),Y=r.useCallback(async()=>(h("checking"),navigator.geolocation?new Promise(e=>{navigator.geolocation.getCurrentPosition(s=>{h("ok"),C.current=!0,b.setPermissionStatus(V,!0),e("granted")},s=>{s.code===s.PERMISSION_DENIED?(h("permission_denied"),C.current=!1,b.setPermissionStatus(V,!1),te(),e("denied")):(h("error"),C.current=!1,console.error("Location access error:",s),e("error"))},{enableHighAccuracy:!1,timeout:1e4,maximumAge:0})}):(h("error"),L("❌ Geolocation not supported"),C.current=!1,"error")),[]),_e=r.useCallback(()=>{g.fire({title:"Camera Permission Required",html:`
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
        `,icon:"warning",confirmButtonText:"Try Again",showCancelButton:!0,cancelButtonText:"Skip",confirmButtonColor:"#3085d6"}).then(e=>{e.isConfirmed&&Q()})},[Q]),te=r.useCallback(()=>{g.fire({title:"Location Permission Required",html:`
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
        `,icon:"warning",confirmButtonText:"Grant Location Access",showCancelButton:!1,confirmButtonColor:"#3085d6"}).then(e=>{e.isConfirmed?b.checkBrowserPermission("geolocation").then(s=>{s==="denied"?ee():Y().finally(()=>window.location.reload())}).catch(()=>Y().finally(()=>window.location.reload())):e.isDenied&&ee()})},[Y,ee]),U=r.useCallback(ft(e=>{if($.current=e,!C.current){L("❌ Location permission required"),h("permission_denied");return}const s=()=>{if(!navigator.geolocation){L("❌ Geolocation not supported"),h("error");return}navigator.geolocation.getCurrentPosition(n=>{const{latitude:d,longitude:m}=n.coords,{isNearby:y,distance:p}=dt(d,m,e);T.current=y;const j=y?`✅ Within office range! (${p.toFixed(2)} km)`:`❌ Outside office range (${p.toFixed(2)} km from nearest office)`;L(j),h("ok")},n=>{if(console.error("Location error:",n),T.current!==null){const d=T.current?"✅ Within office range! (checking...)":"❌ Outside office range (checking...)";L(m=>!m||m.includes("Location permission required")||m.includes("Location access failed")?d:m)}else L("❌ Location access failed"),h("error")},{enableHighAccuracy:ce()||Me(),timeout:ce()?2e4:1e4,maximumAge:0})};A.current&&clearInterval(A.current),s(),A.current=setInterval(s,45e3)},15e3),[]),we=r.useCallback(async()=>{if(!l)try{N("Loading models...");try{const e=Qe;e!=null&&e.setBackend&&(await e.setBackend("webgl"),e!=null&&e.ready&&await e.ready())}catch{}await Promise.all([W.tinyFaceDetector.loadFromUri(G),W.faceLandmark68TinyNet.loadFromUri(G),W.faceRecognitionNet.loadFromUri(G),W.faceExpressionNet.loadFromUri(G)]);try{const e=document.createElement("canvas");e.width=128,e.height=128;const s=e.getContext("2d");s==null||s.fillRect(0,0,1,1),await Pe(e,new Re({inputSize:160,scoreThreshold:.9})).withFaceLandmarks(!0).withFaceDescriptors().withFaceExpressions()}catch{}u(!0)}catch{N("Error loading models")}},[l]),ye=r.useCallback(async()=>{try{const e=await Promise.all(f.map(s=>{const n=s.descriptors.map(d=>new Float32Array(d));return new et(s.label,n)}));q.current=new tt(e,.6)}catch(e){console.error("Face matcher initialization error:",e)}},[f]),be=r.useCallback(async()=>{var e;if(x!=="ok"){F("Camera permission required");return}try{(e=w.current)!=null&&e.srcObject&&(w.current.srcObject.getTracks().forEach(m=>m.stop()),w.current.srcObject=null);const s=Le(M),n=await navigator.mediaDevices.getUserMedia(s);w.current&&(w.current.srcObject=n,w.current.onloadedmetadata=()=>{F("Please smile to verify liveliness")})}catch(s){console.error("Error starting video:",s),N("Error accessing camera"),I("error")}},[M,x]),ve=r.useCallback(()=>{if(!q.current||!w.current||!P.current||x!=="ok")return;D.current&&clearInterval(D.current);const e=Te(),s=e==="low"?224:e==="mid"?320:416,n=e==="low"?700:e==="mid"?500:350,d=async()=>{try{if(!w.current||!P.current||!q.current)return;const m=await Pe(w.current,new Re({inputSize:s,scoreThreshold:.6})).withFaceLandmarks(!0).withFaceDescriptors().withFaceExpressions(),y=P.current,p={width:500,height:600};ot(y,p);const j=Fe(m,p),re=y.getContext("2d",{willReadFrequently:!0});if(re&&re.clearRect(0,0,p.width,p.height),j.length>0){const se=j.map(ne=>q.current.findBestMatch(ne.descriptor));nt(y,j),se.forEach((ne,qe)=>{const Ye=j[qe].detection.box;new Ne(Ye,{label:ne.toString()}).draw(y)});const $e=j[0].expressions,ke=se[0],Ce=ke&&ke.label!=="unknown",je=ct($e);Ce&&je?(_("passed"),F("Nice Smile!😉")):Ce&&!je?(_("pending"),F("Please smile.")):(_("pending"),F("Face not recognized.")),me(se),N("Running")}else _("pending"),F("No face detected"),me([])}catch(m){console.error("Face detection error:",m)}};D.current=setInterval(d,n)},[x]),Se=r.useCallback(async()=>{var e;try{const n=(await ae.get("users/userDetails",{headers:{Authorization:`Token ${localStorage.getItem("accessToken")}`}})).data;if(!(n!=null&&n.description))throw new Error("No face description data in API response");k([{label:n.full_name,descriptors:n.description}]),E([{id:n.full_name,name:n.full_name,position:n.job_title}]),i(!0),((e=n.location)==null?void 0:e.length)>0?($.current=n.location,U(n.location)):(L("❌ No office locations configured"),h("error"))}catch(s){N(s.message||"Error loading face data"),h("error")}},[U]),Oe={I:{message:"clocked in",emoji:"🌅"},i:{message:"started break",emoji:"☕"},0:{message:"ended break",emoji:"🍽️"},o:{message:"clocked out",emoji:"🌙"}},K=r.useCallback(mt(e=>{const{message:s,emoji:n}=Oe[e],d=ut();ae.post("checkinoutregion/create/",{CHECKTIME:d,CHECKTYPE:e,VERIFYCODE:t.deptid,SENSORID:t.deptid},{headers:{Authorization:`Token ${localStorage.getItem("accessToken")}`}}).then(()=>{const m={I:"Have a great day at work! 💼",i:"Enjoy your break! ☕",0:"Welcome back! 🔋",o:"See you tomorrow! 🌙"};g.fire({title:`${n} Success! ${n}`,html:`
              <div style="text-align: center; margin: 20px 0;">
                <p style="font-size: 18px; margin-bottom: 15px;">
                  You have successfully ${s}! 
                </p>
                <p style="font-size: 16px; color: #10b981; margin-bottom: 10px;">
                  😊 Nice smile, by the way! 😊
                </p>
                <p style="font-size: 14px; color: #666; font-style: italic;">
                  ${m[e]}
                </p>
              </div>
            `,icon:"success",confirmButtonColor:"#3085d6",timer:3e3,showConfirmButton:!1,customClass:{popup:"success-popup",title:"success-title"}}),setTimeout(()=>{a("/regional/user/home"),window.location.reload()},3e3)}).catch(m=>{var y,p;g.fire({icon:"error",title:"❌ Oops! Something went wrong",html:`
              <div style="text-align: center; margin: 20px 0;">
                <p style="font-size: 16px; margin-bottom: 10px;">
                  ${((p=(y=m.response)==null?void 0:y.data)==null?void 0:p.detail)||"An error occurred while processing your request."}
                </p>
                <p style="font-size: 14px; color: #666; font-style: italic;">
                  😔 Don't worry, please try again!
                </p>
              </div>
            `,confirmButtonColor:"#d33",confirmButtonText:"Try Again 🔄"})})},1e3),[t,a]);return r.useEffect(()=>(Se(),pe(),()=>{var e;if((e=w.current)!=null&&e.srcObject&&(w.current.srcObject.getTracks().forEach(n=>n.stop()),w.current.srcObject=null),D.current&&clearInterval(D.current),A.current&&clearInterval(A.current),B.current&&clearTimeout(B.current),he.current&&cancelAnimationFrame(he.current),P.current){const s=P.current.getContext("2d",{willReadFrequently:!0});s&&s.clearRect(0,0,P.current.width,P.current.height)}N("Stopped")}),[Se,pe]),r.useEffect(()=>{l||we()},[l,we]),r.useEffect(()=>(l&&c&&f.length>0&&fe&&x==="ok"&&(async()=>(await ye(),await be(),ve()))(),()=>{D.current&&clearInterval(D.current)}),[l,c,f.length,fe,x,M,ye,be,ve]),r.useEffect(()=>{(S==="permission_denied"||z&&z.includes("Location permission required"))&&!X.current&&(X.current=!0,te()),S==="ok"&&(X.current=!1)},[S,z,te]),r.useEffect(()=>{let e=null;return(async()=>{try{const n=await navigator.permissions.query({name:"geolocation"});e=n;const d=()=>{n.state==="granted"?(h("ok"),C.current=!0,$.current&&U($.current)):n.state==="denied"&&(h("permission_denied"),C.current=!1)};n.onchange=d}catch{}})(),()=>{e&&(e.onchange=null)}},[U]),o.jsx("div",{className:"flex-1 h-full overflow-auto",children:o.jsxs("div",{className:"flex-1 items-center mt-20 justify-between",children:[o.jsxs("div",{children:[o.jsxs("p",{className:"animate-pulse ml-4 text-2xl text-primary",children:["Hello, ",t.full_name,"! 👋"]}),o.jsxs("p",{className:"ml-4 text-sm italic text-foreground",children:["You are currently ",o.jsx("span",{children:z})]}),o.jsxs("div",{className:"ml-4 mt-2 flex gap-4 text-xs",children:[o.jsxs("span",{className:`flex items-center gap-1 ${x==="ok"?"text-green-600":x==="permission_denied"?"text-red-600":"text-yellow-600"}`,children:["📷 Camera: ",x==="ok"?"✅ Active":x==="permission_denied"?"❌ Denied":x==="checking"?"⏳ Checking...":"⚠️ Error"]}),o.jsxs("span",{className:`flex items-center gap-1 ${S==="ok"?"text-green-600":S==="permission_denied"?"text-red-600":"text-yellow-600"}`,children:["📍 Location: ",S==="ok"?"✅ Active":S==="permission_denied"?"❌ Denied":S==="checking"?"⏳ Checking...":"⚠️ Error"]})]})]}),o.jsxs("div",{className:"flex flex-col items-center justify-center mt-2",children:[o.jsx("p",{className:"text-2xl font-bold sm:text-base text-primary",children:"Digital Biometric"}),o.jsx("p",{className:"text-secondary-foreground text-sm mt-2",children:"Please Smile🙂 To enable the Clock In/Out Button"}),o.jsx("div",{className:"flex w-full justify-center mt-2",children:o.jsx("div",{className:Z?"flex self-center w-[80%] sm:w-[90%] sm:h-[40vh] h-[50vh] bg-border border border-5 border-green-500 rounded-md":"flex self-center w-[80%] sm:w-[90%] sm:h-[40vh] h-[50vh] bg-border border rounded-md",children:o.jsx("div",{className:T.current?"flex flex-col gap-5 items-center justify-center h-full w-full relative border border-green-500 rounded-sm ":"flex flex-col gap-5 items-center justify-center h-full w-full relative border border-red-500 rounded-sm ",children:o.jsxs("div",{className:"overflow-hidden w-full max-w-[500px] h-[500px] relative flex",children:[o.jsx("div",{className:"ml-2 mt-5 absolute gap-2 text-primary col-span-1 flex flex-col",children:ue&&ue.map((e,s)=>{const n=v.find(d=>d.id===e._label);return o.jsxs("div",{className:"text-sm bg-card/50 backdrop-blur-md p-2 rounded-md",children:[o.jsx("h3",{children:n?n.name:"Unknown"}),o.jsx("p",{children:n?n.position:"Unrecognized Person"})]},s)})}),o.jsx("video",{crossOrigin:"anonymous",ref:w,className:"w-full h-full rounded-md",autoPlay:!0,muted:!0,playsInline:!0}),o.jsx("canvas",{ref:P,className:"w-full h-full absolute"})]})})})}),o.jsxs("div",{className:"relative grid grid-cols-3 justify-center w-[80%] items-center h-full",children:[o.jsxs("p",{className:"relative bottom-0 left-0 p-4 z-[999] justify-start justify-self-start sm:text-sm text-secondary-foreground",children:["Status:  ",o.jsx("span",{className:de==="Running"?"justify-end justify-self-end z-[999] text-green-600":"text-red-500 justify-end z-[999] justify-self-end",children:de})]}),o.jsx(st,{className:M==="user"?"cursor-pointer m-5 text-foreground justify-center self-center justify-self-center rotate-180 transition-all duration-700 col-span-1":"justify-center self-center justify-self-center cursor-pointer m-5 text-foreground col-span-1 rotate-0 transition-all duration-700",onClick:()=>Be(e=>e==="user"?"environment":"user")}),o.jsx("span",{className:le==="passed"?"text-green-600 sm:text-sm justify-self-end":"text-yellow-600 sm:text-sm justify-self-end",children:Ae})]})]})]})})}function wt(){const[t,a]=r.useState(null),[c,i]=r.useState(!0),[l,u]=r.useState(60),f=De();r.useEffect(()=>{ae.get("users/userDetails",{headers:{Authorization:`Token ${localStorage.getItem("accessToken")}`}}).then(v=>{a(v.data)}).finally(()=>i(!1))},[]),r.useEffect(()=>{const v=setInterval(()=>{u(E=>(E<=1&&(f("/regional/user/temp"),window.location.reload()),E-1))},1e3);return()=>clearInterval(v)},[f]);const k=v=>{const E=Math.floor(v/60),S=v%60;return`${E.toString().padStart(2,"0")}:${S.toString().padStart(2,"0")}`};return c?o.jsx("div",{className:"flex h-full w-full justify-center items-center",children:"Loading..."}):!t||!t.description||t.description.length===0?o.jsx("div",{className:"flex-1 h-full flex items-center justify-center",children:o.jsx(it,{})}):o.jsxs("div",{className:"flex-1 h-full overflow-auto",children:[o.jsxs("div",{className:"fixed bottom-20 right-2 bg-gray-100 px-3 py-1 rounded-md font-mono text-sm z-50",children:[o.jsx("span",{className:" md:hidden",children:"Session Timer:"}),"   ",k(l)]}),o.jsx(rt,{}),o.jsx(ht,{userObject:t})]})}export{wt as default};
