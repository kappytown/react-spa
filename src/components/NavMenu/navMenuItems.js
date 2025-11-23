const navMenuItems = {
		authenticated: [
			{
				title: 'SimpleApp',
				links: [
					{
						title: 'Home',
						path: '/home'
					},
					{
						title: 'Products',
						path: '/products'
					},
					{
						title: 'Orders',
						path: '/orders'
					}
				]
			},
			{
				title: 'Account',
				links: [
					{
						title: 'My Account',
						path: '/account/my-account'
					},
					{
						title: 'Refresh',
						path: '/refresh'
					},
					{
						title: 'Logout',
						path: '/logout'
					}
				]
			},
			{
				title: 'Support',
				links: [
					{
						title: 'Contact Us',
						path: '/support/contact-us'
					}
				]
			},
			{
				title: 'Policies',
				links: [
					{
						title: 'Privacy Policy',
						path: '/privacy'
					},
					{
						title: 'Terms and Conditions',
						path: '/terms'
					},
					{
						title: 'Cookie Policy',
						path: '/cookies'
					},
					{
						title: 'Consent Preferences',
						path: '/cookie-preferences'
					}
				]
			}
		],
		unauthenticated: [
			{
				title: 'SimpleApp',
				links: [
					{
						title: 'Login',
						path: '/login'
					},
					{
						title: 'Sign Up',
						path: '/sign-up'
					},
					{
						title: 'Refresh',
						path: '/refresh'
					}
				]
			},
			{
				title: 'Support',
				links: [
					{
						title: 'Contact Us',
						path: '/support/contact-us'
					}
				]
			},
			{
				title: 'Policies',
				links: [
					{
						title: 'Privacy Policy',
						path: '/privacy'
					},
					{
						title: 'Terms and Conditions',
						path: '/terms'
					},
					{
						title: 'Cookie Policy',
						path: '/cookies'
					},
					{
						title: 'Cookie Preferences',
						path: '/cookie-preferences'
					}
				]
			}
		]
	};

export default navMenuItems;