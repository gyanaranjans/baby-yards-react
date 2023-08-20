import React, { useState, useEffect } from 'react';
import { db } from '@/services/firebase';
import { withRouter } from 'react-router-dom';
import { useDocumentTitle, useScrollTop } from '@/hooks';
import { ImageLoader } from '@/components/common';
import Skeleton, { SkeletonTheme } from 'react-loading-skeleton';
import { useHistory } from 'react-router-dom';
import { displayMoney,displayActionMessage } from '@/helpers/utils';
const AdminOrders = () => {
  const history = useHistory();
  useDocumentTitle('order List | Baby-yards Admin');
  useScrollTop();
  const [orders, setOrders] = useState([]);
  const fetchOrders = async () => {
    const snapshot = await db.collection('orders').get();
    const ordersData = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
    setOrders(ordersData);
  };

  useEffect(() => {
    

    fetchOrders();
  }, []);

  const handleStatusChange = async (orderId, newStatus) => {
    await db.collection('orders').doc(orderId).update({ orderStatus: newStatus });
    fetchOrders();
  };

  return (
     <div>
    <h2>Manage Orders</h2>
    <hr />
    {orders.map((order, index) => (
      <div key={index}>
        <p>Order Status: {order.orderStatus} </p>
        <p>Order Time: {order.orderTime} {order.orderDate}</p>
        <p>User Email: {order.userEmail}</p>
        <p>Order Amount: {displayMoney(order.orderAmount)}</p>
        <p>OrderAdress: {order.shippingAddress.address} </p>
        {order.cartItems.length === 0 ? (
                  <p>No items in the cart</p>
                ) : (
                  order.cartItems.map(item => (
                    <div key={item.id} className="item-img-wrapper" onClick={()=>history.push(`/product/${item.id}`)} style={{ cursor: 'pointer' }} >
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
        {/* Display other order details here */}
        <div style={{ display: 'flex', alignItems: 'center' }}>
        <select
          value={order.orderStatus}
          onChange={e => handleStatusChange(order.id, e.target.value)}
        >
          <option value="pending">Pending</option>
          <option value="processing">Processing</option>
          <option value="completed">Completed</option>
          <option value="cancelled">cancelled</option>
          {/* Add more options as needed */}
        </select>
        <button className="button button-border button-small" onClick={() => handleStatusChange(order.id, order.orderStatus)}>
          Update Status
        </button>
      </div>
      <hr />
      </div>
    ))}
  </div>
  );
};

export default withRouter(AdminOrders);