import type { ReactNode } from "react";

type SectionCardProps = {
  title: ReactNode;
  children: ReactNode;
  className?: string;
};

function SectionCard({ title, children, className = "" }: SectionCardProps) {
  const classes = ["card", className].filter(Boolean).join(" ");

  return (
    <section className={classes}>
      <h2>{title}</h2>
      {children}
    </section>
  );
}

export default SectionCard;
