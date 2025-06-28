'use client';

import { useParams } from 'next/navigation';
import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import RoadMapNav from '@/app/ui_components/RoadMapNav';
import { useCustomProp } from '@/app/portal/layout';
import { API_PREFIX, AI_ENDPOINT } from '@/app/global';
import { httpPost } from '@/app/utils';

interface MatchingPair {
  left: string;
  right: string;
}

interface IMatchingActivity {
  title: string;
  instructions: string;
  leftItems: string[];
  rightItems: string[];
  correctPairs: MatchingPair[];
}

export default function MatchingPage() {
  const params = useParams();
  const enrollmentId = params.enrollmentId as string;
  const section = params.section as string;
  const title = decodeURIComponent(params.matchTitle as string);

  const layoutProps = useCustomProp();

  const [activity, setActivity] = useState<IMatchingActivity | null>(null);

  const dummyData: IMatchingActivity = {
    title: "Match the Contractions!",
    instructions: "Drag the correct contraction to its matching pair.",
    leftItems: ["do not", "cannot", "I am", "she will", "they are"],
    rightItems: ["I’m", "don’t", "they’re", "she’ll", "can’t"],
    correctPairs: [
      { left: "do not", right: "don’t" },
      { left: "cannot", right: "can’t" },
      { left: "I am", right: "I’m" },
      { left: "she will", right: "she’ll" },
      { left: "they are", right: "they’re" },
    ],
  };

  useEffect(() => {
    layoutProps.setEnrollmentId(parseInt(enrollmentId));
    layoutProps.setContext(prev => ({
      ...prev,
      pageContext: "This page is a matching activity to reinforce learning through interactive pairing.",
    }));

    //setActivity(dummyData);
    const apiUrl = API_PREFIX + AI_ENDPOINT;
    const queryParams = {
        section: "generate_ai_content"
    }
    const prompt_parameters = {
        "title": title,
    }
    const formData = {
        enrollment_id: enrollmentId,
        prompt_type: "matching_activity",
        prompt_parameters: JSON.stringify(prompt_parameters),
    }

    const response = httpPost<IMatchingActivity>(apiUrl, formData, queryParams);
    response.then((res)=>{
        console.log("Raw response:", res);
        console.log(res.data.data);
        setActivity({
            title: title,
            instructions: res.data.data.description,
            leftItems: res.data.data.left_items,
            rightItems: res.data.data.right_items,
            correctPairs: res.data.data.correct_pairs,
        })
    })

  }, []);

  return (
    <>
      <div className="min-h-screen flex flex-col items-center justify-center w-full bg-white px-4 pt-10 pb-24">
        {activity ? (
          <motion.div
            className="w-full max-w-4xl bg-indigo-50 rounded-3xl shadow-2xl p-10"
            initial={{ opacity: 0, y: 40 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, ease: "easeOut" }}
          >
            <h1 className="text-2xl font-bold text-indigo-800 mb-4">{title}</h1>
            <p className="text-gray-700 mb-6">{activity.instructions}</p>
            <div className="grid grid-cols-2 gap-6">
              <div>
                <h2 className="font-semibold mb-2">Words</h2>
                {activity.leftItems.map((item, index) => (
                  <motion.div
                    key={index}
                    className="bg-white border border-gray-300 rounded-lg p-2 mb-2 shadow-sm"
                    whileHover={{ scale: 1.05 }}
                  >
                    {item}
                  </motion.div>
                ))}
              </div>
              <div>
                <h2 className="font-semibold mb-2">Contractions</h2>
                {activity.rightItems.map((item, index) => (
                  <motion.div
                    key={index}
                    className="bg-white border border-gray-300 rounded-lg p-2 mb-2 shadow-sm"
                    whileHover={{ scale: 1.05 }}
                  >
                    {item}
                  </motion.div>
                ))}
              </div>
            </div>
          </motion.div>
        ) : (
          <div className="w-15 h-15 border-7 border-gray-500 border-t-indigo-600 rounded-full animate-spin" />
        )}
      </div>
      <RoadMapNav enrollmentId={enrollmentId} section={section} />
    </>
  );
}
