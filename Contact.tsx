import React, { useEffect, useState, useMemo } from 'react';
import { View, FlatList, Text, PermissionsAndroid, StyleSheet, TouchableOpacity, Linking, Alert } from 'react-native';
import Contacts from 'react-native-contacts';

const styles = StyleSheet.create({
  row: {
    flex: 1,
    display: 'flex',
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 10
  },
  left: {
    fontSize: 16,
    color: 'black',
  },
  right: {
    fontSize: 15,
    color: 'green'
  }
});

const makePhoneCall = (phoneNumber) => {
  let phoneUrl = `tel:${phoneNumber}`;
  Linking.canOpenURL(phoneUrl)
    .then((supported) => {
      if (!supported) {
        Alert.alert('Error', `Unable to make a phone call ${phoneNumber}`);
      } else {
        return Linking.openURL(phoneUrl);
      }
    })
    .catch((err) => console.error('An error occurred', err));
};

const ContactItem = ({ item }) => {
  let { givenName = '', familyName = '', phoneNumbers = [] } = item;

  const newName = useMemo(() => {
    let name = '';

    if (familyName !== '') {
      name += familyName + ' ';
    }

    if (givenName !== '' && givenName !== familyName) {
      name += givenName;
    }

    return name;
  }, [givenName, familyName]);

  const newPhoneNumber = useMemo(() => {
    let phoneNumber = phoneNumbers?.[0]?.number.toString();

    if (phoneNumber.indexOf(')') !== -1) {
      const phoneNumberArray = phoneNumber.split(')');
      phoneNumber = phoneNumberArray?.[1];
    }

    if (phoneNumber.indexOf(' ') !== -1) {
      const phoneNumberArray = phoneNumber.split(' ');
      phoneNumber = phoneNumberArray?.[1];
    }

    if (phoneNumber.indexOf('+') !== -1) {
      const phoneNumberArray = phoneNumber.split('+');
      phoneNumber = phoneNumberArray?.[1];
    }

    phoneNumber = phoneNumber.trim()

    return phoneNumber;
  }, [phoneNumbers]);

  const doClickPhoneNumber = () => {
    makePhoneCall(newPhoneNumber)
  }

  return (
    <View style={styles.row}>
      <Text style={styles.left}>
        {newName}
      </Text>
      <TouchableOpacity onPress={doClickPhoneNumber}>
        <Text style={styles.right}>
          {newPhoneNumber}
        </Text>
      </TouchableOpacity>
    </View>
  );
};

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
        renderItem={({ item }) => <ContactItem item={item} />}
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
