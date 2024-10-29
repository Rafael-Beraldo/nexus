import React from "react";
import AsyncStorage from '@react-native-async-storage/async-storage';
import "./style.css";
import iphomeImg from "../../assets/iphone.png";

const Product = (props) => {
  // Verifique se o produto está definido
  if (!props.product) {
    return <div>Produto não encontrado</div>; // Mensagem de erro ou carregamento
  }

  const { image, title, price, id } = props.product;

  const truncateTitle = (title) => {
    return title.length > 15 ? `${title.slice(0, 12)}...` : title;
  };

  const addToCart = async () => {
    try {
      // Obtendo o carrinho existente do AsyncStorage
      const existingCart = await AsyncStorage.getItem('cart');
      const cart = existingCart ? JSON.parse(existingCart) : [];

      // Verificando se o produto já está no carrinho
      const existingItemIndex = cart.findIndex(item => item.id === id);

      if (existingItemIndex > -1) {
        // Se já existir, aumente a quantidade
        cart[existingItemIndex].quantity += 1;
      } else {
        // Se não existir, adicione o novo produto com quantidade 1
        const newItem = { ...props.product, quantity: 1 };
        cart.push(newItem);
      }

      // Armazenando o carrinho atualizado no AsyncStorage
      await AsyncStorage.setItem('cart', JSON.stringify(cart));
      console.log('Produto adicionado ao carrinho:', props.product);
    } catch (error) {
      console.error('Erro ao adicionar ao carrinho:', error);
    }
  };

  return (
    <div className="productCard">
      <img
        src={image || iphomeImg}
        alt={title}
        style={{ margin: "0 auto", width: "80%", height: 200 }}
      />
      <h3>{truncateTitle(title)}</h3>
      <p className="strikeThrough">{`R$${(price + 1).toFixed(2)}`}</p>
      <p className="priceProduct">{`R$${price.toFixed(2)}`}</p>
      <h2 className="font-s">{`10x de R$ ${(price / 10).toFixed(2)} sem juros`}</h2>
      <span>{`Até R$${(price / 10).toFixed(2)}`} <br /></span>
      <button
        onClick={addToCart}
        className="btnAddToCart"
      >
        Adicionar no carrinho
      </button>
    </div>
  );
};

export default Product;
