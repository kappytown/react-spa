import Content from '@/components/Content';
import Spinner from '@/components/Spinner';
import { Button, Select } from '@/components/ui';
import useCacheService, { SERVICE_STATUS } from '@/hooks/useCacheService';
import useNavigate from '@/hooks/useNavigate';
import Header from '@/pages/components/Header';
import productService from '@/services/productService';
import { useEffect, useRef, useState } from 'react';
import { useParams } from 'react-router';

import './Products.scss';

const TITLE = 'Products';

const Products = (props) => {
	const navigate 						= useNavigate();
	const params 						= useParams();
	// Example using cache service without state so we can manage it ourself
	const [ request ] 					= useCacheService(false);
	// Since we are not using state for cache service, we must manage it ourself
	// Categories will not set data, status, and error but could if desired
	// Products will set data, status, and error just as an example
	// Note: Look at Product.jsx to see the proper way to utilize the useCacheService hook
	const [ categories, setCategories ] = useState([]);
	const [ products, setProducts ] 	= useState({ data: null, status: '', error: '' });
	const [ category, setCategory ] 	= useState(null);
	// We use ref for the category select so that we can get the selected options value
	const categoryRef 					= useRef(null);
	
	/**
	 * This will get a list of all categories used to populate the category list
	 */
	const getCategoies = async() => {
		const abortController 	= new AbortController();
		const results 			= await request(productService.productCategories, {}, { signal: abortController.signal });
		
		if (results?.data?.length > 0) {
			setCategories(results.data);
		}
	}

	/**
	 * This will get a list of products for the selected category.
	 * 
	 * @returns null if attempting the same request
	 */
	const getProducts = async () => {
		let results 			= [];
		const selectedCategory 	= categoryRef.current.options[categoryRef.current.selectedIndex].value;

		// prevent same request
		if (selectedCategory === category) {
			return;
		}

		setProducts(prevState => ({ ...prevState, status: SERVICE_STATUS.LOADING, error: '' }));

		const abortController = new AbortController();
		if (selectedCategory) {
			results = await request(productService.productsByCategory, { category: selectedCategory, limit: 10 }, { signal: abortController.signal });
		} else {
			results = await request(productService.products, { limit: 10 }, { signal: abortController.signal });
		}
		
		if (results?.data?.length > 0) {
			setProducts({ data: results.data , status: SERVICE_STATUS.COMPLETE, error: '' });
			setCategory(selectedCategory);
		} else {
			setProducts({ data: [] , status: SERVICE_STATUS.COMPLETE, error: 'Unable to find any products for the selected category.' });
		}
	}

	/**
	 * This will get a list of products
	 * 
	 * @param {Event} e 
	 */
	const handleUpdateBtnClick = (e) => {
		getProducts();
	}

	/**
	 * This will load the selected product in a new window
	 * 
	 * @param {Event} e 
	 */
	const handleProductClick = (e) => {
		const el = e.currentTarget;
		const id = el.dataset.id;
		navigate(`products/product/${id}`);
	}

	/**
	 * This will load all categories on first render
	 */
	useEffect(() => {
		getCategoies();
	}, []);

	/**
	 * This will set the selected category once all the categories are loaded
	 */
	useEffect(() => {
		if (categories?.length > 0) {
			if (params.cat) {
				Array.from(categoryRef.current.options).forEach(el => {
					if (el.value === params.cat) el.selected = true;
				});
			}
			getProducts();
		}
	}, [categories])

	return (
		<Content id='products' title={Products}>
			{/* Header Section */}
			<Header title={TITLE} />

			<div className='mb-3 filters'>
				<div>
					<div>Category</div>
					<Select ref={categoryRef} name='category' className='form-select-sm'>
						{categories?.length > 0 && (<option value=''>All Products</option>)}
						{categories?.length > 0 && categories.map((item, index) => (
							<option key={index} value={item.category}>{item.category}</option>
						))}
					</Select>
				</div>
				<div>
					<div>&nbsp;</div>
					<Button className='btn-action btn-sm' type='button' onClick={handleUpdateBtnClick}>Update</Button>
				</div>
			</div>

			{products.status !== SERVICE_STATUS.COMPLETE && (<Spinner />)}

			{products.error && (<div className='error mb-3'>{products.error}</div>)}

			<div className='d-flex flex-row flex-wrap gap-2 products_list'>
				{products.data?.length === 0 && (<p><strong>No products found</strong></p>)}
				
				{products.data?.length > 0 && products.data.map(product => (
					<article key={product.id} className='product shadow p-3 mb-2 rounded' data-id={product.id} onClick={handleProductClick}>
						<img src={product.image_url} className='mb-3' alt={product.name} />
						<hr />
						<p className='mb-2'>${product.price}</p>
						<p className='mb-2' style={{color: 'var(--bs-tertiary-color)'}}>{product.category}</p>
						<h6 className='mb-2'>{product.name}</h6>
					</article>
				))}
			</div>

			<div className='pagination'></div>
		</Content>
	);
};

export default Products;