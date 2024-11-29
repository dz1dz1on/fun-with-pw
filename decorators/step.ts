import test from '@playwright/test';

export function step(stepDescription?: string) {
	return function decorator(target: Function, context: ClassMethodDecoratorContext) {
		return function (...args: any) {
			//Use `stepName` when it's defined or fall back to class name / method name
			const name = stepDescription || `${this.constructor.name + '.' + (context.name as string)}`;

			return test.step(
				name,
				async () => {
					return await target.call(this, ...args);
				},
				// show errors inside of the step
				{ box: true }
			);
		};
	};
}
