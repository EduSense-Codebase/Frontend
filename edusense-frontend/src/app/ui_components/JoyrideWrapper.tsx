'use client';

import React, { useEffect, useState } from 'react';
import Joyride, { CallBackProps, STATUS, Step } from 'react-joyride';
//import CoursesPage from '../portal/courses/page';

interface JoyrideWrapperProps {
    steps: Step[];
    seenKey: string; // localStorage key to track tutorial completion
}

export default function JoyrideWrapper({steps, seenKey}: JoyrideWrapperProps) {
  const [run, setRun] = useState(false);
  const [stepIndex, setStepIndex] = useState(0);

  useEffect(() => {
    if (typeof window !== 'undefined') {
      const seen = localStorage.getItem(seenKey);
      if (!seen) setRun(true);
    }
  }, []);

  const handleCallback = (data: CallBackProps) => {
    const { status, index, type } = data;

    if (type === 'step:after') {
      setStepIndex(index + 1);
    }

    if ([STATUS.FINISHED, STATUS.SKIPPED].includes(status)) {
      setRun(false);
      localStorage.setItem(seenKey, 'true');
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
