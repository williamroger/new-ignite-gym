import { useCallback, useEffect, useState } from "react";
import { FlatList } from 'react-native';
import { VStack, HStack, Heading, Text, useToast, Toast, ToastTitle } from "@gluestack-ui/themed";
import { useNavigation, useFocusEffect } from '@react-navigation/native';

import { api } from "@services/api";
import { AppError } from "@utils/AppError";

import { AppNavigatorRoutesProps } from "@routes/app.routes";

import { HomeHeader } from '@components/HomeHeader';
import { Group } from "@components/Group";
import { ExerciseCard } from "@components/ExerciseCard";

import { ExerciseDTO } from '@dtos/ExerciseDTO';
import { Loading } from "@components/Loading";

export function Home() {
  const toast = useToast();
  const [isLoading, setIsLoading] = useState(true);
  const [exercises, setExercises] = useState<ExerciseDTO[]>([]);
  const [groups, setGroups] = useState<string[]>([]);
  const [groupSelected, setGroupSelected] = useState('costas');
  const navigation = useNavigation<AppNavigatorRoutesProps>();

  function handleOpenExerciseDetails() {
    navigation.navigate('exercise');
  }

  async function fetchGroups() {
    try {
      const response = await api.get('/groups');
      setGroups(response.data);
    } catch (error) {
      const isAppError = error instanceof AppError;
      const title = isAppError ? error.message : 'Não foi possível carregar os grupos musculares.';

      toast.show({
        placement: 'top',
        render: () => (
          <Toast bg="$red500">
            <ToastTitle>{title}</ToastTitle>
          </Toast>
        )
      });
    }
  }

  async function fetchExercisesByGroup() {
    try {
      setIsLoading(true);

      const response = await api.get(`/exercises/bygroup/${groupSelected}`);
      setExercises(response.data);

    } catch (error) {
      const isAppError = error instanceof AppError;
      const title = isAppError ? error.message : 'Não foi possível carregar os exercícios.';

      toast.show({
        placement: 'top',
        render: () => (
          <Toast bg="$red500">
            <ToastTitle>{title}</ToastTitle>
          </Toast>
        )
      });
    } finally {
      setIsLoading(false);
    }
  }

  useEffect(() => {
    fetchGroups();
  }, []);

  useFocusEffect(useCallback(() => {
    fetchExercisesByGroup();
  }, [groupSelected]));

  return (
    <VStack flex={1}>
      <HomeHeader />

      <FlatList 
        data={groups}
        keyExtractor={(item) => item}
        renderItem={({ item }) => (
          <Group
            name={item}
            isActive={groupSelected.toLowerCase() === item.toLowerCase()}
            onPress={() => setGroupSelected(item)}
          />
        )}
        horizontal
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={{
          paddingHorizontal: 32,
        }}
        style={{
          marginVertical: 40,
          maxHeight: 44,
          minHeight: 44,
        }}
      />

      { isLoading ? <Loading /> :
        <VStack px="$8" flex={1}>
          <HStack justifyContent="space-between" mb="$5" alignItems="center">
            <Heading color="$gray200" fontSize="$md" fontFamily="$heading">Exercícios</Heading>
            <Text color="$gray200" fontSize="$sm" fontFamily="$body">{exercises.length}</Text>
          </HStack>

          <FlatList
            data={exercises}
            keyExtractor={item => item.id}
            renderItem={({ item }) => (
              <ExerciseCard data={item} onPress={handleOpenExerciseDetails} />
            )}
            showsVerticalScrollIndicator={false}
            contentContainerStyle={{
              paddingBottom: 20,
            }}
          />
        </VStack>
      }
    </VStack>
  );  
}