/* eslint-disable prettier/prettier */
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Image,
  ScrollView,
} from 'react-native';
import React, {useState, useEffect} from 'react';
import storage from '@react-native-firebase/storage';
import AsyncStorage from '@react-native-async-storage/async-storage';
import firestore from '@react-native-firebase/firestore';
import {useRoute, useIsFocused} from '@react-navigation/native';
import Header from '../common/Header';
let userId = '';
const EditItem = ({navigation}) => {
  const route = useRoute();
  const [imageData, setImageData] = useState({
    assets: [{uri: route.params.data.imageUrl}],
  });
  const [name, setName] = useState(route.params.data.name);
  const [rating, setRating] = useState(route.params.data.rating);
  const [price, setPrice] = useState(route.params.data.price);
  const [discountPrice, setDiscountPrice] = useState(
    route.params.data.discountPrice,
  );
  const [description, setDescription] = useState(route.params.data.description);
  const [imageUrl, setImageUrl] = useState('');
  const [items, setItems] = useState([]);
  const [cartCount, setCartCount] = useState(0);
  const isFocused = useIsFocused();

  useEffect(() => {
    // const subscriber =
    firestore()
      .collection('items')
      .get()
      .then(querySnapshot => {
        console.log('Total users: ', querySnapshot.size);
        let tempData = [];
        querySnapshot.forEach(documentSnapshot => {
          console.log(
            'User ID: ',
            documentSnapshot.id,
            documentSnapshot.data(),
          );
          tempData.push({
            id: documentSnapshot.id,
            data: documentSnapshot.data(),
          });
        });
        setItems(tempData);
      });
    // Stop listening for updates when no longer required
    // return () => subscriber();
  }, []);
  useEffect(() => {
    getCartItems();
  }, [isFocused]);
  const getCartItems = async () => {
    userId = await AsyncStorage.getItem('USERID');
    const user = await firestore().collection('users').doc(userId).get();
    setCartCount(user._data.cart.length);
  };
  const onAddToCart = async (item, index) => {
    const user = await firestore().collection('users').doc(userId).get();
    console.log(user.data().cart);

    let tempCart = user.data().cart || []; // Jika cart kosong, inisialisasi dengan array kosong

    let existingItem = tempCart.find(itm => itm.id === item.id);
    if (existingItem) {
      // Jika item sudah ada di cart, tambahkan jumlahnya
      existingItem.data.qty = (existingItem.data.qty || 0) + 1;
    } else {
      // Jika item belum ada di cart, tambahkan ke cart dengan qty 1
      tempCart.push({
        id: item.id,
        data: {...item.data, qty: 1}, // Inisialisasi qty menjadi 1
      });
    }

    // Update cart di Firestore
    await firestore().collection('users').doc(userId).update({
      cart: tempCart,
    });

    getCartItems(); // Refresh jumlah item di keranjang
    navigation.navigate('Cart');
  };
  return (
    <ScrollView style={styles.container}>
      <View style={styles.container}>
        {imageData !== null ? (
          <Image
            source={{uri: imageData.assets[0].uri}}
            style={styles.imageStyle}
          />
        ) : null}
        <Text style={styles.judul}>{name}</Text>

        <View
          style={{
            flexDirection: 'row',
            marginLeft: 10,
            alignItems: 'center',
          }}>
          {[...Array(5)].map((_, index) => (
            <Image
              key={index}
              source={require('../../images/fullStar.png')}
              style={{width: 30, height: 30}}
            />
          ))}
          <Text style={{fontSize: 18, fontWeight: '700'}}>
            {rating} | 100Rb+ Terjual
          </Text>
        </View>
        {price > 20000 ? (
          <>
            <Text
              style={{
                fontSize: 24,
                fontWeight: '700',
                marginLeft: 15,
                color: 'red',
              }}>
              Rp {discountPrice}
            </Text>
          </>
        ) : (
          <Text
            style={{
              fontSize: 24,
              fontWeight: '700',
              marginLeft: 15,
              color: 'red',
            }}>
            Rp {price}
          </Text>
        )}

        <Text
          style={{
            fontSize: 20,
            fontWeight: '700',
            marginLeft: 15,
          }}>
          Deskripsi
        </Text>
        <Text
          style={{
            fontSize: 18,
            fontWeight: '500',
            marginLeft: 15,
            marginRight: 15,
            marginTop: 5,
          }}>
          Lorem ipsum dolor sit amet consectetur adipisicing elit. Ad eos
          voluptates rem! Minima eius ex ipsum iste impedit illum officiis
          quibusdam voluptate minus fuga, aliquid quasi quidem explicabo
          inventore voluptatem ea illo officia! Eum corporis similique
          cupiditate facere a optio asperiores pariatur aliquid adipisci, iusto
          architecto consectetur iste enim consequuntur dolore tenetur sed
          recusandae eligendi quasi fuga officiis, commodi cumque! Nihil nobis
          aspernatur odit dolorum quaerat expedita reiciendis voluptatem
          accusantium fugiat eveniet provident cupiditate minima, deleniti,
          dicta neque in nesciunt.{' '}
        </Text>

        {/* FlatList for items */}
        <TouchableOpacity
          style={{
            padding: 15,
            backgroundColor: 'orange',
            borderRadius: 20,
            marginTop: 10,
            marginBottom: 20,
            marginLeft: 15,
            width: '90%',
          }}
          onPress={() => {
            onAddToCart(route.params, 0);
          }}>
          <Text
            style={{
              color: 'white',
              textAlign: 'center',
              fontSize: 18,
              fontWeight: 'bold',
            }}>
            Add To cart
          </Text>
        </TouchableOpacity>
      </View>
    </ScrollView>
  );
};

export default EditItem;
const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  header: {
    height: 40,
    width: '100%',
    backgroundColor: '#fff',
    flexDirection: 'row',
    elevation: 5,
    paddingLeft: 20,
    justifyContent: 'center',
  },
  headerText: {
    fontSize: 18,
    fontWeight: '700',
  },
  judul: {
    textAlign: 'center',
    fontSize: 24,
    fontWeight: 'bold',
  },
  pickBtn: {
    width: '90%',
    height: 50,
    borderWidth: 0.5,
    borderRadius: 10,
    alignSelf: 'center',
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 20,
  },
  uploadBtn: {
    backgroundColor: '#5246f2',
    width: '90%',
    height: 50,
    borderRadius: 10,
    alignSelf: 'center',
    marginTop: 20,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 70,
  },
  imageStyle: {
    width: '90%',
    height: 400,
    borderRadius: 20,
    alignSelf: 'center',
    marginTop: 5,
  },
  penulis: {
    fontSize: 20,
    marginLeft: 10,
    marginBottom: 10,
    fontWeight: '700',
  },
});