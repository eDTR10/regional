import{r as a,u as L,j as e,T as _,M as A,S as r,a as S,E as C,b as E,L as z}from"./index-8b8e0056.js";import{R as D,L as P,a as F}from"./login-f8ecd13e.js";import{I}from"./InputText-ef594cc9.js";const R="/regional/assets/DICT-Logo-Login-75c06a4b.webp";function O(){const[m,j]=a.useState(!1),[f,v]=a.useState(!1),[c,d]=a.useState(0),[i,p]=a.useState(!1),[l,u]=a.useState(null),x=L(),[n,b]=a.useState({email:"",password:""}),h=n.email.trim()!==""&&n.password.trim()!=="",g=5,w=15*60*1e3;a.useEffect(()=>{localStorage.getItem("accessToken")&&x("/regional/user/home");const t=localStorage.getItem("lockoutTime"),o=localStorage.getItem("failedAttempts");if(t){const s=new Date(t);new Date().getTime()-s.getTime()<w?(p(!0),u(s),d(parseInt(o||"0"))):(localStorage.removeItem("lockoutTime"),localStorage.removeItem("failedAttempts"))}},[]),a.useEffect(()=>{let t;return i&&l&&(t=setInterval(()=>{new Date().getTime()-l.getTime()>=w&&(p(!1),u(null),d(0),localStorage.removeItem("lockoutTime"),localStorage.removeItem("failedAttempts"),clearInterval(t))},1e3)),()=>{t&&clearInterval(t)}},[i,l]);const T=()=>{if(!l)return 0;const o=new Date().getTime()-l.getTime(),s=Math.max(0,w-o);return Math.ceil(s/1e3/60)},k=()=>{const t=c+1;if(d(t),localStorage.setItem("failedAttempts",t.toString()),t>=g){const o=new Date;p(!0),u(o),localStorage.setItem("lockoutTime",o.toISOString()),r.fire({icon:"warning",title:"Too Many Failed Attempts! 🚫",html:`
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
                `,confirmButtonText:"I Understand",confirmButtonColor:"#f59e0b",allowOutsideClick:!1})}else{const o=g-t;r.fire({icon:"error",title:"Login Failed ❌",html:`
                    <div style="text-align: center; margin: 20px 0;">
                        <p style="font-size: 16px; margin-bottom: 10px;">
                            Invalid email or password
                        </p>
                        <p style="font-size: 14px; color: #f59e0b;">
                            ⚠️ <strong>${o}</strong> attempt(s) remaining
                        </p>
                    </div>
                `,confirmButtonText:"Try Again",confirmButtonColor:"#ef4444"})}},N=()=>{d(0),localStorage.removeItem("failedAttempts"),localStorage.removeItem("lockoutTime")};return e.jsx(_,{defaultTheme:"light",storageKey:"vite-ui-theme",children:e.jsxs("div",{className:"bg-background relative w-screen h-screen overflow-hidden flex justify-center",children:[e.jsx("div",{className:"absolute right-0 p-10 z-30",children:e.jsx(A,{})}),e.jsxs("div",{className:"relative w-full h-full flex flex-col gap-4 items-center justify-center",children:[e.jsx("img",{src:D,className:"pointer-events-none absolute z-0 h-full w-full object-cover opacity-5",alt:""}),e.jsxs("div",{className:"flex gap-3 items-center",children:[e.jsx("img",{src:P,className:"animate__animated animate__slideInLeft h-16 object-contain",alt:""}),e.jsx("a",{href:"https://www.facebook.com/DICTRegion10",target:"_blank",children:e.jsx("img",{src:R,className:"animate__animated animate__slideInRight h-24 object-contain",alt:""})})]}),e.jsxs("form",{className:"animate__animated animate__fadeInUp mb-10 z-10 w-full sm:w-[95%] sm:mx-4 max-w-[450px] flex flex-col items-center min-h-[100px] py-10 px-6 rounded-md bg-card border-2 border-border",onSubmit:t=>{if(t.preventDefault(),i){r.fire({icon:"warning",title:"Account Temporarily Locked 🔒",html:`
                                    <div style="text-align: center; margin: 20px 0;">
                                        <p style="font-size: 16px; margin-bottom: 15px;">
                                            Too many failed login attempts detected.
                                        </p>
                                        <p style="font-size: 14px; color: #f59e0b; margin-bottom: 10px;">
                                            ⏰ Please wait <strong>${T()}</strong> more minutes
                                        </p>
                                        <p style="font-size: 12px; color: #666; font-style: italic;">
                                            🛡️ This is for security purposes
                                        </p>
                                    </div>
                                `,confirmButtonText:"I Understand",confirmButtonColor:"#f59e0b"});return}v(!0);const o=new Promise((s,y)=>setTimeout(()=>y(new Error("Server timeout")),5e3));Promise.race([S.post("token/login/",n),o]).then(s=>{if(s.data.auth_token)return localStorage.setItem("accessToken",s.data.auth_token),S.get("users/userDetails/",{headers:{Authorization:`Token ${s.data.auth_token}`}})}).then(s=>{s&&(N(),r.fire({icon:"success",title:"Login Successfully! 🎉",html:`
                                        <div style="text-align: center; margin: 20px 0;">
                                            <p style="font-size: 16px; color: #10b981;">
                                                Welcome back! 😊
                                            </p>
                                        </div>
                                    `,showConfirmButton:!1,timer:2e3}),localStorage.setItem("user",JSON.stringify(s.data)),s.data.access_lvl===14?x("/regional/admin"):x("/regional/user"))}).catch(s=>{s.message==="Server timeout"?r.fire({icon:"warning",title:"Server Not Responding ⏰",text:"The server is taking too long to respond. Please try again later.",showConfirmButton:!0}):k()}).finally(()=>{v(!1)})},children:[e.jsx("div",{className:"w-[95%] h-16 flex",children:e.jsx("h1",{className:"text-foreground text-3xl font-bold",children:"SIGN IN"})}),e.jsxs("div",{className:"flex flex-col gap-4 w-[85%]",children:[e.jsx(I,{label:"Email",value:n.email,onChange:t=>{b({...n,email:t.target.value})},type:"email"}),e.jsxs("div",{className:"relative flex",children:[e.jsx(I,{label:"Password",value:n.password,onChange:t=>{b({...n,password:t.target.value})},type:m?"text":"password",style:{paddingRight:"2.5rem"}}),e.jsx("button",{type:"button",onClick:()=>j(!m),"aria-label":m?"Hide password":"Show password",className:"right-0 flex items-center sm:mt-4 h-full w-10 absolute",children:m?e.jsx(E,{className:"w-5 h-5"}):e.jsx(C,{className:"w-5 h-5"})})]}),e.jsx(z,{to:"/regional/forgot-password",className:"text-foreground font-semibold text-sm cursor-pointer self-end pt-2 pb-6 hover:underline",children:"Forgot password?"}),e.jsx("button",{disabled:f||!h||i,className:`btn-donate flex items-center justify-center gap-2 ${f||!h||i?"opacity-70 cursor-not-allowed":""}`,children:f?e.jsxs(e.Fragment,{children:[e.jsx(F,{className:"h-4 w-4 animate-spin"}),"Signing In..."]}):i?`🔒 Locked (${T()}m remaining)`:h?"Sign In":"Sign In (Fill all fields first)"}),c>0&&c<g&&!i&&e.jsxs("div",{className:"text-center text-sm text-yellow-600 mt-2",children:["⚠️ Warning: ",g-c," attempt(s) remaining"]})]})]})]}),e.jsx("p",{className:"absolute text-foreground bottom-0 z-20 self-center pb-4 hover:underline cursor-pointer text-sm",children:"Developed by: DICT Region 10"})]})})}export{O as default};
