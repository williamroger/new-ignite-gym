import { useState } from 'react';
import { ScrollView, TouchableOpacity } from 'react-native';
import { Center, Heading, Text, VStack, onChange, useToast, } from "@gluestack-ui/themed";
import { Controller, useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import * as yup from 'yup';


import * as ImagePicker from 'expo-image-picker';
import * as FileSystem from 'expo-file-system';

import { ToastMessage } from '@components/ToastMessage';
import { ScreenHeader } from "@components/ScreenHeader";
import { UserPhoto } from '@components/UserPhoto';
import { Input } from '@components/Input';
import { Button } from '@components/Button';
import { useAuth } from '@hooks/useAuth';

type FormDataProps = {
  name: string;
  email?: string;
  old_password?: string | null | undefined;
  password?: string | null | undefined;
  confirm_password?: string | null | undefined;
};

const profileSchema = yup.object({
  name: yup.string().required('Informe o nome.'),
  email: yup.string().required('Informe seu email.').email('Email inválido'),
  old_password: yup.string(),
  password: yup
    .string()
    .min(6, 'A senha deve ter pelo menos 6 dígitos.')
    .nullable()
    .transform((value) => !!value ? value : null),
  confirm_password: yup
    .string()
    .nullable()
    .transform((value) => !!value ? value : null)
    .oneOf([yup.ref('password'), ''], 'A confirmação de senha não confere.')
    .when('password', {
      is: (Field: any) => Field,
      then: (schema) =>
        schema.nullable().required('Informe a confirmação da senha.').transform((value) => !!value ? value : null),
    }),
});

export function Profile() {
  const [userPhoto, setUserPhoto] = useState('https://github.com/williamroger.png');

  const { user } = useAuth();
  const { control, handleSubmit, formState: { errors } } = useForm<FormDataProps>({
    resolver: yupResolver(profileSchema),
    defaultValues: {
      name: user.name,
      email: user.email,
    },
  });

  const toast = useToast();

  async function handleUserPhotoSelect() {
    try {
      const photoSelected = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ImagePicker.MediaTypeOptions.Images,
        allowsEditing: true,
        quality: 1,
        aspect: [4, 4],
      });

      if (photoSelected.canceled) {
        return;
      }

      const photoURI = photoSelected.assets[0].uri;

      if (photoURI) {
        const photoInfo = await FileSystem.getInfoAsync(photoURI) as { size: number };

        if (photoInfo.size && photoInfo.size / 1024 / 1024 > 5) {
          return toast.show({
            placement: 'top',
            render: ({ id }) => (
              <ToastMessage
                id={id}
                title="Imagem muito grande!"
                description="Por favor escolha outra foto de até 5Mb"
                action="error"
                onClose={() => toast.close(id)}
              />
            )
          });
        }

        setUserPhoto(photoURI);
      }
    } catch (error) {
      console.log('handleUserPhotoSelect>error: ', error);
    }
  }

  async function handleProfileUpdate(data: FormDataProps) {
    console.log('data ', data)
  }

  return (
    <VStack flex={1}>
      <ScreenHeader title="Perfil" />
      
      <ScrollView contentContainerStyle={{ paddingBottom: 36, }}>
        <Center mt="$6" px="$10">
          <UserPhoto
            source={userPhoto}
            alt="Foto do usuário"
            size="xl"
          />
          <TouchableOpacity onPress={handleUserPhotoSelect}>
            <Text 
              color="$green500" 
              fontFamily="$heading"
              fontSize="$md"
              mt="$2"
              mb="$8"  
            >
              Alterar foto
            </Text>
          </TouchableOpacity>

          <Center w="$full" gap="$4">
            <Controller 
              name="name"
              control={control}
              render={({ field: { value, onChange } }) => (
                <Input 
                  placeholder="Nome" 
                  bg="$gray600" 
                  onChangeText={onChange}
                  value={value}
                  errorMessage={errors.name?.message}
                />
              )}
            />

            <Controller 
              name="email"
              control={control}
              render={({  field: { value } }) => (
                <Input 
                  bg="$gray600" 
                  isReadOnly 
                  value={value} 
                />
              )}
            />
          </Center>

          <Heading
            alignSelf="flex-start"
            color="$gray200"
            fontFamily="$heading"
            fontSize="$md"
            mt="$12"
            mb="$2"
          >
            Alterar senha
          </Heading>

          <Center w="$full" gap="$4">
            <Controller 
              name="old_password"
              control={control}
              render={({ field: { onChange }}) => (
                <Input 
                  placeholder="Senha antiga" 
                  bg="$gray600" 
                  secureTextEntry 
                  onChangeText={onChange}
                />
              )}
            />

            <Controller 
              name="password"
              control={control}
              render={({ field: { onChange }}) => (
                <Input 
                  placeholder="Nova senha" 
                  bg="$gray600" 
                  secureTextEntry 
                  onChangeText={onChange}
                  errorMessage={errors.password?.message}
                />
              )}
            />

            <Controller 
              name="confirm_password"
              control={control}
              render={({ field: { onChange }}) => (
                <Input 
                  placeholder="Confirme a nova senha" 
                  bg="$gray600" 
                  secureTextEntry
                  onChangeText={onChange} 
                  errorMessage={errors.confirm_password?.message}
                />
              )}
            />
            <Button title="Atualizar" onPress={handleSubmit(handleProfileUpdate)}/>
          </Center>
        </Center>
      </ScrollView>
    </VStack>
  );
}