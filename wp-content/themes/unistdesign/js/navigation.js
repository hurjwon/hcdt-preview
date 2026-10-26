/**
 * File navigation.js.
 *
 * Handles toggling the navigation menu for small screens and enables TAB key
 * navigation support for dropdown menus.
 */
class Header {
	constructor( selector, miniHeaderSelector ) {
		this.node = document.querySelector( selector );
		this.miniHeader = document.querySelector( miniHeaderSelector );

		this.container = this.node.querySelector( '.header__container' );
		this.navigation = this.node.querySelector( '.navigation' );
		this.miniNavigation = this.miniHeader.querySelector( '.mini-header__navigation' );

		this.primaryMenu = this.navigation.querySelector( '.primary-menu' );
		this.secondaryMenu = this.navigation.querySelector( '.secondary-menu' );
		this.functionalMenu = this.navigation.querySelector( '.functional-menu' );
		this.functionalMenuMobile = this.node.querySelector( '.functional-menu--mobile' );

		this.subMenu = null;
		this.miniHeaderMenu = null;
	}

	static bindButton( button, target, e, onActive, onInactive ) {
		if ( e ) {
			e.preventDefault();
		}

		target.classList.toggle( 'active' );

		if ( button.getAttribute( 'aria-expanded' ) === 'true' ) {
			button.setAttribute( 'aria-expanded', 'false' );

			if ( onInactive ) {
				onInactive();
			}
		} else {
			button.setAttribute( 'aria-expanded', 'true' );

			if ( onActive ) {
				onActive();
			}
		}
	}

	initMenu() {
		const callback = ( menuItem ) => {
			if ( menuItem.classList.contains( 'current-menu-ancestor' ) ) {
				this.subMenu = document.createElement( 'div' );
				this.subMenu.className = 'tabs submenu';
				const subMenuContainer = document.createElement( 'div' );
				subMenuContainer.className = 'submenu__container';
				const subMenuClone = menuItem.querySelector( '.sub-menu' ).cloneNode( true );
				this.subMenu.appendChild( subMenuContainer );
				subMenuContainer.appendChild( subMenuClone );

				this.container.appendChild( this.subMenu );

				document.body.classList.add( 'has-active-submenu' );
			}
		};

		Array.from( this.primaryMenu.children ).forEach( callback );
		Array.from( this.secondaryMenu.children ).forEach( callback );
	}

	initMobile() {
		if ( ! this.navigation ) {
			return;
		}

		const button = this.node.querySelector( '.toggle--mobile' );

		if ( ! button ) {
			return;
		}

		button.addEventListener( 'click', () => Header.bindButton(
			button,
			this.navigation,
			null,
			() => {
				// 휴대폰 기능 메뉴가 없으면 건너뛴다(없을 때 메뉴를 열면 오류가 났다)
				if ( ! this.functionalMenuMobile ) {
					return;
				}
				const languageToggle = this.functionalMenuMobile.querySelector( 'a' );

				if ( ! languageToggle ) {
					return;
				}

				// Comment this out if you want to opt-in dropdown only.
				this.functionalMenuMobile.classList.add( 'hidden' );

				if ( languageToggle.getAttribute( 'aria-expanded' ) === 'true' ) {
					this.functionalMenuMobile.classList.remove( 'active' );
					languageToggle.setAttribute( 'aria-expanded', 'false' );
				}
			},
			// Comment this out if you want to opt-in dropdown only.
			() => {
				if ( this.functionalMenuMobile ) {
					this.functionalMenuMobile.classList.remove( 'hidden' );
				}
			}
		) );
	}

	initDesktop() {
		if ( ! this.secondaryMenu ) {
			return;
		}

		const button = this.node.querySelector( '.secondary-menu__toggle' );
		if ( ! button ) {
			return;
		}
		button.addEventListener( 'click', ( e ) => Header.bindButton( button, this.secondaryMenu, e ) );

		document.addEventListener( 'click', ( e ) => {
			const isClickButton = button.contains( e.target );

			if ( isClickButton ) {
				return;
			}

			const isClickInside = this.secondaryMenu.contains( e.target );

			if ( ! isClickInside ) {
				this.secondaryMenu.classList.remove( 'active' );
				button.setAttribute( 'aria-expanded', 'false' );
			}
		} );
	}

	initMiniHeader() {
		this.miniHeaderMenu = document.createElement( 'div' );
		this.miniHeaderMenu.className = 'mini-header__dropdown';

		const mainMenu = this.subMenu || this.primaryMenu;
		const miniHeaderMainMenu = mainMenu.cloneNode( true );

		const secondaryMenuClone = this.secondaryMenu.cloneNode( true );

		if ( this.subMenu ) {
			const primaryMenuClone = this.primaryMenu.cloneNode( true );
			this.miniHeaderMenu.appendChild( primaryMenuClone );
		}

		this.miniHeaderMenu.appendChild( secondaryMenuClone );

		this.miniNavigation.appendChild( miniHeaderMainMenu );
		this.miniNavigation.appendChild( this.miniHeaderMenu );

		// Mini functional menu.
		const miniFunctionalMenu = document.createElement( 'ul' );
		miniFunctionalMenu.classList = 'mini-header__functional-menu';

		const miniToggle = document.createElement( 'li' );
		miniToggle.classList = 'mini-header__mini-toggle';
		const button = document.createElement( 'a' );
		button.classList = 'navigation__toggle toggle--mini-header';
		button.setAttribute( 'href', '#' );
		button.addEventListener( 'click', ( e ) => Header.bindButton( button, this.miniHeaderMenu, e ) );

		document.addEventListener( 'click', ( e ) => {
			const isClickButton = button.contains( e.target );

			if ( isClickButton ) {
				return;
			}

			const isClickInside = this.miniHeaderMenu.contains( e.target );

			if ( ! isClickInside ) {
				this.miniHeaderMenu.classList.remove( 'active' );
				button.setAttribute( 'aria-expanded', 'false' );
			}
		} );

		const firstCrumb = document.createElement( 'span' );
		const secondCrumb = document.createElement( 'span' );
		const firstBar = document.createElement( 'span' );
		const secondBar = document.createElement( 'span' );

		firstCrumb.classList = 'navigation__crumb navigation__crumb--top';
		secondCrumb.classList = 'navigation__crumb navigation__crumb--bottom';

		firstBar.classList = 'navigation__bar navigation__bar--top';
		secondBar.classList = 'navigation__bar navigation__bar--bottom';

		firstCrumb.appendChild( firstBar );
		secondCrumb.appendChild( secondBar );

		button.appendChild( firstCrumb );
		button.appendChild( secondCrumb );

		const srText = document.createElement( 'span' );
		srText.classList = 'visually-hidden';
		srText.appendChild( document.createTextNode( 'Site Menu' ) );

		button.appendChild( srText );

		miniToggle.appendChild( button );

		miniFunctionalMenu.appendChild( miniToggle );

		// 기능 메뉴(언어 전환)가 비어 있으면(메뉴 위치에 메뉴가 없으면) 건너뛴다. 없을 때 여기서 멈추면 아래 initHeader 가 실행되지 않는다
		if ( this.functionalMenu ) {
			const languageToggles = this.functionalMenu.querySelectorAll( '.wpml-ls-item' );
			Array.from( languageToggles ).forEach( ( toggle ) => {
				miniFunctionalMenu.appendChild( toggle.cloneNode( true ) );
			} );
		}

		this.miniNavigation.appendChild( miniFunctionalMenu );
	}

	initHeader() {
		const headerObserver = new IntersectionObserver( ( records ) => {
			for ( const record of records ) {
				record.target.classList.toggle( 'not-visible', ! record.isIntersecting );

				if ( record.isIntersecting ) {
					this.onHeaderVisible();
				} else {
					this.onHeaderInvisible();
				}
			}
		}, {} );

		headerObserver.observe( this.node );
	}

	onHeaderVisible() {
		const miniHeaderMenuButton = this.miniHeader.querySelector( '.toggle--mini-header' );
		if ( ! miniHeaderMenuButton ) {
			return;
		}
		miniHeaderMenuButton.setAttribute( 'aria-expanded', 'false' );
		this.miniHeaderMenu.classList.remove( 'active' );
	}

	onHeaderInvisible() {
		const secondaryMenuToggle = this.node.querySelector( '.secondary-menu__toggle' );
		if ( ! secondaryMenuToggle ) {
			return;
		}
		secondaryMenuToggle.setAttribute( 'aria-expanded', 'false' );
		this.secondaryMenu.classList.remove( 'active' );
	}

	initLanguageDropdown() {
		const button = this.functionalMenuMobile.querySelector( 'a' );
		if ( ! button ) {
			return;
		}

		button.addEventListener( 'click', ( e ) => Header.bindButton( button, this.functionalMenuMobile, e ) );

		// Use below if you want to opt-in dropdown only.
		/*
		button.addEventListener( 'click', ( e ) => Header.bindButton(
			button,
			this.functionalMenuMobile,
			e,
			() => {
				const toggleButton = this.node.querySelector( '.toggle--mobile' );

				if ( ! toggleButton ) {
					return;
				}

				if ( toggleButton.getAttribute( 'aria-expanded' ) === 'true' ) {
					this.navigation.classList.remove( 'active' );
					toggleButton.setAttribute( 'aria-expanded', 'false' );
				}
			}
		) );
		*/

		document.addEventListener( 'click', ( e ) => {
			const isClickButton = button.contains( e.target );

			if ( isClickButton ) {
				return;
			}

			const isClickInside = this.functionalMenuMobile.contains( e.target );

			if ( ! isClickInside ) {
				this.functionalMenuMobile.classList.remove( 'active' );
				button.setAttribute( 'aria-expanded', 'false' );
			}
		} );
	}

	init() {
		this.initMenu();
		this.initMobile();
		this.initDesktop();
		this.initMiniHeader();
		this.initHeader();
		// Disabled multilanguage feature.
		// this.initLanguageDropdown();
	}
}

( function() {
	const header = new Header( '.site__header', '.mini-header' );

	if ( header.node ) {
		header.init();
	}

	// Remove the .active class and set aria-expanded to false when the user clicks outside the secondary navigation.
}() );
