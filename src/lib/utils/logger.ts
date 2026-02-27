/**
 * Centralized logging service for the FixTar application
 */

export enum LogLevel {
	ERROR = 0,
	WARN = 1,
	INFO = 2,
	DEBUG = 3
}

export interface LogEntry {
	timestamp: string;
	level: LogLevel;
	category: string;
	message: string;
	data?: any;
	userId?: string;
	sessionId?: string;
}

class Logger {
	private logLevel: LogLevel;
	private isDevelopment: boolean;
	private logs: LogEntry[] = [];
	private maxLogs = 1000; // Keep last 1000 logs in memory

	constructor() {
		this.isDevelopment =
			typeof window !== 'undefined'
				? window.location.hostname === 'localhost'
				: process.env.NODE_ENV === 'development';

		this.logLevel = this.isDevelopment ? LogLevel.DEBUG : LogLevel.INFO;
	}

	private createLogEntry(level: LogLevel, category: string, message: string, data?: any): LogEntry {
		return {
			timestamp: new Date().toISOString(),
			level,
			category,
			message,
			data,
			// These would be set from context in a real app
			userId: undefined,
			sessionId: undefined
		};
	}

	private shouldLog(level: LogLevel): boolean {
		return level <= this.logLevel;
	}

	private formatMessage(entry: LogEntry): string {
		const levelStr = LogLevel[entry.level];
		const time = new Date(entry.timestamp).toLocaleTimeString();
		return `[${time}] ${levelStr} [${entry.category}] ${entry.message}`;
	}

	private writeLog(entry: LogEntry) {
		// Store in memory
		this.logs.push(entry);
		if (this.logs.length > this.maxLogs) {
			this.logs.shift();
		}

		// Console output with appropriate method
		const formatted = this.formatMessage(entry);

		switch (entry.level) {
			case LogLevel.ERROR:
				console.error(formatted, entry.data);
				break;
			case LogLevel.WARN:
				console.warn(formatted, entry.data);
				break;
			case LogLevel.INFO:
				console.info(formatted, entry.data);
				break;
			case LogLevel.DEBUG:
				if (this.isDevelopment) {
					console.debug(formatted, entry.data);
				}
				break;
		}

		// In production, you might want to send to external service
		if (!this.isDevelopment && entry.level <= LogLevel.WARN) {
			this.sendToExternalService(entry);
		}
	}

	private async sendToExternalService(entry: LogEntry) {
		// TODO: Implement external logging service (Sentry, LogRocket, etc.)
		// For now, we'll just store critical errors
		if (entry.level === LogLevel.ERROR) {
			try {
				// This could be sent to an analytics endpoint
				// await fetch('/api/logs', {
				//   method: 'POST',
				//   headers: { 'Content-Type': 'application/json' },
				//   body: JSON.stringify(entry)
				// });
			} catch (error) {
				// Fail silently to avoid recursive logging
			}
		}
	}

	// Public logging methods
	error(category: string, message: string, data?: any) {
		if (this.shouldLog(LogLevel.ERROR)) {
			const entry = this.createLogEntry(LogLevel.ERROR, category, message, data);
			this.writeLog(entry);
		}
	}

	warn(category: string, message: string, data?: any) {
		if (this.shouldLog(LogLevel.WARN)) {
			const entry = this.createLogEntry(LogLevel.WARN, category, message, data);
			this.writeLog(entry);
		}
	}

	info(category: string, message: string, data?: any) {
		if (this.shouldLog(LogLevel.INFO)) {
			const entry = this.createLogEntry(LogLevel.INFO, category, message, data);
			this.writeLog(entry);
		}
	}

	debug(category: string, message: string, data?: any) {
		if (this.shouldLog(LogLevel.DEBUG)) {
			const entry = this.createLogEntry(LogLevel.DEBUG, category, message, data);
			this.writeLog(entry);
		}
	}

	// Performance logging
	time(category: string, label: string) {
		if (this.isDevelopment) {
			console.time(`[${category}] ${label}`);
		}
	}

	timeEnd(category: string, label: string) {
		if (this.isDevelopment) {
			console.timeEnd(`[${category}] ${label}`);
		}
	}

	// Get logs for debugging
	getLogs(level?: LogLevel): LogEntry[] {
		if (level !== undefined) {
			return this.logs.filter((log) => log.level <= level);
		}
		return [...this.logs];
	}

	// Clear logs
	clearLogs() {
		this.logs = [];
	}

	// Set log level
	setLogLevel(level: LogLevel) {
		this.logLevel = level;
	}
}

// Create singleton instance
export const logger = new Logger();

// Convenience exports for common categories
export const authLogger = {
	error: (message: string, data?: any) => logger.error('AUTH', message, data),
	warn: (message: string, data?: any) => logger.warn('AUTH', message, data),
	info: (message: string, data?: any) => logger.info('AUTH', message, data),
	debug: (message: string, data?: any) => logger.debug('AUTH', message, data)
};

export const dbLogger = {
	error: (message: string, data?: any) => logger.error('DATABASE', message, data),
	warn: (message: string, data?: any) => logger.warn('DATABASE', message, data),
	info: (message: string, data?: any) => logger.info('DATABASE', message, data),
	debug: (message: string, data?: any) => logger.debug('DATABASE', message, data)
};

export const apiLogger = {
	error: (message: string, data?: any) => logger.error('API', message, data),
	warn: (message: string, data?: any) => logger.warn('API', message, data),
	info: (message: string, data?: any) => logger.info('API', message, data),
	debug: (message: string, data?: any) => logger.debug('API', message, data)
};

export const performanceLogger = {
	error: (message: string, data?: any) => logger.error('PERFORMANCE', message, data),
	warn: (message: string, data?: any) => logger.warn('PERFORMANCE', message, data),
	info: (message: string, data?: any) => logger.info('PERFORMANCE', message, data),
	debug: (message: string, data?: any) => logger.debug('PERFORMANCE', message, data),
	time: (label: string) => logger.time('PERFORMANCE', label),
	timeEnd: (label: string) => logger.timeEnd('PERFORMANCE', label)
};

export const uiLogger = {
	error: (message: string, data?: any) => logger.error('UI', message, data),
	warn: (message: string, data?: any) => logger.warn('UI', message, data),
	info: (message: string, data?: any) => logger.info('UI', message, data),
	debug: (message: string, data?: any) => logger.debug('UI', message, data)
};
