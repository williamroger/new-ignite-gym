import { Heading, Text, HStack, Image, VStack, Icon } from "@gluestack-ui/themed";
import { TouchableOpacity, TouchableOpacityProps } from "react-native";
import { ChevronRight } from 'lucide-react-native';

type Props = TouchableOpacityProps & {};

export function ExerciseCard({...rest}: Props) {
  return (
    <TouchableOpacity {...rest}>
      <HStack 
        bg="$gray500" 
        alignItems="center" 
        p="$2" 
        pr="$4" 
        rounded="$md" 
        mb="$3"
      >
        <Image 
          source={{ 
            uri: "https://pratiquefitness.com.br/blog/wp-content/uploads/2023/07/Quais-os-melhores-treinos-para-braco-2.jpg"
          }}
          alt="Imagem do exercício" 
          w="$16"
          h="$16"
          rounded="$md"
          mr="$4"
          resizeMode="cover"
        />

        <VStack flex={1}>
          <Heading fontSize="$lg" color="$white" fontFamily="$heading">Puxada Frontal</Heading>
          <Text fontSize="$sm" color="$gray200" fontFamily="$body" mt="$1" numberOfLines={2}>3 séries x 12 repetições</Text>
        </VStack>

        <Icon as={ChevronRight} color="$gray300"/>
      </HStack>
    </TouchableOpacity>
  );
}