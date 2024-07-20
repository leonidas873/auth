import { Link } from "react-router-dom";

export default function Navigation(){
    return <ul className="flex gap-3">
        <li className="p-2 hover:opacity-40"><Link to="/login">login</Link></li>
        <li className="p-2 hover:opacity-40"><Link to="/products">products</Link></li>
        <li className="p-2 hover:opacity-40"><Link to="/cart">cart</Link></li>
    </ul>
}