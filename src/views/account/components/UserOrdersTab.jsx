import React, { useState, useEffect } from 'react';
import { db } from '@/services/firebase';
import { useHistory } from 'react-router-dom';
import { useSelector } from 'react-redux';
import { ImageLoader } from '@/components/common';
import Skeleton, { SkeletonTheme } from 'react-loading-skeleton';
import { displayMoney } from '@/helpers/utils';
const UserOrdersTab = () => {
  const [data, setData] = useState([]);
  const profile = useSelector(state => state.profile);
  const history = useHistory();
  useEffect(() => {
    const fetchData = async () => {
      try {
        const snapshot = await db
          .collection('orders')
          .where('userEmail', '==', profile.email)
          .get();

        const ordersData = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
        setData(ordersData);
      } catch (err) {
        console.error(err);
      }
    };
    
    fetchData();
  }, [profile.email]);
  
  return (
    <>
      <h3>My Orders</h3>
      <hr />
      <div className="orders-container">
        {data.length === 0 ? (
          <strong>
            <span className="text-subtle">You don't have any orders</span>
          </strong>
        ) : (
          data.map(order => (
            <div key={order.id} className="order-row">
              <div className="order-img-wrapper" style={{ display: 'flex', flexDirection: 'row', overflowX: 'auto' }}>
                {order.cartItems.length === 0 ? (
                  <p>No items in the cart</p>
                ) : (
                  order.cartItems.map(item => (
                    <div key={item.id} className="item-img-wrapper" onClick={()=>history.push(`/product/${item.id}`)} style={{ cursor: 'pointer', marginRight: '10px' }} >
                      {item.image ? (
                        <ImageLoader
                          alt={item.name}
                          className="item-img"
                          src={item.image}
                          />
                      ) : (
                        <Skeleton width={50} height={30} />
                      )}
                    </div>
                  ))
                )}
              </div>
              <div className="order-details" >
                <p>Order Date: {order.orderDate}</p>
                <p>Order Amount: {displayMoney(order.orderAmount)}</p>
                <p>Order Status: {order.orderStatus}</p>
                <p>Order Time: {order.orderTime}</p>
                {order.cartItems.length !== 0 &&
                  order.cartItems.map(item => (
                    <div key={item.id} className="item-details">
                      <p>Name: {item.name}</p>
                      <p>Price: {item.price}</p>
                      {/* Render other item details here */}
                    </div>
                  ))}
              </div>
              <hr />
            </div>
          ))
        )}
      </div>
    </>
  );
}

export default UserOrdersTab;