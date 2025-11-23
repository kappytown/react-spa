import { useAuthContext } from '@/hooks/useAuthContext';
import { useLogout } from '@/hooks/useLogout';
import eventEmitter, { EVENTS } from '@/utils/eventEmitter';
import React, { forwardRef, useCallback, useEffect, useImperativeHandle, useRef, useState } from 'react';
import NavMenuCategory from './NavMenuCategory';
import navMenuItems from './navMenuItems';
import NavMenuLink from './NavMenuLink';
import { getRoute } from '@/utils/utils';

import './NavMenu.scss';

const NavMenu = forwardRef((props, ref) => {
	const { user } 		= useAuthContext();
	const { logout } 	= useLogout();

	// Keep menu items in state to prevent us from recreating on every render
	const [ menu, setMenu ] = useState(null);

	const menuRef = useRef();


	/**
	 * Used to access the menuRef from the parent component
	 */
	useImperativeHandle(ref, () => {
		return {
			get menu() {
				return menuRef.current;
			}
		}
	}, []);

	/**
	 * Intercepts all navigation clicks to handle a few use cases where we don't need to navigate
	 * 
	 * @param {Event} e 
	 */
	const onClickHandler = (e) => {
		const el = e.currentTarget;
		const view = el.attributes.href.value;
		
		if (view) {
			// Slides the menu out of view
			menuRef.current.classList.remove('open');

			if (view.includes('/logout')) {
				logout();
				e.preventDefault();
				return;

			} else if (view.includes('/refresh')) {
				window.location.reload(true);
				e.preventDefault();
				return;
			
			} else if (view.includes('/privacy') || view.includes('/terms') || view.includes('/cookies')) {
				// Get the policy to load
				const policy = view.replace(/^.*\/(\w*)$/, '$1');
				eventEmitter.emit(EVENTS.POLICY_MODAL_SHOW, policy);
				e.preventDefault();
				return;

			} else if (view.includes('/cookie-preferences')) {
				eventEmitter.emit(EVENTS.COOKIE_PREFERENCES_CHANGE);
				e.preventDefault();
				return;
			}
		}
	}

	/**
	 * Generates the menu items then sets the menu state to trigger a render of the menu items
	 * 
	 * @param {object} user - the user object used to know which menu to show
	 */
	const loadMenu = useCallback(async (user) => {
		const menuCategory = user ? 'authenticated' : 'unauthenticated';

		// create a copy of the menu item so we do not updated it directly
		const menuItems = [ ...navMenuItems[menuCategory] ];

		const items = (
			<ul>
				{menuItems.map((category, categoryIndex) => (
					<React.Fragment key={categoryIndex}>
						<NavMenuCategory {...category} key={categoryIndex} />
						{category.links.map((link, linkIndex) => (
							<NavMenuLink {...link} key={categoryIndex + '-' + linkIndex} onClick={onClickHandler} /> 
						))}
					</React.Fragment>
				))}
			</ul>
		)
		
		setMenu(items);
	}, []);

	/**
	 * Loads the menu when the user is authenticated and not authenticated
	 */
	useEffect(() => {
		loadMenu(user);
	}, [user, loadMenu]);

	return (
		<nav ref={menuRef} id='menu'>
			{menu}
		</nav>
	);
});

export default NavMenu;