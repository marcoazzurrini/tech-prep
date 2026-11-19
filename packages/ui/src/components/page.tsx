import type { ReactNode } from "react";

import "./page.css";

interface PageProps {
  /** A quiet line above the title, such as the date. */
  eyebrow?: string;
  title: string;
  /** One or two sentences under the title. */
  lead?: ReactNode;
  children?: ReactNode;
}

/** A centred column for a screen that is read, not worked in: the reviews screen, a summary. */
export const Page = ({ eyebrow, title, lead, children }: PageProps) => (
  <div className="tp-page">
    <div className="tp-page__column">
      {eyebrow && <p className="tp-page__eyebrow">{eyebrow}</p>}
      <h1>{title}</h1>
      {lead && <p className="tp-page__lead">{lead}</p>}
      {children}
    </div>
  </div>
);

/** A row of actions with a short note beside them. */
export const PageActions = ({
  children,
  note,
}: {
  children: ReactNode;
  note?: ReactNode;
}) => (
  <div className="tp-page__actions">
    {children}
    {note && <span className="tp-page__note">{note}</span>}
  </div>
);

/** A small capital label that names the list under it. */
export const PageLabel = ({ children }: { children: ReactNode }) => (
  <h2 className="tp-page__label">{children}</h2>
);

/** A quiet closing line. */
export const PageNote = ({ children }: { children: ReactNode }) => (
  <p className="tp-page__footnote">{children}</p>
);

/** A bordered list of rows. */
export const List = ({ children }: { children: ReactNode }) => (
  <ul className="tp-list">{children}</ul>
);

interface ListRowProps {
  /** A badge or icon at the start. */
  start?: ReactNode;
  title: string;
  /** One line under the title. */
  detail?: ReactNode;
  /** Text, a chip or a button at the end. */
  end?: ReactNode;
}

export const ListRow = ({ start, title, detail, end }: ListRowProps) => (
  <li className="tp-list__row">
    {start}
    <div className="tp-list__text">
      <span className="tp-list__title">{title}</span>
      {detail && <span className="tp-list__detail">{detail}</span>}
    </div>
    {end && <div className="tp-list__end">{end}</div>}
  </li>
);

/** A count that needs attention, such as reviews due. */
export const Count = ({ children }: { children: ReactNode }) => (
  <span className="tp-count">{children}</span>
);
