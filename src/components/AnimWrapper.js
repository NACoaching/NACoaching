"use client";
import { motion, useInView } from "framer-motion";
import { useRef } from "react";

export default function AnimWrapper({ children, delay = 0, className = "" }) {
    const ref = useRef(null);
    // Déclenche l'animation 100px avant que l'élément n'entre dans l'écran pour éviter l'effet de page blanche
    const isInView = useInView(ref, { once: true, margin: "0px 0px 100px 0px" });

    return (
        <motion.div
            ref={ref}
            initial={{ opacity: 0, y: 20 }}
            animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
            transition={{ duration: 0.5, delay: delay, ease: "easeOut" }}
            className={className}
        >
            {children}
        </motion.div>
    );
}
