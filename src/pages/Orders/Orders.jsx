import Content from '@/components/Content';
import Spinner from '@/components/Spinner';
import { Button, Select } from '@/components/ui';
import useCacheService, { SERVICE_STATUS } from '@/hooks/useCacheService';
import useNavigate from '@/hooks/useNavigate';
import Header from '@/pages/components/Header';
import orderService from '@/services/orderService';
import { useEffect, useRef, useState } from 'react';
import { useParams } from 'react-router';

import './Orders.scss';

const TITLE = 'Orders';

const Orders = (props) => {
	const navigate 						= useNavigate();
	const params 						= useParams();
	// Example using cache service without state so we can manage it ourself
	const [ request ] 					= useCacheService(false);
	// Since we are not using state for cache service, we must manage it ourself
	// Statuses will not set data, status, and error but could if desired
	// Orders will set data, status, and error just as an example
	// Note: Look at Order.jsx to see the proper way to utilize the useCacheService hook
	const [ statuses, setStatuses ] 	= useState([]);
	const [ orders, setOrders ] 		= useState({ data: null, status: '', error: '' });
	const [ status, setStatus ] 		= useState(null);
	// We use ref for the status select so that we can get the selected options value
	const statusRef 					= useRef(null);
	
	/**
	 * This will get a list of all statuses used to populate the status list
	 */
	const getCategoies = async() => {
		const abortController 	= new AbortController();
		const results 			= await request(orderService.orderStatuses, {}, { signal: abortController.signal });
		
		if (results?.data?.length > 0) {
			setStatuses(results.data);
		}
	}

	/**
	 * This will get a list of orders for the selected status.
	 * 
	 * @returns null if attempting the same request
	 */
	const getOrders = async () => {
		let results 			= [];
		const selectedStatus	= statusRef.current.options[statusRef.current.selectedIndex].value;

		// prevent same request
		if (selectedStatus === status) {
			return;
		}

		setOrders(prevState => ({ ...prevState, status: SERVICE_STATUS.LOADING, error: '' }));

		const abortController = new AbortController();
		if (selectedStatus) {
			results = await request(orderService.ordersByStatus, { status: selectedStatus, limit: 10 }, { signal: abortController.signal });
		} else {
			results = await request(orderService.orders, { limit: 10 }, { signal: abortController.signal });
		}
		
		if (results?.data?.length > 0) {
			setOrders({ data: results.data , status: SERVICE_STATUS.COMPLETE, error: '' });
			setStatus(selectedStatus);
		} else {
			setOrders({ data: [] , status: SERVICE_STATUS.COMPLETE, error: 'Unable to find any orders for the selected status.' });
		}
	}

	/**
	 * This will get a list of orders
	 * 
	 * @param {Event} e 
	 */
	const handleUpdateBtnClick = (e) => {
		getOrders();
	}

	/**
	 * This will load the selected order in a new window
	 * 
	 * @param {Event} e 
	 */
	const handleOrderClick = (e) => {
		const el = e.currentTarget;
		const id = el.dataset.id;
		navigate(`orders/order/${id}`);
	}

	/**
	 * This will load all statuses on first render
	 */
	useEffect(() => {
		getCategoies();
	}, []);

	/**
	 * This will set the selected status once all the statuses are loaded
	 */
	useEffect(() => {
		if (statuses?.length > 0) {
			if (params.cat) {
				Array.from(statusRef.current.options).forEach(el => {
					if (el.value === params.cat) el.selected = true;
				});
			}
			getOrders();
		}
	}, [statuses])

	return (
		<Content id='orders' title={Orders}>
			{/* Header Section */}
			<Header title={TITLE} />

			<div className='mb-3 filters'>
				<div>
					<div>Status</div>
					<Select ref={statusRef} name='status' className='form-select-sm'>
						{statuses?.length > 0 && (<option value=''>All Orders</option>)}
						{statuses?.length > 0 && statuses.map((item, index) => (
							<option key={index} value={item.status}>{item.status}</option>
						))}
					</Select>
				</div>
				<div>
					<div>&nbsp;</div>
					<Button className='btn-action btn-sm' type='button' onClick={handleUpdateBtnClick}>Update</Button>
				</div>
			</div>

			{orders.status !== SERVICE_STATUS.COMPLETE && (<Spinner />)}

			{orders.error && (<div className='error mb-3'>{orders.error}</div>)}

			<div className='d-flex flex-row flex-wrap gap-2 orders_list'>
				{orders.data?.length === 0 && (<p><strong>No orders found</strong></p>)}
				
				{orders.data?.length > 0 && orders.data.map(order => (
					<article key={order.id} className='order shadow p-3 mb-2 rounded' data-id={order.id} onClick={handleOrderClick}>
						<p className='mb-2'>
							<strong>Address:</strong><br />
							{order.shipping_address}
						</p>
						<p className='mb-2'>
							<strong>Price:</strong> ${order.total}
						</p>
						<p className='mb-2'>
							<strong>Status:</strong> <span style={{color: 'var(--bs-tertiary-color)'}}>{order.status}</span>
						</p>
						<h6 className='mb-2'>
							<strong>Created:</strong> {order.created_at}
						</h6>
					</article>
				))}
			</div>

			<div className='pagination'></div>
		</Content>
	);
};

export default Orders;