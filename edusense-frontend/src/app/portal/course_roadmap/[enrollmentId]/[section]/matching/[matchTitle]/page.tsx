'use client';

import { useParams, useSearchParams } from 'next/navigation';
import { useEffect, useRef, useState } from 'react';
import { motion } from 'framer-motion';
import RoadMapNav from '@/app/ui_components/RoadMapNav';
import { useCustomProp } from '@/app/portal/layout';
import { API_PREFIX, AI_ENDPOINT } from '@/app/global';
import { httpPost } from '@/app/utils';

// interface MatchingPair {
// left: string;
// right: string;
// }

interface IMatchingActivity {
    title: string;
    instructions: string;
    leftItems: string[];
    rightItems: string[];
    correctPairs: [string, string][];
}

export default function MatchingPage() {
    const params = useParams();
    const searchParams = useSearchParams();

    const enrollmentId = params.enrollmentId as string;
    const section = params.section as string;
    const title = decodeURIComponent(params.matchTitle as string);
    const desc = searchParams.get('description');
    const prompt_param = `${title}, description: ${desc}`;

    const layoutProps = useCustomProp();
    const containerRef = useRef<HTMLDivElement | null>(null);
    const leftRefs = useRef<(HTMLDivElement | null)[]>([]);
    const rightRefs = useRef<(HTMLDivElement | null)[]>([]);

    const [activity, setActivity] = useState<IMatchingActivity | null>(null);
    const [leftSelectedIndex, setLeftSelectedIndex] = useState<number | null>(null);
    const [connections, setConnections] = useState<Array<{ left: number; right: number }>>([]);
    const [pairResults, setPairResults] = useState<
        { left: number; right: number; isCorrect: boolean }[]
    >([]);

    // Fetch activity content
    useEffect(() => {
        layoutProps.setEnrollmentId(Number(enrollmentId));
        layoutProps.setContext((prev) => ({
            ...prev,
            pageContext:
                'This page is a matching activity to reinforce learning through interactive pairing.',
        }));

        const apiUrl = API_PREFIX + AI_ENDPOINT;
        const queryParams = {
            section: 'generate_ai_content',
        };
        const prompt_parameters = {
            title: prompt_param,
        };
        console.log(prompt_parameters);
        const formData = {
            enrollment_id: enrollmentId,
            prompt_type: 'matching_activity',
            prompt_parameters: JSON.stringify(prompt_parameters),
        };

        const response = httpPost<IMatchingActivity>(apiUrl, formData, queryParams);
        response.then((res) => {
            //console.log("Raw response:", res);
            console.log(res.data.data);
            setActivity({
                title: title,
                instructions: res.data.data.description,
                leftItems: res.data.data.left_items,
                rightItems: res.data.data.right_items,
                correctPairs: res.data.data.correct_pairs,
            });
        });
    }, []);

    // Tile click handler
    const handleTileClick = (type: 'left' | 'right', index: number) => {
        if (type === 'left') {
            setLeftSelectedIndex(index);
        } else if (type === 'right' && leftSelectedIndex !== null) {
            setConnections((prev) => {
                const filtered = prev.filter((conn) => conn.left !== leftSelectedIndex);
                return [...filtered, { left: leftSelectedIndex, right: index }];
            });

            setLeftSelectedIndex(null);
        }
    };

    // Render connection lines between matched tiles
    const renderLines = () => {
        return (
            <svg className="pointer-events-none absolute top-0 left-0 z-0 h-full w-full">
                {connections.map(({ left, right }, idx) => {
                    const leftEl = leftRefs.current[left];
                    const rightEl = rightRefs.current[right];
                    const containerEl = containerRef.current;

                    if (!leftEl || !rightEl || !containerEl) return null;

                    const leftRect = leftEl.getBoundingClientRect();
                    const rightRect = rightEl.getBoundingClientRect();
                    const containerRect = containerEl.getBoundingClientRect();

                    const x1 = leftRect.right - containerRect.left;
                    const y1 = leftRect.top + leftRect.height / 2 - containerRect.top;
                    const x2 = rightRect.left - containerRect.left;
                    const y2 = rightRect.top + rightRect.height / 2 - containerRect.top;

                    return (
                        <line
                            key={idx}
                            x1={x1}
                            y1={y1}
                            x2={x2}
                            y2={y2}
                            stroke="indigo"
                            strokeWidth="3"
                            strokeLinecap="round"
                        />
                    );
                })}
            </svg>
        );
    };

    if (!activity) {
        return (
            <div className="flex min-h-screen w-full items-center justify-center bg-white">
                <div className="h-15 w-15 animate-spin rounded-full border-7 border-gray-500 border-t-indigo-600" />
            </div>
        );
    }

    const handleSubmit = () => {
        console.log('submitted');

        const results = connections.map(({ left, right }) => {
            const leftText = activity.leftItems[left];
            const rightText = activity.rightItems[right];
            const isCorrect = activity.correctPairs.some(
                ([correctLeft, correctRight]) =>
                    correctLeft === leftText && correctRight === rightText,
            );

            return { left, right, isCorrect };
        });

        setPairResults(results);
    };

    const getTileStyle = (side: 'left' | 'right', index: number) => {
        const match = pairResults.find((r) => r[side] === index);
        const isLeftSelected = side === 'left' && leftSelectedIndex === index;

        let base = 'border rounded-lg p-2 mb-2 shadow-sm transition-colors duration-300';

        // Color fill based on correctness
        if (match) {
            base += match.isCorrect
                ? ' bg-green-100 border-green-500'
                : ' bg-red-100 border-red-500';
        } else {
            base += ' bg-white border-gray-300';
        }

        // Only left tile shows indigo ring when selected
        if (isLeftSelected) {
            base += ' ring-2 ring-indigo-400 border-indigo-500';
        }

        return base;
    };

    return (
        <>
            <div className="flex min-h-screen w-full flex-col items-center justify-center bg-white px-4 pt-10 pb-24">
                <motion.div
                    className="w-full max-w-4xl rounded-3xl bg-indigo-50 p-10 shadow-2xl"
                    initial={{ opacity: 0, y: 40 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.6, ease: 'easeOut' }}
                >
                    <h1 className="mb-4 text-2xl font-bold text-indigo-800">{title}</h1>
                    <p className="mb-6 text-gray-700">{activity.instructions}</p>

                    <div ref={containerRef} className="relative h-full w-full">
                        {renderLines()}
                        <div className="relative z-10 grid grid-cols-2 gap-60">
                            {/* Left Tiles */}
                            <div>
                                <h2 className="mb-2 font-semibold">Match the tile on the left</h2>
                                {activity.leftItems.map((item, index) => (
                                    <motion.div
                                        key={index}
                                        ref={(el) => (leftRefs.current[index] = el)}
                                        onClick={() => handleTileClick('left', index)}
                                        className={getTileStyle('left', index)}
                                        whileHover={{ scale: 1.05 }}
                                    >
                                        {item}
                                    </motion.div>
                                ))}
                            </div>

                            {/* Right Tiles */}
                            <div>
                                <h2 className="mb-2 font-semibold">
                                    ... to the correct tiles on the right!
                                </h2>
                                {activity.rightItems.map((item, index) => (
                                    <motion.div
                                        key={index}
                                        ref={(el) => (rightRefs.current[index] = el)}
                                        onClick={() => handleTileClick('right', index)}
                                        className={getTileStyle('right', index)}
                                        whileHover={{ scale: 1.05 }}
                                    >
                                        {item}
                                    </motion.div>
                                ))}
                            </div>
                        </div>
                        <div className="mt-6 flex justify-between gap-4">
                            <button
                                onClick={handleSubmit}
                                className="flex-1 rounded-lg bg-indigo-600 px-6 py-3 font-semibold text-white transition hover:bg-indigo-700"
                            >
                                Submit Answer
                            </button>
                        </div>
                    </div>
                </motion.div>
            </div>
            <RoadMapNav enrollmentId={enrollmentId} section={section} />
        </>
    );
}
