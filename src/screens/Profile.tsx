import { useState } from 'react';
import { Alert, ScrollView, TouchableOpacity } from 'react-native';
import { Center, Heading, Text, VStack, useToast, } from "@gluestack-ui/themed";
import * as ImagePicker from 'expo-image-picker';
import * as FileSystem from 'expo-file-system';
import { ToastMessage } from '@components/ToastMessage';
import { ScreenHeader } from "@components/ScreenHeader";
import { UserPhoto } from '@components/UserPhoto';
import { Input } from '@components/Input';
import { Button } from '@components/Button';

export function Profile() {
  const [userPhoto, setUserPhoto] = useState('https://github.com/williamroger.png');
  
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
            <Input placeholder="Nome" bg="$gray600" />
            <Input value="william@roger.com" bg="$gray600" isReadOnly />
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
            <Input placeholder="Senha antiga" bg="$gray600" secureTextEntry />
            <Input placeholder="Nova senha" bg="$gray600" secureTextEntry />
            <Input placeholder="Confirme a nova senha" bg="$gray600" secureTextEntry />
            <Button title="Atualizar" />
          </Center>
        </Center>
      </ScrollView>
    </VStack>
  );
}