import { Button } from "../ui/button";
import { Card } from "../ui/card";
import { Trophy } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

interface SessionEndMessageProps {
  onRestart: () => void;
  isVisible: boolean;
}

export function SessionEndMessage({ onRestart, isVisible }: SessionEndMessageProps) {
  if (!isVisible) return null;

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0, scale: 0.8 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.5, type: "spring" }}
      >
        <Card className="w-full max-w-[500px] p-8 text-center">
          <div className="flex flex-col items-center gap-6">
            <motion.div
              className="rounded-full bg-primary/10 p-4"
              animate={{
                y: [0, -10, 0],
                scale: [1, 1.1, 1],
              }}
              transition={{
                duration: 1,
                repeat: Infinity,
                repeatType: "reverse",
                ease: "easeInOut",
              }}
            >
              <motion.div
                initial={{ rotate: -30 }}
                animate={{ rotate: 30 }}
                transition={{
                  duration: 0.5,
                  repeat: 1,
                  repeatType: "reverse",
                  delay: 0.2,
                }}
              >
                <Trophy className="h-12 w-12 text-primary" />
              </motion.div>
            </motion.div>
            <motion.div
              className="space-y-2"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3, duration: 0.5 }}
            >
              <motion.h2
                className="text-2xl font-semibold tracking-tight"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.5, duration: 0.5 }}
              >
                Session Complete!
              </motion.h2>
              <motion.p
                className="text-muted-foreground"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.7, duration: 0.5 }}
              >
                You&apos;ve reviewed all available flashcards. Great job on completing your study session!
              </motion.p>
            </motion.div>
            <motion.div
              className="flex gap-4"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.9, duration: 0.5 }}
            >
              <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                <Button onClick={onRestart} size="lg" className="font-semibold" aria-label="Restart learning session">
                  Study Again
                </Button>
              </motion.div>
              <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                <Button variant="outline" size="lg" asChild>
                  <a href="/add">Create More Cards</a>
                </Button>
              </motion.div>
            </motion.div>
          </div>
        </Card>
      </motion.div>
    </AnimatePresence>
  );
}
