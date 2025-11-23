const months = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];

/**
 * 
 * @returns {string}
 */
export const inTestMode = () => {
	return getUrlParam('mode') === 'test';
}

/**
 * 
 * @param {string} name 
 * @param {object} win 
 * @returns {string}
 */
export const getUrlParam = (name, win = window) => {
	name = name.replace(/[\[]/, '\\\[').replace(/[\]]/, '\\\]');
	const regex = new RegExp('[\\?&]' + name + '=([^&#]*)');
	const results = regex.exec(win.location.search);
	return results == null ? '' : decodeURIComponent(results[1].replace(/\+/g, ' '));
}

/**
 * Returns the name passed in but allows us to modify for consistency
 * Due to character encoding issues, some names are returned as: ??? ????
 * This will remove that name and replace it with the default value
 * 
 * @param {string} name 
 * @param {string} defaultVal 
 * @returns {string}
 */
export const getName = (name = '', defaultVal = '') => {
	// Show random names only when in test mode
	if (inTestMode()) {
		return getRandomName();

	} else {
		if (/^[ \?]*$/.test(name)) {
			name = defaultVal;
		}
	}
	return name.toLowerCase();
}

/**
 * Returns the provided email unless in test mode
 * 
 * @param {string} email 
 * @returns {string}
 */
export const getEmail = (email) => {
	if (inTestMode()) {
		return 'sample@email_sample.com';
	}
	return email;
}

/**
 * Returns the provided phone unless in test mode
 * 
 * @param {string} phone 
 * @returns {string}
 */
export const getPhone = (phone) => {
	if (inTestMode()) {
		return '(123) 456-7890';
	}
	return phone;
}

/**
 * Generates a random name to hide the innocent while testing
 * 
 * @returns {string}
 */
export const getRandomName = () => {
	var names = ['Lindsay Gibbs', 'Anna Graham', 'Erica Paul', 'Nellie Potter', 'Jana Baldwin', 'Nichole Hansen', 'Elaine Miles', 'Meghan Schwartz', 'Lela Bryan', 'Della Munoz', 'Rebecca Johnston', 'Jody Pena', 'Casey Jenkins', 'Lana Barber', 'Judy Mcgee', 'Patricia Howard', 'Naomi Carter', 'Roberta Romero', 'Melody Mendez', 'Leticia Manning', 'Cindy Wells', 'Paula Powers', 'Holly Erickson', 'Norma Arnold', 'Belinda Norris', 'Jodi Garcia', 'Donna Sandoval', 'Angie Fuller', 'Pat Byrd', 'Cora Summers', 'Anita Stanley', 'Silvia Silva', 'Carmen Torres', 'Mildred Marshall', 'Dana Duncan', 'Agnes Joseph', 'Katherine Nguyen', 'Alice Leonard', 'Patsy Gibson', 'Nora Brady', 'Lois Burton', 'May Fisher', 'Elena Clayton', 'Cheryl Santos', 'Lynette Oliver', 'Anne Bridges', 'Bridget West', 'Tara Barnett', 'Edith Alvarez', 'Thelma Castro', 'Harriet Sullivan', 'Tricia Wade', 'Vicki Herrera', 'Olga Bowman', 'Doreen Lucas', 'Diana Collier', 'Debra Mason', 'Alison Medina', 'Amelia Cox', 'Shirley Wilkerson', 'Annette Thornton', 'Lori Allison', 'Mindy Allen', 'Vicky Rios', 'Misty Keller', 'Loretta Lamb', 'Jean Ramos', 'Brittany Farmer', 'Joann Larson', 'Jeannette Swanson', 'Ellen Alvarado', 'Kristen Carlson', 'Vickie Terry', 'Latoya Murray', 'Yolanda Houston', 'Alexandra Ramirez', 'Irma Cortez', 'Regina Pittman', 'Ora Robbins', 'Virginia Nichols', 'Alma George', 'Angelica Norman', 'Sophie Bass', 'Traci Martin', 'Audrey Fletcher', 'Tami Glover', 'Sonia Wong', 'Pauline Scott', 'Constance Cross', 'Johanna Harris', 'Pamela Casey', 'Michele Ortega', 'Krista Frank', 'Monica Garner', 'Frances Jimenez', 'Lorene Carr', 'Angelina Palmer', 'Jasmine Townsend', 'Irene Burke', 'Sherri Becker', 'Lauren Johnston', 'Meghan Doyle', 'Edith Castillo', 'Bethany Lewis', 'Rose Fields', 'Janie White', 'Helen Joseph', 'Brandy Hart', 'Jasmine Dawson', 'Monica Neal', 'Loretta Meyer', 'Stephanie Rodgers', 'Dixie Rhodes', 'Thelma Dennis', 'Jacqueline Bryan', 'Rachel Ruiz', 'Angelina Maldonado', 'June Holland', 'Laura Tyler', 'Jeannie Sparks', 'Deborah Cannon', 'Judy Hardy', 'Marlene Moran', 'Caroline Jackson', 'Essie Higgins', 'Rochelle Ramos', 'Geraldine Webb', 'Molly Rowe', 'Roberta Elliott', 'Gretchen May', 'Tracy Collier', 'Lola Campbell', 'Ora Boyd', 'Eloise Figueroa', 'Kelly Bridges', 'Anna Castro', 'Annette Thomas', 'Jacquelyn Lane', 'Megan Gomez', 'Velma Strickland', 'Susan Sandoval', 'Marta Reid', 'Marcia Cortez', 'Jenna Santos', 'Shirley Huff', 'Kathleen Kim', 'Vicky Evans', 'Susie Burns', 'Cristina Hansen', 'Laurie Cohen', 'Dianna Hawkins', 'Myrtle Peters', 'Fannie Christensen', 'Jana Woods', 'Crystal Richards', 'Muriel Anderson', 'Cecelia Lyons', 'Kimberly Abbott', 'Marie Clayton', 'Mae Simon', 'Pauline Hubbard', 'Ashley Norton', 'Elaine King', 'Candace Murphy', 'Kayla Wise', 'Jessie Sanchez', 'Verna Summers', 'Linda Hines', 'Eleanor Rodriquez', 'Bernadette Mcguire', 'Lydia Watson', 'Jodi Matthews', 'Sabrina Wright', 'Sandy Nash', 'Bobbie Vasquez', 'Hope Perry', 'Willie Cobb', 'Maryann Schultz', 'Minnie Hicks', 'Doris Schneider', 'Johanna Floyd', 'Lindsey Baker', 'Joanne Hernandez', 'Debra Drake', 'Emily Ingram', 'Olga Ramsey', 'Martha French', 'Charlene Yates', 'Dorothy Luna', 'Leona Snyder', 'Shawna Morton', 'Virginia Barrett', 'Valerie Sherman', 'Juanita Chavez', 'Elsie Bryant', 'Camille Watts', 'Katie Lloyd', 'Dora Cross', 'Marcella Gross', 'Angel Steele', 'Leah Martinez', 'Eloise Tran', 'Kelley Lopez', 'Amanda Smith', 'Constance Evans', 'Connie Moody', 'Sonia Erickson', 'Mabel Mcgee', 'Jean Roberson', 'Margaret Yates', 'Antonia Morris', 'Loretta Perry', 'Ebony Colon', 'Christine Robertson', 'Jeanne Marsh', 'Iris Francis', 'Mandy Holland', 'Jo Cannon', 'Betty Hogan', 'Tracy Lowe', 'Lola Fletcher', 'Kristine Walker', 'Colleen Edwards', 'Madeline Kelly', 'Josephine Gonzalez', 'Jacquelyn Graves', 'Catherine Hernandez', 'Anne Keller', 'Jan Rios', 'Raquel Santos', 'Monica Kennedy', 'Ada Dean', 'Cecilia Ramsey', 'Audrey Moore', 'Gayle Wilkerson', 'Joanna Harvey', 'Christina Brock', 'Anna Spencer', 'Renee Beck', 'Violet Reeves', 'Margie Rice', 'Monique Patton', 'Tabitha Wells', 'Nicole Mullins', 'Barbara Leonard', 'Elvira Parsons', 'Blanche Green', 'Lisa Bowen', 'Jessie Mclaughlin', 'Paula Dawson', 'Tara Herrera', 'Hannah Ross', 'Rosie Stevens', 'Joy Cummings', 'Patti Massey', 'Gwendolyn Vargas', 'Melanie Pearson', 'Marcella Stephens', 'Krista Powers', 'Priscilla Lynch', 'Nadine Cunningham', 'Marta Townsend', 'Viola Steele', 'Joanne Warren', 'Eileen Torres', 'Louise Burns', 'Valerie Larson', 'Alberta Gonzales', 'Irene Stanley', 'Lydia Brady', 'Leticia Bass', 'Candice Holmes', 'Mary Nelson', 'Traci Sims', 'Teresa Thornton', 'Sherri Briggs', 'Nancy Black', 'Doris Anderson', 'Janie Schmidt', 'Gina Gutierrez', 'Ella Hampton', 'Brittany Mason', 'Tina Williams', 'Erika Wise', 'Tasha Gross', 'Vanessa Burgess', 'Lois Hill', 'Olga Fitzgerald', 'Mona Schneider', 'Doreen Quinn', 'Stephanie Mckinney', 'Penny Clarke', 'Delores Reed', 'Alma Hines', 'Glenda Kelley', 'Cristina Collins', 'Leslie Mccoy', 'Courtney Tucker', 'Agnes Maxwell', 'Faye Vaughn'];
	var index = Math.floor(Math.random()*(names.length-1)) + 1;
	return names[index];
}

/**
 * Returns a random memberid if in test mode
 * 
 * @param {number} memberid 
 * @returns {number}
 */
export const getMemberid = (memberid) => {
	if (inTestMode()) {
		return getRandomMemberid();
	}
	return memberid;
}

/**
 * Generates a random memberid to hide the innocent while testing
 * 
 * @returns {number}
 */
export const getRandomMemberid = () => {
	return Math.floor(1000000 + Math.random() * 9000000);
}

/**
 * This will return true if the provided route is a protected route (one that requires the user to be signed in)
 * We ignore login, sign-up, reactivate-subscription routes.
 * 
 * @param {string} route - the route path i.e. report/top-enrollers | login | account/my-account
 * @returns {bool}
 */
export const isProtectedRoute = (route) => {
	route = route || getFullPath();
	return /(login|login-verify|sign-up|my-account|update-payment|cancel-subscription|reactivate-subscription)(|\/)$/.test(route);
}

/**
 * 
 * @param {string} name 
 * @returns {string} - the value stored in then .env file with the specified key
 */
export const getEnvVar = (key) => {
	return import.meta.env[key];
}

/**
 * 
 * @returns {string} - the current version of the app
 */
export const getAppVersion = () => {
	return getEnvVar('ENV_APP_VERSION_WEB');
}

/**
 * 
 * @returns {string} - the path from the current location
 */
export const getFullPath = () => {
	return location.hash;
	//return location.pathname;
}

/**
 * 
 * @returns {string} the last path in the location i.e. https://simpleapp.com/app/#/my-account/update-email returns update-email
 */
export const getPath = (url) => {
	// Remove the trailing /
	const location = document.location.hash.replace(/#/, '');
	url = url || location.replace(/\/$/, '');
	//url = url || document.location.pathname.replace(/\/$/, '');
	url = url.replace(/^([^\/]*\/)+/, ''); // Return the last path segment
	return decodeURI(url.replaceAll('/', ''));

	//const segments = url.split('/'); 
	//return decodeURI(segments[segments.length - 1]);
}

/**
 * 
 * @returns {string} - the location path
 */
export const getRoute = () => {
	return document.location.hash.replace(/#/, '');
	//return document.location.pathname;
}

/**
 * 
 * @param {object} obj - the object to test if its empty
 * @returns {bool} - true if the object is empty
 */
export const isEmptyObject = (obj) => {
	if (!obj) return true;

	return obj.constructor === Object && Object.keys(obj).length === 0;
	//return JSON.stringify(obj) === '{}';
}

/**
 * Returns the name in initial caps
 * 
 * @param {string} name 
 * @returns {string}
 */
export const initialCaps = (name) => {
	return str.replace(/\b\w/g, char => char.toUpperCase());
}

/**
 * This method will stop execution (sleep) for the specified number of milliseconds
 * Note: This will only stop execution of code within the function and NOT outside of it
 * 
 * How to use:
 * 1) 	sleep(5000).then(() => {console.log('done')});
 * 2) 	(async () => {
 * 			await sleep(5000);
 * 			console.log('done');
 * 		})();
 * 
 * @param {number} ms 
 * @returns {object} a new Promise object
 */
export const sleep = (ms) => {
	return new Promise(resolve => setTimeout(resolve, ms));
};

/**
 * Returns the number of days in the current month
 * 
 * @returns {number} - total number of day in the month
 */
export const getNumberOfDaysInMonth = () => {
	const now = new Date();
	return new Date(now.getFullYear(), now.getMonth()+1, 0).getDate();
};

/**
 * Returns true if the date string is a valid date format that we support
 * 
 * @param {string} date 
 * @returns {bool}
 */
export const isValidDate = (date) => {
	if (date) {
		// Turn date 2017/01/20 to 01/20/2017
		date = date.replace(/^(\d{4})-(\d{2})-(\d{2})$/, '$2/$3/$1');
		return /^\d{1,2}(-|\/)\d{1,2}(-|\/)\d{4}$/.test(date);
	} else {
		return false;
	}
}

/**
 * Returns the number of days between the two dates
 * Make sure that d1 is greater then d2
 * 
 * @param {date} d1 
 * @param {date} d2 
 * @returns {number}
 */
export const daysDiff = (d1, d2) => {
	if (!(d1 instanceof Date)) d1 = new Date(d1);
	if (!(d2 instanceof Date)) d2 = new Date(d2);
	const timeDiff = d1.getTime() - d2.getTime();
	const daysDiff = timeDiff / (1000 * 3600 * 24);
	return daysDiff;
}

/**
 * 
 * @param {date} d1 
 * @param {date} d2 
 * @returns {string} the number of months ON and BETWEEN the two specified dates
 * i.e. September 2017 and December 2017 = 4
 */
export const monthDiff = (d1, d2) => {
	let months;
	months = (d2.getFullYear() - d1.getFullYear()) * 12;
	months += (d2.getMonth() - d1.getMonth()) + 1;

	return months <= 0 ? 0 : months;
};

/**
 * 
 * @param {string} date 
 * @returns {string} a formatted date in the format Jul 2024
 */
export const getMonthYearFromDateString = (date) => {
	date = date.replace(/^(\d{4})-(\d{1,2})-(\d{1,2})$/, '$2/$3/$1');
	if (!/^\d{1,2}(-|\/)\d{1,2}(-|\/)\d{4}$/.test(date)) {
		return date;
	}
	// invalid date if 2016/12/01 - must but 12/01/2016
	date = date.replace('-', '/');
	const d = new Date(date);
	let month = months[d.getMonth()];
	month = month.substring(0,3);
	return month + ' ' + d.getFullYear();
};

/**
 * 
 * @param {string} date 
 * @param {bool} omitYear 
 * @returns {string}
 */
export const getMonthDayYearFromDateString = (date, omitYear) => {
	date = date || '';
	date = date.replace(/^(\d{4})-(\d{1,2})-(\d{1,2})$/, '$2/$3/$1');
	if (!/^\d{1,2}(-|\/)\d{1,2}(-|\/)\d{4}$/.test(date)) {
		return date;
	}
	// invalid date if 2016/12/01 - must but 12/01/2016
	date = date.replace('-', '/');
	const d = new Date(date);
	let month = months[d.getMonth()];
	month = month.substring(0,3);
	return month + ' ' + d.getDate() + (!omitYear ? ' ' + d.getFullYear() : '')
}

/**
 * 
 * @param {string|float} value 
 * @returns {string} the amount of time that has past
 */
export const getLastUpdated = (value) => {
	const time = getPrettyTime(Number(value));
	return time ? time : 'Less than 1 minute ago';
}

/**
 * 
 * @param {float} time 
 * @returns {string} a pretty format of the amount of time that has past since the provided time
 */
export const getPrettyTime = (time) => {
	let days = 0;
	let hours = 0;
	let minutes = 0;
	let display = '';

	// Days elapsed
	if ((time/60) >= 24) {
		days = Math.floor(time/60/24);
		time = time-(days*24*60);

		display += days + ' day' + (days > 1 ? 's' : '');
	}

	// Hours elapsed
	if (time >= 60) {
		hours = Math.floor(time/60);
		time = time - (hours*60);

		if (display.length > 0) {
			display += ', ';
		}

		display += hours + ' hour' + (hours > 1 ? 's' : '');
	}

	// Minutes elapsed
	if (time >= 1) {
		minutes = Math.floor(time/1);
		time = time - (minutes*1);

		if (display.length > 0) {
			display += ' and ';
		}

		display += minutes + ' minute' + (minutes > 1 ? 's' : '');
	}

	return display ? display + ' ago' : display;
}

/**
 * 
 * @param {string} dateString 
 * @returns {number} the periodid associated with the date
 */
export const getPeriodId = (dateString) => {
	let d;
	if (!dateString) {
		d = new Date();
	} else {
		d = new Date(dateString);
	}

	return (Number(d.getFullYear()) * 12 + Number(d.getMonth())+1) - (2014 * 12 + 5) + 400;
}

/**
 * 
 * @param {string} date 
 * @param {bool} onlyIDs 
 * @returns {array} 
 */
export const getPeriodArray = (date, onlyIDs) => {
	const dateStart 	= new Date(date || null);
	const dateNow 		= new Date();
	const arr 			= [];
	const num 			= monthDiff(dateStart, dateNow);
	const startMonth 	= dateStart.getMonth();
	const startYear 	= dateStart.getFullYear();
	let currentMonth 	= startMonth;
	let currentYear 	= startYear;

	for (let i=0; i<num; i++) {
		// Make sure the month is 2 digits
		let newMonth 	= currentMonth + 1;
		newMonth 		= newMonth < 10 ? '0' + newMonth : newMonth;

		const periodid = getPeriodId(`${currentYear}-${newMonth}-15`);
		if (!onlyIDs) {
			arr.push({periodid: periodid, date: `${currentYear}-${newMonth}-01`});
		} else {
			arr.push(periodid);
		}

		if (currentMonth >= 11) {
			currentMonth = 0;
			currentYear += 1;
		} else {
			currentMonth++;
		}
	}

	return arr;
}

/**
 * 
 * @param {number} periodid 
 * @returns {string} - the date associated with the provided periodid
 */
export const getDateForPeriod = (periodid) => {
	periodid = periodid || getPeriodId();
	const pa = getPeriodArray();
	for (let i=0; i<pa.length; i++) {
		if (Number(pa[i].periodid) === Number(periodid)) {
			return getMonthYearFromDateString(pa[i].date);
		}
	}
	return '';
}

/**
 * 
 * @returns {Array} - list of all the rank names by rank
 */
export const getRanks = () => {
	return ['Star', 'Senior Star', 'Executive', 'Silver', 'Gold', 'Platinum', 'Diamond', 'Crown Diamond', 'Royal Crown Diamond'];
}

/**
 * 
 * @param {number} rankid - The id of the associated rank
 * @returns {string} - The name of the associated rank
 */
export const getRankName = (rankid) => {
	switch(Number(rankid)) {
		case -1:
		case 0:
			return 'Associate';
		case 1:
			return 'Star';
		case 2:
			return 'Senior Star';
		case 3:
			return 'Executive';
		case 4:
			return 'Silver';
		case 5:
			return 'Gold';
		case 6:
			return 'Platinum';
		case 7:
			return 'Diamond';
		case 8:
			return 'Crown Diamond';
		case 9:
			return 'Royal Crown Diamond';
	}
	return 'Associate';
}

/**
 * 
 * @param {*} typeid 
 * @returns {string} - Retail | Wholesale | Professional
 */
export const getCustomerType = (typeid) => {
	switch(typeid) {
		case 2:
			return 'Brand Partner';
		case 1:
		case 3:
			return 'Customer';
		case 4:
			return 'Professional Account';
		default:
			return 'Unknown';
	}
	return typeid;
}

/**
 * Returns true if we need to check for CV rather than PV
 * Leave rank empty to just check dates
 * CV date range is from 487 to 517
 * 
 * @param {number} periodid 
 * @param {number} rank 
 * @returns {bool}
 */
export const shouldUseCV = (periodid, rank) => {
	rank = Number(rank) || 3;	// default to 3 if 0

	return (rank <= 3 && Number(periodid).inRange(487, 517));
}

/**
 * Debouncing ensures that a function is not called multiple times in quick succession. 
 * It waits for a specified time period (in milliseconds) after the last call before executing the function. 
 * This is useful for optimizing performance, e.g., during window resizing or keypress events.
 * 
 * How to use:
 * const debouncedFunction = debounce(someFunction, 300);	// 300ms debounce
 * No matter how many times debouncedFunction is envoked within 300ms, it will only get called once
 * 
 * @param {function} func 
 * @param {number} wait 
 * @returns {function}
 */
export const debounce = (func, wait) => {
	let timeout;
	return function(...args) {
		clearTimeout(timeout);
		timeout = setTimeout(() => func(...args), wait);
	}
}

/**
 * This returns a deep clone of the specified object
 * 
 * @param {object} obj - object to clone
 * @returns {object} cloned object
 */
export const deepClone = (obj) => {
	if (typeof window !== 'undefined' && window.structuredClone) {
		return window.structuredClone(obj);
	} else if (typeof structuredClone === 'function') {
		return structuredClone(obj);
	} else {
		return JSON.parse(JSON.stringify(obj));
	}
}

/**
 * Adds a format function to all numbers
 * 
 * @param {number} n 
 * @param {number} x 
 * @returns {string} - the formatted number as a string
 */
Number.prototype.format = function(n, x) {
	const re = '\\d(?=(\\d{' + (x || 3) + '})+' + (n > 0 ? '\\.' : '$') + ')';
	return this.toFixed(Math.max(0, ~~n)).replace(new RegExp(re, 'g'), '$&,');
};

/**
 * Adds a inRange function too all numbers that checks if a number is within the specified range
 * 
 * @param {number} min 
 * @param {number} max 
 * @returns {bool} - true if values are in range
 */
Number.prototype.inRange = function(min, max) {
	if (this >= min && this <= max) return true;
	return false;
}