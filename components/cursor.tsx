'use client';

import React, { useEffect, useState, useRef } from 'react';
import useMouse from '@/hooks/use-mouse-position';
import Image from 'next/image';

const images = [
	'/icons/1.svg',
	'/icons/2.svg',
	'/icons/3.svg',
	'/icons/4.svg',
	'/icons/5.svg',
	'/icons/6.svg',
	'/icons/7.svg',
	'/icons/8.svg',
	'/icons/9.svg',
	'/icons/10.svg',
	'/icons/11.svg',
];

type RenderedImage = {
	id: number;
	src: string;
	x: number;
	y: number;
};

function CursorComponent() {
	const [state, ref] = useMouse();
	const [renderedImages, setRenderedImages] = useState<RenderedImage[]>([]);
	const imageIndexRef = useRef(0);
	const lastRenderTime = useRef(0);

	useEffect(() => {
		const now = Date.now();
		const timeSinceLastRender = now - lastRenderTime.current;

		// Only render if at least 100ms have passed since last render
		if (timeSinceLastRender < 50) {
			return;
		}

		lastRenderTime.current = now;

		// Add new image at mouse position
		const newImage: RenderedImage = {
			id: now + Math.random(),
			src: images[imageIndexRef.current % images.length],
			x: state.x,
			y: state.y,
		};

		setRenderedImages(prev => {
			const updated = [...prev, newImage];
			// Remove oldest if more than 20 images
			if (updated.length > 20) {
				return updated.slice(1);
			}
			return updated;
		});

		// Set timeout to remove this image after 1 second
		// Don't cleanup - let it complete regardless of mouse movement
		setTimeout(() => {
			setRenderedImages(prev => prev.filter(img => img.id !== newImage.id));
		}, 1000);

		// Cycle through images
		imageIndexRef.current += 1;
	}, [state.x, state.y]);

	return (
		<div ref={ref} className='pointer-events-none fixed inset-0'>
			{renderedImages.map(img => (
				<div
					key={img.id}
					className='absolute'
					style={{
						left: img.x,
						top: img.y,
						transform: 'translate(-50%, -50%)',
					}}
				>
					<Image
						src={img.src}
						alt='cursor icon'
						width={100}
						height={100}
						className='pointer-events-none'
					/>
				</div>
			))}
		</div>
	);
}

export default CursorComponent;
