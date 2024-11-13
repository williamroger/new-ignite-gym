import { 
  VStack, 
  Image, 
  Center, 
  Text, 
  Heading,
  ScrollView, 
} from '@gluestack-ui/themed';
import { useNavigation } from '@react-navigation/native';
import { useForm, Controller } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import * as yup from 'yup';

import { AuthNavigatorRoutesProps } from '@routes/auth.routes';

import BackgroundImg from '@assets/background.png';
import Logo from '@assets/logo.svg';


import { Input } from '@components/Input';
import { Button } from '@components/Button';

type FormDataProps = {
  email: string;
  password: string;
}

const signInSchema = yup.object({
  email: yup
    .string()
    .required('Informe o e-mail.')
    .email('E-mail inválido.'),
  password: yup
    .string()
    .required('Informe a senha.')
    .min(6, 'A senha deve ter no mínimo 6 caracteres.'),
});

export function SignIn() {
  const { control, handleSubmit, formState: { errors } } = useForm<FormDataProps>({
    resolver: yupResolver(signInSchema),
  });
  
  const navigation = useNavigation<AuthNavigatorRoutesProps>();
  
  function handleSignIn({ email, password }: FormDataProps) {
    console.log({ email, password });
  }

  function handleNewAccount() {
    navigation.navigate('signUp');
  }

  return (
    <ScrollView 
      contentContainerStyle={{ flexGrow: 1 }} 
      showsVerticalScrollIndicator={false}
    >
      <VStack flex={1}>
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

            <Controller
              control={control}
              name="email"
              render={({ field: { onChange, value }}) => (
                <Input
                  value={value}
                  onChangeText={onChange}
                  placeholder="E-mail"
                  keyboardType="email-address"
                  autoCapitalize="none"
                  errorMessage={errors.email?.message}
                />
              )}
            />

            <Controller 
              control={control}
              name="password"
              render={({ field: { onChange, value }}) => (
                <Input
                  value={value}
                  onChangeText={onChange}
                  placeholder="Senha" 
                  secureTextEntry 
                  textContentType="oneTimeCode"
                  errorMessage={errors.password?.message}
                />
              )}
            />
            

            <Button 
              title="Acessar"
              onPress={handleSubmit(handleSignIn)} 
            />
          </Center>
          <Center flex={1} justifyContent="flex-end" mt="$4">
            <Text color="$gray100" fontSize="$sm" fontFamily="$body" mb="$3">
              Ainda não tem acesso?
            </Text>
            <Button 
              title="Criar Conta" 
              variant="outline" 
              onPress={handleNewAccount} 
            />
          </Center>
        </VStack>
      </VStack>
    </ScrollView>
  );
}