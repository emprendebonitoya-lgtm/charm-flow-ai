import { describe, it, expect, beforeEach, vi } from 'vitest';
import { loadScanUsage, recordScan, getAvailableScans, claimAdBonus } from '@/lib/scan-usage';

describe('Scan Usage Functions', () => {
  beforeEach(() => {
    window.localStorage.clear();
    vi.clearAllMocks();
  });

  it('should load scan usage from localStorage', () => {
    const mockData = { date: new Date().toISOString().slice(0, 10), used: 5, bonus: 0 };
    window.localStorage.setItem('magneto_scan_usage', JSON.stringify(mockData));
    const usage = loadScanUsage();
    expect(usage.used).toBe(5);
  });

  it('should return default usage if no data in localStorage', () => {
    const usage = loadScanUsage();
    expect(usage.used).toBe(0);
    expect(usage.bonus).toBe(0);
  });

  it('should record a scan correctly', () => {
    const usage = loadScanUsage();
    const updated = recordScan(usage);
    expect(updated.used).toBe(1);
  });

  it('should increment count for same day scan', () => {
    const usage = loadScanUsage();
    const firstScan = recordScan(usage);
    const secondScan = recordScan(firstScan);
    expect(secondScan.used).toBe(2);
  });

  it('should calculate available scans for free user', () => {
    const usage = loadScanUsage();
    const updated = recordScan(recordScan(usage));
    const available = getAvailableScans(updated, false);
    expect(available).toBeGreaterThan(0);
  });

  it('should return unlimited for premium user', () => {
    const available = getAvailableScans(loadScanUsage(), true);
    expect(available).toBe(Number.POSITIVE_INFINITY);
  });

  it('should claim ad bonus correctly', () => {
    const usage = loadScanUsage();
    const updated = claimAdBonus(usage);
    expect(updated.bonus).toBe(1);
  });
});
