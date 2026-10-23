import "@tech-prep/ui/styles.css";
import "./preview.css";
import type { Preview } from "@storybook/react-vite";

const preview: Preview = {
  parameters: {
    backgrounds: { disable: true },
    layout: "centered",
    viewport: {
      options: {
        studioDisplay: {
          name: 'Studio Display 27"',
          styles: { height: "1440px", width: "2560px" },
          type: "desktop",
        },
      },
    },
  },
};

export default preview;
