import Content from '@/components/Content';
import Spinner from '@/components/Spinner';
import useCacheService, { SERVICE_STATUS } from '@/hooks/useCacheService';
import useNavigate from '@/hooks/useNavigate';
import Header from '@/pages/components/Header';
import orderService from '@/services/orderService';
import eventEmitter, { EVENTS } from '@/utils/eventEmitter';
import { useEffect } from 'react';
import { useParams } from 'react-router';

import './Order.scss';

const TITLE = 'Order';

const Order = (props) => {
	const navigate 							= useNavigate();
	const [ request, status, data, error ] 	= useCacheService(true);
	const params 							= useParams();

	/**
	 * Jumps back to the orders for the selected status
	 * 
	 * @param {*} e 
	 */
	const backToStatus = (e) => {
		e.preventDefault();

		const status = e.currentTarget.dataset?.status || '';
		
		if (status) {
			navigate(`orders/${e.currentTarget.dataset.status}`);
		} else {
			navigate('orders');
		}
	}

	/**
	 * Loads the order details
	 */
	useEffect(() => {
		eventEmitter.emit(EVENTS.BACK_BUTTON_SHOW, '/orders');

		const abortController = new AbortController();
		request(orderService.order, { id: params.id }, { signal: abortController.signal });

		// cleanup
		return () => {
			eventEmitter.emit(EVENTS.BACK_BUTTON_HIDE);
			abortController.abort();
		}
	},[]);

	return (
		<Content id='order' title={Order}>
			{/* Header Section */}
			<Header title={TITLE} />

			{status !== SERVICE_STATUS.COMPLETE && !error && (<Spinner />)}
			{error && <div className='error mb-3'>{error}</div>}

			<div className='mb-3 order_details'>
				{data?.data?.length === 0 && (<p><strong>Order not found</strong></p>)}

				{data?.data?.length > 0 && (
					<article key={data.data[0].id} data-id={data.data[0].id}>
						<p className='mb-2'>
							<strong>Status:</strong> {data.data[0].status}
						</p>
						<p className='mb-2 breadcrumb'>
							<a href='#' onClick={backToStatus}>Orders</a> <span className='divider'>/</span> <a href='#' data-status={data.data[0].status} onClick={backToStatus}>
								{data.data[0].status}
							</a>
						</p>
						{data.data.map((item, index) => (
							<p className='mb-2' key={index}>({item.quantity}) {item.product} - ${item.price}</p>
						))}
						<p className='mb-2'>
							<strong>Total:</strong> {data.data[0].total}
						</p>
					</article>
				)}
			</div>

		</Content>
	);
};

export default Order;