import{c as ue,aa as ae,ab as ce,ac as Ge,ad as Ze,ae as ze,af as Je,ag as Xe,ah as Qe,ai as et,aj as Le,ak as tt,j as n,L as rt,u as Be,r as s,h as p,al as nt,z as Z,am as Fe,an as De,ao as st,ap as it,i as le,_ as ot,$ as at,a0 as ct,a1 as lt,a2 as Me,s as dt}from"./index-56f384a5.js";import{D as ut}from"./DashboardAnalogClock-023a0bc1.js";const mt=ue("Camera",[["path",{d:"M14.5 4h-5L7 7H4a2 2 0 0 0-2 2v9a2 2 0 0 0 2 2h16a2 2 0 0 0 2-2V9a2 2 0 0 0-2-2h-3l-2.5-3z",key:"1tc9qg"}],["circle",{cx:"12",cy:"13",r:"3",key:"1vg3eu"}]]),ft=ue("MapPin",[["path",{d:"M20 10c0 6-8 12-8 12s-8-6-8-12a8 8 0 0 1 16 0Z",key:"2oe9fu"}],["circle",{cx:"12",cy:"10",r:"3",key:"ilqhr7"}]]),gt=ue("Video",[["path",{d:"m22 8-6 4 6 4V8Z",key:"50v9me"}],["rect",{width:"14",height:"12",x:"2",y:"6",rx:"2",ry:"2",key:"1rqjg6"}]]);function ht(r,a){var l=Array.isArray(a)?a:[a];l.forEach(function(o){var c=o instanceof ae?o.score:ce(o)?o.detection.score:void 0,d=o instanceof ae?o.box:ce(o)?o.detection.box:new Ge(o),u=c?""+Ze(c):void 0;new ze(d,{label:u}).draw(r)})}function pt(r,a,l){l===void 0&&(l=!1);var o=l?Je(a):a,c=o.width,d=o.height;return r.width=c,r.height=d,{width:c,height:d}}function _e(r,a){var l=new Xe(a.width,a.height),o=l.width,c=l.height;if(o<=0||c<=0)throw new Error("resizeResults - invalid dimensions: "+JSON.stringify({width:o,height:c}));if(Array.isArray(r))return r.map(function(j){return _e(j,{width:o,height:c})});if(Qe(r)){var d=r.detection.forSize(o,c),u=r.unshiftedLandmarks.forSize(d.box.width,d.box.height);return et(Le(r,d),u)}return ce(r)?Le(r,r.detection.forSize(o,c)):r instanceof tt||r instanceof ae?r.forSize(o,c):r}const xt=()=>n.jsx("div",{className:"flex flex-col items-center justify-center h-screen w-full",children:n.jsxs("div",{className:"bg-card border border-border rounded-md p-8 shadow-md flex flex-col items-center",children:[n.jsx("p",{className:"text-2xl font-bold text-primary mb-2",children:"Face Registration Required"}),n.jsx("p",{className:"text-foreground text-center",children:"Please register your face from your profile to use this page."}),n.jsx(rt,{to:"/regional/user/profile",className:" animate-bounce cursor-pointer text-primary text-xs",children:" View Profile →  Register your Face for Digital Biometric"}),n.jsx("p",{className:" text-xs text-yellow-500 mt-5",children:"*Note: Images won't be saved to the database — your privacy is safe 😊!"})]})}),J="location_permission_granted",X="camera_permission_granted",Te="permissions_explained";function wt(r,a,l,o){const d=(l-r)*Math.PI/180,u=(o-a)*Math.PI/180,j=Math.sin(d/2)*Math.sin(d/2)+Math.cos(r*Math.PI/180)*Math.cos(l*Math.PI/180)*Math.sin(u/2)*Math.sin(u/2);return 6371*(2*Math.atan2(Math.sqrt(j),Math.sqrt(1-j)))}function bt(r){return r.happy>.5}const de=()=>typeof navigator<"u"&&/android|iphone|ipad|ipod|iemobile|mobile/i.test(navigator.userAgent),$e=()=>typeof navigator<"u"&&/chrome|crios/i.test(navigator.userAgent)&&!/edg|opr|brave|firefox/i.test(navigator.userAgent),yt=r=>r+($e()?.01:0),Oe=()=>{try{const r=navigator.deviceMemory??4,a=navigator.hardwareConcurrency??4;return de()&&(r<=2||a<=4)||r<=2||a<=2?"low":r<=4||a<=4?"mid":"high"}catch{return"mid"}};function vt(r,a,l,o=.08){let c=1/0,d=!1,u="";const j=yt(o);return l.forEach(S=>{const[E,k]=S.split(",").map(x=>parseFloat(x.trim())),g=wt(r,a,E,k);g<=j&&(d=!0),g<c&&(c=g,u=S)}),{isNearby:d,distance:c,nearestLocation:u}}function St(){const r=new Date,a=r.getFullYear(),l=String(r.getMonth()+1).padStart(2,"0"),o=String(r.getDate()).padStart(2,"0"),c=String(r.getHours()).padStart(2,"0"),d=String(r.getMinutes()).padStart(2,"0"),u=String(r.getSeconds()).padStart(2,"0");return`${a}-${l}-${o}T${c}:${d}:${u}Z`}function kt(r,a){let l;return(...o)=>{clearTimeout(l),l=setTimeout(()=>r(...o),a)}}function jt(r,a){let l;return(...o)=>{l||(r(...o),l=!0,setTimeout(()=>l=!1,a))}}const v={hasStoredPermission:r=>localStorage.getItem(r)==="true",setPermissionStatus:(r,a)=>{localStorage.setItem(r,a.toString())},hasShownExplanation:()=>localStorage.getItem(Te)==="true",setExplanationShown:()=>{localStorage.setItem(Te,"true")},checkBrowserPermission:async r=>{try{return"permissions"in navigator?(await navigator.permissions.query({name:r})).state:null}catch(a){return console.warn(`Permission check failed for ${r}:`,a),null}}},Q="/regional/models",Ae=(r,a)=>{const l=Oe();let o={ideal:640,max:1280},c={ideal:480,max:720},d={ideal:15,max:30};l==="low"?(o={ideal:480,max:640},c={ideal:360,max:480},d={ideal:12,max:24}):l==="mid"?(o={ideal:640,max:960},c={ideal:480,max:540},d={ideal:15,max:30}):(o={ideal:640,max:1280},c={ideal:480,max:720},d={ideal:24,max:30});const u={width:o,height:c,frameRate:d,aspectRatio:1.333};return a?u.deviceId={exact:a}:u.facingMode=r,{video:u}};function Ct({userObject:r}){const a=Be(),[l,o]=s.useState(!1),[c,d]=s.useState(!1),[u,j]=s.useState([]),[S,E]=s.useState([]),[k,g]=s.useState(null),[x,L]=s.useState(null),[O,F]=s.useState(null),[me,q]=s.useState("pending"),[h,D]=s.useState("Checking permissions..."),[fe,P]=s.useState("Loading..."),[z,Nt]=s.useState("user"),[Et,ge]=s.useState([]),[he,qe]=s.useState(!1),[Y,ee]=s.useState(!1),[pe,Ye]=s.useState([]),[M,xe]=s.useState(""),V=s.useRef(null),C=s.useRef(!1),K=s.useRef(null),te=s.useRef(!1),b=s.useRef(null),I=s.useRef(null),T=s.useRef(),U=s.useRef(null),B=s.useRef(),_=s.useRef(),we=s.useRef(),R=s.useRef(0),be=me==="passed"&&C.current&&x==="ok"&&V.current===!0,ye=s.useCallback(()=>{if(!Y&&!(Date.now()<R.current)){try{if(p.isVisible&&p.isVisible())return}catch{}ee(!0),p.fire({title:"Biometric Actions",html:`
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
    `,showConfirmButton:!1,showCancelButton:!1,allowOutsideClick:!1,allowEscapeKey:!1,position:"center",toast:!1,timer:6e3,timerProgressBar:!0,width:"420px",background:"#fff",customClass:{popup:"floating-menu-popup",timerProgressBar:"floating-menu-timer"},didOpen:()=>{var e,t,i,m;(e=document.getElementById("time-in-btn"))==null||e.addEventListener("click",()=>{R.current=Date.now()+3e3,G("I"),p.close()}),(t=document.getElementById("break-in-btn"))==null||t.addEventListener("click",()=>{R.current=Date.now()+3e3,G("i"),p.close()}),(i=document.getElementById("break-out-btn"))==null||i.addEventListener("click",()=>{R.current=Date.now()+3e3,G("0"),p.close()}),(m=document.getElementById("time-out-btn"))==null||m.addEventListener("click",()=>{R.current=Date.now()+3e3,G("o"),p.close()})},willClose:()=>{R.current=Math.max(R.current,Date.now()+3e3),ee(!1)}}),_.current=setTimeout(()=>{p.close(),ee(!1)},4e3)}},[Y]);s.useEffect(()=>(be&&!Y&&Date.now()>=R.current&&(!p.isVisible||!p.isVisible())&&ye(),()=>{_.current&&clearTimeout(_.current)}),[be,Y,ye]);const ve=s.useCallback(()=>{v.hasShownExplanation()?Se():p.fire({title:"Permission Setup Required",html:`
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
          `,icon:"info",confirmButtonText:"Grant Permissions",confirmButtonColor:"#3085d6",allowOutsideClick:!1,allowEscapeKey:!1}).then(()=>{v.setExplanationShown(),Se()})},[]),Se=s.useCallback(async()=>{P("Checking permissions...");const e=v.hasStoredPermission(X),t=v.hasStoredPermission(J),i=await v.checkBrowserPermission("camera"),m=await v.checkBrowserPermission("geolocation");e&&i==="granted"?L("ok"):i==="denied"?(L("permission_denied"),v.setPermissionStatus(X,!1)):await W(),t&&m==="granted"?(g("ok"),C.current=!0):m==="denied"?(g("permission_denied"),C.current=!1,v.setPermissionStatus(J,!1)):await $(),qe(!0)},[]),A=s.useCallback(async()=>{var e;try{if(!((e=navigator.mediaDevices)!=null&&e.enumerateDevices))return;const t=await navigator.mediaDevices.enumerateDevices();Ye(t.filter(i=>i.kind==="videoinput"))}catch(t){console.warn("Failed to enumerate cameras:",t)}},[]),W=s.useCallback(async()=>{L("checking");try{const e=Ae(z,M||void 0),t=await navigator.mediaDevices.getUserMedia(e);L("ok"),v.setPermissionStatus(X,!0),t.getTracks().forEach(i=>i.stop()),A()}catch(e){e.name==="NotAllowedError"||e.name==="PermissionDeniedError"?(L("permission_denied"),v.setPermissionStatus(X,!1),Ve()):(L("error"),console.error("Camera access error:",e))}},[z,M,A]),re=s.useCallback(()=>{const e=window.location.origin,t=navigator.userAgent.toLowerCase(),i=t.includes("edg"),m=t.includes("firefox"),f=/android|iphone|ipad|ipod/i.test(t),y=(t.includes("chrome")||t.includes("crios"))&&!i&&!t.includes("opr");let w=null;if(!f&&(y||i)?w=`${i?"edge":"chrome"}://settings/content/siteDetails?site=${encodeURIComponent(e)}`:!f&&m&&(w="about:preferences#privacy"),w)try{window.open(w,"_blank")}catch{}const N=f?`<ol style="text-align:left; padding-left: 20px;">
            <li>Tap the lock icon in the address bar</li>
            <li>Permissions ➜ Location</li>
            <li>Choose "Allow while using"</li>
          </ol>`:`<p>In Site Settings, set Location to <strong>Allow</strong> for ${e}, then return here.</p>`;p.fire({icon:"info",title:"Enable location for this site",html:N,confirmButtonText:"Reload Page",allowOutsideClick:!1,allowEscapeKey:!1}).then(()=>window.location.reload())},[]),$=s.useCallback(async()=>(g("checking"),navigator.geolocation?new Promise(e=>{navigator.geolocation.getCurrentPosition(t=>{g("ok"),C.current=!0,v.setPermissionStatus(J,!0),e("granted")},t=>{t.code===t.PERMISSION_DENIED?(g("permission_denied"),C.current=!1,v.setPermissionStatus(J,!1),ne(),e("denied")):(g("error"),C.current=!1,console.error("Location access error:",t),e("error"))},{enableHighAccuracy:!1,timeout:1e4,maximumAge:0})}):(g("error"),F("❌ Geolocation not supported"),C.current=!1,"error")),[]),Ve=s.useCallback(()=>{p.fire({title:"Camera Permission Required",html:`
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
        `,icon:"warning",confirmButtonText:"Try Again",showCancelButton:!0,cancelButtonText:"Skip",confirmButtonColor:"#3085d6"}).then(e=>{e.isConfirmed&&W()})},[W]),ne=s.useCallback(()=>{p.fire({title:"Location Permission Required",html:`
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
        `,icon:"warning",confirmButtonText:"Grant Location Access",showCancelButton:!1,confirmButtonColor:"#3085d6"}).then(e=>{e.isConfirmed?v.checkBrowserPermission("geolocation").then(t=>{t==="denied"?re():$().finally(()=>window.location.reload())}).catch(()=>$().finally(()=>window.location.reload())):e.isDenied&&re()})},[$,re]),H=s.useCallback(jt(e=>{if(K.current=e,!C.current){F("❌ Location permission required"),g("permission_denied");return}const t=()=>{if(!navigator.geolocation){F("❌ Geolocation not supported"),g("error");return}navigator.geolocation.getCurrentPosition(i=>{const{latitude:m,longitude:f}=i.coords,{isNearby:y,distance:w}=vt(m,f,e);V.current=y;const N=y?`✅ Within office range! (${w.toFixed(2)} km)`:`❌ Outside office range (${w.toFixed(2)} km from nearest office)`;F(N),g("ok")},i=>{if(console.error("Location error:",i),V.current!==null){const m=V.current?"✅ Within office range! (checking...)":"❌ Outside office range (checking...)";F(f=>!f||f.includes("Location permission required")||f.includes("Location access failed")?m:f)}else F("❌ Location access failed"),g("error")},{enableHighAccuracy:de()||$e(),timeout:de()?2e4:1e4,maximumAge:0})};B.current&&clearInterval(B.current),t(),B.current=setInterval(t,45e3)},15e3),[]),ke=s.useCallback(async()=>{if(!c)try{P("Loading models...");try{const e=nt;e!=null&&e.setBackend&&(await e.setBackend("webgl"),e!=null&&e.ready&&await e.ready())}catch{}await Promise.all([Z.tinyFaceDetector.loadFromUri(Q),Z.faceLandmark68TinyNet.loadFromUri(Q),Z.faceRecognitionNet.loadFromUri(Q),Z.faceExpressionNet.loadFromUri(Q)]);try{const e=document.createElement("canvas");e.width=128,e.height=128;const t=e.getContext("2d");t==null||t.fillRect(0,0,1,1),await Fe(e,new De({inputSize:160,scoreThreshold:.9})).withFaceLandmarks(!0).withFaceDescriptors().withFaceExpressions()}catch{}d(!0)}catch{P("Error loading models")}},[c]),je=s.useCallback(async()=>{try{const e=await Promise.all(u.map(t=>{const i=t.descriptors.map(m=>new Float32Array(m));return new st(t.label,i)}));U.current=new it(e,.6)}catch(e){console.error("Face matcher initialization error:",e)}},[u]),Ce=s.useCallback(async()=>{var e;if(x!=="ok"){D("Camera permission required");return}try{(e=b.current)!=null&&e.srcObject&&(b.current.srcObject.getTracks().forEach(f=>f.stop()),b.current.srcObject=null);const t=Ae(z,M||void 0),i=await navigator.mediaDevices.getUserMedia(t);b.current&&(b.current.srcObject=i,b.current.onloadedmetadata=()=>{D("Please smile to verify liveliness")})}catch(t){if(console.error("Error starting video:",t),M&&((t==null?void 0:t.name)==="OverconstrainedError"||(t==null?void 0:t.name)==="NotFoundError")){D("Selected camera unavailable — reverting to default"),xe("");return}P("Error accessing camera"),L("error")}},[z,x,M]),Ne=s.useCallback(()=>{if(!U.current||!b.current||!I.current||x!=="ok")return;T.current&&clearInterval(T.current);const e=Oe(),t=e==="low"?224:e==="mid"?320:416,i=e==="low"?700:e==="mid"?500:350,m=async()=>{try{if(!b.current||!I.current||!U.current)return;const f=await Fe(b.current,new De({inputSize:t,scoreThreshold:.6})).withFaceLandmarks(!0).withFaceDescriptors().withFaceExpressions(),y=I.current,w={width:500,height:600};pt(y,w);const N=_e(f,w),se=y.getContext("2d",{willReadFrequently:!0});if(se&&se.clearRect(0,0,w.width,w.height),N.length>0){const ie=N.map(oe=>U.current.findBestMatch(oe.descriptor));ht(y,N),ie.forEach((oe,We)=>{const He=N[We].detection.box;new ze(He,{label:oe.toString()}).draw(y)});const Ue=N[0].expressions,Pe=ie[0],Ie=Pe&&Pe.label!=="unknown",Re=bt(Ue);Ie&&Re?(q("passed"),D("Nice Smile!😉")):Ie&&!Re?(q("pending"),D("Please smile.")):(q("pending"),D("Face not recognized.")),ge(ie),P("Running")}else q("pending"),P("Running"),D("No face detected"),ge([])}catch(f){console.error("Face detection error:",f)}};T.current=setInterval(m,i)},[x]),Ee=s.useCallback(async()=>{var e;try{const i=(await le.get("users/userDetails",{headers:{Authorization:`Token ${localStorage.getItem("accessToken")}`}})).data;if(localStorage.setItem("user",JSON.stringify(i)),!(i!=null&&i.description))throw new Error("No face description data in API response");j([{label:i.full_name,descriptors:i.description}]),E([{id:i.full_name,name:i.full_name,position:i.job_title}]),o(!0),((e=i.location)==null?void 0:e.length)>0?(K.current=i.location,H(i.location)):(F("❌ No office locations configured"),g("error"))}catch(t){P(t.message||"Error loading face data"),g("error")}},[H]),Ke={I:{message:"clocked in",emoji:"🌅"},i:{message:"started break",emoji:"☕"},0:{message:"ended break",emoji:"🍽️"},o:{message:"clocked out",emoji:"🌙"}},G=s.useCallback(kt(e=>{const{message:t,emoji:i}=Ke[e],m=St();le.post("checkinoutregion/create/",{CHECKTIME:m,CHECKTYPE:e,VERIFYCODE:r.deptid,SENSORID:0},{headers:{Authorization:`Token ${localStorage.getItem("accessToken")}`}}).then(()=>{const f={I:"Have a great day at work! 💼",i:"Enjoy your break! ☕",0:"Welcome back! 🔋",o:"See you tomorrow! 🌙"};p.fire({title:`${i} Success! ${i}`,html:`
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
            `,confirmButtonColor:"#d33",confirmButtonText:"Try Again 🔄"})})},1e3),[r,a]);return s.useEffect(()=>(Ee(),ve(),()=>{var e;if((e=b.current)!=null&&e.srcObject&&(b.current.srcObject.getTracks().forEach(i=>i.stop()),b.current.srcObject=null),T.current&&clearInterval(T.current),B.current&&clearInterval(B.current),_.current&&clearTimeout(_.current),we.current&&cancelAnimationFrame(we.current),I.current){const t=I.current.getContext("2d",{willReadFrequently:!0});t&&t.clearRect(0,0,I.current.width,I.current.height)}P("Stopped")}),[Ee,ve]),s.useEffect(()=>{c||ke()},[c,ke]),s.useEffect(()=>(c&&l&&u.length>0&&he&&x==="ok"&&(async()=>(await je(),await Ce(),Ne()))(),()=>{T.current&&clearInterval(T.current)}),[c,l,u.length,he,x,z,M,je,Ce,Ne]),s.useEffect(()=>{var t;if(x!=="ok")return;A();const e=navigator.mediaDevices;return(t=e==null?void 0:e.addEventListener)==null||t.call(e,"devicechange",A),()=>{var i;return(i=e==null?void 0:e.removeEventListener)==null?void 0:i.call(e,"devicechange",A)}},[x,A]),s.useEffect(()=>{(k==="permission_denied"||O&&O.includes("Location permission required"))&&!te.current&&(te.current=!0,ne()),k==="ok"&&(te.current=!1)},[k,O,ne]),s.useEffect(()=>{let e=null;return(async()=>{try{const i=await navigator.permissions.query({name:"geolocation"});e=i;const m=()=>{i.state==="granted"?(g("ok"),C.current=!0,K.current&&H(K.current)):i.state==="denied"&&(g("permission_denied"),C.current=!1)};i.onchange=m}catch{}})(),()=>{e&&(e.onchange=null)}},[H]),n.jsxs("div",{className:"flex-1 h-full overflow-auto bg-background",children:[n.jsx("style",{children:`
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
        `}),n.jsxs("div",{className:"flex-1 flex flex-col items-center justify-center min-h-screen p-6",children:[n.jsxs("div",{className:"text-center mb-12",children:[n.jsx("h1",{className:"text-4xl sm:text-3xl font-bold text-primary mb-2",children:"🔐 Digital Biometric"}),n.jsxs("p",{className:"text-secondary-foreground text-lg",children:["Welcome back, ",n.jsx("span",{className:"font-semibold text-primary",children:r.full_name})]}),n.jsx("p",{className:"text-sm text-secondary-foreground mt-2",children:O})]}),n.jsx("div",{className:"flex w-full justify-center px-4",children:n.jsx("div",{className:"flex flex-col items-center gap-6",children:n.jsxs("div",{className:"relative flex items-center justify-center",children:[n.jsxs("div",{className:"absolute w-[350px] h-[350px] sm:w-[240px] sm:h-[240px] pointer-events-none rounded-full ",children:[n.jsx("div",{className:`absolute z-[999] inset-0 rounded-full pulse-ring ${h==="Nice Smile!😉"?"ring-2 ring-blue-400":h==="Please smile."?"ring-2 ring-green-500":h==="Face not recognized."?"ring-2 ring-red-500":h==="No face detected"?"ring-2 ring-red-500/80":"ring-2 ring-gray-400/30"}`}),n.jsx("div",{className:`absolute inset-0 rounded-full pulse-ring-alt ${h==="Nice Smile!😉"?"ring-2 ring-blue-400":h==="Please smile."?"ring-2 ring-green-300/70":h==="Face not recognized."?"ring-2 ring-yellow-400/70":h==="No face detected"?"ring-2 ring-red-400/30":"ring-2 ring-gray-300/20"}`}),n.jsx("div",{className:`absolute inset-0 rounded-full pulse-ring-slow ${h==="Nice Smile!😉"?"ring-2 ring-blue-300":h==="Please smile."?"ring-2 ring-green-300/40":h==="Face not recognized."?"ring-2 ring-yellow-300/40":h==="No face detected"?"ring-2 ring-red-400/20":"ring-2 ring-gray-300/10"}`})]}),n.jsxs("div",{className:`flex items-center justify-center w-[400px] h-[400px] sm:w-80 sm:h-80 rounded-full overflow-hidden transition-all duration-300 ${h==="Nice Smile!😉"?"ring-4 ring-blue-500 ring-offset-2 shadow-lg shadow-blue-500/50":h==="Please smile."?"ring-4 ring-green-400 ring-offset-2 shadow-lg shadow-green-500/50":h==="Face not recognized."?"ring-4 ring-yellow-500 ring-offset-2 shadow-lg shadow-yellow-500/50":h==="No face detected"?"ring-4 ring-red-400 ring-offset-2 shadow-lg shadow-red-500/40":"ring-4 ring-gray-400 ring-offset-2"} bg-gradient-to-br from-slate-900 to-slate-800`,children:[n.jsx("video",{crossOrigin:"anonymous",ref:b,className:"w-full h-full object-cover",autoPlay:!0,muted:!0,playsInline:!0}),n.jsx("canvas",{ref:I,className:"w-full h-full absolute inset-0"})]}),n.jsx("div",{className:"absolute flex justify-center translate-y-[190px] sm:translate-y-[140px] w-full ",children:n.jsx("span",{className:`px-4 py-2 backdrop-blur-sm rounded-full text-sm sm:text-xs font-medium transition-all ${me==="passed"?"bg-blue-500/60 text-green-50 border ":"bg-green-500/60  text-yellow-50 border "}`,children:h})})]})})}),n.jsxs("div",{className:"relative grid grid-cols-3 justify-center w-full mt-20 px-4 gap-4",children:[n.jsxs("div",{className:"flex flex-col gap-2 justify-start max-w-60",children:[n.jsx("p",{className:"text-xs font-semibold text-secondary-foreground uppercase tracking-wide",children:"Status"}),n.jsxs("span",{className:`inline-flex items-center gap-2 px-3 py-1 rounded-full text-sm font-medium ${fe==="Running"?"bg-green-600 text-green-50 border border-green-500":"bg-red-600 text-red-50 border border-red-500"}`,children:[n.jsx("span",{className:"w-2 h-2 rounded-full bg-current animate-pulse"}),fe]})]}),n.jsx("div",{className:"flex flex-col items-center gap-2",children:pe.length>1&&n.jsxs(ot,{value:M||"auto",onValueChange:e=>xe(e==="auto"?"":e),children:[n.jsxs(at,{className:"h-8 w-40 text-xs gap-1 px-2 text-accent-foreground",children:[n.jsx(gt,{className:"w-3.5 h-3.5 shrink-0 text-muted-foreground"}),n.jsx(ct,{placeholder:"Camera",className:"text-accent-foreground"})]}),n.jsxs(lt,{className:"text-accent-foreground",children:[n.jsx(Me,{value:"auto",children:"Auto (Front/Back)"}),pe.map((e,t)=>n.jsx(Me,{className:"text-accent-foreground",value:e.deviceId,children:e.label||`Camera ${t+1}`},e.deviceId))]})]})}),n.jsxs("div",{className:"flex flex-col gap-2 justify-end text-right",children:[n.jsx("p",{className:"text-xs font-semibold text-secondary-foreground uppercase tracking-wide",children:"Permissions"}),n.jsxs("div",{className:"flex gap-3 justify-end",children:[n.jsxs("button",{onClick:()=>{x!=="ok"&&W()},className:"flex items-center gap-1 px-2 py-1 rounded transition-all hover:bg-white/10 cursor-pointer group",title:x==="ok"?"Camera enabled":"Click to enable camera",children:[n.jsx(mt,{className:`w-4 h-4 transition-all ${x==="ok"?"text-green-500":"text-red-500 group-hover:scale-110"}`}),n.jsx("span",{className:`w-2 h-2 rounded-full transition-all ${x==="ok"?"bg-green-500":"bg-red-500 group-hover:scale-125"}`})]}),n.jsxs("button",{onClick:()=>{k!=="ok"&&$()},className:"flex items-center gap-1 px-2 py-1 rounded transition-all hover:bg-white/10 cursor-pointer group",title:k==="ok"?"Location enabled":"Click to enable location",children:[n.jsx(ft,{className:`w-4 h-4 transition-all ${k==="ok"?"text-green-500":"text-red-500 group-hover:scale-110"}`}),n.jsx("span",{className:`w-2 h-2 rounded-full transition-all ${k==="ok"?"bg-green-500":"bg-red-500 group-hover:scale-125"}`})]})]})]})]})]})]})}function Lt(){const[r,a]=s.useState(null),[l,o]=s.useState(!0),[c,d]=s.useState(60),u=Be();s.useEffect(()=>{le.get("users/userDetails/",{headers:{Authorization:`Token ${dt.getItem("accessToken")}`}}).then(S=>{a(S.data)}).finally(()=>o(!1))},[]),s.useEffect(()=>{const S=setInterval(()=>{d(E=>(E<=1&&(u("/regional/user/temp"),window.location.reload()),E-1))},1e3);return()=>clearInterval(S)},[u]);const j=S=>{const E=Math.floor(S/60),k=S%60;return`${E.toString().padStart(2,"0")}:${k.toString().padStart(2,"0")}`};return l?n.jsx("div",{className:"flex h-full w-full justify-center items-center",children:"Loading..."}):!r||!r.description||r.description.length===0?n.jsx("div",{className:"flex-1 h-full flex items-center justify-center",children:n.jsx(xt,{})}):n.jsxs("div",{className:"flex-1 h-full overflow-auto",children:[n.jsxs("div",{className:"fixed bottom-20 right-2 bg-gray-100 px-3 py-1 rounded-md font-mono text-sm z-50",children:[n.jsx("span",{className:" md:hidden",children:"Session Timer:"}),"   ",j(c)]}),n.jsx(ut,{}),n.jsx(s.Suspense,{fallback:n.jsx("div",{children:"Loading..."}),children:n.jsx(Ct,{userObject:r})})]})}export{Lt as default};
