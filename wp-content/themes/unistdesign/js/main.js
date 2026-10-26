( function() {
	// 홈 화면의 News, People Story 등 모든 캐러셀을 각각 초기화합니다.
	function initCarousel( newsCarousel ) {
		if ( ! newsCarousel ) {
			return;
		}
		const newsCards = newsCarousel.querySelector( '.news__cards' );

		if ( ! newsCards.children.length ) {
			return;
		}

		const newsMeta = newsCarousel.querySelector( '.news__meta' );

		// Add Indicators.
		const indicators = document.createElement( 'nav' );
		indicators.className = 'news__indicators';

		let current = newsCarousel.dataset.current || 0;

		const setCurrent = function( index ) {
			indicators.children[ current ].classList.remove( 'current' );
			newsCards.children[ current ].classList.remove( 'current' );
			current = index;
			indicators.children[ current ].classList.add( 'current' );
			newsCards.children[ current ].classList.add( 'current' );
		};

		const fullObserver = new IntersectionObserver( function( records ) {
			for ( const record of records ) {
				if ( record.isIntersecting ) {
					const index = Array.from( newsCards.children ).indexOf( record.target );
					setCurrent( index );
				}
			}
		}, {
			root: newsCards,
			threshold: 0.9,
		} );

		Array.from( newsCards.children ).forEach( function( card, index ) {
			fullObserver.observe( card );

			card.addEventListener( 'click', function( e ) {
				// Ignore if in desktop mode.
				if ( window.innerWidth > 782 ) {
					return;
				}

				if ( card.classList.contains( 'current' ) ) {
					return;
				}

				e.preventDefault();

				const cardRect = card.getBoundingClientRect();
				newsCards.scrollTo( {
					left: newsCards.scrollLeft + cardRect.x - 16,
					behavior: 'smooth',
				} );

				// card.scrollIntoView( { behavior: 'smooth', block: 'nearest' } );
				setCurrent( index );
			} );

			const indicator = document.createElement( 'button' );
			indicator.className = 'news__indicator';
			indicator.addEventListener( 'click', function( e ) {
				e.preventDefault();

				const cardRect = card.getBoundingClientRect();
				newsCards.scrollTo( {
					left: newsCards.scrollLeft + cardRect.x - 16,
					behavior: 'smooth',
				} );

				setCurrent( index );
			} );
			indicators.append( indicator );
		} );

		indicators.children[ current ].classList.add( 'current' );

		newsMeta.prepend( indicators );
	}

	// Display award description.
	function initAward() {
		const awardToggle = document.querySelector( '.single__award__toggle' );
		const awardTarget = document.querySelector( '.single__award__info' );
		const awardTargetArrow = document.querySelector( '.single__award__info__arrow' );

		if ( ! awardToggle ) {
			return;
		}

		function setHandle() {
			if ( window.innerWidth < 1024 ) {
				const toggleRect = awardToggle.getBoundingClientRect();
				const parentNode = awardToggle.parentNode;
				const parentRect = parentNode.getBoundingClientRect();
				const toggleLeft = toggleRect.left;
				const toggleWidth = toggleRect.width;
				const parentLeft = parentRect.left;
				awardTargetArrow.style.left = `${ toggleLeft + ( toggleWidth / 2 ) - parentLeft - 16 }px`;
			} else {
				awardTargetArrow.style.left = null;
			}
		}

		let debounce;
		function debouncedHandler() {
			if ( debounce ) {
				window.cancelAnimationFrame( debounce );
			}

			debounce = window.requestAnimationFrame( setHandle );
		}

		awardToggle.addEventListener( 'click', function( e ) {
			e.preventDefault();

			if ( awardToggle.classList.contains( 'is-active' ) ) {
				window.removeEventListener( 'resize', debouncedHandler );
			} else {
				window.addEventListener( 'resize', debouncedHandler );
			}

			awardToggle.classList.toggle( 'is-active' );
			awardTarget.classList.toggle( 'is-active' );

			setHandle();
		} );
	}

	document.querySelectorAll( '.news__carousel' ).forEach( initCarousel );
	initAward();
}() );

/* global unistdesignAjaxPosts */
// Explore More: 마지막 쪽까지 불러오면 버튼을 숨긴다(빈 요청을 한 번 더 보내 "All posts loaded" 가 남지 않게)
( function() {
	const button = document.querySelector( '.load-more' );
	if ( ! button || typeof unistdesignAjaxPosts === 'undefined' ) {
		return;
	}
	const check = () => {
		if ( Number( unistdesignAjaxPosts.currentPage ) >= Number( unistdesignAjaxPosts.maxPage ) ) {
			button.style.display = 'none';
		}
	};
	new MutationObserver( check ).observe( button.parentNode, { childList: true, subtree: true } );
}() );
