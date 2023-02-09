import { HStack, Toast, useToast, VStack } from "native-base";
import {Share } from 'react-native'
import { useState, useEffect } from "react";
import { Header } from "../components/Header";

import { api } from '../services/api';


import {useRoute} from '@react-navigation/native' ;
import { Loading } from "../components/Loading";
import {PoolCardProps} from "../components/PoolCard";
import { PoolHeader } from "../components/PoolHeader";
import { Guesses } from "../components/Guesses";
import { EmptyMyPoolList } from "../components/EmptyMyPoolList";
import { Option } from "../components/Option";

interface RouteParams {
    id: string;
}


export function Details(){
    const [optionSelected, setOptionSelected] = useState<'guesses' | 'ranking'>('guesses');
    const [poolDetails, setPoolDetails] = useState<PoolCardProps>({} as PoolCardProps);
    const [isLoading, setIsLoading] = useState(true);
    const route = useRoute();
    const {id} = route.params as RouteParams;
    const toast = useToast();

    async function handleCodeShare(){
        await Share.share({
            message: poolDetails.code
        });
    }

    async function fetchPoolDetails(){
        try {
            setIsLoading(true)
            const response = await api.get(`/pools/${id}`)
            setPoolDetails(response.data.pool);

        } catch (error) {
            console.log(error)

            toast.show({
                title: 'Não foi possível carreagar os detalhes do bolão!',
                placement:'top',
                bgColor: 'red.500'
            })
        }finally{
            setIsLoading(false)
        }
    }

    useEffect (() => {
        fetchPoolDetails();
    }, [id]);

    if(isLoading){
        return (
            <Loading />
        )
    }

    return (
        <VStack flex={1} bgColor="gray.900"  >
            <Header title={poolDetails.title} showBackButton showShareButton onShare={handleCodeShare}/>

            {
                poolDetails._count?.participants > 0 ? 
                <VStack>
                    <PoolHeader data={poolDetails}/>

                    <HStack bgColor='gray.800' p={1} rounded='sm' mb={5} mx={5}>
                        <Option 
                            title="Seus Palpites" 
                            isSelected={optionSelected === 'guesses'}
                            onPress={() => setOptionSelected('guesses')}
                        />
                        <Option 
                            title="Ranking do grupo" 
                            isSelected={optionSelected === 'ranking'}
                            onPress={() => setOptionSelected('ranking')}
                        />
                        <Guesses poolId={poolDetails.code}/> 
                    </HStack>

                </VStack> 

                : <EmptyMyPoolList code = {poolDetails.code}/>
            }

        </VStack>
    );
}