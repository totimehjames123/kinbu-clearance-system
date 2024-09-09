
function checkIsAdmin() {

    const currentUser = JSON?.parse(localStorage.getItem("currentUser"))

    if (currentUser?.role === "admin"){
        return true
    }

  return false;
}

export default checkIsAdmin