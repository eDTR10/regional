import{u as f,r as o,j as e,T as u,M as x,L as g,a as h,S as i}from"./index-2da551a3.js";import{R as p,L as b,a as j,b as w}from"./login-7b19856c.js";import{I as v}from"./InputText-ca7d63b7.js";function T(){const c=f(),[s,r]=o.useState({email:"",password:""}),[l,a]=o.useState(!1);o.useEffect(()=>{localStorage.getItem("accessToken")&&c("/regional/admin/home")},[]);const m=async t=>{t.preventDefault(),a(!0);const d=setTimeout(()=>a(!1),6e3);try{await h.post("users/reset_password/",s),clearTimeout(d),i.fire({icon:"success",title:"We sent something to your email successfully.",showConfirmButton:!1,timer:2e3}),r({email:"",password:""})}catch(n){console.log(n.response.data.non_field_errors[0]),i.fire({icon:"error",title:"Oops...",text:n.response.data.non_field_errors[0],showConfirmButton:!1})}finally{a(!1)}};return e.jsx(u,{defaultTheme:"system",storageKey:"vite-ui-theme",children:e.jsxs("div",{className:"bg-background relative w-screen h-screen overflow-hidden flex justify-center",children:[e.jsx("div",{className:"absolute right-0 p-10 z-30",children:e.jsx(x,{})}),e.jsxs("div",{className:"relative w-full h-full flex flex-col gap-4 items-center justify-center",children:[e.jsx("img",{src:p,className:"pointer-events-none absolute z-0 h-full w-full object-cover opacity-5",alt:""}),e.jsxs("div",{className:"flex gap-3 items-center",children:[e.jsx("img",{src:b,className:"animate__animated animate__slideInLeft h-16 object-contain",alt:""}),e.jsx("a",{href:"https://www.facebook.com/DICTRegion10",target:"_blank",children:e.jsx("img",{src:j,className:"animate__animated animate__slideInRight h-24 object-contain",alt:""})})]}),e.jsxs("form",{className:"animate__animated animate__fadeInUp mb-10 z-10 w-full sm:w-[95%] sm:mx-4 max-w-[450px] flex flex-col items-center min-h-[100px] py-10 px-6 rounded-md bg-card border-2 border-border",onSubmit:m,children:[e.jsx("div",{className:"w-[95%] h-16 flex",children:e.jsx("h1",{className:"text-foreground text-3xl font-bold",children:"Reset Password"})}),e.jsxs("div",{className:"flex flex-col gap-4 w-[85%]",children:[e.jsx(v,{label:"Email",value:s.email,onChange:t=>r({...s,email:t.target.value}),type:"email"}),e.jsx(g,{to:"/regional/login",className:"text-foreground font-semibold text-sm cursor-pointer self-end pt-2 pb-6 hover:underline",children:"Already remember it? Back to Login"}),e.jsx("button",{className:"btn-donate",type:"submit",disabled:l,children:l?e.jsxs("div",{className:"flex gap-2 justify-center items-center",children:["Sending",e.jsx(w,{className:"loader animate-spin"})]}):"Reset Password"})]})]})]}),e.jsx("p",{className:"absolute text-foreground bottom-0 z-20 self-center pb-4 hover:underline cursor-pointer text-sm",children:"Developed by: DICT Region 10"})]})})}export{T as default};
