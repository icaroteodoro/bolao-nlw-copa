import { createContext , ReactNode, useState, useEffect} from 'react';
import * as Google from 'expo-auth-session/providers/google';
import * as AuthSession from 'expo-auth-session';
import * as WebBrowser from 'expo-web-browser';

import { api } from '../services/api'

WebBrowser.maybeCompleteAuthSession();


interface UserProps {
    name: string;
    avatarUrl: string;
}
interface AuthPoviderProps {
    children: ReactNode;
}

export interface AuthContextDataProps {
    user: UserProps;
    isUserLoading: boolean;
    signIn: () => Promise<void>;
}

export const AuthContext = createContext({} as AuthContextDataProps);



export function AuthContextProvider ({children}: AuthPoviderProps){
    const [user, setUser] =useState<UserProps>({} as UserProps);

    const [isUserLoading, setIsUserLoading] =  useState(false); 

    const [request, response, promptAsync] = Google.useAuthRequest({
        clientId:'459149731567-42rs2ski17g7qs134tgvqri8ltq8luib.apps.googleusercontent.com',
        redirectUri: AuthSession.makeRedirectUri({useProxy: true}),
        scopes: ['profile', 'email']

    });
    
    async function signIn(){
        try {

            setIsUserLoading(true);
            await promptAsync();

        } catch (error) {
            console.log(error);
            throw error;
        }finally{
            setIsUserLoading(false);
        }
    }

    async function signInWithGoogle(access_token: string){
        try{
            setIsUserLoading(true);

            const tokenResponse = await api.post('/users', { access_token })
            api.defaults.headers.common['Authorization'] = `Bearer ${tokenResponse.data.token}`

            const userInfoResponse = await api.get('/me')
            setUser(userInfoResponse.data.user)

        }catch(error){
            console.log(error);
            throw error;
        }finally{
            setIsUserLoading(false);
        }
    }


    useEffect(() => {
        if(response?.type === 'success' && response.authentication?.accessToken){
            signInWithGoogle(response.authentication.accessToken)
        }
    }, [response])
    return (
        <AuthContext.Provider value={{
            signIn,
            isUserLoading,
            user,
        }}>
            {children}

        </AuthContext.Provider>

    );
}