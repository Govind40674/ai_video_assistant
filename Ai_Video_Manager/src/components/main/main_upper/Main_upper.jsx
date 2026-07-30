import React from "react";
import styles from "./Main_upper.module.css";
import {
  Sparkles,
  Brain,
  FileText,
  MessageCircle,
  Clock,
} from "lucide-react";

function Main_upper() {
  return (
    <section className={styles.hero}>
      {/* Background Effects */}
      <div className={styles.grid}></div>

      <div className={styles.glow1}></div>
      <div className={styles.glow2}></div>
      <div className={styles.glow3}></div>

      <div className={styles.circle1}></div>
      <div className={styles.circle2}></div>
      <div className={styles.circle3}></div>

      {/* AI Badge */}
      <div className={styles.badge}>
        <Sparkles size={16} />
        <span>AI Powered Video Intelligence</span>
      </div>

      {/* Heading */}
      <h1 className={styles.title}>
        Understand Any Video
        <br />
        <span>in Seconds</span>
      </h1>

      {/* Description */}
      <p className={styles.description}>
        Transform any YouTube video into concise summaries, interactive AI
        conversations, and actionable insights. Learn faster, save valuable
        time, and explore videos like never before.
      </p>

      {/* Feature Pills */}
      <div className={styles.features}>
        <div className={styles.feature}>
          <FileText size={18} />
          <span>AI Summary</span>
        </div>

        <div className={styles.feature}>
          <MessageCircle size={18} />
          <span>Ask Questions</span>
        </div>

        <div className={styles.feature}>
          <Brain size={18} />
          <span>Key Insights</span>
        </div>

        <div className={styles.feature}>
          <Clock size={18} />
          <span>Save Time</span>
        </div>
      </div>
    </section>
  );
}

export default Main_upper;