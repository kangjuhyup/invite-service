import React from 'react';
import {View, Text, StyleSheet, SafeAreaView, TouchableOpacity} from 'react-native';
import Icon from 'react-native-vector-icons/MaterialIcons';
import type {NativeStackScreenProps} from '@react-navigation/native-stack';
import type {RootStackParamList} from '../types/navigation';

type Props = NativeStackScreenProps<RootStackParamList, 'Settings'>;

const Settings: React.FC<Props> = ({navigation}) => {
  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.headerTitle}>설정</Text>
      </View>
      <View style={styles.content}>
        <MenuItem
          icon="person"
          title="내 정보"
          onPress={() => navigation.navigate('Profile')}
        />
        <MenuItem
          icon="notifications"
          title="알림 관리"
          onPress={() => navigation.navigate('Notifications')}
        />
        <MenuItem
          icon="announcement"
          title="공지사항"
          onPress={() => navigation.navigate('Notice')}
        />
      </View>
    </SafeAreaView>
  );
};

interface MenuItemProps {
  icon: string;
  title: string;
  onPress: () => void;
}

const MenuItem: React.FC<MenuItemProps> = ({icon, title, onPress}) => (
  <TouchableOpacity style={styles.menuItem} onPress={onPress}>
    <View style={styles.menuLeft}>
      <Icon name={icon} size={24} color="#1a73e8" />
      <Text style={styles.menuText}>{title}</Text>
    </View>
    <Icon name="chevron-right" size={24} color="#666" />
  </TouchableOpacity>
);

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#ffffff',
  },
  header: {
    padding: 20,
    borderBottomWidth: 1,
    borderBottomColor: '#e0e0e0',
  },
  headerTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#1a73e8',
  },
  content: {
    flex: 1,
    backgroundColor: '#f5f5f5',
  },
  menuItem: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: 16,
    backgroundColor: '#ffffff',
    borderBottomWidth: 1,
    borderBottomColor: '#e0e0e0',
  },
  menuLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  menuText: {
    fontSize: 16,
    color: '#202124',
  },
});

export default Settings;
