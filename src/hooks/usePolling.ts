import { useEffect, useRef, useCallback } from "react";

interface UsePollingReturn {
    stop: () => void;
    restart: () => void;
}

type FetchDataFunction = (signal: AbortSignal) => void;

export const usePolling = (fetchData: FetchDataFunction, interval: number = 500): UsePollingReturn => {
    const timerRef = useRef<number | null>(null);
    const abortRef = useRef<AbortController | null>(null);
    const visibilityHandlerRef = useRef<(() => void) | null>(null);

    // 持久化最新fetch方法
    const fetchRef = useRef<FetchDataFunction>(fetchData);
    useEffect(() => {
        fetchRef.current = fetchData;
    }, [fetchData]);

    // 核心轮询逻辑
    const startPolling = useCallback(() => {
        if (document.visibilityState === "visible") {
            abortRef.current = new AbortController();
            fetchRef.current(abortRef.current.signal);
            timerRef.current = window.setInterval(() => {
                abortRef.current = new AbortController();
                fetchRef.current(abortRef.current.signal);
            }, interval);
        }
    }, [interval]);

    // 可见性变化处理（2025最新优化模式）
    useEffect(() => {
        visibilityHandlerRef.current = () => {
            if (document.visibilityState === "visible") {
                startPolling();
            } else {
                if (timerRef.current !== null) {
                    clearInterval(timerRef.current);
                }
                abortRef.current?.abort();
            }
        };

        document.addEventListener("visibilitychange", visibilityHandlerRef.current);

        // 初始化执行
        startPolling();

        return () => {
            document.removeEventListener(
                "visibilitychange",
                visibilityHandlerRef.current || (() => {})
            );
            if (timerRef.current !== null) {
                clearInterval(timerRef.current);
            }
            abortRef.current?.abort();
        };
    }, [startPolling]);

    // 返回手动控制方法
    return {
        stop: () => {
            if (timerRef.current !== null) {
                clearInterval(timerRef.current);
            }
            abortRef.current?.abort();
        },
        restart: startPolling,
    };
};
