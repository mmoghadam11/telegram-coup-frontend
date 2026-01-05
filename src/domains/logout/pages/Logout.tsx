import React, {useEffect} from "react";
// import { useKeycloak } from "@react-keycloak/web";
import TavanaSpinner from "components/spinner/TavanaSpinner";
import {useAuth} from "../../../hooks/useAuth";

function LogoutPage() {
    const Auth = useAuth();
    // const { keycloak } = useKeycloak();

    // useEffect(() => {
    //   if (!keycloak.authenticated) {
    //     // keycloak.login({ redirectUri: "http://192.180.9.151:3000/dashboard" });
    //     keycloak.login({ redirectUri: "http://localhost:3000:3000/dashboard" });
    //   } else {
    //     // keycloak.logout({ redirectUri: "http://192.180.9.151:3000/" });
    //     keycloak.logout({ redirectUri: "http://localhost:3000/dashboard" });
    //   }
    // }, [keycloak]);
    useEffect(() => {
        sessionStorage.clear();
        localStorage.clear();
        Auth?.logout();
        window.location.href = `/login`.toString();
    }, []);

    return <TavanaSpinner show={true}/>;
}

export default LogoutPage;
