import React, { useState } from 'react';
import { motion } from "framer-motion"; // یا motion/react
import "./MEnvelope.css";

const MEnvelope = () => {
  const [open, setOpen] = useState(false);

  return (
    <div className="scene">
      <motion.div 
        className="envelope" 
        onClick={() => setOpen(!open)}
        // کمی چرخش به کل پاکت می‌دهیم تا سه‌بعدی بودن درب در حال چرخش کاملاً دیده شود
        // animate={{ rotateY: open ? 0 : -30, rotateX: open ? 5 : 0 }}
        animate={open 
    ? { 
        rotateY: 0, 
        rotateX: 5, 
        rotateZ: 0, 
        scale: 1 
      } 
    : { 
        rotateY: -30, 
        rotateX: 0,
        // افکت لرزش حول محور Z و کمی تغییر مقیاس
        rotateZ: [0, -2, 1, -1, 0], 
        scale: [1, 1.02, 1],
      }}
      transition={open 
    ? { duration: 0.5 } 
    : { 
        rotateZ: { 
          repeat: Infinity, 
          duration: 2, 
          ease: "circInOut" 
        },
        scale: { 
          repeat: Infinity, 
          duration: 2, 
          ease: "easeInOut" 
        },
        // بقیه ترنزیشن‌ها
        default: { duration: 0.5 }
      }
  }
        
      >
        
        {/* Letter */}
        <motion.div
          className="letter"
          initial={false}
          animate={{ y: open ? -150 : 0, z: open ? 9 : 8 }}
          transition={{ type: "spring", stiffness: 100, damping: 15,delay: open ? 0.3 : 0 }}
        >
          <div className="letter-content">
            <h3 style={{margin: 10}}>سلام ✨</h3>
            <p>الان سه‌بعدی شد! 😎</p>
          </div>
        </motion.div>

        {/* Flap (درب پاکت) */}
        <motion.div
          className="flap"
          initial={false}
          animate={{ rotateX: open ? 180 : 0,z: open ? 8 : 10}}
          transition={{ duration: 0.8, 
            ease: "easeInOut",
            // نکته اصلی: وقتی open فالز است (بسته شدن)، صبر کن (delay) تا نامه پایین برود
            delay: open ? 0 : 1.5 }}
          style={{
            // کنترل لایه با چرخش: وقتی باز شد (بیش از 90 درجه) برود پشت (Z منفی)
            // zIndex: open ? 1 : 5, 
          }}
        />

        {/* Pocket */}
        <div className="pocket" />
        
      </motion.div>
    </div>
  );
};

export default MEnvelope;