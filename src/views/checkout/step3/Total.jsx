import { ArrowLeftOutlined, CheckOutlined } from '@ant-design/icons';
import { CHECKOUT_STEP_2 } from '@/constants/routes';
import { useFormikContext } from 'formik';
import { displayMoney,displayActionMessage } from '@/helpers/utils';
// import { useDispatch, useSelector } from 'react-redux';
import { clearBasket } from '@/redux/actions/basketActions';
import PropType from 'prop-types';
import React from 'react';
import { useDispatch,useSelector } from 'react-redux';
import firebase from '@/services/firebase';
// import {  collection } from "firebase/firestore";
// import firebase from 'firebase/app';
import { db } from '@/services/firebase';
import { useHistory } from 'react-router-dom';
import { setPaymentDetails } from '@/redux/actions/checkoutActions';

import logo from '@/images/logo-full.png'

const Total = ({ isInternational, subtotal }) => {
  const { values, submitForm } = useFormikContext();
  const history = useHistory();
  const dispatch = useDispatch();
// some changes
  
const cartItems = useSelector(state => state.basket);
const shippingAddress = useSelector(state => state.checkout.shipping);
const payment= useSelector(state=>state.checkout.payment)
const store = useSelector((state) => ({
  basketLength: state.basket.length,
  user: state.auth,
  profile:state.profile,
  isAuthenticating: state.app.isAuthenticating,
  isLoading: state.app.loading
}));

// saving data to db
const saveOrder = () => {
  const today = new Date();
  const date = today.toDateString();
  const time = today.toLocaleTimeString();
  const orderConfig = {
    userID : store.user, 
    userEmail :store.profile.email,
    orderDate: date,
    orderTime: time,
    orderAmount: Math.round(subtotal + (isInternational ? 50 : 0)),
    orderStatus: "Order Placed...",
    cartItems,
    shippingAddress,
    createdAt: time,
    payment,
    
  };
  try {
    db.collection('orders').add(orderConfig)
    dispatch(clearBasket());
    // console.log(orderConfig)
    history.push("/");
    // console.log(userEmail,userID)
  } catch (error) {
    console.error(error.message);
  }
};
// actual payment razorpay
  const loadScript = (src) => {
    return new Promise((resovle) => {
      const script = document.createElement("script");
      script.src = src;

      script.onload = () => {
        resovle(true);
      };

      script.onerror = () => {
        resovle(false);
      };

      document.body.appendChild(script);
    });
  };

  const displayRazorpay = async (amount) => {
    const res = await loadScript(
      "https://checkout.razorpay.com/v1/checkout.js"
    );

    if (!res) {
      displayActionMessage("You are offline... Failed to load Razorpay SDK");
      return;
    }

    const options = {
      key: import.meta.env.VITE_RAZORPAY_KEY,
      currency: "INR",
      amount: amount * 100,
      name: "Baby-Yard",
      description: "Thanks for purchasing",
      image:
        {logo},

      handler: function (response) {
        displayActionMessage(response.razorpay_payment_id);
        displayActionMessage("Payment Successfully",'success');
        saveOrder();
      },
      prefill: {
        name: "Gyana",
      },
    };

    const paymentObject = new window.Razorpay(options);
    paymentObject.open();
    
  };

  const onClickBack = () => {
    // destructure to only select left fields omitting cardnumber and ccv
    const { cardnumber, ccv, ...rest } = values;

    dispatch(setPaymentDetails({ ...rest })); // save payment details
    history.push(CHECKOUT_STEP_2);
  };

  return (
    <>
      <div className="basket-total text-right">
        <p className="basket-total-title">Total:</p>
        <h2 className="basket-total-amount">
          {`${displayMoney(subtotal+(isInternational ? 50: 0))} - ${(displayMoney(subtotal+(isInternational ? 50: 0)- Math.round(subtotal + (isInternational ? 50 : 0))))}`}
        </h2>
        <h2 className="basket-total-amount">
          {displayMoney(Math.round(subtotal + (isInternational ? 50 : 0)))}
    </h2>
      </div>
      <br />
      <div className="checkout-shipping-action">
        <button
          className="button button-muted"
          onClick={() => onClickBack(values)}
          type="button"
        >
          <ArrowLeftOutlined />
          &nbsp;
          Go Back
        </button>
        <button
          className="button"
          disabled={false}
          onClick={() => displayRazorpay(Math.round(subtotal+(isInternational?50:0)))}
          type="button"
        >
          <CheckOutlined />
          &nbsp;
          Confirm
        </button>
      </div>
    </>
  );
};

Total.propTypes = {
  isInternational: PropType.bool.isRequired,
  subtotal: PropType.number.isRequired
};

export default Total;


// saving data to db

