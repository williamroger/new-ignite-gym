import { VStack, Image, Center, Text, Heading, ScrollView, } from '@gluestack-ui/themed';

import BackgroundImg from '@assets/background.png';
import Logo from '@assets/logo.svg';

import { Input } from '@components/Input';
import { Button } from '@components/Button';

export function SignIn() {
  return (
    <ScrollView 
      contentContainerStyle={{ flexGrow: 1 }} 
      showsVerticalScrollIndicator={false}
    >
      <VStack flex={1} bg="$gray700">
        <Image 
          source={BackgroundImg} 
          alt="Pessoas treinando"
          w="$full"
          h={624} 
          defaultSource={BackgroundImg} 
          position="absolute"
        />

        <VStack flex={1} px="$10" pb="$16">
          <Center my="$24">
            <Logo />

            <Text color="$gray100" fontSize="$sm">Treine sua mente e o seu corpo.</Text>
          </Center>

          <Center gap="$2">
            <Heading color="$gray100">Acesse a sua conta</Heading>

            <Input 
              placeholder="E-mail" 
              keyboardType="email-address"
              autoCapitalize="none"  
            />

            <Input placeholder="Senha" secureTextEntry />

            <Button title="Acessar" />
          </Center>
          <Center flex={1} justifyContent="flex-end" mt="$4">
            <Text color="$gray100" fontSize="$sm" fontFamily="$body" mb="$3">
              Ainda não tem acesso?
            </Text>
            <Button title="Criar Conta" variant="outline" />
          </Center>
        </VStack>
      </VStack>
    </ScrollView>
  );
}