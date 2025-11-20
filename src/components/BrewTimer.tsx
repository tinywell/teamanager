import { useState, useEffect, useRef } from 'react';
import { Play, Pause, RotateCcw } from 'lucide-react';

interface BrewTimerProps {
    onComplete?: (time: number) => void;
}

const BrewTimer: React.FC<BrewTimerProps> = ({ onComplete }) => {
    const [time, setTime] = useState(0);
    const [isRunning, setIsRunning] = useState(false);
    const intervalRef = useRef<number | null>(null);

    useEffect(() => {
        if (isRunning) {
            intervalRef.current = window.setInterval(() => {
                setTime((prev) => prev + 1);
            }, 1000);
        } else if (intervalRef.current) {
            clearInterval(intervalRef.current);
        }

        return () => {
            if (intervalRef.current) clearInterval(intervalRef.current);
        };
    }, [isRunning]);

    const toggleTimer = () => {
        if (isRunning && onComplete) {
            onComplete(time);
        }
        setIsRunning(!isRunning);
    };

    const resetTimer = () => {
        setIsRunning(false);
        setTime(0);
    };

    const formatTime = (seconds: number) => {
        const mins = Math.floor(seconds / 60);
        const secs = seconds % 60;
        return `${mins}:${secs.toString().padStart(2, '0')}`;
    };

    return (
        <div className="flex flex-col items-center justify-center p-6 bg-stone-100 rounded-2xl border border-stone-200">
            <div className="text-6xl font-serif font-bold text-ink mb-6 tabular-nums">
                {formatTime(time)}
            </div>

            <div className="flex gap-4">
                <button
                    onClick={resetTimer}
                    className="w-12 h-12 rounded-full bg-white border border-stone-200 flex items-center justify-center text-stone-400 hover:text-ink hover:bg-stone-50 transition-colors"
                >
                    <RotateCcw size={20} />
                </button>

                <button
                    onClick={toggleTimer}
                    className={`w-16 h-16 rounded-full flex items-center justify-center text-white shadow-lg transition-all active:scale-95 ${isRunning ? 'bg-stone-400 hover:bg-stone-500' : 'bg-tea-500 hover:bg-tea-600'
                        }`}
                >
                    {isRunning ? <Pause size={28} /> : <Play size={28} className="ml-1" />}
                </button>
            </div>
        </div>
    );
};

export default BrewTimer;
