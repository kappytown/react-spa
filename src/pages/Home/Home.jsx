import Content from '@/components/Content';
import { Button } from '@/components/ui';
import { useAuthContext } from '@/hooks/useAuthContext';
import useCacheService from '@/hooks/useCacheService';
import { useLogout } from '@/hooks/useLogout';
import useNavigate from '@/hooks/useNavigate';
import Header from '@/pages/components/Header';
import reportService from '@/services/reportService';
import { useEffect, useState } from 'react';

import './Home.scss';

const TITLE = 'Home';

const Home = (props) => {
	const navigate 							= useNavigate();
	const { user } 							= useAuthContext();
	const [ request ] 						= useCacheService(false);
	const { logout } 						= useLogout();
	const [ stats, setStats ] 				= useState(null);
	const [ topProducts, setTopProducts ] 	= useState(null);
	const [ recentOrders, setRecentOrders ] = useState(null);

	const loadReports = () => {
		getStats();
		getTopProducts();
		getRecentOrders(); 
	}

	/** 
	 * Gets the stats
	 */
	const getStats = async () => {
		const abortController 	= new AbortController();
		const results 			= await request(reportService.orderStats, {}, { signal: abortController.signal });
		
		if (results?.data?.length > 0) {
			setStats(results.data[0]);
		} else {
			setStats({});
		}
	}

	/**
	 * Gets the top products
	 */
	const getTopProducts = async () => {
		const abortController 	= new AbortController();
		const results 			= await request(reportService.topProducts, {}, { signal: abortController.signal });
		
		if (results?.data?.length > 0) {
			setTopProducts(results.data);
		} else {
			setTopProducts([]);
		}
	}

	/**
	 * Gets the recent orders
	 */
	const getRecentOrders = async () => {
		const abortController 	= new AbortController();
		const results 			= await request(reportService.recentOrders, {}, { signal: abortController.signal });
		
		if (results?.data?.length > 0) {
			setRecentOrders(results.data);
		} else {
			setRecentOrders([]);
		}
	}

	/**
	 * Logs the user out
	 * 
	 * @param {Event} e 
	 */
	const handleLogout = (e) => {
		e.preventDefault();
		logout();
	}

	/**
	 * Navigates to the order details page
	 * 
	 * @param {Event} e 
	 */
	const handleOrderClick = (e) => {
		e.preventDefault();
		const id = e.currentTarget.dataset.id;
		navigate(`orders/order/${id}`);
	}

	/**
	 * Loads all the stats
	 */
	useEffect(() => {
		loadReports();
	}, []);

	return (
		<Content id='home' title={Home}>
			{/* Header Section */}
			<Header title={TITLE} />

			<div id='dashboard'>
				<div className='card shadow-lg mb-5 border-0 p-3 bg-info-subtle'>
					<div className='card-body'>
						<div className='d-flex justify-content-between align-items-center flex-wrap'>
							<div>
								<h1 className='mb-2'>Welcome back, <span id='userName'>{user.name}</span>!</h1>
								<p className='text-muted mb-0' id='userEmail'><a href={`mailto:${user.email}`}>{user.email}</a></p>
							</div>
							<Button className='btn-primary mt-3 mt-md-0' onClick={handleLogout}>
								<i className='bi bi-box-arrow-right me-2'></i>Logout
							</Button>
						</div>
					</div>
				</div>

				<div className='row mb-5'>
				{stats && (
					<>
					<div className='col-12 col-sm-6 col-lg-3'>
						<div className='card shadow-lg border-0 bg-info-subtle p-3'>
							<div className='card-body text-center p-0'>
								<div className='stat-icon mb-3 fs-1'>📦</div>
								<p className='text-muted mb-2 small'>Total Orders</p>
								<h2 className='mb-0' id='totalOrders'>{stats.totalOrders}</h2>
							</div>
						</div>
					</div>
					<div className='col-12 col-sm-6 col-lg-3'>
						<div className='card shadow-lg border-0 bg-info-subtle p-3'>
							<div className='card-body text-center p-0'>
								<div className='stat-icon mb-3 fs-1'>💰</div>
								<p className='text-muted mb-2 small'>Total Spent</p>
								<h2 className='mb-0' id='totalSpent'>{Intl.NumberFormat('en-US', {style: 'currency',currency: 'USD'}).format(stats.totalSpent)}</h2>
							</div>
						</div>
					</div>
					<div className='col-12 col-sm-6 col-lg-3'>
						<div className='card shadow-lg border-0 bg-info-subtle p-3'>
							<div className='card-body text-center p-0'>
								<div className='stat-icon mb-3 fs-1'>📊</div>
								<p className='text-muted mb-2 small'>Average Order</p>
								<h2 className='mb-0' id='avgOrder'>{Intl.NumberFormat('en-US', {style: 'currency',currency: 'USD'}).format(stats.averageOrder)}</h2>
							</div>
						</div>
					</div>
					<div className='col-12 col-sm-6 col-lg-3'>
						<div className='card shadow-lg border-0 bg-info-subtle p-3'>
							<div className='card-body text-center p-0'>
								<div className='stat-icon mb-3 fs-1'>🎯</div>
								<p className='text-muted mb-2 small'>Items Purchased</p>
								<h2 className='mb-0' id='totalItems'>{stats.numItems}</h2>
							</div>
						</div>
					</div>
					</>
				)}
				</div>

				<div className='row mb-5'>
					<div className='col-12'>
						<div className='card shadow-lg border-0 p-3 bg-info-subtle'>
							<div className='card-body'>
								<h3 className='card-title mb-4'>Top Products You've Purchased</h3>
								{topProducts?.length > 0 && (
								<div className='list-group' id='topProducts'>
									{topProducts.map((product,index) => (
									<div className='list-group-item d-flex mb-1 p-3 justify-content-between align-items-center' key={`${product.id}-${index}`}>
										<span className='fw-semibold'>{product.name}</span>
										<span className='badge bg-primary rounded-pill'>{product.quantity}x • {Intl.NumberFormat('en-US', {style: 'currency',currency: 'USD'}).format(product.price)}</span>
									</div>
									))}
								</div>
								)}
								{topProducts?.length === 0 && (<strong>No top products found.</strong>)}
							</div>
						</div>
					</div>
				</div>

				<div className='card shadow-lg border-0 p-3 bg-info-subtle'>
					<div className='card-body'>
						<h3 className='card-title mb-4'>Recent Orders</h3>
						<div className='table-responsive'>
							{recentOrders?.length > 0 && (
							<table className='table table-hover align-middle'>
								<thead className='table-light'>
									<tr>
										<th className='p-3'>Order ID</th>
										<th className='p-3'>Date</th>
										<th className='p-3'>Items</th>
										<th className='p-3'>Total</th>
										<th className='p-3'>Status</th>
									</tr>
								</thead>
								<tbody id='ordersTableBody'>
									{recentOrders.map(order => {
										const badgeClass = {
											delivered: 'success',
											shipped: 'primary',
											processing: 'warning',
											pending: 'secondary',
											cancelled: 'danger'
										}[order.status] || 'secondary';

										return (
										<tr key={order.id} onClick={handleOrderClick} data-id={order.id}>
											<td className='p-3'><strong>{order.id}</strong></td>
											<td className='p-3'>{order.date}</td>
											<td className='p-3'>{order.numItems} items</td>
											<td className='p-3'><strong>{Intl.NumberFormat('en-US', {style: 'currency',currency: 'USD'}).format(order.total)}</strong></td>
											<td className='p-3'><span className={`badge bg-${badgeClass}`}>{order.status}</span></td>
										</tr>
										)
									})}
								</tbody>
							</table>
							)}

							{recentOrders?.length === 0 && (<strong>No recent orders found.</strong>)}
						</div>
					</div>
				</div>
			</div>
		</Content>
	);
};

export default Home;