import './Header.scss';

const Header = ({ getMenuRef }) => {
	/**
	 * 
	 * @param {Event} e 
	 * @returns 
	 */
	const onMenuClick = (e) => {
		let menu = getMenuRef();

		if (menu.classList.contains('open')) {
			menu.classList.remove('open');
		} else {
			menu.classList.add('open');
		}
		return false;
	};

	return (
		<header className='sticky-top d-flex align-items-center header'>
			<div className='logo flex-grow-1'>
				<img src='assets/img/app_icon.png' />
				<span className='simple'>Simple</span><span className='app'>App</span>
			</div>
			<div className='hamburger'>
				<img src='assets/img/icon_hamburger.png' alt='Navigation menu' onClick={onMenuClick} />
			</div>
		</header>
	);
};

export default Header;