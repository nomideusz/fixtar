/**
 * Performance utilities for optimizing server-side operations
 */

// Request deduplication - prevent multiple identical requests
const pendingRequests = new Map<string, Promise<any>>();

export async function dedupedFetch<T>(
	key: string, 
	fetchFn: () => Promise<T>
): Promise<T> {
	if (pendingRequests.has(key)) {
		return pendingRequests.get(key) as Promise<T>;
	}
	
	const promise = fetchFn().finally(() => {
		pendingRequests.delete(key);
	});
	
	pendingRequests.set(key, promise);
	return promise;
}

// Batch processor for database operations
export class BatchProcessor<Input, Output> {
	private batches = new Map<string, {
		inputs: Input[];
		resolvers: Array<(value: Output[]) => void>;
		rejectors: Array<(error: Error) => void>;
	}>();
	
	constructor(
		private batchProcessor: (inputs: Input[]) => Promise<Output[]>,
		private batchKey: (input: Input) => string = () => 'default',
		private batchDelay: number = 10, // ms
		private maxBatchSize: number = 100
	) {}
	
	async process(input: Input): Promise<Output> {
		const key = this.batchKey(input);
		
		return new Promise<Output>((resolve, reject) => {
			if (!this.batches.has(key)) {
				this.batches.set(key, {
					inputs: [],
					resolvers: [],
					rejectors: []
				});
			}
			
			const batch = this.batches.get(key)!;
			const index = batch.inputs.length;
			
			batch.inputs.push(input);
			batch.resolvers.push((results: Output[]) => resolve(results[index]));
			batch.rejectors.push(reject);
			
			// Schedule batch execution
			if (batch.inputs.length === 1) {
				setTimeout(() => this.executeBatch(key), this.batchDelay);
			}
			
			// Execute immediately if batch is full
			if (batch.inputs.length >= this.maxBatchSize) {
				this.executeBatch(key);
			}
		});
	}
	
	private async executeBatch(key: string) {
		const batch = this.batches.get(key);
		if (!batch || batch.inputs.length === 0) return;
		
		this.batches.delete(key);
		
		try {
			const results = await this.batchProcessor(batch.inputs);
			batch.resolvers.forEach((resolve, index) => {
				resolve(results);
			});
		} catch (error) {
			batch.rejectors.forEach(reject => {
				reject(error as Error);
			});
		}
	}
}

// Lazy loading utility for expensive operations
export class LazyValue<T> {
	private value: T | undefined;
	private promise: Promise<T> | undefined;
	private computed = false;
	
	constructor(private factory: () => Promise<T>) {}
	
	async get(): Promise<T> {
		if (this.computed) {
			return this.value!;
		}
		
		if (!this.promise) {
			this.promise = this.factory().then(value => {
				this.value = value;
				this.computed = true;
				return value;
			});
		}
		
		return this.promise;
	}
	
	reset() {
		this.value = undefined;
		this.promise = undefined;
		this.computed = false;
	}
}

// Rate limiter for API calls
export class RateLimiter {
	private requests: number[] = [];
	
	constructor(
		private maxRequests: number,
		private windowMs: number
	) {}
	
	async throttle(): Promise<void> {
		const now = Date.now();
		
		// Remove old requests outside the window
		this.requests = this.requests.filter(time => now - time < this.windowMs);
		
		if (this.requests.length >= this.maxRequests) {
			const oldestRequest = Math.min(...this.requests);
			const waitTime = this.windowMs - (now - oldestRequest);
			
			if (waitTime > 0) {
				await new Promise(resolve => setTimeout(resolve, waitTime));
				return this.throttle(); // Recursive call after waiting
			}
		}
		
		this.requests.push(now);
	}
}

// Parallel execution with concurrency limit
export async function parallelLimit<T, R>(
	items: T[],
	processor: (item: T) => Promise<R>,
	concurrency: number = 5
): Promise<R[]> {
	const results: R[] = [];
	const executing: Promise<void>[] = [];
	
	for (let i = 0; i < items.length; i++) {
		const promise = processor(items[i]).then(result => {
			results[i] = result;
		});
		
		executing.push(promise);
		
		if (executing.length >= concurrency) {
			await Promise.race(executing);
			// Remove completed promises
			for (let j = executing.length - 1; j >= 0; j--) {
				if ((executing[j] as any).isFulfilled || (executing[j] as any).isRejected) {
					executing.splice(j, 1);
				}
			}
		}
	}
	
	await Promise.all(executing);
	return results;
} 