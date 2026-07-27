import{r as i,u as A,s as o,j as e,T as _,M as C,h as m,i as j,E,f as z,L as D}from"./index-b5243937.js";import{R as P,L as F}from"./login-26b670a0.js";import{I as k}from"./InputText-4c3724b4.js";import{L as R}from"./loader-2-f897c3f5.js";const $="/regional/assets/DICT-Logo-Login-75c06a4b.webp";function K(){const[c,N]=i.useState(!1),[g,b]=i.useState(!1),[d,f]=i.useState(0),[n,u]=i.useState(!1),[l,x]=i.useState(null),h=A(),[r,T]=i.useState({email:"",password:""}),w=r.email.trim()!==""&&r.password.trim()!=="",p=5,v=15*60*1e3;i.useEffect(()=>{o.getItem("accessToken")&&h("/regional/user/home");const t=o.getItem("lockoutTime"),a=o.getItem("failedAttempts");if(t){const s=new Date(t);new Date().getTime()-s.getTime()<v?(u(!0),x(s),f(parseInt(a||"0"))):(o.removeItem("lockoutTime"),o.removeItem("failedAttempts"))}},[]),i.useEffect(()=>{let t;return n&&l&&(t=setInterval(()=>{new Date().getTime()-l.getTime()>=v&&(u(!1),x(null),f(0),o.removeItem("lockoutTime"),o.removeItem("failedAttempts"),clearInterval(t))},1e3)),()=>{t&&clearInterval(t)}},[n,l]);const y=()=>{if(!l)return 0;const a=new Date().getTime()-l.getTime(),s=Math.max(0,v-a);return Math.ceil(s/1e3/60)},L=()=>{const t=d+1;if(f(t),o.setItem("failedAttempts",t.toString()),t>=p){const a=new Date;u(!0),x(a),o.setItem("lockoutTime",a.toISOString()),m.fire({icon:"warning",title:"Too Many Failed Attempts! 🚫",html:`
                    <div style="text-align: center; margin: 20px 0;">
                        <p style="font-size: 16px; margin-bottom: 15px;">
                            You have exceeded the maximum number of login attempts.
                        </p>
                        <p style="font-size: 14px; color: #f59e0b; margin-bottom: 10px;">
                            ⏰ Please come back later in <strong>15 minutes</strong>
                        </p>
                        <p style="font-size: 12px; color: #666; font-style: italic;">
                            🛡️ This is for security purposes
                        </p>
                    </div>
                `,confirmButtonText:"I Understand",confirmButtonColor:"#f59e0b",allowOutsideClick:!1})}else{const a=p-t;m.fire({icon:"error",title:"Login Failed ❌",html:`
                    <div style="text-align: center; margin: 20px 0;">
                        <p style="font-size: 16px; margin-bottom: 10px;">
                            Invalid email or password
                        </p>
                        <p style="font-size: 14px; color: #f59e0b;">
                            ⚠️ <strong>${a}</strong> attempt(s) remaining
                        </p>
                    </div>
                `,confirmButtonText:"Try Again",confirmButtonColor:"#ef4444"})}},S=()=>{f(0),o.removeItem("failedAttempts"),o.removeItem("lockoutTime")};return e.jsx(_,{defaultTheme:"light",storageKey:"vite-ui-theme",children:e.jsxs("div",{className:"bg-background relative w-screen h-screen overflow-hidden flex justify-center",children:[e.jsx("div",{className:"absolute right-0 p-10 z-30",children:e.jsx(C,{})}),e.jsxs("div",{className:"relative w-full h-full flex flex-col gap-4 items-center justify-center",children:[e.jsx("img",{src:P,className:"pointer-events-none absolute z-0 h-full w-full object-cover opacity-5",alt:""}),e.jsxs("div",{className:"flex gap-3 items-center",children:[e.jsx("img",{src:F,className:"animate__animated animate__slideInLeft h-16 object-contain",alt:""}),e.jsx("a",{href:"https://www.facebook.com/DICTRegion10",target:"_blank",children:e.jsx("img",{src:$,className:"animate__animated animate__slideInRight h-24 object-contain",alt:""})})]}),e.jsxs("form",{className:"animate__animated animate__fadeInUp mb-10 z-10 w-full sm:w-[95%] sm:mx-4 max-w-[450px] flex flex-col items-center min-h-[100px] py-10 px-6 rounded-md bg-card border-2 border-border",onSubmit:t=>{if(t.preventDefault(),n){m.fire({icon:"warning",title:"Account Temporarily Locked 🔒",html:`
                                    <div style="text-align: center; margin: 20px 0;">
                                        <p style="font-size: 16px; margin-bottom: 15px;">
                                            Too many failed login attempts detected.
                                        </p>
                                        <p style="font-size: 14px; color: #f59e0b; margin-bottom: 10px;">
                                            ⏰ Please wait <strong>${y()}</strong> more minutes
                                        </p>
                                        <p style="font-size: 12px; color: #666; font-style: italic;">
                                            🛡️ This is for security purposes
                                        </p>
                                    </div>
                                `,confirmButtonText:"I Understand",confirmButtonColor:"#f59e0b"});return}b(!0);const a=new Promise((s,I)=>setTimeout(()=>I(new Error("Server timeout")),5e3));Promise.race([j.post("jwt/create/",r),a]).then(s=>{if(s.data.access)return o.setItem("accessToken",s.data.access),o.setItem("refreshToken",s.data.refresh),j.get("users/userDetails/",{headers:{Authorization:`Token ${s.data.access}`}})}).then(s=>{s&&(S(),m.fire({icon:"success",title:"Login Successfully! 🎉",html:`
                                        <div style="text-align: center; margin: 20px 0;">
                                            <p style="font-size: 16px; color: #10b981;">
                                                Welcome back! 😊
                                            </p>
                                        </div>
                                    `,showConfirmButton:!1,timer:2e3}),o.setItem("user",JSON.stringify(s.data)),s.data.access_lvl===14?h("/regional/admin"):h("/regional/user"))}).catch(s=>{s.message==="Server timeout"?m.fire({icon:"warning",title:"Server Not Responding ⏰",text:"The server is taking too long to respond. Please try again later.",showConfirmButton:!0}):L()}).finally(()=>{b(!1)})},children:[e.jsx("div",{className:"w-[95%] h-16 flex",children:e.jsx("h1",{className:"text-foreground text-3xl font-bold",children:"SIGN IN"})}),e.jsxs("div",{className:"flex flex-col gap-4 w-[85%]",children:[e.jsx(k,{label:"Email",value:r.email,onChange:t=>{T({...r,email:t.target.value})},type:"email"}),e.jsxs("div",{className:"relative flex",children:[e.jsx(k,{label:"Password",value:r.password,onChange:t=>{T({...r,password:t.target.value})},type:c?"text":"password",style:{paddingRight:"2.5rem"}}),e.jsx("button",{type:"button",onClick:()=>N(!c),"aria-label":c?"Hide password":"Show password",className:"right-0 flex items-center sm:mt-4 h-full w-10 absolute",children:c?e.jsx(z,{className:"w-5 h-5"}):e.jsx(E,{className:"w-5 h-5"})})]}),e.jsx(D,{to:"/regional/forgot-password",className:"text-foreground font-semibold text-sm cursor-pointer self-end pt-2 pb-6 hover:underline",children:"Forgot password?"}),e.jsx("button",{disabled:g||!w||n,className:`btn-donate flex items-center justify-center gap-2 ${g||!w||n?"opacity-70 cursor-not-allowed":""}`,children:g?e.jsxs(e.Fragment,{children:[e.jsx(R,{className:"h-4 w-4 animate-spin"}),"Signing In..."]}):n?`🔒 Locked (${y()}m remaining)`:w?"Sign In":"Sign In (Fill all fields first)"}),d>0&&d<p&&!n&&e.jsxs("div",{className:"text-center text-sm text-yellow-600 mt-2",children:["⚠️ Warning: ",p-d," attempt(s) remaining"]})]})]})]}),e.jsx("p",{className:"absolute text-foreground bottom-0 z-20 self-center pb-4 hover:underline cursor-pointer text-sm",children:"Developed by: DICT Region 10"})]})})}export{K as default};
