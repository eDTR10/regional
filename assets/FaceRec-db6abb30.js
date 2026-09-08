import{c as me,aa as ce,ab as le,ac as Ze,ad as Je,ae as ze,af as Xe,ag as Qe,ah as et,ai as tt,aj as Fe,ak as rt,j as n,L as nt,u as Oe,r as s,h as p,al as st,z as J,am as De,an as Me,ao as it,ap as ot,i as de,s as P,_ as at,$ as ct,a0 as lt,a1 as dt,a2 as Te}from"./index-d8018bdb.js";import{D as ut}from"./DashboardAnalogClock-d6e79487.js";const mt=me("Camera",[["path",{d:"M14.5 4h-5L7 7H4a2 2 0 0 0-2 2v9a2 2 0 0 0 2 2h16a2 2 0 0 0 2-2V9a2 2 0 0 0-2-2h-3l-2.5-3z",key:"1tc9qg"}],["circle",{cx:"12",cy:"13",r:"3",key:"1vg3eu"}]]),ft=me("MapPin",[["path",{d:"M20 10c0 6-8 12-8 12s-8-6-8-12a8 8 0 0 1 16 0Z",key:"2oe9fu"}],["circle",{cx:"12",cy:"10",r:"3",key:"ilqhr7"}]]),gt=me("Video",[["path",{d:"m22 8-6 4 6 4V8Z",key:"50v9me"}],["rect",{width:"14",height:"12",x:"2",y:"6",rx:"2",ry:"2",key:"1rqjg6"}]]);function ht(r,a){var d=Array.isArray(a)?a:[a];d.forEach(function(o){var c=o instanceof ce?o.score:le(o)?o.detection.score:void 0,u=o instanceof ce?o.box:le(o)?o.detection.box:new Ze(o),m=c?""+Je(c):void 0;new ze(u,{label:m}).draw(r)})}function pt(r,a,d){d===void 0&&(d=!1);var o=d?Xe(a):a,c=o.width,u=o.height;return r.width=c,r.height=u,{width:c,height:u}}function _e(r,a){var d=new Qe(a.width,a.height),o=d.width,c=d.height;if(o<=0||c<=0)throw new Error("resizeResults - invalid dimensions: "+JSON.stringify({width:o,height:c}));if(Array.isArray(r))return r.map(function(C){return _e(C,{width:o,height:c})});if(et(r)){var u=r.detection.forSize(o,c),m=r.unshiftedLandmarks.forSize(u.box.width,u.box.height);return tt(Fe(r,u),m)}return le(r)?Fe(r,r.detection.forSize(o,c)):r instanceof rt||r instanceof ce?r.forSize(o,c):r}const xt=()=>n.jsx("div",{className:"flex flex-col items-center justify-center h-screen w-full",children:n.jsxs("div",{className:"bg-card border border-border rounded-md p-8 shadow-md flex flex-col items-center",children:[n.jsx("p",{className:"text-2xl font-bold text-primary mb-2",children:"Face Registration Required"}),n.jsx("p",{className:"text-foreground text-center",children:"Please register your face from your profile to use this page."}),n.jsx(nt,{to:"/regional/user/profile",className:" animate-bounce cursor-pointer text-primary text-xs",children:" View Profile →  Register your Face for Digital Biometric"}),n.jsx("p",{className:" text-xs text-yellow-500 mt-5",children:"*Note: Images won't be saved to the database — your privacy is safe 😊!"})]})}),X="location_permission_granted",Q="camera_permission_granted",Ae="permissions_explained";function wt(r,a,d,o){const u=(d-r)*Math.PI/180,m=(o-a)*Math.PI/180,C=Math.sin(u/2)*Math.sin(u/2)+Math.cos(r*Math.PI/180)*Math.cos(d*Math.PI/180)*Math.sin(m/2)*Math.sin(m/2);return 6371*(2*Math.atan2(Math.sqrt(C),Math.sqrt(1-C)))}function bt(r){return r.happy>.5}const ue=()=>typeof navigator<"u"&&/android|iphone|ipad|ipod|iemobile|mobile/i.test(navigator.userAgent),$e=()=>typeof navigator<"u"&&/chrome|crios/i.test(navigator.userAgent)&&!/edg|opr|brave|firefox/i.test(navigator.userAgent),yt=r=>r+($e()?.01:0),qe=()=>{try{const r=navigator.deviceMemory??4,a=navigator.hardwareConcurrency??4;return ue()&&(r<=2||a<=4)||r<=2||a<=2?"low":r<=4||a<=4?"mid":"high"}catch{return"mid"}};function vt(r,a,d,o=.08){let c=1/0,u=!1,m="";const C=yt(o);return d.forEach(S=>{const[I,k]=S.split(",").map(x=>parseFloat(x.trim())),g=wt(r,a,I,k);g<=C&&(u=!0),g<c&&(c=g,m=S)}),{isNearby:u,distance:c,nearestLocation:m}}function St(){const r=new Date,a=r.getFullYear(),d=String(r.getMonth()+1).padStart(2,"0"),o=String(r.getDate()).padStart(2,"0"),c=String(r.getHours()).padStart(2,"0"),u=String(r.getMinutes()).padStart(2,"0"),m=String(r.getSeconds()).padStart(2,"0");return`${a}-${d}-${o}T${c}:${u}:${m}Z`}function kt(r,a){let d;return(...o)=>{clearTimeout(d),d=setTimeout(()=>r(...o),a)}}function Ct(r,a){let d;return(...o)=>{d||(r(...o),d=!0,setTimeout(()=>d=!1,a))}}const v={hasStoredPermission:r=>P.getItem(r)==="true",setPermissionStatus:(r,a)=>{P.setItem(r,a.toString())},hasShownExplanation:()=>P.getItem(Ae)==="true",setExplanationShown:()=>{P.setItem(Ae,"true")},checkBrowserPermission:async r=>{try{return"permissions"in navigator?(await navigator.permissions.query({name:r})).state:null}catch(a){return console.warn(`Permission check failed for ${r}:`,a),null}}},ee="/regional/models",Be=(r,a)=>{const d=qe();let o={ideal:640,max:1280},c={ideal:480,max:720},u={ideal:15,max:30};d==="low"?(o={ideal:480,max:640},c={ideal:360,max:480},u={ideal:12,max:24}):d==="mid"?(o={ideal:640,max:960},c={ideal:480,max:540},u={ideal:15,max:30}):(o={ideal:640,max:1280},c={ideal:480,max:720},u={ideal:24,max:30});const m={width:o,height:c,frameRate:u,aspectRatio:1.333};return a?m.deviceId={exact:a}:m.facingMode=r,{video:m}};function jt({userObject:r}){const a=Oe(),[d,o]=s.useState(!1),[c,u]=s.useState(!1),[m,C]=s.useState([]),[S,I]=s.useState([]),[k,g]=s.useState(null),[x,F]=s.useState(null),[q,D]=s.useState(null),[fe,Y]=s.useState("pending"),[h,M]=s.useState("Checking permissions..."),[ge,N]=s.useState("Loading..."),[z,Nt]=s.useState("user"),[Et,he]=s.useState([]),[pe,Ye]=s.useState(!1),[V,te]=s.useState(!1),[xe,Ve]=s.useState([]),[T,we]=s.useState(""),K=s.useRef(null),j=s.useRef(!1),U=s.useRef(null),re=s.useRef(!1),b=s.useRef(null),L=s.useRef(null),A=s.useRef(),W=s.useRef(null),O=s.useRef(),_=s.useRef(),be=s.useRef(),R=s.useRef(0),ye=fe==="passed"&&j.current&&x==="ok"&&K.current===!0,ve=s.useCallback(()=>{if(!V&&!(Date.now()<R.current)){try{if(p.isVisible&&p.isVisible())return}catch{}te(!0),p.fire({title:"Biometric Actions",html:`
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
    `,showConfirmButton:!1,showCancelButton:!1,allowOutsideClick:!1,allowEscapeKey:!1,position:"center",toast:!1,timer:6e3,timerProgressBar:!0,width:"420px",background:"#fff",customClass:{popup:"floating-menu-popup",timerProgressBar:"floating-menu-timer"},didOpen:()=>{var e,t,i,l;(e=document.getElementById("time-in-btn"))==null||e.addEventListener("click",()=>{R.current=Date.now()+3e3,Z("I"),p.close()}),(t=document.getElementById("break-in-btn"))==null||t.addEventListener("click",()=>{R.current=Date.now()+3e3,Z("i"),p.close()}),(i=document.getElementById("break-out-btn"))==null||i.addEventListener("click",()=>{R.current=Date.now()+3e3,Z("0"),p.close()}),(l=document.getElementById("time-out-btn"))==null||l.addEventListener("click",()=>{R.current=Date.now()+3e3,Z("o"),p.close()})},willClose:()=>{R.current=Math.max(R.current,Date.now()+3e3),te(!1)}}),_.current=setTimeout(()=>{p.close(),te(!1)},4e3)}},[V]);s.useEffect(()=>(ye&&!V&&Date.now()>=R.current&&(!p.isVisible||!p.isVisible())&&ve(),()=>{_.current&&clearTimeout(_.current)}),[ye,V,ve]);const Se=s.useCallback(()=>{v.hasShownExplanation()?ke():p.fire({title:"Permission Setup Required",html:`
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
          `,icon:"info",confirmButtonText:"Grant Permissions",confirmButtonColor:"#3085d6",allowOutsideClick:!1,allowEscapeKey:!1}).then(()=>{v.setExplanationShown(),ke()})},[]),ke=s.useCallback(async()=>{N("Checking permissions...");const e=v.hasStoredPermission(Q),t=v.hasStoredPermission(X),i=await v.checkBrowserPermission("camera"),l=await v.checkBrowserPermission("geolocation");e&&i==="granted"?F("ok"):i==="denied"?(F("permission_denied"),v.setPermissionStatus(Q,!1)):await H(),t&&l==="granted"?(g("ok"),j.current=!0):l==="denied"?(g("permission_denied"),j.current=!1,v.setPermissionStatus(X,!1)):await $(),Ye(!0)},[]),B=s.useCallback(async()=>{var e;try{if(!((e=navigator.mediaDevices)!=null&&e.enumerateDevices))return;const t=await navigator.mediaDevices.enumerateDevices();Ve(t.filter(i=>i.kind==="videoinput"))}catch(t){console.warn("Failed to enumerate cameras:",t)}},[]),H=s.useCallback(async()=>{F("checking");try{const e=Be(z,T||void 0),t=await navigator.mediaDevices.getUserMedia(e);F("ok"),v.setPermissionStatus(Q,!0),t.getTracks().forEach(i=>i.stop()),B()}catch(e){e.name==="NotAllowedError"||e.name==="PermissionDeniedError"?(F("permission_denied"),v.setPermissionStatus(Q,!1),Ke()):(F("error"),console.error("Camera access error:",e))}},[z,T,B]),ne=s.useCallback(()=>{const e=window.location.origin,t=navigator.userAgent.toLowerCase(),i=t.includes("edg"),l=t.includes("firefox"),f=/android|iphone|ipad|ipod/i.test(t),y=(t.includes("chrome")||t.includes("crios"))&&!i&&!t.includes("opr");let w=null;if(!f&&(y||i)?w=`${i?"edge":"chrome"}://settings/content/siteDetails?site=${encodeURIComponent(e)}`:!f&&l&&(w="about:preferences#privacy"),w)try{window.open(w,"_blank")}catch{}const E=f?`<ol style="text-align:left; padding-left: 20px;">
            <li>Tap the lock icon in the address bar</li>
            <li>Permissions ➜ Location</li>
            <li>Choose "Allow while using"</li>
          </ol>`:`<p>In Site Settings, set Location to <strong>Allow</strong> for ${e}, then return here.</p>`;p.fire({icon:"info",title:"Enable location for this site",html:E,confirmButtonText:"Reload Page",allowOutsideClick:!1,allowEscapeKey:!1}).then(()=>window.location.reload())},[]),$=s.useCallback(async()=>(g("checking"),navigator.geolocation?new Promise(e=>{navigator.geolocation.getCurrentPosition(t=>{g("ok"),j.current=!0,v.setPermissionStatus(X,!0),e("granted")},t=>{t.code===t.PERMISSION_DENIED?(g("permission_denied"),j.current=!1,v.setPermissionStatus(X,!1),se(),e("denied")):(g("error"),j.current=!1,console.error("Location access error:",t),e("error"))},{enableHighAccuracy:!1,timeout:1e4,maximumAge:0})}):(g("error"),D("❌ Geolocation not supported"),j.current=!1,"error")),[]),Ke=s.useCallback(()=>{p.fire({title:"Camera Permission Required",html:`
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
        `,icon:"warning",confirmButtonText:"Try Again",showCancelButton:!0,cancelButtonText:"Skip",confirmButtonColor:"#3085d6"}).then(e=>{e.isConfirmed&&H()})},[H]),se=s.useCallback(()=>{p.fire({title:"Location Permission Required",html:`
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
        `,icon:"warning",confirmButtonText:"Grant Location Access",showCancelButton:!1,confirmButtonColor:"#3085d6"}).then(e=>{e.isConfirmed?v.checkBrowserPermission("geolocation").then(t=>{t==="denied"?ne():$().finally(()=>window.location.reload())}).catch(()=>$().finally(()=>window.location.reload())):e.isDenied&&ne()})},[$,ne]),G=s.useCallback(Ct(e=>{if(U.current=e,!j.current){D("❌ Location permission required"),g("permission_denied");return}const t=()=>{if(!navigator.geolocation){D("❌ Geolocation not supported"),g("error");return}navigator.geolocation.getCurrentPosition(i=>{const{latitude:l,longitude:f}=i.coords,{isNearby:y,distance:w}=vt(l,f,e);K.current=y;const E=y?`✅ Within office range! (${w.toFixed(2)} km)`:`❌ Outside office range (${w.toFixed(2)} km from nearest office)`;D(E),g("ok")},i=>{if(console.error("Location error:",i),K.current!==null){const l=K.current?"✅ Within office range! (checking...)":"❌ Outside office range (checking...)";D(f=>!f||f.includes("Location permission required")||f.includes("Location access failed")?l:f)}else D("❌ Location access failed"),g("error")},{enableHighAccuracy:ue()||$e(),timeout:ue()?2e4:1e4,maximumAge:0})};O.current&&clearInterval(O.current),t(),O.current=setInterval(t,45e3)},15e3),[]),Ce=s.useCallback(async()=>{if(!c)try{N("Loading models...");try{const e=st;e!=null&&e.setBackend&&(await e.setBackend("webgl"),e!=null&&e.ready&&await e.ready())}catch{}await Promise.all([J.tinyFaceDetector.loadFromUri(ee),J.faceLandmark68TinyNet.loadFromUri(ee),J.faceRecognitionNet.loadFromUri(ee),J.faceExpressionNet.loadFromUri(ee)]);try{const e=document.createElement("canvas");e.width=128,e.height=128;const t=e.getContext("2d");t==null||t.fillRect(0,0,1,1),await De(e,new Me({inputSize:160,scoreThreshold:.9})).withFaceLandmarks(!0).withFaceDescriptors().withFaceExpressions()}catch{}u(!0)}catch{N("Error loading models")}},[c]),je=s.useCallback(async()=>{try{const e=await Promise.all(m.map(t=>{const i=t.descriptors.map(l=>new Float32Array(l));return new it(t.label,i)}));W.current=new ot(e,.6)}catch(e){console.error("Face matcher initialization error:",e)}},[m]),Ne=s.useCallback(async()=>{var e;if(x!=="ok"){M("Camera permission required");return}try{(e=b.current)!=null&&e.srcObject&&(b.current.srcObject.getTracks().forEach(f=>f.stop()),b.current.srcObject=null);const t=Be(z,T||void 0),i=await navigator.mediaDevices.getUserMedia(t);b.current&&(b.current.srcObject=i,b.current.onloadedmetadata=()=>{M("Please smile to verify liveliness")})}catch(t){if(console.error("Error starting video:",t),T&&((t==null?void 0:t.name)==="OverconstrainedError"||(t==null?void 0:t.name)==="NotFoundError")){M("Selected camera unavailable — reverting to default"),we("");return}N("Error accessing camera"),F("error")}},[z,x,T]),Ee=s.useCallback(()=>{if(!W.current||!b.current||!L.current||x!=="ok")return;A.current&&clearInterval(A.current);const e=qe(),t=e==="low"?224:e==="mid"?320:416,i=e==="low"?700:e==="mid"?500:350,l=async()=>{try{if(!b.current||!L.current||!W.current)return;const f=await De(b.current,new Me({inputSize:t,scoreThreshold:.6})).withFaceLandmarks(!0).withFaceDescriptors().withFaceExpressions(),y=L.current,w={width:500,height:600};pt(y,w);const E=_e(f,w),ie=y.getContext("2d",{willReadFrequently:!0});if(ie&&ie.clearRect(0,0,w.width,w.height),E.length>0){const oe=E.map(ae=>W.current.findBestMatch(ae.descriptor));ht(y,E),oe.forEach((ae,He)=>{const Ge=E[He].detection.box;new ze(Ge,{label:ae.toString()}).draw(y)});const We=E[0].expressions,Ie=oe[0],Le=Ie&&Ie.label!=="unknown",Re=bt(We);Le&&Re?(Y("passed"),M("Nice Smile!😉")):Le&&!Re?(Y("pending"),M("Please smile.")):(Y("pending"),M("Face not recognized.")),he(oe),N("Running")}else Y("pending"),N("Running"),M("No face detected"),he([])}catch(f){console.error("Face detection error:",f)}};A.current=setInterval(l,i)},[x]),Pe=s.useCallback(async()=>{var e,t;try{const l=(await de.get("users/userDetails/",{headers:{Authorization:`Token ${P.getItem("accessToken")}`}})).data;if(P.setItem("user",JSON.stringify(l)),!(l!=null&&l.description))throw new Error("No face description data in API response");C([{label:l.full_name,descriptors:l.description}]),I([{id:l.full_name,name:l.full_name,position:l.job_title}]),o(!0),((e=l.location)==null?void 0:e.length)>0?(U.current=l.location,G(l.location)):(D("❌ No office locations configured"),g("error"))}catch(i){if(((t=i==null?void 0:i.response)==null?void 0:t.status)===401){N("Session expired"),p.fire({icon:"warning",title:"Session Expired",text:"Please log in again to continue.",confirmButtonText:"Log In",confirmButtonColor:"#3085d6",allowOutsideClick:!1,allowEscapeKey:!1}).then(()=>{P.clear(),window.location.href="/regional"});return}N(i.message||"Error loading face data"),g("error")}},[G]),Ue={I:{message:"clocked in",emoji:"🌅"},i:{message:"started break",emoji:"☕"},0:{message:"ended break",emoji:"🍽️"},o:{message:"clocked out",emoji:"🌙"}},Z=s.useCallback(kt(e=>{const{message:t,emoji:i}=Ue[e],l=St();de.post("checkinoutregion/create/",{CHECKTIME:l,CHECKTYPE:e,VERIFYCODE:r.deptid,SENSORID:0},{headers:{Authorization:`Token ${P.getItem("accessToken")}`}}).then(()=>{const f={I:"Have a great day at work! 💼",i:"Enjoy your break! ☕",0:"Welcome back! 🔋",o:"See you tomorrow! 🌙"};p.fire({title:`${i} Success! ${i}`,html:`
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
            `,icon:"success",confirmButtonColor:"#3085d6",timer:3e3,showConfirmButton:!1,customClass:{popup:"success-popup",title:"success-title"}}),setTimeout(()=>{a("/regional/user/home"),window.location.reload()},3e3)}).catch(f=>{var y,w;p.fire({icon:"error",title:"❌ Oops! Something went wrong",html:`
              <div style="text-align: center; margin: 20px 0;">
                <p style="font-size: 16px; margin-bottom: 10px;">
                  ${((w=(y=f.response)==null?void 0:y.data)==null?void 0:w.detail)||"An error occurred while processing your request."}
                </p>
                <p style="font-size: 14px; color: #666; font-style: italic;">
                  😔 Don't worry, please try again!
                </p>
              </div>
            `,confirmButtonColor:"#d33",confirmButtonText:"Try Again 🔄"})})},1e3),[r,a]);return s.useEffect(()=>(Pe(),Se(),()=>{var e;if((e=b.current)!=null&&e.srcObject&&(b.current.srcObject.getTracks().forEach(i=>i.stop()),b.current.srcObject=null),A.current&&clearInterval(A.current),O.current&&clearInterval(O.current),_.current&&clearTimeout(_.current),be.current&&cancelAnimationFrame(be.current),L.current){const t=L.current.getContext("2d",{willReadFrequently:!0});t&&t.clearRect(0,0,L.current.width,L.current.height)}N("Stopped")}),[Pe,Se]),s.useEffect(()=>{c||Ce()},[c,Ce]),s.useEffect(()=>(c&&d&&m.length>0&&pe&&x==="ok"&&(async()=>(await je(),await Ne(),Ee()))(),()=>{A.current&&clearInterval(A.current)}),[c,d,m.length,pe,x,z,T,je,Ne,Ee]),s.useEffect(()=>{var t;if(x!=="ok")return;B();const e=navigator.mediaDevices;return(t=e==null?void 0:e.addEventListener)==null||t.call(e,"devicechange",B),()=>{var i;return(i=e==null?void 0:e.removeEventListener)==null?void 0:i.call(e,"devicechange",B)}},[x,B]),s.useEffect(()=>{(k==="permission_denied"||q&&q.includes("Location permission required"))&&!re.current&&(re.current=!0,se()),k==="ok"&&(re.current=!1)},[k,q,se]),s.useEffect(()=>{let e=null;return(async()=>{try{const i=await navigator.permissions.query({name:"geolocation"});e=i;const l=()=>{i.state==="granted"?(g("ok"),j.current=!0,U.current&&G(U.current)):i.state==="denied"&&(g("permission_denied"),j.current=!1)};i.onchange=l}catch{}})(),()=>{e&&(e.onchange=null)}},[G]),n.jsxs("div",{className:"flex-1 h-full overflow-auto bg-background",children:[n.jsx("style",{children:`
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
        `}),n.jsxs("div",{className:"flex-1 flex flex-col items-center justify-center min-h-screen p-6",children:[n.jsxs("div",{className:"text-center mb-12",children:[n.jsx("h1",{className:"text-4xl sm:text-3xl font-bold text-primary mb-2",children:"🔐 Digital Biometric"}),n.jsxs("p",{className:"text-secondary-foreground text-lg",children:["Welcome back, ",n.jsx("span",{className:"font-semibold text-primary",children:r.full_name})]}),n.jsx("p",{className:"text-sm text-secondary-foreground mt-2",children:q})]}),n.jsx("div",{className:"flex w-full justify-center px-4",children:n.jsx("div",{className:"flex flex-col items-center gap-6",children:n.jsxs("div",{className:"relative flex items-center justify-center",children:[n.jsxs("div",{className:"absolute w-[350px] h-[350px] sm:w-[240px] sm:h-[240px] pointer-events-none rounded-full ",children:[n.jsx("div",{className:`absolute z-[999] inset-0 rounded-full pulse-ring ${h==="Nice Smile!😉"?"ring-2 ring-blue-400":h==="Please smile."?"ring-2 ring-green-500":h==="Face not recognized."?"ring-2 ring-red-500":h==="No face detected"?"ring-2 ring-red-500/80":"ring-2 ring-gray-400/30"}`}),n.jsx("div",{className:`absolute inset-0 rounded-full pulse-ring-alt ${h==="Nice Smile!😉"?"ring-2 ring-blue-400":h==="Please smile."?"ring-2 ring-green-300/70":h==="Face not recognized."?"ring-2 ring-yellow-400/70":h==="No face detected"?"ring-2 ring-red-400/30":"ring-2 ring-gray-300/20"}`}),n.jsx("div",{className:`absolute inset-0 rounded-full pulse-ring-slow ${h==="Nice Smile!😉"?"ring-2 ring-blue-300":h==="Please smile."?"ring-2 ring-green-300/40":h==="Face not recognized."?"ring-2 ring-yellow-300/40":h==="No face detected"?"ring-2 ring-red-400/20":"ring-2 ring-gray-300/10"}`})]}),n.jsxs("div",{className:`flex items-center justify-center w-[400px] h-[400px] sm:w-80 sm:h-80 rounded-full overflow-hidden transition-all duration-300 ${h==="Nice Smile!😉"?"ring-4 ring-blue-500 ring-offset-2 shadow-lg shadow-blue-500/50":h==="Please smile."?"ring-4 ring-green-400 ring-offset-2 shadow-lg shadow-green-500/50":h==="Face not recognized."?"ring-4 ring-yellow-500 ring-offset-2 shadow-lg shadow-yellow-500/50":h==="No face detected"?"ring-4 ring-red-400 ring-offset-2 shadow-lg shadow-red-500/40":"ring-4 ring-gray-400 ring-offset-2"} bg-gradient-to-br from-slate-900 to-slate-800`,children:[n.jsx("video",{crossOrigin:"anonymous",ref:b,className:"w-full h-full object-cover",autoPlay:!0,muted:!0,playsInline:!0}),n.jsx("canvas",{ref:L,className:"w-full h-full absolute inset-0"})]}),n.jsx("div",{className:"absolute flex justify-center translate-y-[190px] sm:translate-y-[140px] w-full ",children:n.jsx("span",{className:`px-4 py-2 backdrop-blur-sm rounded-full text-sm sm:text-xs font-medium transition-all ${fe==="passed"?"bg-blue-500/60 text-green-50 border ":"bg-green-500/60  text-yellow-50 border "}`,children:h})})]})})}),n.jsxs("div",{className:"relative grid grid-cols-3 justify-center w-full mt-20 px-4 gap-4",children:[n.jsxs("div",{className:"flex flex-col gap-2 justify-start max-w-60",children:[n.jsx("p",{className:"text-xs font-semibold text-secondary-foreground uppercase tracking-wide",children:"Status"}),n.jsxs("span",{className:`inline-flex items-center gap-2 px-3 py-1 rounded-full text-sm font-medium ${ge==="Running"?"bg-green-600 text-green-50 border border-green-500":"bg-red-600 text-red-50 border border-red-500"}`,children:[n.jsx("span",{className:"w-2 h-2 rounded-full bg-current animate-pulse"}),ge]})]}),n.jsx("div",{className:"flex flex-col items-center gap-2",children:xe.length>1&&n.jsxs(at,{value:T||"auto",onValueChange:e=>we(e==="auto"?"":e),children:[n.jsxs(ct,{className:"h-8 w-40 text-xs gap-1 px-2 text-accent-foreground",children:[n.jsx(gt,{className:"w-3.5 h-3.5 shrink-0 text-muted-foreground"}),n.jsx(lt,{placeholder:"Camera",className:"text-accent-foreground"})]}),n.jsxs(dt,{className:"text-accent-foreground",children:[n.jsx(Te,{value:"auto",children:"Auto (Front/Back)"}),xe.map((e,t)=>n.jsx(Te,{className:"text-accent-foreground",value:e.deviceId,children:e.label||`Camera ${t+1}`},e.deviceId))]})]})}),n.jsxs("div",{className:"flex flex-col gap-2 justify-end text-right",children:[n.jsx("p",{className:"text-xs font-semibold text-secondary-foreground uppercase tracking-wide",children:"Permissions"}),n.jsxs("div",{className:"flex gap-3 justify-end",children:[n.jsxs("button",{onClick:()=>{x!=="ok"&&H()},className:"flex items-center gap-1 px-2 py-1 rounded transition-all hover:bg-white/10 cursor-pointer group",title:x==="ok"?"Camera enabled":"Click to enable camera",children:[n.jsx(mt,{className:`w-4 h-4 transition-all ${x==="ok"?"text-green-500":"text-red-500 group-hover:scale-110"}`}),n.jsx("span",{className:`w-2 h-2 rounded-full transition-all ${x==="ok"?"bg-green-500":"bg-red-500 group-hover:scale-125"}`})]}),n.jsxs("button",{onClick:()=>{k!=="ok"&&$()},className:"flex items-center gap-1 px-2 py-1 rounded transition-all hover:bg-white/10 cursor-pointer group",title:k==="ok"?"Location enabled":"Click to enable location",children:[n.jsx(ft,{className:`w-4 h-4 transition-all ${k==="ok"?"text-green-500":"text-red-500 group-hover:scale-110"}`}),n.jsx("span",{className:`w-2 h-2 rounded-full transition-all ${k==="ok"?"bg-green-500":"bg-red-500 group-hover:scale-125"}`})]})]})]})]})]})]})}function Rt(){const[r,a]=s.useState(null),[d,o]=s.useState(!0),[c,u]=s.useState(60),m=Oe();s.useEffect(()=>{de.get("users/userDetails/",{headers:{Authorization:`Token ${P.getItem("accessToken")}`}}).then(S=>{a(S.data)}).finally(()=>o(!1))},[]),s.useEffect(()=>{const S=setInterval(()=>{u(I=>(I<=1&&(m("/regional/user/temp"),window.location.reload()),I-1))},1e3);return()=>clearInterval(S)},[m]);const C=S=>{const I=Math.floor(S/60),k=S%60;return`${I.toString().padStart(2,"0")}:${k.toString().padStart(2,"0")}`};return d?n.jsx("div",{className:"flex h-full w-full justify-center items-center",children:"Loading..."}):!r||!r.description||r.description.length===0?n.jsx("div",{className:"flex-1 h-full flex items-center justify-center",children:n.jsx(xt,{})}):n.jsxs("div",{className:"flex-1 h-full overflow-auto",children:[n.jsxs("div",{className:"fixed bottom-20 right-2 bg-gray-100 px-3 py-1 rounded-md font-mono text-sm z-50",children:[n.jsx("span",{className:" md:hidden",children:"Session Timer:"}),"   ",C(c)]}),n.jsx(ut,{}),n.jsx(s.Suspense,{fallback:n.jsx("div",{children:"Loading..."}),children:n.jsx(jt,{userObject:r})})]})}export{Rt as default};
