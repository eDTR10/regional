import{o as le,a5 as ie,a6 as oe,a7 as Ke,a8 as Ue,a9 as Fe,aa as We,ab as Ve,ac as He,ad as Ge,ae as Pe,af as Je,j as n,L as Ze,u as Me,r,S as p,ag as Xe,z as H,ah as Ee,ai as Re,aj as Qe,ak as et,a as ae}from"./index-f72d9205.js";import{D as tt}from"./DashboardAnalogClock-e9ba90c2.js";const rt=le("Camera",[["path",{d:"M14.5 4h-5L7 7H4a2 2 0 0 0-2 2v9a2 2 0 0 0 2 2h16a2 2 0 0 0 2-2V9a2 2 0 0 0-2-2h-3l-2.5-3z",key:"1tc9qg"}],["circle",{cx:"12",cy:"13",r:"3",key:"1vg3eu"}]]),nt=le("MapPin",[["path",{d:"M20 10c0 6-8 12-8 12s-8-6-8-12a8 8 0 0 1 16 0Z",key:"2oe9fu"}],["circle",{cx:"12",cy:"10",r:"3",key:"ilqhr7"}]]),st=le("RotateCcw",[["path",{d:"M3 12a9 9 0 1 0 9-9 9.75 9.75 0 0 0-6.74 2.74L3 8",key:"1357e3"}],["path",{d:"M3 3v5h5",key:"1xhq8a"}]]);function it(t,a){var c=Array.isArray(a)?a:[a];c.forEach(function(o){var l=o instanceof ie?o.score:oe(o)?o.detection.score:void 0,d=o instanceof ie?o.box:oe(o)?o.detection.box:new Ke(o),f=l?""+Ue(l):void 0;new Fe(d,{label:f}).draw(t)})}function ot(t,a,c){c===void 0&&(c=!1);var o=c?We(a):a,l=o.width,d=o.height;return t.width=l,t.height=d,{width:l,height:d}}function De(t,a){var c=new Ve(a.width,a.height),o=c.width,l=c.height;if(o<=0||l<=0)throw new Error("resizeResults - invalid dimensions: "+JSON.stringify({width:o,height:l}));if(Array.isArray(t))return t.map(function(j){return De(j,{width:o,height:l})});if(He(t)){var d=t.detection.forSize(o,l),f=t.unshiftedLandmarks.forSize(d.box.width,d.box.height);return Ge(Pe(t,d),f)}return oe(t)?Pe(t,t.detection.forSize(o,l)):t instanceof Je||t instanceof ie?t.forSize(o,l):t}const at=()=>n.jsx("div",{className:"flex flex-col items-center justify-center h-screen w-full",children:n.jsxs("div",{className:"bg-card border border-border rounded-md p-8 shadow-md flex flex-col items-center",children:[n.jsx("p",{className:"text-2xl font-bold text-primary mb-2",children:"Face Registration Required"}),n.jsx("p",{className:"text-foreground text-center",children:"Please register your face from your profile to use this page."}),n.jsx(Ze,{to:"/regional/user/profile",className:" animate-bounce cursor-pointer text-primary text-xs",children:" View Profile →  Register your Face for Digital Biometric"}),n.jsx("p",{className:" text-xs text-yellow-500 mt-5",children:"*Note: Images won't be saved to the database — your privacy is safe 😊!"})]})}),G="location_permission_granted",J="camera_permission_granted",Le="permissions_explained";function ct(t,a,c,o){const d=(c-t)*Math.PI/180,f=(o-a)*Math.PI/180,j=Math.sin(d/2)*Math.sin(d/2)+Math.cos(t*Math.PI/180)*Math.cos(c*Math.PI/180)*Math.sin(f/2)*Math.sin(f/2);return 6371*(2*Math.atan2(Math.sqrt(j),Math.sqrt(1-j)))}function lt(t){return t.happy>.5}const ce=()=>typeof navigator<"u"&&/android|iphone|ipad|ipod|iemobile|mobile/i.test(navigator.userAgent),Te=()=>typeof navigator<"u"&&/chrome|crios/i.test(navigator.userAgent)&&!/edg|opr|brave|firefox/i.test(navigator.userAgent),dt=t=>t+(Te()?.01:0),Ae=()=>{try{const t=navigator.deviceMemory??4,a=navigator.hardwareConcurrency??4;return ce()&&(t<=2||a<=4)||t<=2||a<=2?"low":t<=4||a<=4?"mid":"high"}catch{return"mid"}};function ut(t,a,c,o=.08){let l=1/0,d=!1,f="";const j=dt(o);return c.forEach(S=>{const[P,k]=S.split(",").map(w=>parseFloat(w.trim())),g=ct(t,a,P,k);g<=j&&(d=!0),g<l&&(l=g,f=S)}),{isNearby:d,distance:l,nearestLocation:f}}function mt(){const t=new Date,a=t.getFullYear(),c=String(t.getMonth()+1).padStart(2,"0"),o=String(t.getDate()).padStart(2,"0"),l=String(t.getHours()).padStart(2,"0"),d=String(t.getMinutes()).padStart(2,"0"),f=String(t.getSeconds()).padStart(2,"0");return`${a}-${c}-${o}T${l}:${d}:${f}Z`}function ft(t,a){let c;return(...o)=>{clearTimeout(c),c=setTimeout(()=>t(...o),a)}}function gt(t,a){let c;return(...o)=>{c||(t(...o),c=!0,setTimeout(()=>c=!1,a))}}const v={hasStoredPermission:t=>localStorage.getItem(t)==="true",setPermissionStatus:(t,a)=>{localStorage.setItem(t,a.toString())},hasShownExplanation:()=>localStorage.getItem(Le)==="true",setExplanationShown:()=>{localStorage.setItem(Le,"true")},checkBrowserPermission:async t=>{try{return"permissions"in navigator?(await navigator.permissions.query({name:t})).state:null}catch(a){return console.warn(`Permission check failed for ${t}:`,a),null}}},Z="/regional/models",Ie=t=>{const a=Ae();let c={ideal:640,max:1280},o={ideal:480,max:720},l={ideal:15,max:30};return a==="low"?(c={ideal:480,max:640},o={ideal:360,max:480},l={ideal:12,max:24}):a==="mid"?(c={ideal:640,max:960},o={ideal:480,max:540},l={ideal:15,max:30}):(c={ideal:640,max:1280},o={ideal:480,max:720},l={ideal:24,max:30}),{video:{facingMode:t,width:c,height:o,frameRate:l,aspectRatio:1.333}}};function ht({userObject:t}){const a=Me(),[c,o]=r.useState(!1),[l,d]=r.useState(!1),[f,j]=r.useState([]),[S,P]=r.useState([]),[k,g]=r.useState(null),[w,I]=r.useState(null),[$,F]=r.useState(null),[de,O]=r.useState("pending"),[h,D]=r.useState("Checking permissions..."),[ue,E]=r.useState("Loading..."),[T,ze]=r.useState("user"),[pt,me]=r.useState([]),[fe,Be]=r.useState(!1),[_,X]=r.useState(!1),q=r.useRef(null),C=r.useRef(!1),Y=r.useRef(null),Q=r.useRef(!1),b=r.useRef(null),R=r.useRef(null),M=r.useRef(),K=r.useRef(null),A=r.useRef(),z=r.useRef(),ge=r.useRef(),L=r.useRef(0),he=de==="passed"&&C.current&&w==="ok"&&q.current===!0,pe=r.useCallback(()=>{if(!_&&!(Date.now()<L.current)){try{if(p.isVisible&&p.isVisible())return}catch{}X(!0),p.fire({title:"Biometric Actions",html:`
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
    `,showConfirmButton:!1,showCancelButton:!1,allowOutsideClick:!1,allowEscapeKey:!1,position:"center",toast:!1,timer:6e3,timerProgressBar:!0,width:"420px",background:"#fff",customClass:{popup:"floating-menu-popup",timerProgressBar:"floating-menu-timer"},didOpen:()=>{var e,s,i,u;(e=document.getElementById("time-in-btn"))==null||e.addEventListener("click",()=>{L.current=Date.now()+3e3,V("I"),p.close()}),(s=document.getElementById("break-in-btn"))==null||s.addEventListener("click",()=>{L.current=Date.now()+3e3,V("i"),p.close()}),(i=document.getElementById("break-out-btn"))==null||i.addEventListener("click",()=>{L.current=Date.now()+3e3,V("0"),p.close()}),(u=document.getElementById("time-out-btn"))==null||u.addEventListener("click",()=>{L.current=Date.now()+3e3,V("o"),p.close()})},willClose:()=>{L.current=Math.max(L.current,Date.now()+3e3),X(!1)}}),z.current=setTimeout(()=>{p.close(),X(!1)},4e3)}},[_]);r.useEffect(()=>(he&&!_&&Date.now()>=L.current&&(!p.isVisible||!p.isVisible())&&pe(),()=>{z.current&&clearTimeout(z.current)}),[he,_,pe]);const xe=r.useCallback(()=>{v.hasShownExplanation()?we():p.fire({title:"Permission Setup Required",html:`
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
          `,icon:"info",confirmButtonText:"Grant Permissions",confirmButtonColor:"#3085d6",allowOutsideClick:!1,allowEscapeKey:!1}).then(()=>{v.setExplanationShown(),we()})},[]),we=r.useCallback(async()=>{E("Checking permissions...");const e=v.hasStoredPermission(J),s=v.hasStoredPermission(G),i=await v.checkBrowserPermission("camera"),u=await v.checkBrowserPermission("geolocation");e&&i==="granted"?I("ok"):i==="denied"?(I("permission_denied"),v.setPermissionStatus(J,!1)):await U(),s&&u==="granted"?(g("ok"),C.current=!0):u==="denied"?(g("permission_denied"),C.current=!1,v.setPermissionStatus(G,!1)):await B(),Be(!0)},[]),U=r.useCallback(async()=>{I("checking");try{const e=Ie(T),s=await navigator.mediaDevices.getUserMedia(e);I("ok"),v.setPermissionStatus(J,!0),s.getTracks().forEach(i=>i.stop())}catch(e){e.name==="NotAllowedError"||e.name==="PermissionDeniedError"?(I("permission_denied"),v.setPermissionStatus(J,!1),$e()):(I("error"),console.error("Camera access error:",e))}},[T]),ee=r.useCallback(()=>{const e=window.location.origin,s=navigator.userAgent.toLowerCase(),i=s.includes("edg"),u=s.includes("firefox"),m=/android|iphone|ipad|ipod/i.test(s),y=(s.includes("chrome")||s.includes("crios"))&&!i&&!s.includes("opr");let x=null;if(!m&&(y||i)?x=`${i?"edge":"chrome"}://settings/content/siteDetails?site=${encodeURIComponent(e)}`:!m&&u&&(x="about:preferences#privacy"),x)try{window.open(x,"_blank")}catch{}const N=m?`<ol style="text-align:left; padding-left: 20px;">
            <li>Tap the lock icon in the address bar</li>
            <li>Permissions ➜ Location</li>
            <li>Choose "Allow while using"</li>
          </ol>`:`<p>In Site Settings, set Location to <strong>Allow</strong> for ${e}, then return here.</p>`;p.fire({icon:"info",title:"Enable location for this site",html:N,confirmButtonText:"Reload Page",allowOutsideClick:!1,allowEscapeKey:!1}).then(()=>window.location.reload())},[]),B=r.useCallback(async()=>(g("checking"),navigator.geolocation?new Promise(e=>{navigator.geolocation.getCurrentPosition(s=>{g("ok"),C.current=!0,v.setPermissionStatus(G,!0),e("granted")},s=>{s.code===s.PERMISSION_DENIED?(g("permission_denied"),C.current=!1,v.setPermissionStatus(G,!1),te(),e("denied")):(g("error"),C.current=!1,console.error("Location access error:",s),e("error"))},{enableHighAccuracy:!1,timeout:1e4,maximumAge:0})}):(g("error"),F("❌ Geolocation not supported"),C.current=!1,"error")),[]),$e=r.useCallback(()=>{p.fire({title:"Camera Permission Required",html:`
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
        `,icon:"warning",confirmButtonText:"Try Again",showCancelButton:!0,cancelButtonText:"Skip",confirmButtonColor:"#3085d6"}).then(e=>{e.isConfirmed&&U()})},[U]),te=r.useCallback(()=>{p.fire({title:"Location Permission Required",html:`
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
        `,icon:"warning",confirmButtonText:"Grant Location Access",showCancelButton:!1,confirmButtonColor:"#3085d6"}).then(e=>{e.isConfirmed?v.checkBrowserPermission("geolocation").then(s=>{s==="denied"?ee():B().finally(()=>window.location.reload())}).catch(()=>B().finally(()=>window.location.reload())):e.isDenied&&ee()})},[B,ee]),W=r.useCallback(gt(e=>{if(Y.current=e,!C.current){F("❌ Location permission required"),g("permission_denied");return}const s=()=>{if(!navigator.geolocation){F("❌ Geolocation not supported"),g("error");return}navigator.geolocation.getCurrentPosition(i=>{const{latitude:u,longitude:m}=i.coords,{isNearby:y,distance:x}=ut(u,m,e);q.current=y;const N=y?`✅ Within office range! (${x.toFixed(2)} km)`:`❌ Outside office range (${x.toFixed(2)} km from nearest office)`;F(N),g("ok")},i=>{if(console.error("Location error:",i),q.current!==null){const u=q.current?"✅ Within office range! (checking...)":"❌ Outside office range (checking...)";F(m=>!m||m.includes("Location permission required")||m.includes("Location access failed")?u:m)}else F("❌ Location access failed"),g("error")},{enableHighAccuracy:ce()||Te(),timeout:ce()?2e4:1e4,maximumAge:0})};A.current&&clearInterval(A.current),s(),A.current=setInterval(s,45e3)},15e3),[]),be=r.useCallback(async()=>{if(!l)try{E("Loading models...");try{const e=Xe;e!=null&&e.setBackend&&(await e.setBackend("webgl"),e!=null&&e.ready&&await e.ready())}catch{}await Promise.all([H.tinyFaceDetector.loadFromUri(Z),H.faceLandmark68TinyNet.loadFromUri(Z),H.faceRecognitionNet.loadFromUri(Z),H.faceExpressionNet.loadFromUri(Z)]);try{const e=document.createElement("canvas");e.width=128,e.height=128;const s=e.getContext("2d");s==null||s.fillRect(0,0,1,1),await Ee(e,new Re({inputSize:160,scoreThreshold:.9})).withFaceLandmarks(!0).withFaceDescriptors().withFaceExpressions()}catch{}d(!0)}catch{E("Error loading models")}},[l]),ye=r.useCallback(async()=>{try{const e=await Promise.all(f.map(s=>{const i=s.descriptors.map(u=>new Float32Array(u));return new Qe(s.label,i)}));K.current=new et(e,.6)}catch(e){console.error("Face matcher initialization error:",e)}},[f]),ve=r.useCallback(async()=>{var e;if(w!=="ok"){D("Camera permission required");return}try{(e=b.current)!=null&&e.srcObject&&(b.current.srcObject.getTracks().forEach(m=>m.stop()),b.current.srcObject=null);const s=Ie(T),i=await navigator.mediaDevices.getUserMedia(s);b.current&&(b.current.srcObject=i,b.current.onloadedmetadata=()=>{D("Please smile to verify liveliness")})}catch(s){console.error("Error starting video:",s),E("Error accessing camera"),I("error")}},[T,w]),Se=r.useCallback(()=>{if(!K.current||!b.current||!R.current||w!=="ok")return;M.current&&clearInterval(M.current);const e=Ae(),s=e==="low"?224:e==="mid"?320:416,i=e==="low"?700:e==="mid"?500:350,u=async()=>{try{if(!b.current||!R.current||!K.current)return;const m=await Ee(b.current,new Re({inputSize:s,scoreThreshold:.6})).withFaceLandmarks(!0).withFaceDescriptors().withFaceExpressions(),y=R.current,x={width:500,height:600};ot(y,x);const N=De(m,x),re=y.getContext("2d",{willReadFrequently:!0});if(re&&re.clearRect(0,0,x.width,x.height),N.length>0){const ne=N.map(se=>K.current.findBestMatch(se.descriptor));it(y,N),ne.forEach((se,qe)=>{const Ye=N[qe].detection.box;new Fe(Ye,{label:se.toString()}).draw(y)});const _e=N[0].expressions,je=ne[0],Ce=je&&je.label!=="unknown",Ne=lt(_e);Ce&&Ne?(O("passed"),D("Nice Smile!😉")):Ce&&!Ne?(O("pending"),D("Please smile.")):(O("pending"),D("Face not recognized.")),me(ne),E("Running")}else O("pending"),E("Running"),D("No face detected"),me([])}catch(m){console.error("Face detection error:",m)}};M.current=setInterval(u,i)},[w]),ke=r.useCallback(async()=>{var e;try{const i=(await ae.get("users/userDetails",{headers:{Authorization:`Token ${localStorage.getItem("accessToken")}`}})).data;if(localStorage.setItem("user",JSON.stringify(i)),!(i!=null&&i.description))throw new Error("No face description data in API response");j([{label:i.full_name,descriptors:i.description}]),P([{id:i.full_name,name:i.full_name,position:i.job_title}]),o(!0),((e=i.location)==null?void 0:e.length)>0?(Y.current=i.location,W(i.location)):(F("❌ No office locations configured"),g("error"))}catch(s){E(s.message||"Error loading face data"),g("error")}},[W]),Oe={I:{message:"clocked in",emoji:"🌅"},i:{message:"started break",emoji:"☕"},0:{message:"ended break",emoji:"🍽️"},o:{message:"clocked out",emoji:"🌙"}},V=r.useCallback(ft(e=>{const{message:s,emoji:i}=Oe[e],u=mt();ae.post("checkinoutregion/create/",{CHECKTIME:u,CHECKTYPE:e,VERIFYCODE:t.deptid,SENSORID:0},{headers:{Authorization:`Token ${localStorage.getItem("accessToken")}`}}).then(()=>{const m={I:"Have a great day at work! 💼",i:"Enjoy your break! ☕",0:"Welcome back! 🔋",o:"See you tomorrow! 🌙"};p.fire({title:`${i} Success! ${i}`,html:`
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
            `,icon:"success",confirmButtonColor:"#3085d6",timer:3e3,showConfirmButton:!1,customClass:{popup:"success-popup",title:"success-title"}}),setTimeout(()=>{a("/regional/user/home"),window.location.reload()},3e3)}).catch(m=>{var y,x;p.fire({icon:"error",title:"❌ Oops! Something went wrong",html:`
              <div style="text-align: center; margin: 20px 0;">
                <p style="font-size: 16px; margin-bottom: 10px;">
                  ${((x=(y=m.response)==null?void 0:y.data)==null?void 0:x.detail)||"An error occurred while processing your request."}
                </p>
                <p style="font-size: 14px; color: #666; font-style: italic;">
                  😔 Don't worry, please try again!
                </p>
              </div>
            `,confirmButtonColor:"#d33",confirmButtonText:"Try Again 🔄"})})},1e3),[t,a]);return r.useEffect(()=>(ke(),xe(),()=>{var e;if((e=b.current)!=null&&e.srcObject&&(b.current.srcObject.getTracks().forEach(i=>i.stop()),b.current.srcObject=null),M.current&&clearInterval(M.current),A.current&&clearInterval(A.current),z.current&&clearTimeout(z.current),ge.current&&cancelAnimationFrame(ge.current),R.current){const s=R.current.getContext("2d",{willReadFrequently:!0});s&&s.clearRect(0,0,R.current.width,R.current.height)}E("Stopped")}),[ke,xe]),r.useEffect(()=>{l||be()},[l,be]),r.useEffect(()=>(l&&c&&f.length>0&&fe&&w==="ok"&&(async()=>(await ye(),await ve(),Se()))(),()=>{M.current&&clearInterval(M.current)}),[l,c,f.length,fe,w,T,ye,ve,Se]),r.useEffect(()=>{(k==="permission_denied"||$&&$.includes("Location permission required"))&&!Q.current&&(Q.current=!0,te()),k==="ok"&&(Q.current=!1)},[k,$,te]),r.useEffect(()=>{let e=null;return(async()=>{try{const i=await navigator.permissions.query({name:"geolocation"});e=i;const u=()=>{i.state==="granted"?(g("ok"),C.current=!0,Y.current&&W(Y.current)):i.state==="denied"&&(g("permission_denied"),C.current=!1)};i.onchange=u}catch{}})(),()=>{e&&(e.onchange=null)}},[W]),n.jsxs("div",{className:"flex-1 h-full overflow-auto bg-background",children:[n.jsx("style",{children:`
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
        `}),n.jsxs("div",{className:"flex-1 flex flex-col items-center justify-center min-h-screen p-6",children:[n.jsxs("div",{className:"text-center mb-12",children:[n.jsx("h1",{className:"text-4xl sm:text-3xl font-bold text-primary mb-2",children:"🔐 Digital Biometric"}),n.jsxs("p",{className:"text-secondary-foreground text-lg",children:["Welcome back, ",n.jsx("span",{className:"font-semibold text-primary",children:t.full_name})]}),n.jsx("p",{className:"text-sm text-secondary-foreground mt-2",children:$})]}),n.jsx("div",{className:"flex w-full justify-center px-4",children:n.jsx("div",{className:"flex flex-col items-center gap-6",children:n.jsxs("div",{className:"relative flex items-center justify-center",children:[n.jsxs("div",{className:"absolute w-[350px] h-[350px] sm:w-[240px] sm:h-[240px] pointer-events-none rounded-full ",children:[n.jsx("div",{className:`absolute inset-0 rounded-full pulse-ring ${h==="Nice Smile!😉"?"ring-2 ring-blue-400":h==="Please smile."?"ring-2 ring-green-500":h==="Face not recognized."?"ring-2 ring-red-500":h==="No face detected"?"ring-2 ring-red-500/80":"ring-2 ring-gray-400/30"}`}),n.jsx("div",{className:`absolute inset-0 rounded-full pulse-ring-alt ${h==="Nice Smile!😉"?"ring-2 ring-blue-400":h==="Please smile."?"ring-2 ring-green-300/70":h==="Face not recognized."?"ring-2 ring-yellow-400/70":h==="No face detected"?"ring-2 ring-red-400/30":"ring-2 ring-gray-300/20"}`}),n.jsx("div",{className:`absolute inset-0 rounded-full pulse-ring-slow ${h==="Nice Smile!😉"?"ring-2 ring-blue-300":h==="Please smile."?"ring-2 ring-green-300/40":h==="Face not recognized."?"ring-2 ring-yellow-300/40":h==="No face detected"?"ring-2 ring-red-400/20":"ring-2 ring-gray-300/10"}`})]}),n.jsxs("div",{className:`flex items-center justify-center w-[400px] h-[400px] sm:w-80 sm:h-80 rounded-full overflow-hidden transition-all duration-300 ${h==="Nice Smile!😉"?"ring-4 ring-blue-500 ring-offset-2 shadow-lg shadow-blue-500/50":h==="Please smile."?"ring-4 ring-green-400 ring-offset-2 shadow-lg shadow-green-500/50":h==="Face not recognized."?"ring-4 ring-yellow-500 ring-offset-2 shadow-lg shadow-yellow-500/50":h==="No face detected"?"ring-4 ring-red-400 ring-offset-2 shadow-lg shadow-red-500/40":"ring-4 ring-gray-400 ring-offset-2"} bg-gradient-to-br from-slate-900 to-slate-800`,children:[n.jsx("video",{crossOrigin:"anonymous",ref:b,className:"w-full h-full object-cover",autoPlay:!0,muted:!0,playsInline:!0}),n.jsx("canvas",{ref:R,className:"w-full h-full absolute inset-0"})]}),n.jsx("div",{className:"absolute flex justify-center translate-y-[190px] sm:translate-y-[140px] w-full ",children:n.jsx("span",{className:`px-4 py-2 backdrop-blur-sm rounded-full text-sm sm:text-xs font-medium transition-all ${de==="passed"?"bg-blue-500/60 text-green-50 border ":"bg-green-500/60  text-yellow-50 border "}`,children:h})})]})})}),n.jsxs("div",{className:"relative grid grid-cols-3 justify-center w-full mt-20 px-4 gap-4",children:[n.jsxs("div",{className:"flex flex-col gap-2 justify-start max-w-60",children:[n.jsx("p",{className:"text-xs font-semibold text-secondary-foreground uppercase tracking-wide",children:"Status"}),n.jsxs("span",{className:`inline-flex items-center gap-2 px-3 py-1 rounded-full text-sm font-medium ${ue==="Running"?"bg-green-600 text-green-50 border border-green-500":"bg-red-600 text-red-50 border border-red-500"}`,children:[n.jsx("span",{className:"w-2 h-2 rounded-full bg-current animate-pulse"}),ue]})]}),n.jsx("div",{className:"flex justify-center",children:n.jsx("button",{onClick:()=>ze(e=>e==="user"?"environment":"user"),className:"group relative p-3 rounded-full bg-primary hover:bg-primary/90 text-white border border-primary transition-all duration-300 hover:shadow-lg hover:shadow-primary/50",title:"Switch camera",children:n.jsx(st,{className:`w-5 h-5 text-white transition-transform duration-500 ${T==="user"?"rotate-180":"rotate-0"}`})})}),n.jsxs("div",{className:"flex flex-col gap-2 justify-end text-right",children:[n.jsx("p",{className:"text-xs font-semibold text-secondary-foreground uppercase tracking-wide",children:"Permissions"}),n.jsxs("div",{className:"flex gap-3 justify-end",children:[n.jsxs("button",{onClick:()=>{w!=="ok"&&U()},className:"flex items-center gap-1 px-2 py-1 rounded transition-all hover:bg-white/10 cursor-pointer group",title:w==="ok"?"Camera enabled":"Click to enable camera",children:[n.jsx(rt,{className:`w-4 h-4 transition-all ${w==="ok"?"text-green-500":"text-red-500 group-hover:scale-110"}`}),n.jsx("span",{className:`w-2 h-2 rounded-full transition-all ${w==="ok"?"bg-green-500":"bg-red-500 group-hover:scale-125"}`})]}),n.jsxs("button",{onClick:()=>{k!=="ok"&&B()},className:"flex items-center gap-1 px-2 py-1 rounded transition-all hover:bg-white/10 cursor-pointer group",title:k==="ok"?"Location enabled":"Click to enable location",children:[n.jsx(nt,{className:`w-4 h-4 transition-all ${k==="ok"?"text-green-500":"text-red-500 group-hover:scale-110"}`}),n.jsx("span",{className:`w-2 h-2 rounded-full transition-all ${k==="ok"?"bg-green-500":"bg-red-500 group-hover:scale-125"}`})]})]})]})]})]})]})}function yt(){const[t,a]=r.useState(null),[c,o]=r.useState(!0),[l,d]=r.useState(60),f=Me();r.useEffect(()=>{ae.get("users/userDetails",{headers:{Authorization:`Token ${localStorage.getItem("accessToken")}`}}).then(S=>{a(S.data)}).finally(()=>o(!1))},[]),r.useEffect(()=>{const S=setInterval(()=>{d(P=>(P<=1&&(f("/regional/user/temp"),window.location.reload()),P-1))},1e3);return()=>clearInterval(S)},[f]);const j=S=>{const P=Math.floor(S/60),k=S%60;return`${P.toString().padStart(2,"0")}:${k.toString().padStart(2,"0")}`};return c?n.jsx("div",{className:"flex h-full w-full justify-center items-center",children:"Loading..."}):!t||!t.description||t.description.length===0?n.jsx("div",{className:"flex-1 h-full flex items-center justify-center",children:n.jsx(at,{})}):n.jsxs("div",{className:"flex-1 h-full overflow-auto",children:[n.jsxs("div",{className:"fixed bottom-20 right-2 bg-gray-100 px-3 py-1 rounded-md font-mono text-sm z-50",children:[n.jsx("span",{className:" md:hidden",children:"Session Timer:"}),"   ",j(l)]}),n.jsx(tt,{}),n.jsx(r.Suspense,{fallback:n.jsx("div",{children:"Loading..."}),children:n.jsx(ht,{userObject:t})})]})}export{yt as default};
