
import {useState} from 'react'
import {Heading, Text, VStack, useToast, keyboardDismissHandlerManager } from "native-base";
import { Header } from "../components/Header";

import Logo from '../assets/logo.svg'
import { Input } from "../components/Input";
import { Button } from "../components/Button";

import {api} from '../services/api';
import { Keyboard, TouchableWithoutFeedback } from 'react-native';


export function New(){
    const [title, setTitle] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const toast =useToast();
    
    async function handlePoolCreate(){
        if(!title.trim()){
            return toast.show({
                title: 'Informe um nome para o seu bolão!',
                placement: 'top',
                bgColor: 'red.500'
            })
        }
        try{
            setIsLoading(true);

            await api.post('/pools', { title })
            toast.show({
                title: 'Bolão enviado com sucesso!',
                placement: 'top',
                bgColor: 'green.500',
            })
            setTitle('');
            Keyboard.dismiss();
            

        }catch(e){
            console.log(e);

            toast.show({
                title: 'Não foi possível criar o bolão',
                placement: 'top',
                bgColor: 'red.500'
            })
        }finally{
            setIsLoading(false)
        }
    }
    return (
        <TouchableWithoutFeedback onPress={() => Keyboard.dismiss()}>
            <VStack flex={1} bgColor="gray.900" >
            <Header title="Criar novo bolão" />

            <VStack mt={8} mx={5} alignItems="center">
                <Logo/>
                <Heading fontFamily='heading' color='white' fontSize='xl' my={8} textAlign='center'>
                    Crie seu próprio bolão da copa{'\n'} e compartlhe entre amigos!
                </Heading>
                <Input mb={2} placeholder='Qual o nome do seu bolão?'
                onChangeText={setTitle}
                value={title}/>
                <Button 
                    title="CRIAR MEU BOLÃO"
                    onPress={handlePoolCreate}
                    isLoading={isLoading}
                />
                <Text color='gray.200' fontSize='sm' textAlign='center' px={10} mt={4}>
                    Após criar seu bolão, você receberá{'\n'}
                    um código único que poderá usar para{'\n'}
                    convidar outras pessoas.
                </Text>
            </VStack>
        </VStack>
        </TouchableWithoutFeedback>
        
    );
}