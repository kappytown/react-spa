import { useEffect, useRef } from 'react';

import './ProgressCircle.scss';

const DELAY = 500;

const ProgressCircle = (props) => {
	let { amount, size, color='blue', animate } = props;
	amount = amount <= 0 ? 0 : amount > 100 ? 100 : amount;

	const circleRef = useRef(null);
	const numRef = useRef(null);
	const dotsRef = useRef(null);

	const w = size === 'lg' ? 100 : 50;	// width
	const h = size === 'lg' ? 100 : 50;	// height
	const sw = size === 'lg' ? 8 : 4;	// stroke width
	const x = w / 2;					// x center point
	const y = w / 2;					// y center point
	const r = (w / 2) - (sw / 2); 		// radius

	const rotation = animate ? 0 : amount / 100 * 360;
	const offset = 2 * Math.PI * r;
	
	let dashOffset = offset - (amount / 100 * offset);

	useEffect(() => {
		if (animate) {
			setTimeout(() => {
				let circle = circleRef.current;

				const startTime = performance.now();
				const startValue = parseInt(numRef.current.innerText.replace(/[^\d]/g, '')) || 0;
				const endValue = amount;

				// Animates the value of a number from its current value to the new value
				const animatePercent = () => {
					if (!numRef.current) return;
					
					const currentTime = performance.now();
					const elapsed = currentTime - startTime;
					let progress = elapsed / 1500; // 1500 is the timing of the css transition 1.5s

					// If we reached the end
					if (progress > 1) progress = 1;
					
					const animatedValue = startValue + (endValue - startValue) * progress;
					numRef.current.innerText = Math.round(animatedValue) + '%';
					
					// Continually run the script until progress >= 1
					if (progress < 1) {
						requestAnimationFrame(animatePercent);
					}
				}
				animatePercent();

				// 144.51 = (2 * PI * 23) 2 * π * radius
				circle.style.strokeDashoffset = offset - (amount / 100 * offset);
				let dots = dotsRef.current;
				dots.style.transform = `rotate(${amount / 100 * 360}deg)`;
				if (amount === 100) {
					//dots.style.opacity = 0;
				}
			}, DELAY);

		} else {
			numRef.current.innerText = amount + '%';
			circleRef.current.style.strokeDashoffset = offset - (amount / 100 * offset);
			dotsRef.current.style.transform = `rotate(${amount / 100 * 360}deg)`;
		}
	}, [amount]);
	
	return (
		<div className={`progresscircle ${size} ${color}`}>
			<svg className='progress-circle' width={w} height={h} xmlns='http://www.w3.org/2000/svg'>
				<circle className='progress-circle-back' cx={x} cy={y} r={r} style={{strokeWidth: sw}}></circle>
				<circle ref={circleRef} className='progress-circle-prog' cx={x} cy={y} r={r} style={{strokeWidth: sw, strokeDasharray: offset, strokeDashoffset: offset}}></circle>
			</svg>
			<div ref={numRef} className='progress-text' data-progress='0'>0%</div>
			<span ref={dotsRef} className='dots'></span>
		</div>	
	)
}

export default ProgressCircle;