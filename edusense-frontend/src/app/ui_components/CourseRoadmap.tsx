'use client';
import { useState, useEffect } from 'react';
import { AI_ENDPOINT, API_PREFIX, COURSE_ENDPOINT } from "../global";
import { IJourney, IJourneyResponse, INewEnrollment } from '../typedef';
import { httpPost, httpGet } from '../utils';
import { useParams, useRouter } from 'next/navigation';
import { motion } from "framer-motion";
import Link from 'next/link';

type Step = {
  title: string
  description?: string
}

type Props = {
  data: Step[]
}

export default function CourseRoadmap() {
  const params = useParams();
  const enrollmentId = params.enrollmentId as string;
  const section = params.section as string;

  const [journey, setJourney] = useState<IJourney[]>([]);
  const router = useRouter();

  useEffect(() => {
    const url = API_PREFIX + COURSE_ENDPOINT;
    const queryParams = {
      section: "course_details",
      enrollment_id: enrollmentId?.toString()
    };

    const response = httpGet<INewEnrollment>(url, queryParams);
    response.then((res) => {
      if (res.data.data.takenDiag == false) {
        router.push(`/portal/diagnostic/${enrollmentId}`);
      } else {
        const cache_query_params = {
          section: "retrieve_cache",
          enroll_id: enrollmentId,
          cache_request: section,
        };

        const API_URL = API_PREFIX + AI_ENDPOINT;
        httpGet<IJourneyResponse>(API_URL, cache_query_params).then((response) => {
          if (response.data.data != null) {
            const localJourney: IJourney[] = [];
            response.data.data.description.map((desc, index) => {
              localJourney.push({
                title: response.data.data.title[index],
                description: desc,
              });
            });
            setJourney(localJourney);
          } else {
            const queryParams = {
              section: "generate_ai_content",
            };

            const formData = {
              enrollment_id: enrollmentId,
              prompt_type: "roadmap",
              prompt_parameters: JSON.stringify({ type: section }),
            };

            httpPost<IJourneyResponse>(API_URL, formData, queryParams).then((response) => {
              const localJourney: IJourney[] = [];
              response.data.data.description.map((desc, index) => {
                localJourney.push({
                  title: response.data.data.title[index],
                  description: desc,
                });
              });

              setJourney(localJourney);

              httpPost(API_URL, {
                enroll_id: enrollmentId,
                cache_request: section,
                cache_content: JSON.stringify(response.data.data)
              }, { section: "set_cache_content" });
            });
          }
        });
      }
    });
  }, []);

  const renderRoadmap = ({ data }: Props) => {
    return (
      <div className="w-screen px-4 mx-auto relative">
        {data.map((step, index) => {
          const isLeft = index % 2 === 1;
          return (
            <div
              key={index}
              className={`relative mb-24 flex flex-col md:flex-row ${
                isLeft ? 'md:flex-row-reverse' : ''
              } items-center justify-between`}
            >
              <div className="w-full md:w-1/2"></div>
              <div className="w-full md:w-1/2 flex justify-center">
                <motion.div
                  whileHover={{ scale: 1.05, y: -5 }}
                  transition={{ type: "spring", stiffness: 300 }}
                  className="bg-white p-6 md:p-8 rounded-xl shadow-xl border border-gray-200 w-[90%] max-w-md"
                >
                  <Link
                    className="text-xl font-semibold text-black"
                    href={
                      step.title.toLowerCase().includes("quiz")
                        ? `/portal/course_roadmap/${enrollmentId}/${section}/quiz/${step.title}`
                        : step.title.toLowerCase().includes("test")
                        ? `/portal/course_roadmap/${enrollmentId}/${section}/test/${step.title}`
                        : `/portal/course_roadmap/${enrollmentId}/${section}/article/${step.title}`
                    }
                  >
                    {step.title}
                  </Link>
                  {step.description && (
                    <p className="text-sm text-gray-600 mt-2">{step.description}</p>
                  )}
                </motion.div>
              </div>
            </div>
          );
        })}
      </div>
    );
  };

  return <>{renderRoadmap({ data: journey })}</>;
}
