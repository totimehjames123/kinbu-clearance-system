import axios from 'axios'
import React, { useEffect } from 'react'
import { useNavigate } from 'react-router-dom'

function checkIsLoggedInAndNavigate(passedPath, failedPath) {
    const navigate = useNavigate()
    
        useEffect(() => {

            const currentUser = JSON?.parse(localStorage?.getItem("currentUser"))
           

            if (currentUser){
                const id = currentUser?._id

                const verifyUser = async () => {
                    try{
                        const response = await axios.post(`${import.meta.env.VITE_SERVER_URL}/verify-user`, {id})

                        if (response.status === 200){
                            localStorage.setItem("currentUser", JSON?.stringify(response.data.user))
                            navigate(passedPath)
                        }
                        else{
                            console.log(response.data.message)
                            navigate(failedPath)
                        }
                    }
                    catch(error){
                        console.error("Error verifying user: ", error)
                        navigate(failedPath)
                    }
                
            
                }
                verifyUser()
            }
            else{
                console.log("logged out")
                navigate(failedPath)
            }

        }, [navigate])
    
    
  
}

export default checkIsLoggedInAndNavigate