import { Button } from '@/components/ui';
import logger from '@/utils/logger';
import { Component } from 'react';

class ErrorBoundary extends Component {
	/**
	 * 
	 * @param {object} props 
	 */
	constructor(props) {
		super(props);
		this.state = { hasError: false, error: null };
	}

	/**
	 * 
	 * @param {Error} error - The error that was thrown
	 * @returns {object}
	 */
	static getDerivedStateFromError(error) {
		logger.log('ERROR: ', error.message);
		// Update the state so the next render will show the fallback UI.
		return { hasError: true, error };
	}

	/**
	 * Typically used for logging purposes
	 * 
	 * @param {Error} error - The error that was thrown
	 * @param {Object} errorInfo - An object containing additional info about the error
	 */
	componentDidCatch(error, errorInfo) {
		logger.log('Error Boundary Caught:', error, errorInfo);
	}

	render() {
		if (this.state.hasError) {
			return (
				<>
					{(/ChunkLoadError|SyntaxError/).test(this.state.error) || this.state.error.message.includes('Cannot find module') ? (
					// {this.state.error && (this.state.error.name === 'ChunkLoadError' || this.state.error.name === 'SyntaxError') ? (
						<div>
							<p>The application has been updated, please refresh your browser to get the latest update.</p>
							<Button onClick={() => window.location.reload(true)}>Refresh</Button>
						</div>
					) : (
						<div>
							<p>Something went wrong.</p>
							<pre>{this.state.error && this.state.error.message}</pre>
							<Button onClick={() => {window.location.href='/'}}>Try again</Button>
						</div>
					)}
				</>
			)
		} else {
			// Render children in case no errors were found
			return this.props.children;
		}
	}
}

export default ErrorBoundary;