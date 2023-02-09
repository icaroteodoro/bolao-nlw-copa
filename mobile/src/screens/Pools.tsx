import { Icon, Text, useToast, VStack, FlatList } from "native-base";
import { Octicons } from '@expo/vector-icons';
import { Button } from "../components/Button";
import { Header } from "../components/Header";
import {useFocusEffect, useNavigation} from '@react-navigation/native'
import {api} from '../services/api'


import {PoolCard,  PoolCardProps} from '../components/PoolCard'
import {Loading} from '../components/Loading'
import { useState, useEffect, useCallback } from "react";
import { EmptyPoolList } from "../components/EmptyPoolList";


export function Pools(){
    const toast = useToast();
    const [isLoading, setIsLoading] = useState(true);
    const [pools, setPools] = useState<PoolCardProps[]>([]);
    const {navigate} = useNavigation();


    async function fecthPools() {
        try {
            setIsLoading(true);
            const response = await api.get('/pools');
            setPools(response.data.pools)
        }catch (error){
            console.log(error);
            toast.show({
                title:'Não foi possivel carregar os bolões!',
                placement: 'top',
                bgColor: 'red.500'
            });
        }finally{
            setIsLoading(false);
        }
    }
    useFocusEffect(useCallback(() => {
        fecthPools();
    }, []));
    return (
        <VStack flex={1} bgColor="gray.900">
            <Header title="Meus Bolões"/>


            <VStack mt={6} mx={5} borderBottomWidth={1} borderBottomColor='gray.600' pb={4} mb={4}>
                <Button 
                    title="BUSCAR BOLÃO POR CÓDIGO"
                    leftIcon={<Icon as ={Octicons} name='search' color='black' size='md' />} 
                    onPress= {() => navigate('find')}
                />  
                
            </VStack>
            <FlatList
                data={pools}
                keyExtractor={item => item.id}
                renderItem ={({item}) => (
                <PoolCard 
                    data={item}
                    onPress={() => navigate('details', {id: item.id })}
                />)}
                ListEmptyComponent = {() => <EmptyPoolList/>}
                _contentContainerStyle = {{ pb: 10}}
                px={5}
                showsVerticalScrollIndicator={false}
            />
            
           
        </VStack>
    );
}