import { Platform } from 'react-native';
import { createBottomTabNavigator, BottomTabNavigationProp } from '@react-navigation/bottom-tabs';

import { gluestackUIConfig } from '../../config/gluestack-ui.config';

import { Home } from '@screens/Home';
import { History } from '@screens/History';
import { Profile } from '@screens/Profile';
import { Exercise } from '@screens/Exercise';

import HomeSVG from '@assets/home.svg';
import HistorySVG from '@assets/history.svg';
import ProfileSVG from '@assets/profile.svg';

type AppRoutes = {
  home: undefined;
  exercise: { exerciseId: string };
  history: undefined;
  profile: undefined;
}

export type AppNavigatorRoutesProps = BottomTabNavigationProp<AppRoutes>;

const { Navigator, Screen } = createBottomTabNavigator<AppRoutes>();

export function AppRoutes() {
  const { tokens } = gluestackUIConfig;
  const iconSize = tokens.space[6];

  return(
    <Navigator 
      screenOptions={{ 
        headerShown: false, 
        tabBarShowLabel: false,
        tabBarActiveTintColor: tokens.colors.green500,
        tabBarInactiveTintColor: tokens.colors.gray200,
        tabBarStyle: {
          backgroundColor: tokens.colors.gray600,
          borderTopWidth: 0,
          height: Platform.OS === "android" ? "auto" : 96,
          paddingBottom: tokens.space["10"],
          paddingTop: tokens.space["6"],
        }
      }}
    >
      <Screen 
        name="home" 
        component={Home} 
        options={{ 
          tabBarIcon: ({color}) => <HomeSVG fill={color} width={iconSize} height={iconSize}/> 
        }} 
      />
      <Screen 
        name="history" 
        component={History} 
        options={{
          tabBarIcon: ({ color }) => <HistorySVG fill={color} width={iconSize} height={iconSize} />
        }} 
      />
      <Screen 
        name="profile" 
        component={Profile} 
        options={{
          tabBarIcon: ({ color }) => <ProfileSVG fill={color} width={iconSize} height={iconSize} />
        }} 
      />
      <Screen 
        name="exercise"
        component={Exercise} 
        options={{ tabBarButton: () => null }}
      />
    </Navigator>
  );
}