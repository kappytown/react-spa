import { useCallback } from 'react';
import { useNavigate as useNav } from 'react-router';

/**
 * This is a wrapper around react-router useNavigate hook.
 * This is needed because the navigate function does not have a reloadDocument attribute like the NavLink does
 * so we have to use location.hash instead which triggers a location change without a full page reload.
 *  
 * @returns {function} navigate
 */
const useNavigate = () => {
    const navigate = useNav();

    return useCallback((to, options) => {
        if (options) {
            navigate(to, options);
        } else {
            const newHash = `#${to}`;
            if (window.location.hash !== newHash) {
                window.location.hash = newHash;
            }
        }
    }, [navigate]);
};

export default useNavigate;
