import Content from '@/components/Content';
import Spinner from '@/components/Spinner';
import useCacheService, { SERVICE_STATUS } from '@/hooks/useCacheService';
import useNavigate from '@/hooks/useNavigate';
import Header from '@/pages/components/Header';
import productService from '@/services/productService';
import eventEmitter, { EVENTS } from '@/utils/eventEmitter';
import { useEffect } from 'react';
import { useParams } from 'react-router';

import './Product.scss';

const TITLE = 'Product';

const Product = (props) => {
	const navigate 							= useNavigate();
	const [ request, status, data, error ] 	= useCacheService(true);
	const params 							= useParams();

	/**
	 * Jumps back to the products for the selected category
	 * 
	 * @param {*} e 
	 */
	const backToCategory = (e) => {
		e.preventDefault();

		const category = e.currentTarget.dataset?.category || '';
		
		if (category) {
			navigate(`products/${e.currentTarget.dataset.category}`);
		} else {
			navigate('products');
		}
	}

	/**
	 * Loads the product details
	 */
	useEffect(() => {
		eventEmitter.emit(EVENTS.BACK_BUTTON_SHOW, '/products');

		const abortController = new AbortController();
		request(productService.product, { id: params.id }, { signal: abortController.signal });

		// cleanup
		return () => {
			eventEmitter.emit(EVENTS.BACK_BUTTON_HIDE);
			abortController.abort();
		}
	},[]);

	return (
		<Content id='product' title={Product}>
			{/* Header Section */}
			<Header title={TITLE} />

			{status !== SERVICE_STATUS.COMPLETE && !error && (<Spinner />)}
			{error && <div className='error mb-3'>{error}</div>}

			<div className='mb-3 product_details'>
				{data?.data?.id && (
					<article>
						<img src={data.data.image_url} className='mb-3 shadow p-3 mb-2 rounded' alt={data.data.name} />
						<p className='mb-2'>${data.data.price}</p>
						<p className='mb-2 breadcrumb'>
							<a href='#' onClick={backToCategory}>Products</a> <span className='divider'>/</span> <a href='#' data-category={data.data.category} onClick={backToCategory}>
								{data.data.category}
							</a>
						</p>
						<h5 className='mb-2'>{data.data.name}</h5>
						<p>{data.data.description}</p>
					</article>
				)}
			</div>

		</Content>
	);
};

export default Product;