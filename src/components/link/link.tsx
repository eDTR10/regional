
import { Link } from 'react-router-dom'

function NavLink({to,text,icon}:any) {
  return (
    <Link className=" hover:font-semibold transition-all  flex items-center gap-2 duration-75 text-white" to={to} >
      {icon?icon:""}
      <p>{text}</p> </Link>
  )
}

export default NavLink