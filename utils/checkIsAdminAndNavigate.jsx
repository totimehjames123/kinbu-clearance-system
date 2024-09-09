import checkIsAdmin from "./checkIsAdmin"
import { useNavigate } from "react-router-dom"

function checkIsAdminAndNavigate() {
    const navigate = useNavigate()
    if (checkIsAdmin() !== true){
        navigate('/login')
    }
}

export default checkIsAdminAndNavigate