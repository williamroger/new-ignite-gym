import { useState } from 'react';
import { 
  VStack, 
  Image, 
  Center, 
  Text, 
  Heading, 
  ScrollView,
  useToast, 
  Toast,
  ToastTitle,
} from '@gluestack-ui/themed';
import { useNavigation } from '@react-navigation/native';
import { useForm, Controller } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import * as yup from 'yup';

import { api } from '@services/api';
import { useAuth } from '@hooks/useAuth';

import { AppError } from '@utils/AppError';

import BackgroundImg from '@assets/background.png';
import Logo from '@assets/logo.svg';

import { Input } from '@components/Input';
import { Button } from '@components/Button';

type FormDataProps = {
  name: string;
  email: string;
  password: string;
  password_confirm: string;
}

const signUpSchema = yup.object({
  name: yup.string().required('Informe o nome.'),
  email: yup.string().required('Informe o e-mail.').email('E-mail inválido.'),
  password: yup
    .string()
    .required('Informe a senha.')
    .min(6, 'A senha deve ter no mínimo 6 dígitos.'),
  password_confirm: yup
    .string()
    .required('Confirme a senha.')
    .oneOf([yup.ref("password"), ""], "A confirmação da senha não confere."),
});

export function SignUp() {
  const [isLoading, setIsLoading] = useState(false);

  const { control, handleSubmit, formState: { errors } } = useForm<FormDataProps>({
    resolver: yupResolver(signUpSchema),
  });

  const navigation = useNavigation();
  const toast = useToast();
  const { signIn } = useAuth();

  async function handleSignUp({ name, email, password }: FormDataProps) {
    try {
      setIsLoading(true);
      
      await api.post('/users', { name, email, password });
      await signIn(email, password);

    } catch (error) {
      setIsLoading(false);

      const isAppError = error instanceof AppError;
     
      const title = isAppError 
        ? error.message 
        : 'Não foi possível criar a conta. Tente novamente mais tarde.';

      toast.show({
        placement: 'top',
        render: () => (
          <Toast bgColor="$red500">
            <ToastTitle>{title}</ToastTitle>
          </Toast>
        )
      });
    }
  }

  function handleGoBack() {
    navigation.goBack();
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

          <Center gap="$2" flex={1}>
            <Heading color="$gray100">Crie sua conta</Heading>

            <Controller 
              control={control}
              name="name"
              render={({ field: { onChange, value } }) => (
                <Input
                  placeholder="Nome"
                  value={value}
                  onChangeText={onChange}
                  errorMessage={errors.name?.message}
                />
              )}
            />

            <Controller
              control={control}
              name="email"
              render={({ field: { onChange, value } }) => (
                <Input
                  placeholder="E-mail"
                  keyboardType="email-address"
                  autoCapitalize="none"
                  value={value}
                  onChangeText={onChange}
                  errorMessage={errors.email?.message}
                />
              )}
            />

            <Controller
              control={control}
              name="password"
              render={({ field: { onChange, value } }) => (
                <Input
                  placeholder="Senha"
                  secureTextEntry
                  value={value}
                  onChangeText={onChange}
                  textContentType="oneTimeCode"
                  errorMessage={errors.password?.message}
                />
              )}
            />
            
            <Controller
              control={control}
              name="password_confirm"
              render={({ field: { onChange, value } }) => (
                <Input
                  placeholder="Confirmar senha"
                  secureTextEntry
                  value={value}
                  onChangeText={onChange}
                  onSubmitEditing={handleSubmit(handleSignUp)}
                  errorMessage={errors.password_confirm?.message}
                  returnKeyType="send"
                />
              )}
            />
          
            <Button 
              title="Criar e Acessar" 
              onPress={handleSubmit(handleSignUp)}
              isLoading={isLoading}
            />
          </Center>
          
          <Button 
            title="Voltar para o Login" 
            variant="outline" 
            mt="$12" 
            onPress={handleGoBack}
          />
        </VStack>
      </VStack>
    </ScrollView>
  );
}