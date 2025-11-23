import { NavLink } from 'react-router';

const NavMenuLink = (props) => {
	const { path, title, onClick } 	= props;
	let classes 					= props.linkClass ? `${props.linkClass}` : '';

	return (
		<li>
			<NavLink to={path} className={classes} onClick={onClick} reloadDocument>{title}</NavLink>
		</li>
	)
};

export default NavMenuLink;