// Based on article https://medium.com/tenantcloud-engineering/mastering-mobile-testing-in-playwright-simplify-your-workflow-with-typescript-decorators-9a995ea750f0
type ClassConstructor = new (...args: any[]) => any;

interface Proxy extends ClassConstructor {
	originalWebClass?: any;
	isProxing?: boolean;
}

interface ClassMap {
	mobileClass: Proxy;
	webClass: ClassConstructor;
}

const classStore: ClassMap[] = [];

export const Web = () => {
	return function (WebClass: ClassConstructor): Proxy {
		class Proxy extends WebClass {
			static originalWebClass = WebClass;
			static isProxying = false; // flag for stopping recursion

			constructor(...args: any[]) {
				if (global.IS_MOBILE && !Proxy.isProxying) {
					const MobileClass = classStore.find(el => el.webClass === WebClass)?.mobileClass;
					if (MobileClass) {
						Proxy.isProxying = true;
						const instance = new MobileClass(...args);
						Proxy.isProxying = false;
						return instance;
					}
				}
				// Otherwise, create an instance of the desktop component
				super(...args);
			}
		}
		return Proxy;
	};
};

export const Mobile = () => {
	return function (MobileClass: Proxy): Proxy {
		const webClass = MobileClass.originalWebClass;

		if (webClass) {
			classStore.push({
				mobileClass: MobileClass,
				webClass,
			});
		}

		return MobileClass;
	};
};
