import ModalDialog from '@/components/ModalDialog';
import { useAuthContext } from '@/hooks/useAuthContext';
import reportService from '@/services/reportService';
import eventEmitter, { EVENTS } from '@/utils/eventEmitter';
import { getPeriodId } from '@/utils/utils';
import { isValidEmail } from '@/utils/validation';
import { useEffect, useState } from 'react';

const INITIAL_STATE = { 
	id:'', 
	show: false, 
	title: '', 
	body: '', 
	buttonTitle: '', 
	onClose: null, 
	onClick: null 
};

const ModalExport = () => {
	const [ modal, setModal ] 	= useState(INITIAL_STATE);
	const { user } 				= useAuthContext();

	/**
	 * Exports the selected report
	 * 
	 * @param {object} data - the key data attributes needed to export the selected report
	 */
	const exportReport = async (data) => {
		const response = await reportService.export(data);

		// Show error if not successfull
		if (response.status !== 200) {
			setModal({ id: 'modal_export_report_error', show: true, title: 'Export Report Error', body: <><p>Unable to export your {report} report at this time, please try again later.</p></> });
		}
	}

	/**
	 * Shows the export modal to confirm the export of the selected report.
	 * Note: This will only allow users to export 1 years worth of data.
	 * 
	 * @param {string} report 
	 * @param {string} id 
	 * @param {string} date 
	 * @param {number} periodid 
	 * @param {string} type 
	 * @returns 
	 */
	const onExportReportEvent = async (data) => {
		const { report, id, date, periodid, type } = data;
		const currentPeriodid = getPeriodId();

		// Only allow exporting of the past year
		if (currentPeriodid - periodid >= 12) {
			const onClose = () => {
				setModal(INITIAL_STATE);
			}
			setModal({ id: 'modal_export_report_error', show: true, title: 'Export Report - Unable to Export', body: <><p>Currently, we can only export data for the last 12 months.</p></>, onClose });
			return;
		}
		
		if (user.email && isValidEmail(user.email)) {
			// Once we successfully obtained the email address...
			const title = `Export ${report} Report`;
			const body = <><p>The {report} report will be sent as a CSV file to the email address on file with SimpleApp. If the email address is not correct, please update it in the Update Email Address feature located in My Account in the upper right hand menu.</p><p>This report can export data for the last 12 months.</p><p>This report will be sent to:<br /><strong>{user.email}</strong></p><p><strong>Note:</strong> The export process make take several minutes to complete.</p><p>If you haven't received your report, please check your junk/spam folder.</p></>;
			const onClick = () => {
				setModal(INITIAL_STATE);
				exportReport({ ...data, email: user.email });
			}

			setModal({ id: 'modal_export_report', show: true, title, body, buttonTitle: 'Export Report', onClose, onClick });

		} else {
			const onClick = () => {
				setModal(INITIAL_STATE);
				eventEmitter.emit(EVENTS.NAVIGATE, '/account/update-email');
			}
			setModal({ id: 'modal_export_report_error', show: true, title: 'Export Report - Invalid Email Address', body: <><p>Your email address on file is not valid. Please update your email address in the Update Email Address feature located in My Account in the upper right hand menu.</p></>, buttonTitle: 'Update Now', onClick });
		}
	}

	/**
	 * 
	 * @param {Event} e 
	 */
	const onClose = (e) => {
		setModal(INITIAL_STATE);
	}

	useEffect(() => {
		eventEmitter.on('ModalExportDialog', EVENTS.EXPORT_REPORT, onExportReportEvent);
		
		// cleanup
		return () => {
			eventEmitter.off('ModalExportDialog');
		}

		// We need to resubscribe when user object is updated
	}, [user]);

	return (
		<ModalDialog {...modal} />
	)
};

export default ModalExport;