import { Button } from '@/components/ui';

import './ContactUsFAQs.scss';

const ContactUsFAQs = () => {
	/**
	 * 
	 * @param {Event} e 
	 */
	const onRowClick = (e) => {
		if (e.currentTarget.classList.contains('on')) {
			e.currentTarget.classList.remove('on');
		} else {
			e.currentTarget.classList.add('on');
		}
	}

	return (
		<section>
			<div className='accordion' id='accordionFAQs'>
				<div className='accordion-item'>
					<h2 className='accordion-header'>
						<Button className='accordion-button collapsed' type='button' data-bs-toggle='collapse' data-bs-target='#q1' aria-expanded='true' aria-controls='q1'>How do i signup for SimpleApp?</Button>
					</h2>
					<div id='q1' className='accordion-collapse collapse' data-bs-parent='#accordionFAQs'>
						<div className='accordion-body'>From your web browser, you can sign up at:<br />https://simpleapp.com/#sign-up</div>
					</div>
				</div>

				<div className='accordion-item'>
					<h2 className='accordion-header'>
						<Button className='accordion-button collapsed' type='button' data-bs-toggle='collapse' data-bs-target='#q2' aria-expanded='true' aria-controls='q2'>Why are my login credentials not working?</Button>
					</h2>
					<div id='q2' className='accordion-collapse collapse' data-bs-parent='#accordionFAQs'>
						<div className='accordion-body'>
							<p>Click on the Forgot Password link and reset your password</p>
						</div>
					</div>
				</div>

				<div className='accordion-item'>
					<h2 className='accordion-header'>
						<Button className='accordion-button collapsed' type='button' data-bs-toggle='collapse' data-bs-target='#q3' aria-expanded='true' aria-controls='q3'>How do i cancel my subscription?</Button>
					</h2>
					<div id='q3' className='accordion-collapse collapse' data-bs-parent='#accordionFAQs'>
						<div className='accordion-body'>You can cancel your subscription on the My Account page located in the upper right hand menu.</div>
					</div>
				</div>

				<div className='accordion-item'>
					<h2 className='accordion-header'>
						<Button className='accordion-button collapsed' type='button' data-bs-toggle='collapse' data-bs-target='#q4' aria-expanded='true' aria-controls='q4'>How do I update my credit card?</Button>
					</h2>
					<div id='q4' className='accordion-collapse collapse' data-bs-parent='#accordionFAQs'>
						<div className='accordion-body'>You can update your credit card on the My Account page. If you are unable to update your card, we recommend that you update it from your laptop computer.</div>
					</div>
				</div>

				<div className='accordion-item'>
					<h2 className='accordion-header'>
						<Button className='accordion-button collapsed' type='button' data-bs-toggle='collapse' data-bs-target='#q7' aria-expanded='true' aria-controls='q7'>How do i switch to the annual subscription?</Button>
					</h2>
					<div id='q7' className='accordion-collapse collapse' data-bs-parent='#accordionFAQs'>
						<div className='accordion-body'>You can upgrade your subscription on the My Account page.</div>
					</div>
				</div>

				<div className='accordion-item'>
					<h2 className='accordion-header'>
						<Button className='accordion-button collapsed' type='button' data-bs-toggle='collapse' data-bs-target='#q8' aria-expanded='true' aria-controls='q8'>Why is the Gift SimpleApp feature not working for me?</Button>
					</h2>
					<div id='q8' className='accordion-collapse collapse' data-bs-parent='#accordionFAQs'>
						<div className='accordion-body'>Our gift feature only works for customers who have an active credit card on file. If you do not have an active card on file, you can add one by updating your payment information on the My Account page.</div>
					</div>
				</div>

				<div className='accordion-item'>
					<h2 className='accordion-header'>
						<Button className='accordion-button collapsed' type='button' data-bs-toggle='collapse' data-bs-target='#q9' aria-expanded='true' aria-controls='q9'>How do i see the latest updates?</Button>
					</h2>
					<div id='q9' className='accordion-collapse collapse' data-bs-parent='#accordionFAQs'>
						<div className='accordion-body'>To see our latest updates, you must click on the "Refresh" link located in the upper right hand menu.</div>
					</div>
				</div>

				<div className='accordion-item'>
					<h2 className='accordion-header'>
						<Button className='accordion-button collapsed' type='button' data-bs-toggle='collapse' data-bs-target='#q11' aria-expanded='true' aria-controls='q11'>Why are some members highlighted?</Button>
					</h2>
					<div id='q11' className='accordion-collapse collapse' data-bs-parent='#accordionFAQs'>
						<div className='accordion-body'>We have recently updated our reports to highlight your personally enrolled in each report as a way for you to easily find them when you scroll through them. You can also sort by your personally enrolled by using the new "Settings" feature in the upper right hand menu.</div>
					</div>
				</div>

				<div className='accordion-item'>
					<h2 className='accordion-header'>
						<Button className='accordion-button collapsed' type='button' data-bs-toggle='collapse' data-bs-target='#q12' aria-expanded='true' aria-controls='q12'>Can I view my reports from my desktop?</Button>
					</h2>
					<div id='q12' className='accordion-collapse collapse' data-bs-parent='#accordionFAQs'>
						<div className='accordion-body'>Yes! In fact, our desktop version displays additional information that we are unable to display on mobile devices.</div>
					</div>
				</div>
			</div>
		</section>
	)
}

export default ContactUsFAQs;