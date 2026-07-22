import{c as ye,j as n,L as at,u as Ke,r,a as ge,s as L}from"./index-8bd096b7.js";import{S as h}from"./sweetalert2.esm.all-3fe0d2e9.js";import{F as pe,i as he,B as ct,r as lt,D as He,g as ut,a as dt,b as mt,e as ft,c as qe,f as gt,t as pt,n as ie,h as ht,T as We,L as xt,j as yt,d as wt}from"./FaceMatcher-01d4fa20.js";import{S as bt,a as vt,b as St,c as kt,d as Ye}from"./select-9429e356.js";import{L as Ct}from"./loader-2-c4805899.js";import{D as jt}from"./DashboardAnalogClock-6d388bff.js";const Pt=ye("Camera",[["path",{d:"M14.5 4h-5L7 7H4a2 2 0 0 0-2 2v9a2 2 0 0 0 2 2h16a2 2 0 0 0 2-2V9a2 2 0 0 0-2-2h-3l-2.5-3z",key:"1tc9qg"}],["circle",{cx:"12",cy:"13",r:"3",key:"1vg3eu"}]]),Nt=ye("MapPin",[["path",{d:"M20 10c0 6-8 12-8 12s-8-6-8-12a8 8 0 0 1 16 0Z",key:"2oe9fu"}],["circle",{cx:"12",cy:"10",r:"3",key:"ilqhr7"}]]),Lt=ye("Video",[["path",{d:"m22 8-6 4 6 4V8Z",key:"50v9me"}],["rect",{width:"14",height:"12",x:"2",y:"6",rx:"2",ry:"2",key:"1rqjg6"}]]);function Et(i,c){var u=Array.isArray(c)?c:[c];u.forEach(function(o){var l=o instanceof pe?o.score:he(o)?o.detection.score:void 0,m=o instanceof pe?o.box:he(o)?o.detection.box:new ct(o),f=l?""+lt(l):void 0;new He(m,{label:f}).draw(i)})}function Rt(i,c,u){u===void 0&&(u=!1);var o=u?ut(c):c,l=o.width,m=o.height;return i.width=l,i.height=m,{width:l,height:m}}function Ge(i,c){var u=new dt(c.width,c.height),o=u.width,l=u.height;if(o<=0||l<=0)throw new Error("resizeResults - invalid dimensions: "+JSON.stringify({width:o,height:l}));if(Array.isArray(i))return i.map(function(P){return Ge(P,{width:o,height:l})});if(mt(i)){var m=i.detection.forSize(o,l),f=i.unshiftedLandmarks.forSize(m.box.width,m.box.height);return ft(qe(i,m),f)}return he(i)?qe(i,i.detection.forSize(o,l)):i instanceof gt||i instanceof pe?i.forSize(o,l):i}const It=()=>n.jsx("div",{className:"flex flex-col items-center justify-center h-screen w-full",children:n.jsxs("div",{className:"bg-card border border-border rounded-md p-8 shadow-md flex flex-col items-center",children:[n.jsx("p",{className:"text-2xl font-bold text-primary mb-2",children:"Face Registration Required"}),n.jsx("p",{className:"text-foreground text-center",children:"Please register your face from your profile to use this page."}),n.jsx(at,{to:"/regional/user/profile",className:" animate-bounce cursor-pointer text-primary text-xs",children:" View Profile →  Register your Face for Digital Biometric"}),n.jsx("p",{className:" text-xs text-yellow-500 mt-5",children:"*Note: Images won't be saved to the database — your privacy is safe 😊!"})]})}),se="location_permission_granted",oe="camera_permission_granted",Ue="permissions_explained";function Tt(i,c,u,o){const m=(u-i)*Math.PI/180,f=(o-c)*Math.PI/180,P=Math.sin(m/2)*Math.sin(m/2)+Math.cos(i*Math.PI/180)*Math.cos(u*Math.PI/180)*Math.sin(f/2)*Math.sin(f/2);return 6371*(2*Math.atan2(Math.sqrt(P),Math.sqrt(1-P)))}function Ft(i){return i.happy>.5}const xe=()=>typeof navigator<"u"&&(/android|iphone|ipad|ipod|iemobile|mobile/i.test(navigator.userAgent)||/macintosh/i.test(navigator.userAgent)&&navigator.maxTouchPoints>1),V=()=>typeof navigator<"u"&&(/iphone|ipad|ipod/i.test(navigator.userAgent)||/macintosh/i.test(navigator.userAgent)&&navigator.maxTouchPoints>1),Dt=()=>typeof navigator<"u"&&/fban|fbav|fb_iab|instagram|messenger|tiktok|line\/|micromessenger/i.test(navigator.userAgent),Je=()=>typeof navigator<"u"&&/chrome|crios/i.test(navigator.userAgent)&&!/edg|opr|brave|firefox/i.test(navigator.userAgent),At=i=>i+(Je()?.01:0),Ze=()=>{try{const i=navigator.deviceMemory??4,c=navigator.hardwareConcurrency??4;return xe()&&(i<=2||c<=4)||i<=2||c<=2?"low":i<=4||c<=4?"mid":"high"}catch{return"mid"}};function Mt(i,c,u,o=.08){let l=1/0,m=!1,f="";const P=At(o);return u.forEach(k=>{const[E,C]=k.split(",").map(y=>parseFloat(y.trim())),x=Tt(i,c,E,C);x<=P&&(m=!0),x<l&&(l=x,f=k)}),{isNearby:m,distance:l,nearestLocation:f}}function Bt(){const i=new Date,c=i.getFullYear(),u=String(i.getMonth()+1).padStart(2,"0"),o=String(i.getDate()).padStart(2,"0"),l=String(i.getHours()).padStart(2,"0"),m=String(i.getMinutes()).padStart(2,"0"),f=String(i.getSeconds()).padStart(2,"0");return`${c}-${u}-${o}T${l}:${m}:${f}Z`}function Ot(i,c){let u;return(...o)=>{clearTimeout(u),u=setTimeout(()=>i(...o),c)}}function zt(i,c){let u;return(...o)=>{u||(i(...o),u=!0,setTimeout(()=>u=!1,c))}}const v={hasStoredPermission:i=>L.getItem(i)==="true",setPermissionStatus:(i,c)=>{L.setItem(i,c.toString())},hasShownExplanation:()=>L.getItem(Ue)==="true",setExplanationShown:()=>{L.setItem(Ue,"true")},checkBrowserPermission:async i=>{try{return"permissions"in navigator?(await navigator.permissions.query({name:i})).state:null}catch(c){return console.warn(`Permission check failed for ${i}:`,c),null}}},ae="/regional/models",$t="/regional/models-sw.js",Ve=(i,c)=>{const u=Ze();let o={ideal:640,max:1280},l={ideal:480,max:720},m={ideal:15,max:30};u==="low"?(o={ideal:480,max:640},l={ideal:360,max:480},m={ideal:12,max:24}):u==="mid"?(o={ideal:640,max:960},l={ideal:480,max:540},m={ideal:15,max:30}):(o={ideal:640,max:1280},l={ideal:480,max:720},m={ideal:24,max:30});const f={width:o,height:l,frameRate:m,aspectRatio:1.333};return c?f.deviceId={exact:c}:f.facingMode=i,{video:f}};function _t({userObject:i}){const c=Ke(),[u,o]=r.useState(!1),[l,m]=r.useState(!1),[f,P]=r.useState([]),[k,E]=r.useState([]),[C,x]=r.useState(null),[y,R]=r.useState(null),[K,D]=r.useState(null),[we,Xe]=r.useState("pending"),[w,$]=r.useState("Checking permissions..."),[be,I]=r.useState("Loading..."),[_,qt]=r.useState("user"),[ve,Qe]=r.useState(!1),[H,ce]=r.useState(!1),[Se,et]=r.useState([]),[A,ke]=r.useState(""),[le,G]=r.useState(!1),[Ce,tt]=r.useState(!1),J=r.useRef(null),N=r.useRef(!1),Z=r.useRef(null),ue=r.useRef(!1),je=r.useRef(!1),b=r.useRef(null),M=r.useRef(null),T=r.useRef(null),B=r.useRef(),de=r.useRef(!1),X=r.useRef(null),q=r.useRef(),W=r.useRef(),Pe=r.useRef(),F=r.useRef(0),Ne=r.useRef(0),Q=r.useRef(null),Le=r.useRef("pending"),Ee=r.useRef(""),Re=we==="passed"&&N.current&&y==="ok"&&J.current===!0,Ie=r.useCallback(()=>{if(!H&&!(Date.now()<F.current)){try{if(h.isVisible&&h.isVisible())return}catch{}ce(!0),h.fire({title:"Biometric Actions",html:`
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
    `,showConfirmButton:!1,showCancelButton:!1,allowOutsideClick:!1,allowEscapeKey:!1,position:"center",toast:!1,timer:6e3,timerProgressBar:!0,width:"420px",background:"#fff",customClass:{popup:"floating-menu-popup",timerProgressBar:"floating-menu-timer"},didOpen:()=>{var e,t,s,a;(e=document.getElementById("time-in-btn"))==null||e.addEventListener("click",()=>{F.current=Date.now()+3e3,ne("I"),h.close()}),(t=document.getElementById("break-in-btn"))==null||t.addEventListener("click",()=>{F.current=Date.now()+3e3,ne("i"),h.close()}),(s=document.getElementById("break-out-btn"))==null||s.addEventListener("click",()=>{F.current=Date.now()+3e3,ne("0"),h.close()}),(a=document.getElementById("time-out-btn"))==null||a.addEventListener("click",()=>{F.current=Date.now()+3e3,ne("o"),h.close()})},willClose:()=>{F.current=Math.max(F.current,Date.now()+3e3),ce(!1)}}),W.current=setTimeout(()=>{h.close(),ce(!1)},4e3)}},[H]);r.useEffect(()=>(Re&&!H&&Date.now()>=F.current&&(!h.isVisible||!h.isVisible())&&Ie(),()=>{W.current&&clearTimeout(W.current)}),[Re,H,Ie]);const Te=r.useCallback(()=>{v.hasShownExplanation()?Fe():h.fire({title:"Permission Setup Required",html:`
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
          `,icon:"info",confirmButtonText:"Grant Permissions",confirmButtonColor:"#3085d6",allowOutsideClick:!1,allowEscapeKey:!1}).then(()=>{v.setExplanationShown(),Fe()})},[]),Fe=r.useCallback(async()=>{I("Checking permissions...");const e=v.hasStoredPermission(oe),t=v.hasStoredPermission(se),s=await v.checkBrowserPermission("camera"),a=await v.checkBrowserPermission("geolocation");e&&s==="granted"?R("ok"):s==="denied"?(R("permission_denied"),v.setPermissionStatus(oe,!1)):await ee(),t&&a==="granted"?(x("ok"),N.current=!0):a==="denied"?(x("permission_denied"),N.current=!1,v.setPermissionStatus(se,!1)):await U(),Qe(!0)},[]),z=r.useCallback(async()=>{var e;try{if(!((e=navigator.mediaDevices)!=null&&e.enumerateDevices))return;const t=await navigator.mediaDevices.enumerateDevices();et(t.filter(s=>s.kind==="videoinput"))}catch(t){console.warn("Failed to enumerate cameras:",t)}},[]),ee=r.useCallback(async()=>{var e;if(!((e=navigator.mediaDevices)!=null&&e.getUserMedia)){R("error"),h.fire({icon:"warning",title:"Camera Not Available Here",html:Dt()?`<div style="text-align:left; margin: 10px 0;">
              <p>This in-app browser can't access the camera.</p>
              <p style="margin-top:10px">Please open this page in <strong>${V()?"Safari":"Chrome"}</strong>:
              tap the <strong>⋯</strong> or share menu, then choose <strong>"Open in Browser"</strong>.</p>
            </div>`:`<p>This browser doesn't support camera access. Please use ${V()?"Safari":"Chrome"} instead.</p>`,confirmButtonColor:"#3085d6"});return}R("checking");try{const t=Ve(_,A||void 0),s=await navigator.mediaDevices.getUserMedia(t);R("ok"),v.setPermissionStatus(oe,!0),s.getTracks().forEach(a=>a.stop()),z()}catch(t){t.name==="NotAllowedError"||t.name==="PermissionDeniedError"?(R("permission_denied"),v.setPermissionStatus(oe,!1),rt()):(R("error"),console.error("Camera access error:",t))}},[_,A,z]),Y=r.useCallback(()=>{const e=window.location.origin,t=navigator.userAgent.toLowerCase(),s=t.includes("edg"),a=t.includes("firefox"),d=/android|iphone|ipad|ipod/i.test(t),g=(t.includes("chrome")||t.includes("crios"))&&!s&&!t.includes("opr");let p=null;if(!d&&(g||s)?p=`${s?"edge":"chrome"}://settings/content/siteDetails?site=${encodeURIComponent(e)}`:!d&&a&&(p="about:preferences#privacy"),p)try{window.open(p,"_blank")}catch{}const j=V()?`<ol style="text-align:left; padding-left: 20px;">
            <li>Tap the <strong>ᴀA</strong> icon in Safari's address bar</li>
            <li>Choose <strong>Website Settings</strong> ➜ <strong>Location</strong> ➜ <strong>Allow</strong></li>
            <li>If Location is greyed out: open the iPhone <strong>Settings</strong> app ➜
                <strong>Privacy & Security</strong> ➜ <strong>Location Services</strong> ➜
                <strong>Safari Websites</strong> ➜ "While Using the App"</li>
          </ol>`:d?`<ol style="text-align:left; padding-left: 20px;">
            <li>Tap the lock icon in the address bar</li>
            <li>Permissions ➜ Location</li>
            <li>Choose "Allow while using"</li>
          </ol>`:`<p>In Site Settings, set Location to <strong>Allow</strong> for ${e}, then return here.</p>`;h.fire({icon:"info",title:"Enable location for this site",html:j,confirmButtonText:"Reload Page",allowOutsideClick:!1,allowEscapeKey:!1}).then(()=>window.location.reload())},[]),U=r.useCallback(async()=>(x("checking"),navigator.geolocation?new Promise(e=>{navigator.geolocation.getCurrentPosition(t=>{x("ok"),N.current=!0,v.setPermissionStatus(se,!0),e("granted")},t=>{t.code===t.PERMISSION_DENIED?(x("permission_denied"),N.current=!1,v.setPermissionStatus(se,!1),e("denied")):(x("error"),N.current=!1,console.error("Location access error:",t),e("error"))},{enableHighAccuracy:!1,timeout:1e4,maximumAge:0})}):(x("error"),D("❌ Geolocation not supported"),N.current=!1,"error")),[]),rt=r.useCallback(()=>{const e=`
          <div style="text-align: left; margin: 20px 0;">
            <p>Camera access is required for facial recognition. To enable on iPhone/iPad:</p>
            <ol style="margin: 10px 0; padding-left: 20px;">
              <li>Tap the <strong>ᴀA</strong> icon in Safari's address bar</li>
              <li>Choose <strong>Website Settings</strong> ➜ <strong>Camera</strong> ➜ <strong>Allow</strong></li>
              <li>Then tap "Try Again" below</li>
            </ol>
            <p style="margin-top: 15px; font-size: 14px; color: #666;">
              <em>If Camera doesn't appear there: iPhone Settings app ➜ Apps ➜ Safari ➜ Camera ➜ Allow</em>
            </p>
          </div>
        `,t=`
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
        `;h.fire({title:"Camera Permission Required",html:V()?e:t,icon:"warning",confirmButtonText:"Try Again",showCancelButton:!0,cancelButtonText:"Skip",confirmButtonColor:"#3085d6"}).then(s=>{s.isConfirmed&&ee()})},[ee]),De=r.useCallback(()=>{h.fire({title:"Location Permission Required",html:`
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
        `,icon:"warning",confirmButtonText:"Grant Location Access",showCancelButton:!1,confirmButtonColor:"#3085d6"}).then(e=>{e.isConfirmed?v.checkBrowserPermission("geolocation").then(t=>{t==="denied"?Y():U().then(s=>{s==="granted"?window.location.reload():s==="denied"?Y():h.fire({icon:"warning",title:"Location Unavailable",text:"Please turn on GPS/Location Services on your device and try again.",confirmButtonText:"OK",confirmButtonColor:"#3085d6"})})}).catch(()=>U().then(t=>{t==="granted"?window.location.reload():t==="denied"&&Y()})):e.isDenied&&Y()})},[U,Y]),te=r.useCallback(zt(e=>{if(Z.current=e,!N.current){D("❌ Location permission required"),x("permission_denied");return}const t=()=>{if(!navigator.geolocation){D("❌ Geolocation not supported"),x("error");return}navigator.geolocation.getCurrentPosition(s=>{const{latitude:a,longitude:d,accuracy:g}=s.coords,{isNearby:p,distance:j}=Mt(a,d,e);J.current=p;const S=!p&&typeof g=="number"&&g>250,O=p?`✅ Within office range! (${j.toFixed(2)} km)`:S?`⚠️ Location too imprecise (±${Math.round(g)} m) — turn on Precise Location`:`❌ Outside office range (${j.toFixed(2)} km from nearest office)`;if(S&&V()&&!je.current)try{h.isVisible()||(je.current=!0,h.fire({icon:"info",title:"Turn On Precise Location",html:`
                    <div style="text-align:left; margin: 10px 0;">
                      <p>Your iPhone is sharing an <strong>approximate</strong> location
                      (±${Math.round(g)} m), so we can't confirm you're at the office.</p>
                      <p style="margin-top:10px">To fix it:</p>
                      <ol style="margin: 8px 0; padding-left: 20px;">
                        <li>Open the iPhone <strong>Settings</strong> app</li>
                        <li><strong>Privacy & Security</strong> ➜ <strong>Location Services</strong></li>
                        <li>Select <strong>Safari Websites</strong> (or your browser)</li>
                        <li>Turn <strong>Precise Location</strong> ON</li>
                      </ol>
                      <p style="font-size: 13px; color: #666;"><em>Then return here — the location re-checks automatically.</em></p>
                    </div>`,confirmButtonText:"OK",confirmButtonColor:"#3085d6"}))}catch{}D(O),x("ok")},s=>{if(console.error("Location error:",s),J.current!==null){const a=J.current?"✅ Within office range! (checking...)":"❌ Outside office range (checking...)";D(d=>!d||d.includes("Location permission required")||d.includes("Location access failed")?a:d)}else D("❌ Location access failed"),x("error")},{enableHighAccuracy:xe()||Je(),timeout:xe()?2e4:1e4,maximumAge:0})};q.current&&clearInterval(q.current),t(),q.current=setInterval(t,45e3)},15e3),[]),Ae=r.useCallback(async()=>{if(!l)try{I("Loading models...");try{const e=pt;e!=null&&e.setBackend&&(await e.setBackend("webgl"),e!=null&&e.ready&&await e.ready())}catch{}await Promise.all([ie.tinyFaceDetector.loadFromUri(ae),ie.faceLandmark68TinyNet.loadFromUri(ae),ie.faceRecognitionNet.loadFromUri(ae),ie.faceExpressionNet.loadFromUri(ae)]);try{const e=document.createElement("canvas");e.width=128,e.height=128;const t=e.getContext("2d");t==null||t.fillRect(0,0,1,1),await ht(e,new We({inputSize:160,scoreThreshold:.9})).withFaceLandmarks(!0).withFaceDescriptors().withFaceExpressions()}catch{}m(!0)}catch{I("Error loading models")}},[l]),Me=r.useCallback(async()=>{try{const e=await Promise.all(f.map(t=>{const s=t.descriptors.map(a=>new Float32Array(a));return new xt(t.label,s)}));X.current=new yt(e,.6),tt(!0)}catch(e){console.error("Face matcher initialization error:",e)}},[f]),re=r.useCallback(async()=>{var e;if(y!=="ok"){$("Camera permission required");return}G(!0);try{(e=b.current)!=null&&e.srcObject&&(b.current.srcObject.getTracks().forEach(d=>{d.onended=null,d.stop()}),b.current.srcObject=null),Q.current=null;const t=Ve(_,A||void 0),s=await navigator.mediaDevices.getUserMedia(t);if(b.current){const a=b.current;a.srcObject=s,a.muted=!0,a.setAttribute("muted","");const d=()=>{$("Please smile to verify liveliness"),G(!1)};a.onloadedmetadata=()=>{a.play().catch(()=>{}),d()},a.oncanplay=()=>{a.paused&&a.play().catch(()=>{})},setTimeout(d,4e3);const[g]=s.getVideoTracks();g&&(g.onended=()=>{var p;$("Camera interrupted — restarting…"),(p=M.current)==null||p.call(M)})}}catch(t){if(console.error("Error starting video:",t),A&&((t==null?void 0:t.name)==="OverconstrainedError"||(t==null?void 0:t.name)==="NotFoundError")){$("Selected camera unavailable — reverting to default"),ke(""),G(!1);return}I("Error accessing camera"),R("error"),G(!1)}},[_,y,A]);r.useEffect(()=>{M.current=re},[re]),r.useEffect(()=>{const e=()=>{var a,d,g,p;if(document.visibilityState!=="visible"||y!=="ok")return;const t=(a=b.current)==null?void 0:a.srcObject,s=(d=t==null?void 0:t.getVideoTracks)==null?void 0:d.call(t)[0];!s||s.readyState==="ended"||s.muted?(g=M.current)==null||g.call(M):(p=b.current)!=null&&p.paused&&b.current.play().catch(()=>{})};return document.addEventListener("visibilitychange",e),window.addEventListener("pageshow",e),()=>{document.removeEventListener("visibilitychange",e),window.removeEventListener("pageshow",e)}},[y]);const Be=r.useCallback(()=>{if(!X.current||!b.current||!T.current||y!=="ok")return;B.current&&clearInterval(B.current);const e=Ze(),t=e==="low"?160:e==="mid"?320:416,s=e==="low"?900:e==="mid"?500:350,a={width:500,height:600},d=T.current;Rt(d,a);const g=(j,S)=>{j!==Le.current&&(Le.current=j,Xe(j)),S!==Ee.current&&(Ee.current=S,$(S))},p=async()=>{var j;if(!de.current){de.current=!0;try{if(!b.current||!T.current||!X.current)return;const S=await wt(b.current,new We({inputSize:t,scoreThreshold:.6})).withFaceLandmarks(!0).withFaceDescriptor().withFaceExpressions(),O=S?[Ge(S,a)]:[];if(Q.current||(Q.current=d.getContext("2d",{willReadFrequently:!0})),(j=Q.current)==null||j.clearRect(0,0,a.width,a.height),O.length>0){const ze=O.map(fe=>X.current.findBestMatch(fe.descriptor));Et(d,O),ze.forEach((fe,st)=>{const ot=O[st].detection.box;new He(ot,{label:fe.toString()}).draw(d)});const $e=ze[0],_e=$e&&$e.label!=="unknown",it=Ft(O[0].expressions);_e&&it&&(Ne.current=Date.now()+4e3),Date.now()<Ne.current?g("passed","Nice Smile!😉"):_e?g("pending","Please smile."):g("pending","Face not recognized."),I("Running")}else g("pending","No face detected"),I("Running")}catch(S){console.error("Face detection error:",S)}finally{de.current=!1}}};B.current=setInterval(p,s)},[y]),me=r.useCallback(e=>{var t;return e!=null&&e.description?(P([{label:e.full_name,descriptors:e.description}]),E([{id:e.full_name,name:e.full_name,position:e.job_title}]),o(!0),((t=e.location)==null?void 0:t.length)>0?(Z.current=e.location,te(e.location)):(D("❌ No office locations configured"),x("error")),!0):!1},[te]),Oe=r.useCallback(async()=>{try{const t=(await ge.get("users/userDetails",{headers:{Authorization:`Token ${L.getItem("accessToken")}`}})).data;if(L.setItem("user",JSON.stringify(t)),!me(t))throw new Error("No face description data in API response")}catch(e){if(!(e!=null&&e.response))try{const t=JSON.parse(L.getItem("user")||"null");if(me(t))return}catch{}I(e.message||"Error loading face data"),x("error")}},[me]),nt={I:{message:"clocked in",emoji:"🌅"},i:{message:"started break",emoji:"☕"},0:{message:"ended break",emoji:"🍽️"},o:{message:"clocked out",emoji:"🌙"}},ne=r.useCallback(Ot(e=>{const{message:t,emoji:s}=nt[e],a=Bt();ge.post("checkinoutregion/create/",{CHECKTIME:a,CHECKTYPE:e,VERIFYCODE:i.deptid,SENSORID:0},{headers:{Authorization:`Token ${L.getItem("accessToken")}`},timeout:2e4}).then(()=>{const d={I:"Have a great day at work! 💼",i:"Enjoy your break! ☕",0:"Welcome back! 🔋",o:"See you tomorrow! 🌙"};h.fire({title:`${s} Success! ${s}`,html:`
              <div style="text-align: center; margin: 20px 0;">
                <p style="font-size: 18px; margin-bottom: 15px;">
                  You have successfully ${t}! 
                </p>
                <p style="font-size: 16px; color: #10b981; margin-bottom: 10px;">
                  😊 Nice smile, by the way! 😊
                </p>
                <p style="font-size: 14px; color: #666; font-style: italic;">
                  ${d[e]}
                </p>
              </div>
            `,icon:"success",confirmButtonColor:"#3085d6",timer:3e3,showConfirmButton:!1,customClass:{popup:"success-popup",title:"success-title"}}),setTimeout(()=>{c("/regional/user/home"),window.location.reload()},3e3)}).catch(d=>{var g,p;h.fire({icon:"error",title:"❌ Oops! Something went wrong",html:`
              <div style="text-align: center; margin: 20px 0;">
                <p style="font-size: 16px; margin-bottom: 10px;">
                  ${((p=(g=d.response)==null?void 0:g.data)==null?void 0:p.detail)||(d.response?"An error occurred while processing your request.":"Network problem — your time record was NOT saved. Please check your internet connection and try again.")}
                </p>
                <p style="font-size: 14px; color: #666; font-style: italic;">
                  😔 Don't worry, please try again!
                </p>
              </div>
            `,confirmButtonColor:"#d33",confirmButtonText:"Try Again 🔄"})})},1e3),[i,c]);return r.useEffect(()=>{"serviceWorker"in navigator&&navigator.serviceWorker.register($t).catch(e=>console.warn("Offline model cache unavailable:",e))},[]),r.useEffect(()=>(Oe(),Te(),()=>{var e;if((e=b.current)!=null&&e.srcObject&&(b.current.srcObject.getTracks().forEach(s=>{s.onended=null,s.stop()}),b.current.srcObject=null),B.current&&clearInterval(B.current),q.current&&clearInterval(q.current),W.current&&clearTimeout(W.current),Pe.current&&cancelAnimationFrame(Pe.current),T.current){const t=T.current.getContext("2d",{willReadFrequently:!0});t&&t.clearRect(0,0,T.current.width,T.current.height)}I("Stopped")}),[Oe,Te]),r.useEffect(()=>{l||Ae()},[l,Ae]),r.useEffect(()=>{var t;if(y!=="ok")return;z();const e=navigator.mediaDevices;return(t=e==null?void 0:e.addEventListener)==null||t.call(e,"devicechange",z),()=>{var s;return(s=e==null?void 0:e.removeEventListener)==null?void 0:s.call(e,"devicechange",z)}},[y,z]),r.useEffect(()=>{l&&u&&f.length>0&&Me()},[l,u,f.length,Me]),r.useEffect(()=>(Ce&&ve&&y==="ok"&&(async()=>(await re(),Be()))(),()=>{B.current&&clearInterval(B.current)}),[Ce,ve,y,_,A,re,Be]),r.useEffect(()=>{(C==="permission_denied"||K&&K.includes("Location permission required"))&&!ue.current&&(ue.current=!0,De()),C==="ok"&&(ue.current=!1)},[C,K,De]),r.useEffect(()=>{let e=null;return(async()=>{try{const s=await navigator.permissions.query({name:"geolocation"});e=s;const a=()=>{s.state==="granted"?(x("ok"),N.current=!0,Z.current&&te(Z.current)):s.state==="denied"&&(x("permission_denied"),N.current=!1)};s.onchange=a}catch{}})(),()=>{e&&(e.onchange=null)}},[te]),n.jsxs("div",{className:"flex-1 h-full overflow-auto bg-background",children:[n.jsx("style",{children:`
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
        `}),n.jsxs("div",{className:"flex-1 flex flex-col items-center justify-center min-h-screen p-6",children:[n.jsxs("div",{className:"text-center mb-12",children:[n.jsx("h1",{className:"text-4xl sm:text-3xl font-bold text-primary mb-2",children:"🔐 Digital Biometric"}),n.jsxs("p",{className:"text-secondary-foreground text-lg",children:["Welcome back, ",n.jsx("span",{className:"font-semibold text-primary",children:i.full_name})]}),n.jsx("p",{className:"text-sm text-secondary-foreground mt-2",children:K})]}),n.jsx("div",{className:"flex w-full justify-center px-4 animate-in fade-in zoom-in-95 duration-500",children:n.jsx("div",{className:"flex flex-col items-center gap-6",children:n.jsxs("div",{className:"relative flex items-center justify-center",children:[n.jsxs("div",{className:"absolute w-[350px] h-[350px] sm:w-[240px] sm:h-[240px] pointer-events-none rounded-full ",children:[n.jsx("div",{className:`absolute inset-0 rounded-full pulse-ring ${w==="Nice Smile!😉"?"ring-2 ring-blue-400":w==="Please smile."?"ring-2 ring-green-500":w==="Face not recognized."?"ring-2 ring-red-500":w==="No face detected"?"ring-2 ring-red-500/80":"ring-2 ring-gray-400/30"}`}),n.jsx("div",{className:`absolute inset-0 rounded-full pulse-ring-alt ${w==="Nice Smile!😉"?"ring-2 ring-blue-400":w==="Please smile."?"ring-2 ring-green-300/70":w==="Face not recognized."?"ring-2 ring-yellow-400/70":w==="No face detected"?"ring-2 ring-red-400/30":"ring-2 ring-gray-300/20"}`}),n.jsx("div",{className:`absolute inset-0 rounded-full pulse-ring-slow ${w==="Nice Smile!😉"?"ring-2 ring-blue-300":w==="Please smile."?"ring-2 ring-green-300/40":w==="Face not recognized."?"ring-2 ring-yellow-300/40":w==="No face detected"?"ring-2 ring-red-400/20":"ring-2 ring-gray-300/10"}`})]}),n.jsxs("div",{className:`flex items-center justify-center w-[400px] h-[400px] sm:w-80 sm:h-80 rounded-full overflow-hidden transition-all duration-300 ${w==="Nice Smile!😉"?"ring-4 ring-blue-500 ring-offset-2 shadow-lg shadow-blue-500/50":w==="Please smile."?"ring-4 ring-green-400 ring-offset-2 shadow-lg shadow-green-500/50":w==="Face not recognized."?"ring-4 ring-yellow-500 ring-offset-2 shadow-lg shadow-yellow-500/50":w==="No face detected"?"ring-4 ring-red-400 ring-offset-2 shadow-lg shadow-red-500/40":"ring-4 ring-gray-400 ring-offset-2"} bg-gradient-to-br from-slate-900 to-slate-800`,style:{clipPath:"circle(50%)"},children:[n.jsx("video",{crossOrigin:"anonymous",ref:b,className:`w-full h-full object-cover transition-opacity duration-300 ease-out ${le?"opacity-0":"opacity-100"}`,style:{clipPath:"circle(50%)"},autoPlay:!0,muted:!0,playsInline:!0}),n.jsx("canvas",{ref:T,className:"w-full h-full absolute inset-0",style:{clipPath:"circle(50%)"}}),le&&n.jsx("div",{className:"absolute inset-0 z-10 flex items-center justify-center bg-slate-900/70 backdrop-blur-sm transition-opacity duration-200",children:n.jsxs("div",{className:"flex flex-col items-center gap-2",children:[n.jsx(Ct,{className:"w-8 h-8 text-white animate-spin"}),n.jsx("span",{className:"text-xs text-white/80 font-medium",children:"Switching camera…"})]})})]}),n.jsx("div",{className:"absolute flex justify-center translate-y-[190px] sm:translate-y-[140px] w-full ",children:n.jsx("span",{className:`px-4 py-2 backdrop-blur-sm rounded-full text-sm sm:text-xs font-medium transition-all ${we==="passed"?"bg-blue-500/60 text-green-50 border ":"bg-green-500/60  text-yellow-50 border "}`,children:w})})]})})}),n.jsxs("div",{className:"relative grid grid-cols-3 justify-center w-full mt-20 px-4 gap-4",children:[n.jsxs("div",{className:"flex flex-col gap-2 justify-start max-w-60",children:[n.jsx("p",{className:"text-xs font-semibold text-secondary-foreground uppercase tracking-wide",children:"Status"}),n.jsxs("span",{className:`inline-flex items-center gap-2 px-3 py-1 rounded-full text-sm font-medium ${be==="Running"?"bg-green-600 text-green-50 border border-green-500":"bg-red-600 text-red-50 border border-red-500"}`,children:[n.jsx("span",{className:"w-2 h-2 rounded-full bg-current animate-pulse"}),be]})]}),n.jsx("div",{className:"flex flex-col items-center gap-2",children:Se.length>1&&n.jsxs(bt,{value:A||"auto",onValueChange:e=>ke(e==="auto"?"":e),disabled:le,children:[n.jsxs(vt,{className:"h-8 w-40 text-xs gap-1 px-2 text-accent-foreground",children:[n.jsx(Lt,{className:"w-3.5 h-3.5 shrink-0 text-muted-foreground"}),n.jsx(St,{placeholder:"Camera",className:" text-accent-foreground"})]}),n.jsxs(kt,{className:" text-accent-foreground ",children:[n.jsx(Ye,{value:"auto",children:"Auto (Front/Back)"}),Se.map((e,t)=>n.jsx(Ye,{className:" text-accent-foreground ",value:e.deviceId,children:e.label||`Camera ${t+1}`},e.deviceId))]})]})}),n.jsxs("div",{className:"flex flex-col gap-2 justify-end text-right",children:[n.jsx("p",{className:"text-xs font-semibold text-secondary-foreground uppercase tracking-wide",children:"Permissions"}),n.jsxs("div",{className:"flex gap-3 justify-end",children:[n.jsxs("button",{onClick:()=>{y!=="ok"&&ee()},className:"flex items-center gap-1 px-2 py-1 rounded transition-all hover:bg-white/10 cursor-pointer group",title:y==="ok"?"Camera enabled":"Click to enable camera",children:[n.jsx(Pt,{className:`w-4 h-4 transition-all ${y==="ok"?"text-green-500":"text-red-500 group-hover:scale-110"}`}),n.jsx("span",{className:`w-2 h-2 rounded-full transition-all ${y==="ok"?"bg-green-500":"bg-red-500 group-hover:scale-125"}`})]}),n.jsxs("button",{onClick:()=>{C!=="ok"&&U()},className:"flex items-center gap-1 px-2 py-1 rounded transition-all hover:bg-white/10 cursor-pointer group",title:C==="ok"?"Location enabled":"Click to enable location",children:[n.jsx(Nt,{className:`w-4 h-4 transition-all ${C==="ok"?"text-green-500":"text-red-500 group-hover:scale-110"}`}),n.jsx("span",{className:`w-2 h-2 rounded-full transition-all ${C==="ok"?"bg-green-500":"bg-red-500 group-hover:scale-125"}`})]})]})]})]})]})]})}function Jt(){const[i,c]=r.useState(null),[u,o]=r.useState(!0),[l,m]=r.useState(60),f=Ke();r.useEffect(()=>{ge.get("users/userDetails",{headers:{Authorization:`Token ${L.getItem("accessToken")}`}}).then(k=>{c(k.data)}).finally(()=>o(!1))},[]),r.useEffect(()=>{const k=setInterval(()=>{m(E=>(E<=1&&(f("/regional/user/temp"),window.location.reload()),E-1))},1e3);return()=>clearInterval(k)},[f]);const P=k=>{const E=Math.floor(k/60),C=k%60;return`${E.toString().padStart(2,"0")}:${C.toString().padStart(2,"0")}`};return u?n.jsx("div",{className:"flex h-full w-full justify-center items-center",children:"Loading..."}):!i||!i.description||i.description.length===0?n.jsx("div",{className:"flex-1 h-full flex items-center justify-center",children:n.jsx(It,{})}):n.jsxs("div",{className:"flex-1 h-full overflow-auto",children:[n.jsxs("div",{className:"fixed bottom-20 right-2 bg-gray-100 px-3 py-1 rounded-md font-mono text-sm z-50",children:[n.jsx("span",{className:" md:hidden",children:"Session Timer:"}),"   ",P(l)]}),n.jsx(jt,{}),n.jsx(r.Suspense,{fallback:n.jsx("div",{children:"Loading..."}),children:n.jsx(_t,{userObject:i})})]})}export{Jt as default};
