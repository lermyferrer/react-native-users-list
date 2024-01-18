import React from 'react';
import { render } from '@testing-library/react-native';
import UsersList from './UsersList';
import { NavigationContainer } from '@react-navigation/native';

describe('UsersList Component', () => {
  it('renders correctly', () => {
    const { getByPlaceholderText, getByText } = render(
      <NavigationContainer>
        <UsersList />
      </NavigationContainer>
    );

    expect(getByPlaceholderText('Ingrese usuario a buscar...')).toBeTruthy();
    expect(getByText('Buscar')).toBeTruthy();
  });
});
