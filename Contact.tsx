import React, {useEffect, useState} from 'react';
import {View, FlatList, Text, PermissionsAndroid} from 'react-native';
import Contacts from 'react-native-contacts';

const Contact = () => {
  const [contacts, setContacts] = useState([]);

  useEffect(() => {
    requestContactPermission().then(() => {
      Contacts.getAll().then(contactsTemp => {
        setContacts(contactsTemp);
      });
    });
  }, []);

  return (
    <View>
      <FlatList
        data={contacts}
        keyExtractor={item => item.recordID}
        renderItem={({item}) => (
          <View>
            <Text>
              {item.givenName} {item.familyName} {item.phoneNumbers[0]?.number}
            </Text>
          </View>
        )}
      />
    </View>
  );
};

async function requestContactPermission() {
  try {
    const granted = await PermissionsAndroid.request(
      PermissionsAndroid.PERMISSIONS.READ_CONTACTS,
      {
        title: 'Contacts Permission',
        message: 'This app needs access to your contacts',
        buttonNeutral: 'Ask Me Later',
        buttonNegative: 'Cancel',
        buttonPositive: 'OK',
      },
    );
    if (granted === PermissionsAndroid.RESULTS.GRANTED) {
      console.log('You can use the contacts');
    } else {
      console.log('Contacts permission denied');
    }
  } catch (err) {
    console.warn(err);
  }
}

export default Contact;
