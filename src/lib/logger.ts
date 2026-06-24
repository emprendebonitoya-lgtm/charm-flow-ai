/**
 * Sistema de logging mejorado para MAGNETO
 * Proporciona logging estructurado con diferentes niveles de severidad
 */

type LogLevel = "debug" | "info" | "warn" | "error";

interface LogEntry {
  level: LogLevel;
  message: string;
  timestamp: string;
  context?: Record<string, unknown>;
  error?: Error;
}

class Logger {
  private isDevelopment = import.meta.env.DEV;
  private logs: LogEntry[] = [];
  private maxLogs = 100;

  private formatMessage(entry: LogEntry): string {
    const timestamp = new Date(entry.timestamp).toISOString();
    const contextStr = entry.context ? ` | Context: ${JSON.stringify(entry.context)}` : "";
    const errorStr = entry.error ? ` | Error: ${entry.error.message}` : "";
    return `[${timestamp}] [${entry.level.toUpperCase()}] ${entry.message}${contextStr}${errorStr}`;
  }

  private log(level: LogLevel, message: string, context?: Record<string, unknown>, error?: Error) {
    const entry: LogEntry = {
      level,
      message,
      timestamp: new Date().toISOString(),
      context,
      error,
    };

    // Guardar en memoria (últimos 100 logs)
    this.logs.push(entry);
    if (this.logs.length > this.maxLogs) {
      this.logs.shift();
    }

    // Console logging en desarrollo
    if (this.isDevelopment) {
      const formatted = this.formatMessage(entry);
      switch (level) {
        case "debug":
          console.debug(formatted);
          break;
        case "info":
          console.info(formatted);
          break;
        case "warn":
          console.warn(formatted);
          break;
        case "error":
          console.error(formatted);
          if (error) console.error(error.stack);
          break;
      }
    }

    // En producción, enviar errores a servicio de monitoreo si está configurado
    if (level === "error" && !this.isDevelopment) {
      this.sendToMonitoring(entry);
    }
  }

  private sendToMonitoring(entry: LogEntry) {
    // Aquí podrías integrar con Sentry, LogRocket, u otro servicio
    // Por ahora, solo guardamos en localStorage para debugging
    try {
      const errorLogs = JSON.parse(localStorage.getItem("magneto_error_logs") || "[]");
      errorLogs.push(entry);
      // Mantener solo los últimos 50 errores
      if (errorLogs.length > 50) {
        errorLogs.shift();
      }
      localStorage.setItem("magneto_error_logs", JSON.stringify(errorLogs));
    } catch {
      // Silencioso - no queremos que el logging cause errores
    }
  }

  debug(message: string, context?: Record<string, unknown>) {
    this.log("debug", message, context);
  }

  info(message: string, context?: Record<string, unknown>) {
    this.log("info", message, context);
  }

  warn(message: string, context?: Record<string, unknown>) {
    this.log("warn", message, context);
  }

  error(message: string, error?: Error, context?: Record<string, unknown>) {
    this.log("error", message, context, error);
  }

  getLogs(): LogEntry[] {
    return [...this.logs];
  }

  clearLogs() {
    this.logs = [];
  }

  getErrorLogs(): LogEntry[] {
    return this.logs.filter((log) => log.level === "error");
  }
}

export const logger = new Logger();

/**
 * Wrapper para funciones async que maneja errores automáticamente
 */
export async function withErrorHandling<T>(
  fn: () => Promise<T>,
  errorMessage: string,
  context?: Record<string, unknown>
): Promise<T | null> {
  try {
    return await fn();
  } catch (error) {
    logger.error(errorMessage, error as Error, context);
    return null;
  }
}

/**
 * Wrapper para funciones sync que maneja errores automáticamente
 */
export function withSyncErrorHandling<T>(
  fn: () => T,
  errorMessage: string,
  context?: Record<string, unknown>
): T | null {
  try {
    return fn();
  } catch (error) {
    logger.error(errorMessage, error as Error, context);
    return null;
  }
}
