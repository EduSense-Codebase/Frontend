'use client';

import React, { useEffect, useState } from 'react';
import Joyride, { CallBackProps, STATUS, Step } from 'react-joyride';
import { API_PREFIX, AUTH_ENDPOINT } from '../global';
import { httpGet, httpPost } from '../utils';
//import CoursesPage from '../portal/courses/page';

interface JoyrideWrapperProps {
    steps: Step[];
    seenKey: string; // localStorage key to track tutorial completion
}

interface tutorialResponse{
    seen: number
}

export default function JoyrideWrapper({steps, seenKey}: JoyrideWrapperProps) {
    const [run, setRun] = useState(false);
    const [stepIndex, setStepIndex] = useState(0);

    useEffect(() => {

        const API_URL = API_PREFIX + AUTH_ENDPOINT;
        const queryParams = {
            "type": "check_flag",
            "seenKey": seenKey
        }

        const response = httpGet<tutorialResponse>(API_URL, queryParams);
        
        response.then((res)=>{
            console.log(res)
            if(!res.data.seen){
                console.log("nt seen")
                setRun(true)
            }else{
                console.log("seen")
            }
        })
        

    }, []);

    const handleCallback = (data: CallBackProps) => {
        const { status, index, type } = data;
    
        // Move to next step
        if (type === 'step:after') {
        setStepIndex(index + 1);
        }
    
        // Only set the bit if tutorial is completed or skipped
        if ([STATUS.FINISHED, STATUS.SKIPPED].includes(status)) {
        setRun(false);
    
        const API_URL = API_PREFIX + AUTH_ENDPOINT;
        const queryParams = {
            type: "set_flag", // or "set_flag" if that's what the endpoint expects
        };
        const formData = {
            setKey:seenKey,

        };
    
        httpPost(API_URL, formData, queryParams)
            .then((res) => {
            console.log("Tutorial completion saved:", res.data);
            })
            .catch((err) => {
            console.error("Error setting tutorial flag:", err);
            });
        }
    };
      

    return (
        <Joyride
        steps={steps}
        run={run}
        stepIndex={stepIndex}
        continuous = {true}
        showSkipButton
        scrollToFirstStep
        callback={handleCallback}
        disableScrolling = {true}
        styles={{
            options: {
            zIndex: 10000,
            },
        }}
        />
    );
}
