import Content from '@/components/Content';
import { Button } from '@/components/ui';
import EmailForm from '@/pages/components/EmailForm';
import Header from '@/pages/components/Header';
import eventEmitter, { EVENTS } from '@/utils/eventEmitter';
import { useState } from 'react';
import ContactUsFAQs from './ContactUsFAQs';

import './ContactUs.scss';

const TITLE = 'Contact Us';

const ContactUs = () => {
	const [ showFAQs, setShowFAQs ] = useState(false);

	/**
	 * 
	 */
	const onShowFAQsClick = () => {
		eventEmitter.emit(EVENTS.MODAL_SHOW, { id: 'modal_faqs', size: 'lg', show: true, title: 'FAQs', body: <ContactUsFAQs /> })
	}

	return (
		<Content id='contact_us'>
			{/* Header Section */}
			<Header title={TITLE} />
			
			<div className='did-you-know mb-3'>
				<p>Did you know that most of your questions can be answered from within our FAQs popup?</p>
				<Button className='btn-primary btn-sm show-faqs' onClick={onShowFAQsClick}>Show FAQs</Button>
			</div>

			<EmailForm parent='contact_us' />
		</Content>
	)
}

export default ContactUs;