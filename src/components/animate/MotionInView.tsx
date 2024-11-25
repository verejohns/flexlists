import { useEffect } from 'react';
import { motion, useAnimation } from 'framer-motion';
import { useInView } from 'react-intersection-observer';
// material
import { Box } from '@mui/material';

// ----------------------------------------------------------------------

type MotionInViewProps = {
  children?: React.ReactNode,
  variants: any,
  transition?: any,
  triggerOnce?: boolean,
  threshold?: number | any[]
};

export default function MotionInView({ children, variants, transition, threshold, ...other }: any) {
  const controls = useAnimation();
  const [ref, inView] = useInView({
    threshold: threshold || 0,
    triggerOnce: true
  });

  useEffect(() => {
    if (inView) {
      controls.start(Object.keys(variants)[1]);
    } else {
      controls.start(Object.keys(variants)[0]);
    }
  }, [controls, inView, variants]);

  return (
    <Box
      ref={ref}
      component={motion.div}
      initial={Object.keys(variants)[0]}
      animate={controls}
      variants={variants}
      transition={transition}
      {...other}
    >
      {children}
    </Box>
  );
}
