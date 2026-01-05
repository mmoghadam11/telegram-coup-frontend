import React, {useEffect} from "react";
import {useAuthorization} from "../hooks/useAutorization";
import {store} from "../redux/configureStore";
import {UserAccess} from "../redux/actions";

export type MainProviderContextType = {
    // isAuthorized?: boolean,
    access: any;
}

export const mainProviderContext = React.createContext<any>(undefined);


export const MainProviderContext = (props: any) => {
    const {children} = props;

    const {userAccess} = useAuthorization();

    // useEffect(() => {
    //     console.log({
    //         access: userAccess(),
    //         // isAuthorized: isAuthorized()
    //     });
    // }, [userAccess]);

    return (<mainProviderContext.Provider value={{
        access: userAccess(),
        // isAuthorized: isAuthorized()
    }}>
        {children}
    </mainProviderContext.Provider>)
}