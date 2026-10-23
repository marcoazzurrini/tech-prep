import "@tech-prep/ui/styles.css";
import "./preview.css";
import type { Preview } from "@storybook/react-vite";

const preview: Preview = {
  parameters: {
    backgrounds: { disable: true },
    layout: "centered",
  },
};

export default preview;
