import{c as he,aa as de,ab as ue,ac as at,ad as ct,ae as Ve,af as lt,ag as dt,ah as ut,ai as mt,aj as Ae,ak as ft,j as o,L as gt,r as n,al as ht,u as Ye,h as f,am as pt,z as Q,an as Be,ao as _e,ap as xt,aq as bt,i as me,s as P,_ as wt,$ as yt,a0 as vt,a1 as kt,a2 as ze}from"./index-a4373ac9.js";import{D as St}from"./DashboardAnalogClock-18e94fca.js";const Ct=he("Camera",[["path",{d:"M14.5 4h-5L7 7H4a2 2 0 0 0-2 2v9a2 2 0 0 0 2 2h16a2 2 0 0 0 2-2V9a2 2 0 0 0-2-2h-3l-2.5-3z",key:"1tc9qg"}],["circle",{cx:"12",cy:"13",r:"3",key:"1vg3eu"}]]),Et=he("MapPin",[["path",{d:"M20 10c0 6-8 12-8 12s-8-6-8-12a8 8 0 0 1 16 0Z",key:"2oe9fu"}],["circle",{cx:"12",cy:"10",r:"3",key:"ilqhr7"}]]),Lt=he("Video",[["path",{d:"m22 8-6 4 6 4V8Z",key:"50v9me"}],["rect",{width:"14",height:"12",x:"2",y:"6",rx:"2",ry:"2",key:"1rqjg6"}]]);function Pt(t,a){var d=Array.isArray(a)?a:[a];d.forEach(function(i){var l=i instanceof de?i.score:ue(i)?i.detection.score:void 0,u=i instanceof de?i.box:ue(i)?i.detection.box:new at(i),m=l?""+ct(l):void 0;new Ve(u,{label:m}).draw(t)})}function Rt(t,a,d){d===void 0&&(d=!1);var i=d?lt(a):a,l=i.width,u=i.height;return t.width=l,t.height=u,{width:l,height:u}}function Ke(t,a){var d=new dt(a.width,a.height),i=d.width,l=d.height;if(i<=0||l<=0)throw new Error("resizeResults - invalid dimensions: "+JSON.stringify({width:i,height:l}));if(Array.isArray(t))return t.map(function(v){return Ke(v,{width:i,height:l})});if(ut(t)){var u=t.detection.forSize(i,l),m=t.unshiftedLandmarks.forSize(u.box.width,u.box.height);return mt(Ae(t,u),m)}return ue(t)?Ae(t,t.detection.forSize(i,l)):t instanceof ft||t instanceof de?t.forSize(i,l):t}const jt=()=>o.jsx("div",{className:"flex flex-col items-center justify-center h-screen w-full",children:o.jsxs("div",{className:"bg-card border border-border rounded-md p-8 shadow-md flex flex-col items-center",children:[o.jsx("p",{className:"text-2xl font-bold text-primary mb-2",children:"Face Registration Required"}),o.jsx("p",{className:"text-foreground text-center",children:"Please register your face from your profile to use this page."}),o.jsx(gt,{to:"/regional/user/profile",className:" animate-bounce cursor-pointer text-primary text-xs",children:" View Profile →  Register your Face for Digital Biometric"}),o.jsx("p",{className:" text-xs text-yellow-500 mt-5",children:"*Note: Images won't be saved to the database — your privacy is safe 😊!"})]})}),It=n.lazy(()=>ht(()=>import("./OfficeLocationMap-1ac6007d.js"),["assets/OfficeLocationMap-1ac6007d.js","assets/index-a4373ac9.js","assets/index-68db2429.css","assets/OfficeLocationMap-4d8e306f.css"])),ee="location_permission_granted",te="camera_permission_granted",Oe="permissions_explained";function Nt(t,a,d,i){const u=(d-t)*Math.PI/180,m=(i-a)*Math.PI/180,v=Math.sin(u/2)*Math.sin(u/2)+Math.cos(t*Math.PI/180)*Math.cos(d*Math.PI/180)*Math.sin(m/2)*Math.sin(m/2);return 6371*(2*Math.atan2(Math.sqrt(v),Math.sqrt(1-v)))}function Mt(t){return t.happy>.5}const fe=()=>typeof navigator<"u"&&/android|iphone|ipad|ipod|iemobile|mobile/i.test(navigator.userAgent),Ue=()=>typeof navigator<"u"&&/chrome|crios/i.test(navigator.userAgent)&&!/edg|opr|brave|firefox/i.test(navigator.userAgent),We=t=>t+(Ue()?.01:0),He=.06,$e=t=>(t==null?void 0:t.uid)===25?.04:He,ge=()=>{try{const t=navigator.deviceMemory??4,a=navigator.hardwareConcurrency??4;return fe()&&(t<=2||a<=4)||t<=2||a<=2?"low":t<=4||a<=4?"mid":"high"}catch{return"mid"}};function Dt(t,a,d,i=He){let l=1/0,u=!1,m="";const v=We(i);return d.forEach(y=>{const[R,k]=y.split(",").map(x=>parseFloat(x.trim())),g=Nt(t,a,R,k);g<=v&&(u=!0),g<l&&(l=g,m=y)}),{isNearby:u,distance:l,nearestLocation:m}}function Tt(){const t=new Date,a=t.getFullYear(),d=String(t.getMonth()+1).padStart(2,"0"),i=String(t.getDate()).padStart(2,"0"),l=String(t.getHours()).padStart(2,"0"),u=String(t.getMinutes()).padStart(2,"0"),m=String(t.getSeconds()).padStart(2,"0");return`${a}-${d}-${i}T${l}:${u}:${m}Z`}function Ft(t,a){let d;return(...i)=>{clearTimeout(d),d=setTimeout(()=>t(...i),a)}}function At(t,a){let d;return(...i)=>{d||(t(...i),d=!0,setTimeout(()=>d=!1,a))}}const w={hasStoredPermission:t=>P.getItem(t)==="true",setPermissionStatus:(t,a)=>{P.setItem(t,a.toString())},hasShownExplanation:()=>P.getItem(Oe)==="true",setExplanationShown:()=>{P.setItem(Oe,"true")},checkBrowserPermission:async t=>{try{return"permissions"in navigator?(await navigator.permissions.query({name:t})).state:null}catch(a){return console.warn(`Permission check failed for ${t}:`,a),null}}},re="/regional/models",qe=(t,a)=>{const d=ge();let i={ideal:640,max:1280},l={ideal:480,max:720},u={ideal:15,max:30};d==="low"?(i={ideal:480,max:640},l={ideal:360,max:480},u={ideal:12,max:24}):d==="mid"?(i={ideal:640,max:960},l={ideal:480,max:540},u={ideal:15,max:30}):(i={ideal:640,max:1280},l={ideal:480,max:720},u={ideal:24,max:30});const m={width:i,height:l,frameRate:u,aspectRatio:1.333};return a?m.deviceId={exact:a}:m.facingMode=t,{video:m}};function Bt({userObject:t}){const a=Ye(),[d,i]=n.useState(!1),[l,u]=n.useState(!1),[m,v]=n.useState([]),[y,R]=n.useState([]),[k,g]=n.useState(null),[x,M]=n.useState(null),[D,T]=n.useState(null),[pe,U]=n.useState("pending"),[z,F]=n.useState("Checking permissions..."),[xe,E]=n.useState("Loading..."),[O,_t]=n.useState("user"),[be,Ge]=n.useState(!1),[W,ne]=n.useState(!1),[we,Ze]=n.useState([]),[A,ye]=n.useState(""),[Je,Xe]=n.useState(null),[Qe,et]=n.useState(null),[ve,oe]=n.useState(!1),H=n.useRef(null),S=n.useRef(!1),$=n.useRef(null),se=n.useRef(!1),b=n.useRef(null),j=n.useRef(null),B=n.useRef(),G=n.useRef(null),q=n.useRef(),V=n.useRef(),ke=n.useRef(),I=n.useRef(0),ie=pe==="passed"&&S.current&&x==="ok"&&H.current===!0,Se=n.useCallback(()=>{if(!W&&!(Date.now()<I.current)){try{if(f.isVisible&&f.isVisible())return}catch{}ne(!0),f.fire({title:"Biometric Actions",html:`
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
    `,showConfirmButton:!1,showCancelButton:!1,allowOutsideClick:!1,allowEscapeKey:!1,position:"center",toast:!1,timer:6e3,timerProgressBar:!0,width:"420px",background:"#fff",customClass:{popup:"floating-menu-popup",timerProgressBar:"floating-menu-timer"},didOpen:()=>{var e,r,s,c;(e=document.getElementById("time-in-btn"))==null||e.addEventListener("click",()=>{I.current=Date.now()+3e3,X("I"),f.close()}),(r=document.getElementById("break-in-btn"))==null||r.addEventListener("click",()=>{I.current=Date.now()+3e3,X("i"),f.close()}),(s=document.getElementById("break-out-btn"))==null||s.addEventListener("click",()=>{I.current=Date.now()+3e3,X("0"),f.close()}),(c=document.getElementById("time-out-btn"))==null||c.addEventListener("click",()=>{I.current=Date.now()+3e3,X("o"),f.close()})},willClose:()=>{I.current=Math.max(I.current,Date.now()+3e3),ne(!1)}}),V.current=setTimeout(()=>{f.close(),ne(!1)},4e3)}},[W]);n.useEffect(()=>(ie&&!W&&Date.now()>=I.current&&(!f.isVisible||!f.isVisible())&&Se(),()=>{V.current&&clearTimeout(V.current)}),[ie,W,Se]);const Ce=n.useCallback(()=>{w.hasShownExplanation()?Ee():f.fire({title:"Permission Setup Required",html:`
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
          `,icon:"info",confirmButtonText:"Grant Permissions",confirmButtonColor:"#3085d6",allowOutsideClick:!1,allowEscapeKey:!1}).then(()=>{w.setExplanationShown(),Ee()})},[]),Ee=n.useCallback(async()=>{E("Checking permissions...");const e=w.hasStoredPermission(te),r=w.hasStoredPermission(ee),s=await w.checkBrowserPermission("camera"),c=await w.checkBrowserPermission("geolocation");s==="denied"?(M("permission_denied"),w.setPermissionStatus(te,!1)):e||s==="granted"?M("ok"):await Z(),c==="denied"?(g("permission_denied"),S.current=!1,w.setPermissionStatus(ee,!1)):r||c==="granted"?(g("ok"),S.current=!0):await K(),Ge(!0)},[]),_=n.useCallback(async()=>{var e;try{if(!((e=navigator.mediaDevices)!=null&&e.enumerateDevices))return;const r=await navigator.mediaDevices.enumerateDevices();Ze(r.filter(s=>s.kind==="videoinput"))}catch(r){console.warn("Failed to enumerate cameras:",r)}},[]),Z=n.useCallback(async()=>{M("checking");try{const e=qe(O,A||void 0),r=await navigator.mediaDevices.getUserMedia(e);M("ok"),w.setPermissionStatus(te,!0),r.getTracks().forEach(s=>s.stop()),_()}catch(e){e.name==="NotAllowedError"||e.name==="PermissionDeniedError"?(M("permission_denied"),w.setPermissionStatus(te,!1),tt()):(M("error"),console.error("Camera access error:",e))}},[O,A,_]),Y=n.useCallback(()=>{const e=window.location.origin,r=navigator.userAgent.toLowerCase(),s=r.includes("edg"),c=r.includes("firefox"),h=/android|iphone|ipad|ipod/i.test(r),C=(r.includes("chrome")||r.includes("crios"))&&!s&&!r.includes("opr");let p=null;if(!h&&(C||s)?p=`${s?"edge":"chrome"}://settings/content/siteDetails?site=${encodeURIComponent(e)}`:!h&&c&&(p="about:preferences#privacy"),p)try{window.open(p,"_blank")}catch{}const L=h?`<ol style="text-align:left; padding-left: 20px;">
            <li>Tap the lock icon in the address bar</li>
            <li>Permissions ➜ Location</li>
            <li>Choose "Allow while using"</li>
          </ol>`:`<p>In Site Settings, set Location to <strong>Allow</strong> for ${e}, then return here.</p>`;f.fire({icon:"info",title:"Enable location for this site",html:L,confirmButtonText:"Reload Page",allowOutsideClick:!1,allowEscapeKey:!1}).then(()=>window.location.reload())},[]),K=n.useCallback(async()=>(g("checking"),navigator.geolocation?new Promise(e=>{navigator.geolocation.getCurrentPosition(r=>{g("ok"),S.current=!0,w.setPermissionStatus(ee,!0),e("granted")},r=>{r.code===r.PERMISSION_DENIED?(g("permission_denied"),S.current=!1,w.setPermissionStatus(ee,!1),ae(),e("denied")):(g("error"),S.current=!1,console.error("Location access error:",r),e("error"))},{enableHighAccuracy:!1,timeout:1e4,maximumAge:0})}):(g("error"),T("❌ Geolocation not supported"),S.current=!1,"error")),[]),tt=n.useCallback(()=>{f.fire({title:"Camera Permission Required",html:`
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
        `,icon:"warning",confirmButtonText:"Try Again",showCancelButton:!0,cancelButtonText:"Skip",confirmButtonColor:"#3085d6"}).then(e=>{e.isConfirmed&&Z()})},[Z]),ae=n.useCallback(()=>{f.fire({title:"Location Permission Required",html:`
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
        `,icon:"warning",confirmButtonText:"Grant Location Access",showCancelButton:!1,confirmButtonColor:"#3085d6"}).then(e=>{e.isConfirmed?w.checkBrowserPermission("geolocation").then(r=>{r==="denied"?Y():K().finally(()=>window.location.reload())}).catch(()=>K().finally(()=>window.location.reload())):e.isDenied&&Y()})},[K,Y]),J=n.useCallback(At(e=>{if($.current=e,!S.current){T("❌ Location permission required"),g("permission_denied");return}const r=()=>{if(!navigator.geolocation){T("❌ Geolocation not supported"),g("error");return}navigator.geolocation.getCurrentPosition(s=>{const{latitude:c,longitude:h,accuracy:C}=s.coords,{isNearby:p,distance:L}=Dt(c,h,e,$e(t));Xe({lat:c,lng:h}),et(C),H.current=p;const N=p?`✅ Within office range! (${L.toFixed(2)} km)`:`❌ Outside office range (${L.toFixed(2)} km from nearest office)`;T(N),g("ok")},s=>{if(console.error("Location error:",s),H.current!==null){const c=H.current?"✅ Within office range! (checking...)":"❌ Outside office range (checking...)";T(h=>!h||h.includes("Location permission required")||h.includes("Location access failed")?c:h)}else T("❌ Location access failed"),g("error")},{enableHighAccuracy:fe()||Ue(),timeout:fe()?2e4:1e4,maximumAge:0})};q.current&&clearInterval(q.current),r(),q.current=setInterval(r,45e3)},15e3),[]),Le=n.useCallback(async()=>{if(!l)try{E("Loading models...");try{const e=pt;e!=null&&e.setBackend&&(await e.setBackend("webgl"),e!=null&&e.ready&&await e.ready())}catch{}await Promise.all([Q.tinyFaceDetector.loadFromUri(re),Q.faceLandmark68TinyNet.loadFromUri(re),Q.faceRecognitionNet.loadFromUri(re),Q.faceExpressionNet.loadFromUri(re)]);try{const e=document.createElement("canvas");e.width=128,e.height=128;const r=e.getContext("2d");r==null||r.fillRect(0,0,1,1),await Be(e,new _e({inputSize:160,scoreThreshold:.9})).withFaceLandmarks(!0).withFaceDescriptors().withFaceExpressions()}catch{}u(!0)}catch{E("Error loading models")}},[l]),Pe=n.useCallback(async()=>{try{const e=await Promise.all(m.map(r=>{const s=r.descriptors.map(c=>new Float32Array(c));return new xt(r.label,s)}));G.current=new bt(e,.6)}catch(e){console.error("Face matcher initialization error:",e)}},[m]),Re=n.useCallback(async()=>{var e;if(x!=="ok"){F("Camera permission required");return}try{(e=b.current)!=null&&e.srcObject&&(b.current.srcObject.getTracks().forEach(h=>h.stop()),b.current.srcObject=null);const r=qe(O,A||void 0),s=await navigator.mediaDevices.getUserMedia(r);b.current&&(b.current.srcObject=s,b.current.onloadedmetadata=()=>{F("Please smile to verify liveliness")})}catch(r){if(console.error("Error starting video:",r),A&&((r==null?void 0:r.name)==="OverconstrainedError"||(r==null?void 0:r.name)==="NotFoundError")){F("Selected camera unavailable — reverting to default"),ye("");return}E("Error accessing camera"),M("error")}},[O,x,A]),je=n.useCallback(()=>{if(!G.current||!b.current||!j.current||x!=="ok")return;B.current&&clearInterval(B.current);const e=ge(),r=e==="low"?224:e==="mid"?320:416,s=e==="low"?700:e==="mid"?500:350;let c=!1;const h=async()=>{if(!(c||document.hidden)){c=!0;try{if(!b.current||!j.current||!G.current)return;const C=await Be(b.current,new _e({inputSize:r,scoreThreshold:.6})).withFaceLandmarks(!0).withFaceDescriptors().withFaceExpressions(),p=j.current,L={width:500,height:600};Rt(p,L);const N=Ke(C,L),Ne=p.getContext("2d",{willReadFrequently:!0});if(Ne&&Ne.clearRect(0,0,L.width,L.height),N.length>0){const Me=N.map(le=>G.current.findBestMatch(le.descriptor));e!=="low"&&(Pt(p,N),Me.forEach((le,st)=>{const it=N[st].detection.box;new Ve(it,{label:le.toString()}).draw(p)}));const ot=N[0].expressions,De=Me[0],Te=De&&De.label!=="unknown",Fe=Mt(ot);Te&&Fe?(U("passed"),F("Nice Smile!😉")):Te&&!Fe?(U("pending"),F("Please smile.")):(U("pending"),F("Face not recognized.")),E("Running")}else U("pending"),E("Running"),F("No face detected")}catch(C){console.error("Face detection error:",C)}finally{c=!1}}};B.current=setInterval(h,s)},[x]),Ie=n.useCallback(async()=>{var e,r;try{const c=(await me.get("users/userDetails/",{headers:{Authorization:`Token ${P.getItem("accessToken")}`}})).data;if(P.setItem("user",JSON.stringify(c)),!(c!=null&&c.description))throw new Error("No face description data in API response");v([{label:c.full_name,descriptors:c.description}]),R([{id:c.full_name,name:c.full_name,position:c.job_title}]),i(!0),((e=c.location)==null?void 0:e.length)>0?($.current=c.location,J(c.location)):(T("❌ No office locations configured"),g("error"))}catch(s){if(((r=s==null?void 0:s.response)==null?void 0:r.status)===401){E("Session expired"),f.fire({icon:"warning",title:"Session Expired",text:"Please log in again to continue.",confirmButtonText:"Log In",confirmButtonColor:"#3085d6",allowOutsideClick:!1,allowEscapeKey:!1}).then(()=>{P.clear(),window.location.href="/regional"});return}E(s.message||"Error loading face data"),g("error")}},[J]),rt={I:{message:"clocked in",emoji:"🌅"},i:{message:"started break",emoji:"☕"},0:{message:"ended break",emoji:"🍽️"},o:{message:"clocked out",emoji:"🌙"}},X=n.useCallback(Ft(e=>{const{message:r,emoji:s}=rt[e],c=Tt();me.post("checkinoutregion/create/",{CHECKTIME:c,CHECKTYPE:e,VERIFYCODE:t.deptid,SENSORID:0},{headers:{Authorization:`Token ${P.getItem("accessToken")}`}}).then(()=>{const h={I:"Have a great day at work! 💼",i:"Enjoy your break! ☕",0:"Welcome back! 🔋",o:"See you tomorrow! 🌙"};f.fire({title:`${s} Success! ${s}`,html:`
              <div style="text-align: center; margin: 20px 0;">
                <p style="font-size: 18px; margin-bottom: 15px;">
                  You have successfully ${r}! 
                </p>
                <p style="font-size: 16px; color: #10b981; margin-bottom: 10px;">
                  😊 Nice smile, by the way! 😊
                </p>
                <p style="font-size: 14px; color: #666; font-style: italic;">
                  ${h[e]}
                </p>
              </div>
            `,icon:"success",confirmButtonColor:"#3085d6",timer:3e3,showConfirmButton:!1,customClass:{popup:"success-popup",title:"success-title"}}),setTimeout(()=>{a("/regional/user/home"),window.location.reload()},3e3)}).catch(h=>{var C,p;f.fire({icon:"error",title:"❌ Oops! Something went wrong",html:`
              <div style="text-align: center; margin: 20px 0;">
                <p style="font-size: 16px; margin-bottom: 10px;">
                  ${((p=(C=h.response)==null?void 0:C.data)==null?void 0:p.detail)||"An error occurred while processing your request."}
                </p>
                <p style="font-size: 14px; color: #666; font-style: italic;">
                  😔 Don't worry, please try again!
                </p>
              </div>
            `,confirmButtonColor:"#d33",confirmButtonText:"Try Again 🔄"})})},1e3),[t,a]);n.useEffect(()=>(Ie(),Ce(),()=>{var e;if((e=b.current)!=null&&e.srcObject&&(b.current.srcObject.getTracks().forEach(s=>s.stop()),b.current.srcObject=null),B.current&&clearInterval(B.current),q.current&&clearInterval(q.current),V.current&&clearTimeout(V.current),ke.current&&cancelAnimationFrame(ke.current),j.current){const r=j.current.getContext("2d",{willReadFrequently:!0});r&&r.clearRect(0,0,j.current.width,j.current.height)}E("Stopped")}),[Ie,Ce]),n.useEffect(()=>{l||Le()},[l,Le]),n.useEffect(()=>(l&&d&&m.length>0&&be&&x==="ok"&&(async()=>(await Pe(),await Re(),je()))(),()=>{B.current&&clearInterval(B.current)}),[l,d,m.length,be,x,O,A,Pe,Re,je]),n.useEffect(()=>{var r;if(x!=="ok")return;_();const e=navigator.mediaDevices;return(r=e==null?void 0:e.addEventListener)==null||r.call(e,"devicechange",_),()=>{var s;return(s=e==null?void 0:e.removeEventListener)==null?void 0:s.call(e,"devicechange",_)}},[x,_]),n.useEffect(()=>{(k==="permission_denied"||D&&D.includes("Location permission required"))&&!se.current&&(se.current=!0,ae()),k==="ok"&&(se.current=!1)},[k,D,ae]),n.useEffect(()=>{let e=null;return(async()=>{try{const s=await navigator.permissions.query({name:"geolocation"});e=s;const c=()=>{s.state==="granted"?(g("ok"),S.current=!0,$.current&&J($.current)):s.state==="denied"&&(g("permission_denied"),S.current=!1)};s.onchange=c}catch{}})(),()=>{e&&(e.onchange=null)}},[J]);const ce=z==="Nice Smile!😉"?{ring:"ring-blue-500",border:"border-blue-400",badge:"bg-blue-600/80"}:z==="Please smile."?{ring:"ring-green-400",border:"border-green-400",badge:"bg-green-600/80"}:z==="Face not recognized."?{ring:"ring-yellow-500",border:"border-yellow-400",badge:"bg-yellow-600/80"}:z==="No face detected"?{ring:"ring-red-400",border:"border-red-400",badge:"bg-red-600/80"}:{ring:"ring-gray-400",border:"border-gray-300",badge:"bg-slate-600/80"},nt=ge()==="low";return o.jsxs("div",{className:"flex-1 h-full overflow-auto bg-background",children:[o.jsx("style",{children:`
          @keyframes pulse-ring {
            0% { transform: scale(1); opacity: .9; }
            100% { transform: scale(1.18); opacity: 0; }
          }
          .pulse-ring { animation: pulse-ring 2.2s ease-out infinite; }
          @media (prefers-reduced-motion: reduce) { .pulse-ring { animation: none; } }
        `}),o.jsxs("div",{className:"flex-1 flex flex-col items-center min-h-screen px-4 pt-20 pb-10 sm:pt-16",children:[o.jsxs("div",{className:"text-center mb-8 sm:mb-6",children:[o.jsx("h1",{className:"text-3xl sm:text-2xl font-bold text-primary cursor-pointer select-none",onDoubleClick:()=>oe(!0),title:"Double-click to view your location on the map",children:"🔐 Digital Biometric"}),o.jsxs("p",{className:"text-secondary-foreground mt-1",children:["Welcome back, ",o.jsx("span",{className:"font-semibold text-primary",children:t.full_name})]}),D&&o.jsx("span",{className:`mt-3 inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-medium border ${D.startsWith("✅")?"bg-green-500/10 text-green-600 border-green-500/30":"bg-red-500/10 text-red-600 border-red-500/30"}`,children:D.replace(/^[✅❌]\s*/,"")})]}),o.jsxs("div",{className:"relative flex items-center justify-center",children:[!nt&&o.jsx("div",{className:`pulse-ring absolute w-[400px] h-[400px] sm:w-80 sm:h-80 rounded-full border-2 pointer-events-none ${ce.border}`}),o.jsxs("div",{className:`relative w-[400px] h-[400px] sm:w-80 sm:h-80 rounded-full overflow-hidden ring-4 ring-offset-2 ring-offset-background transition-colors duration-300 bg-slate-900 ${ce.ring}`,children:[o.jsx("video",{crossOrigin:"anonymous",ref:b,className:"w-full h-full object-cover",autoPlay:!0,muted:!0,playsInline:!0}),o.jsx("canvas",{ref:j,className:"w-full h-full absolute inset-0"})]}),o.jsx("div",{className:"absolute -bottom-4 flex justify-center w-full",children:o.jsx("span",{className:`px-4 py-2 rounded-full text-sm sm:text-xs font-semibold text-white shadow ${ce.badge}`,children:z})})]}),o.jsx("p",{className:"mt-10 text-sm text-secondary-foreground text-center max-w-sm",children:ie?"You’re verified — pick an action from the menu.":pe!=="passed"?"Look at the camera and smile so we can verify it’s you.":"Verified. Move within the office range to unlock actions."}),o.jsxs("div",{className:"mt-6 flex flex-wrap items-center justify-center gap-2",children:[o.jsxs("span",{className:`inline-flex items-center gap-2 px-3 py-1.5 rounded-full text-xs font-medium border ${xe==="Running"?"bg-green-500/10 text-green-600 border-green-500/30":"bg-red-500/10 text-red-600 border-red-500/30"}`,children:[o.jsx("span",{className:"w-2 h-2 rounded-full bg-current"}),xe]}),o.jsxs("button",{type:"button",onClick:()=>{x!=="ok"?Z():f.fire({icon:"success",title:"Camera Enabled",text:"Facial recognition has access to your camera.",confirmButtonText:"OK",showCancelButton:!0,cancelButtonText:"Manage in browser settings"}).then(e=>{e.dismiss===f.DismissReason.cancel&&Y()})},className:`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-medium border transition-colors ${x==="ok"?"bg-green-500/10 text-green-600 border-green-500/30":"bg-red-500/10 text-red-600 border-red-500/30 hover:bg-red-500/20"}`,title:x==="ok"?"Camera enabled":"Click to enable camera",children:[o.jsx(Ct,{className:"w-3.5 h-3.5"})," Camera"]}),o.jsxs("button",{type:"button",onClick:()=>{k!=="ok"?K():f.fire({icon:"success",title:"Location Enabled",text:D||"Tracking your location for office proximity.",confirmButtonText:"OK",showCancelButton:!0,cancelButtonText:"Manage in browser settings"}).then(e=>{e.dismiss===f.DismissReason.cancel&&Y()})},className:`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-medium border transition-colors ${k==="ok"?"bg-green-500/10 text-green-600 border-green-500/30":"bg-red-500/10 text-red-600 border-red-500/30 hover:bg-red-500/20"}`,title:k==="ok"?"Location enabled":"Click to enable location",children:[o.jsx(Et,{className:"w-3.5 h-3.5"})," Location"]}),o.jsx("button",{type:"button",onClick:()=>oe(!0),className:"inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-medium border border-input text-accent-foreground hover:bg-accent transition-colors",children:"🗺️ View map"}),we.length>1&&o.jsxs(wt,{value:A||"auto",onValueChange:e=>ye(e==="auto"?"":e),children:[o.jsxs(yt,{className:"h-8 w-40 text-xs gap-1 px-2 text-accent-foreground",children:[o.jsx(Lt,{className:"w-3.5 h-3.5 shrink-0 text-muted-foreground"}),o.jsx(vt,{placeholder:"Camera",className:"text-accent-foreground"})]}),o.jsxs(kt,{className:"text-accent-foreground",children:[o.jsx(ze,{value:"auto",children:"Auto (Front/Back)"}),we.map((e,r)=>o.jsx(ze,{className:"text-accent-foreground",value:e.deviceId,children:e.label||`Camera ${r+1}`},e.deviceId))]})]})]})]}),ve&&o.jsx(n.Suspense,{fallback:null,children:o.jsx(It,{open:ve,onOpenChange:oe,officeLocations:$.current||[],userCoords:Je,accuracyMeters:Qe,radiusMeters:We($e(t))*1e3})})]})}function qt(){const[t,a]=n.useState(null),[d,i]=n.useState(!0),[l,u]=n.useState(60),m=Ye();n.useEffect(()=>{me.get("users/userDetails/",{headers:{Authorization:`Token ${P.getItem("accessToken")}`}}).then(y=>{a(y.data)}).finally(()=>i(!1))},[]),n.useEffect(()=>{const y=setInterval(()=>{u(R=>(R<=1&&(m("/regional/user/temp"),window.location.reload()),R-1))},1e3);return()=>clearInterval(y)},[m]);const v=y=>{const R=Math.floor(y/60),k=y%60;return`${R.toString().padStart(2,"0")}:${k.toString().padStart(2,"0")}`};return d?o.jsx("div",{className:"flex h-full w-full justify-center items-center",children:"Loading..."}):!t||!t.description||t.description.length===0?o.jsx("div",{className:"flex-1 h-full flex items-center justify-center",children:o.jsx(jt,{})}):o.jsxs("div",{className:"flex-1 h-full overflow-auto",children:[o.jsxs("div",{className:"fixed bottom-20 right-2 bg-gray-100 px-3 py-1 rounded-md font-mono text-sm z-50",children:[o.jsx("span",{className:" md:hidden",children:"Session Timer:"}),"   ",v(l)]}),o.jsx(St,{}),o.jsx(n.Suspense,{fallback:o.jsx("div",{children:"Loading..."}),children:o.jsx(Bt,{userObject:t})})]})}export{qt as default};
